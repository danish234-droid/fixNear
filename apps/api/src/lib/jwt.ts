/**
 * src/lib/jwt.ts
 *
 * Thin wrapper around the `jose` library for signing and verifying
 * HttpOnly-cookie-delivered JWT access tokens.
 *
 * Design:
 *  - HS256 (HMAC-SHA256) — symmetric, single-server secret.
 *  - 15-minute expiry keeps the exposure window small.
 *  - `tokenVersion` embedded in the payload allows per-user invalidation
 *    without a server-side token store: increment User.tokenVersion on logout,
 *    then reject any JWT whose tokenVersion no longer matches.
 *  - issuer + audience claims add a basic validation guard.
 */

import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { env } from "../config/env.js";

export interface AuthTokenPayload extends JWTPayload {
  sub: string;       // User.id
  role: string;      // UserRole enum value
  ver: number;       // tokenVersion — must match User.tokenVersion in DB
}

/** JWT lifetime (ms and seconds) */
export const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes
const ACCESS_TOKEN_TTL_S = "15m";

const ISSUER   = "fixnear-api";
const AUDIENCE = "fixnear-web";

function getSecretKey(): Uint8Array {
  const secret = env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET is missing or too short. Set at least 32 random characters in apps/api/.env"
    );
  }
  return new TextEncoder().encode(secret);
}

/**
 * Sign a new JWT access token.
 */
export async function signAccessToken(payload: {
  sub: string;
  role: string;
  ver: number;
}): Promise<string> {
  return new SignJWT({ role: payload.role, ver: payload.ver })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(ACCESS_TOKEN_TTL_S)
    .sign(getSecretKey());
}

/**
 * Verify and decode a JWT.  Returns null instead of throwing on invalid tokens
 * so callers can convert the result to a 401 without leaking internals.
 */
export async function verifyAccessToken(
  token: string
): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify<AuthTokenPayload>(token, getSecretKey(), {
      issuer:   ISSUER,
      audience: AUDIENCE,
    });
    return payload;
  } catch {
    return null;
  }
}
