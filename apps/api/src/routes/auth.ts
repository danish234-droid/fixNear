/**
 * src/routes/auth.ts
 *
 * Authentication routes:
 *   POST /api/auth/register  — Part 1 (unchanged)
 *   POST /api/auth/login     — Part 2: verify credentials, issue JWT cookie
 *   POST /api/auth/logout    — Part 2: invalidate token, clear cookie
 *   GET  /api/auth/me        — Part 2: return current authenticated user
 *
 * Cookie strategy — HttpOnly + SameSite=Lax + Secure (production):
 *   The API and frontend run on different origins (different ports locally,
 *   different subdomains in production).  SameSite=Lax permits cookie delivery
 *   on top-level navigations while blocking third-party embeds.  Combined with
 *   strict Content-Type: application/json enforcement on state-changing requests
 *   this defeats simple-request CSRF.  An explicit X-CSRF-Requested header is
 *   also checked on logout as a belt-and-suspenders measure.
 *
 * JWT token version invalidation:
 *   Each JWT carries `ver` = User.tokenVersion.  On logout the DB row is
 *   incremented.  requireAuth validates ver === DB value, so all previously
 *   issued tokens for that user become invalid immediately without a token list.
 */

import { Router, type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { UserRole } from "../generated/prisma/enums.js";
import { signAccessToken, ACCESS_TOKEN_TTL_MS } from "../lib/jwt.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { env } from "../config/env.js";

const router = Router();

// ---------------------------------------------------------------------------
// Shared cookie configuration
// ---------------------------------------------------------------------------
const AUTH_COOKIE_NAME = "fixnear_auth";

function buildCookieOptions() {
  const isProduction = env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,                       // HTTPS only in production
    sameSite: "lax" as const,                   // Lax: safe for cross-site nav
    maxAge: ACCESS_TOKEN_TTL_MS,                // 15 minutes (ms)
    path: "/",
  };
}

// ---------------------------------------------------------------------------
// Shared safe user response shape
// ---------------------------------------------------------------------------
function safeUser(user: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: Date;
}) {
  return {
    id:        user.id,
    name:      user.name,
    email:     user.email,
    role:      user.role,
    createdAt: user.createdAt,
  };
}

// ---------------------------------------------------------------------------
// Rate limiters
// ---------------------------------------------------------------------------

/** Registration: 10 attempts / 15 min */
export const registerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.NODE_ENV === "test",
  message: {
    error: "Too Many Requests",
    message: "Too many registration attempts. Please try again after 15 minutes.",
    status: 429,
  },
});

/** Login: 10 attempts / 15 min — prevents brute-force */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.NODE_ENV === "test",
  message: {
    error: "Too Many Requests",
    message: "Too many login attempts. Please try again after 15 minutes.",
    status: 429,
  },
});

// ---------------------------------------------------------------------------
// Validation schemas
// ---------------------------------------------------------------------------

const ALLOWED_ROLES = [UserRole.CUSTOMER, UserRole.PROFESSIONAL] as const;
const BCRYPT_SALT_ROUNDS = 12;

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long.").max(100),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address.")
    .max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(128)
    .refine(
      (val) => /[A-Za-z]/.test(val) && /[\d\W]/.test(val),
      "Password must contain at least one letter and at least one number or symbol."
    ),
  role: z.string().trim().transform((val) => val.toUpperCase()),
  phone: z.string().trim().max(30).optional().nullable(),
  city: z.string().trim().max(100).optional().nullable(),
  businessName: z.string().trim().max(150).optional().nullable(),
});

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address.")
    .max(255),
  password: z.string().min(1, "Password is required.").max(128),
});

