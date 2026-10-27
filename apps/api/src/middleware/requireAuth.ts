/**
 * src/middleware/requireAuth.ts
 *
 * Reusable Express authentication middleware for FixNear.
 *
 * Design & Security Guarantees:
 *  - Reads credentials from the HttpOnly `fixnear_auth` cookie (primary)
 *    or the `Authorization: Bearer <token>` header (fallback for API clients).
 *  - Verifies token signature, expiration, issuer, and audience using `jose`.
 *  - Verifies the user still exists in PostgreSQL and their current `tokenVersion`
 *    matches the token claim (enforcing immediate invalidation on logout).
 *  - Attaches a strictly typed, minimal `req.user` ({ id, role, email }) and
 *    `res.locals.user` without exposing password hashes, salts, or token secrets.
 *  - Returns HTTP 401 for missing, invalid, expired, or revoked sessions.
 *  - Never trusts a client-supplied user ID or role from request body, query, or headers.
 */

import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt.js";
import { prisma } from "../lib/prisma.js";
import { UserRole } from "../generated/prisma/enums.js";

/**
 * Minimal trusted user object attached to authenticated requests.
 */
export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  email: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
    interface Locals {
      user?: AuthenticatedUser;
      userId?: string;
      userRole?: string;
    }
  }
}

/**
 * Type helper for route handlers protected by `requireAuth`.
 * Guarantees `req.user` is defined and strongly typed.
 */
export type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};

/**
 * Extract the raw JWT from either the HttpOnly cookie or the Authorization header.
 */
function extractToken(req: Request): string | null {
  // 1. HttpOnly cookie (primary session mechanism from Module 5 Part 2)
  if (req.cookies && typeof req.cookies["fixnear_auth"] === "string") {
    const cookieToken = req.cookies["fixnear_auth"].trim();
    if (cookieToken) return cookieToken;
  }

  // 2. Authorization: Bearer <token> (standard header fallback for direct API clients)
  const authHeader = req.headers.authorization;
  if (authHeader && typeof authHeader === "string") {
    const parts = authHeader.trim().split(/\s+/);
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      return parts[1];
    }
  }

  return null;
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);

    if (!token) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required.",
        status: 401,
      });
      return;
    }

    const payload = await verifyAccessToken(token);

    if (!payload || !payload.sub || typeof payload.ver !== "number") {
      res.status(401).json({
        error: "Unauthorized",
        message: "Invalid or expired session. Please log in again.",
        status: 401,
      });
      return;
    }

    // Confirm that the user still exists and tokenVersion has not changed.
    // Query only minimal required fields — never fetch passwordHash.
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        tokenVersion: true,
      },
    });

    if (!user) {
      res.status(401).json({
        error: "Unauthorized",
        message: "User account no longer exists.",
        status: 401,
      });
      return;
    }

    if (user.tokenVersion !== payload.ver) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Session has been invalidated. Please log in again.",
        status: 401,
      });
      return;
    }

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      role: user.role,
      email: user.email,
    };

    // Attach to request and response locals
    req.user = authenticatedUser;
    res.locals.user = authenticatedUser;
    res.locals.userId = user.id;
    res.locals.userRole = user.role;

    next();
  } catch (err) {
    next(err);
  }
}

// Export authenticate alias for flexibility
export const authenticate = requireAuth;
