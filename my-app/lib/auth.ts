/**
 * my-app/lib/auth.ts
 *
 * Client-side authentication utilities for communicating with the FixNear Express API.
 * 
 * Rules:
 *  - Credentials (HttpOnly cookies) are sent using `credentials: "include"`.
 *  - Tokens are never stored in localStorage or sessionStorage.
 *  - State-changing authenticated requests include Content-Type: application/json
 *    and the X-CSRF-Requested header to fulfill CSRF mitigation requirements.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "PROFESSIONAL" | "ADMIN";
  createdAt: string;
  professionalProfile?: {
    id: string;
    city: string;
    businessName: string | null;
    bio: string | null;
    isAvailable: boolean;
    createdAt: string;
  } | null;
}

export interface LoginResponse {
  message: string;
  status: number;
  data: AuthUser;
}

export interface ApiError {
  error: string;
  message: string;
  status: number;
}

/**
 * Log in with email and password.
 * The server sets an HttpOnly cookie containing the signed JWT.
 */
export async function loginApi(
  email: string,
  password: string
): Promise<{ ok: true; user: AuthUser } | { ok: false; error: string; status: number }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        ok: false,
        error: body?.message || "Invalid email or password.",
        status: res.status,
      };
    }

    return {
      ok: true,
      user: body.data,
    };
  } catch {
    return {
      ok: false,
      error: "Unable to connect to authentication server. Please check your network.",
      status: 503,
    };
  }
}

/**
 * Fetch the current authenticated session.
 * Returns null if not authenticated (401) or on error.
 */
export async function getCurrentUserApi(): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      return null;
    }

    const body = await res.json();
    return body.data as AuthUser;
  } catch {
    return null;
  }
}

/**
 * Invalidate the session and clear the HttpOnly cookie.
 */
export async function logoutApi(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Requested": "1",
      },
      credentials: "include",
    });

    return res.ok;
  } catch {
    return false;
  }
}
