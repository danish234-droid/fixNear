/**
 * src/middleware/requireRole.ts
 *
 * Role-based authorization middleware for FixNear.
 *
 * Requirements:
 *  - Must be chained after `requireAuth`.
 *  - Validates that the trusted, server-verified user role (`req.user.role`)
 *    matches one of the allowed roles.
 *  - Returns HTTP 401 if unauthenticated.
 *  - Returns HTTP 403 Forbidden if authenticated but unauthorized.
 *  - Never trusts role parameters submitted in request body, headers, or query string.
 */

import type { Request, Response, NextFunction } from "express";
import { UserRole } from "../generated/prisma/enums.js";

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required before role verification.",
        status: 401,
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: "Forbidden",
        message: "You do not have the required permissions to access this resource.",
        status: 403,
      });
      return;
    }

    next();
  };
}
