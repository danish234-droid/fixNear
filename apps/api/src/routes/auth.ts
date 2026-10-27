import { Router, type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { UserRole } from "../generated/prisma/enums.js";

const router = Router();

// Password hashing cost factor
const BCRYPT_SALT_ROUNDS = 12;

// Registration rate limiter: max 10 attempts per 15 minutes per IP
export const registerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too Many Requests",
    message: "Too many registration attempts from this IP. Please try again after 15 minutes.",
    status: 429,
  },
});

// Allowed public roles: strictly CUSTOMER and PROFESSIONAL (ADMIN is prohibited)
const ALLOWED_ROLES = [UserRole.CUSTOMER, UserRole.PROFESSIONAL] as const;

// Registration input validation schema
const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long.")
    .max(100, "Name cannot exceed 100 characters."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address.")
    .max(255, "Email cannot exceed 255 characters."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(128, "Password cannot exceed 128 characters.")
    .refine(
      (val) => /[A-Za-z]/.test(val) && /[\d\W]/.test(val),
      "Password must contain at least one letter and at least one number or symbol."
    ),
  role: z
    .string()
    .trim()
    .transform((val) => val.toUpperCase()),
  phone: z.string().trim().max(30).optional().nullable(),
  city: z.string().trim().max(100).optional().nullable(),
  businessName: z.string().trim().max(150).optional().nullable(),
});

/**
 * POST /api/auth/register
 * Public registration endpoint for CUSTOMER and PROFESSIONAL accounts.
 */
router.post(
  "/register",
  registerRateLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Validate request body with Zod
      const parseResult = registerSchema.safeParse(req.body);

      if (!parseResult.success) {
        const firstIssue = parseResult.error.issues[0];
        const errorMessage = firstIssue ? firstIssue.message : "Invalid registration input.";
        return res.status(400).json({
          error: "Bad Request",
          message: errorMessage,
          status: 400,
        });
      }

      const { name, email, password, role, phone, city, businessName } = parseResult.data;

      // 2. Strict Role Restriction: Reject ADMIN or unknown roles
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

      // 3. Proactive duplicate email check
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

      // 4. Securely hash password with bcrypt
      const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

      // 5. Atomic database transaction to create user and required profile (if PROFESSIONAL)
      const user = await prisma.$transaction(async (tx) => {
        const createdUser = await tx.user.create({
          data: {
            name,
            email,
            passwordHash,
            phone: phone || null,
            role: normalizedRole,
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
              select: {
                id: true,
                city: true,
                businessName: true,
                isAvailable: true,
                createdAt: true,
              },
            },
          },
        });

        return createdUser;
      });

      // 6. Return HTTP 201 with sanitized safe user object (never exposing passwordHash)
      return res.status(201).json({
        message: "User registered successfully.",
        status: 201,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          ...(user.professionalProfile
            ? { professionalProfile: user.professionalProfile }
            : {}),
        },
      });
    } catch (err: unknown) {
      // 7. Handle concurrent duplicate email race condition safely
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        return res.status(409).json({
          error: "Conflict",
          message: "An account with this email address already exists.",
          status: 409,
        });
      }

      // Pass unexpected errors to centralized error handling without exposing secrets
      return next(err);
    }
  }
);

export const authRouter = router;
