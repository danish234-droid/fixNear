/**
 * src/middleware/requireAuth.ts
 *
 * Express middleware that verifies the HttpOnly JWT cookie,
 * validates the embedded tokenVersion against the database,
 * and attaches the decoded payload to res.locals.
 *
 * On failure returns 401. Never throws — passes unexpected errors
 * through to the centralized error handler.
 */

import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt.js";
import { prisma } from "../lib/prisma.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Locals {
      userId: string;
      userRole: string;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token: string | undefined = req.cookies?.["fixnear_auth"];

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

    // Validate tokenVersion against the database to enforce logout invalidation.
    // Only select the two fields needed — do not pull passwordHash.
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, tokenVersion: true },
    });

    if (!user || user.tokenVersion !== payload.ver) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Session has been invalidated. Please log in again.",
        status: 401,
      });
      return;
    }

    // Attach decoded identity to response locals for downstream handlers.
    res.locals.userId   = payload.sub;
    res.locals.userRole = payload.role;

    next();
  } catch (err) {
    next(err);
  }
}