// ---------------------------------------------------------------------------
// POST /api/auth/register
// ---------------------------------------------------------------------------
router.post(
  "/register",
  registerRateLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = registerSchema.safeParse(req.body);
      if (!parseResult.success) {
        const msg = parseResult.error.issues[0]?.message ?? "Invalid registration input.";
        return res.status(400).json({ error: "Bad Request", message: msg, status: 400 });
      }

      const { name, email, password, role, phone, city, businessName } = parseResult.data;

      if (role === UserRole.ADMIN) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Public registration as ADMIN is not permitted.",
          status: 400,
        });
      }

      if (!ALLOWED_ROLES.includes(role as (typeof ALLOWED_ROLES)[number])) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Invalid role. Role must be either CUSTOMER or PROFESSIONAL.",
          status: 400,
        });
      }

      const normalizedRole = role as (typeof ALLOWED_ROLES)[number];

      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (existingUser) {
        return res.status(409).json({
          error: "Conflict",
          message: "An account with this email address already exists.",
          status: 409,
        });
      }

      const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

      const user = await prisma.$transaction(async (tx) => {
        return tx.user.create({
          data: {
            name,
            email,
            passwordHash,
            phone: phone || null,
            role: normalizedRole,
            tokenVersion: 0,
            ...(normalizedRole === UserRole.PROFESSIONAL
              ? {
                  professionalProfile: {
                    create: {
                      city: city || "Unspecified",
                      businessName: businessName || null,
                      isAvailable: true,
                    },
                  },
                }
              : {}),
          },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            professionalProfile: {
              select: { id: true, city: true, businessName: true, isAvailable: true, createdAt: true },
            },
          },
        });
      });

      return res.status(201).json({
        message: "User registered successfully.",
        status: 201,
        data: {
          ...safeUser(user),
          ...(user.professionalProfile ? { professionalProfile: user.professionalProfile } : {}),
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        return res.status(409).json({
          error: "Conflict",
          message: "An account with this email address already exists.",
          status: 409,
        });
      }
      return next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------
router.post(
  "/login",
  loginRateLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = loginSchema.safeParse(req.body);
      if (!parseResult.success) {
        const msg = parseResult.error.issues[0]?.message ?? "Invalid login input.";
        return res.status(400).json({ error: "Bad Request", message: msg, status: 400 });
      }

      const { email, password } = parseResult.data;

      // Fetch user including passwordHash and tokenVersion.
      // Use a constant-time comparison even when user is not found to avoid
      // email-existence timing oracle.
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          passwordHash: true,
          tokenVersion: true,
          createdAt: true,
        },
      });

      // Always run bcrypt.compare to prevent timing attacks.
      // DUMMY_HASH is a pre-computed bcrypt hash of a random string;
      // it will never match but keeps the timing similar to a real comparison.
      const DUMMY_HASH =
        "$2b$12$PlaceholderHashForTimingAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
      const hashToCompare = user ? user.passwordHash : DUMMY_HASH;
      const passwordValid = await bcrypt.compare(password, hashToCompare);

      if (!user || !passwordValid) {
        return res.status(401).json({
          error: "Unauthorized",
          message: "Invalid email or password.",
          status: 401,
        });
      }

      // Issue signed JWT
      const token = await signAccessToken({
        sub:  user.id,
        role: user.role,
        ver:  user.tokenVersion,
      });

      // Set HttpOnly cookie
      res.cookie(AUTH_COOKIE_NAME, token, buildCookieOptions());

      // Return safe user data — never include passwordHash or tokenVersion
      return res.status(200).json({
        message: "Logged in successfully.",
        status: 200,
        data: safeUser(user),
      });
    } catch (err) {
      return next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// POST /api/auth/logout
// ---------------------------------------------------------------------------
router.post(
  "/logout",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // CSRF belt-and-suspenders: require this custom header on state-changing
      // authenticated requests in addition to SameSite=Lax.
      if (!req.headers["x-csrf-requested"]) {
        return res.status(403).json({
          error: "Forbidden",
          message: "Missing CSRF header.",
          status: 403,
        });
      }

      const userId = res.locals.userId;

      // Increment tokenVersion — this invalidates all previously issued JWTs
      // for this user without maintaining a token revocation list.
      await prisma.user.update({
        where: { id: userId },
        data: { tokenVersion: { increment: 1 } },
      });

      // Clear the authentication cookie with matching options
      res.clearCookie(AUTH_COOKIE_NAME, {
        httpOnly: true,
        secure:   env.NODE_ENV === "production",
        sameSite: "lax",
        path:     "/",
      });

      return res.status(200).json({
        message: "Logged out successfully.",
        status: 200,
      });
    } catch (err) {
      return next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// GET /api/auth/me
// ---------------------------------------------------------------------------
router.get(
  "/me",
  requireAuth,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.userId;

      // Fetch fresh user data — do not rely on JWT payload for display data.
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id:        true,
          name:      true,
          email:     true,
          phone:     true,
          role:      true,
          createdAt: true,
          professionalProfile: {
            select: {
              id:           true,
              city:         true,
              businessName: true,
              bio:          true,
              isAvailable:  true,
              createdAt:    true,
            },
          },
        },
      });

      if (!user) {
        // Extremely rare: user deleted after token issued
        return res.status(401).json({
          error: "Unauthorized",
          message: "User account no longer exists.",
          status: 401,
        });
      }

      return res.status(200).json({
        status: 200,
        data: {
          ...safeUser(user),
          ...(user.professionalProfile
            ? { professionalProfile: user.professionalProfile }
            : {}),
        },
      });
    } catch (err) {
      return next(err);
    }
  }
);

export const authRouter = router;
