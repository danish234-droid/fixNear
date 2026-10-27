/**
 * my-app/lib/auth.ts
 *
 * Client-side authentication and resource utilities communicating with FixNear Express API.
 *
 * Security & Design Rules:
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
  phone?: string | null;
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

export interface BookingItem {
  id: string;
  customerId: string;
  professionalServiceId: string;
  scheduledAt: string | null;
  address: string;
  description: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  professionalService?: {
    id: string;
    title: string;
    priceFrom: number | null;
    professionalProfile?: {
      id: string;
      city: string;
      businessName: string | null;
    };
    serviceCategory?: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface AdminOverview {
  totalUsers: number;
  totalCustomers: number;
  totalProfessionals: number;
  totalBookings: number;
  totalCategories: number;
  bookingsByStatus: Record<string, number>;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "PROFESSIONAL";
  phone?: string | null;
  city?: string | null;
  businessName?: string | null;
}

/**
 * Register a new user account (CUSTOMER or PROFESSIONAL).
 */
export async function registerApi(
  data: RegisterPayload
): Promise<{ ok: true; user: AuthUser } | { ok: false; error: string; status: number }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        ok: false,
        error: body?.message || "Registration failed. Please check your information.",
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
      error: "Unable to connect to the registration server. Please check your network connection.",
      status: 503,
    };
  }
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

/**
 * Fetch bookings for the authenticated customer.
 */
export async function getCustomerBookingsApi(
  customerId: string
): Promise<{ ok: true; data: BookingItem[] } | { ok: false; error: string; status: number }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/bookings/customer/${customerId}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });

    const body = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        ok: false,
        error: body?.message || "Failed to load bookings.",
        status: res.status,
      };
    }

    return { ok: true, data: body.data || [] };
  } catch {
    return { ok: false, error: "Network error loading customer bookings.", status: 503 };
  }
}

/**
 * Fetch bookings assigned to the authenticated professional.
 */
export async function getProfessionalBookingsApi(): Promise<
  { ok: true; data: BookingItem[] } | { ok: false; error: string; status: number }
> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/bookings/professional`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });

    const body = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        ok: false,
        error: body?.message || "Failed to load professional bookings.",
        status: res.status,
      };
    }

    return { ok: true, data: body.data || [] };
  } catch {
    return { ok: false, error: "Network error loading professional bookings.", status: 503 };
  }
}

/**
 * Update a booking's status (for professionals accepting/rejecting/completing).
 */
export async function updateBookingStatusApi(
  bookingId: string,
  status: "ACCEPTED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
): Promise<{ ok: true; data: BookingItem } | { ok: false; error: string; status: number }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Requested": "1",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    });

    const body = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        ok: false,
        error: body?.message || "Failed to update booking status.",
        status: res.status,
      };
    }

    return { ok: true, data: body.data };
  } catch {
    return { ok: false, error: "Network error updating booking status.", status: 503 };
  }
}

/**
 * Fetch admin platform overview stats.
 */
export async function getAdminOverviewApi(): Promise<
  { ok: true; data: AdminOverview } | { ok: false; error: string; status: number }
> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/overview`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });

    const body = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        ok: false,
        error: body?.message || "Failed to load admin overview.",
        status: res.status,
      };
    }

    return { ok: true, data: body.data };
  } catch {
    return { ok: false, error: "Network error loading admin overview.", status: 503 };
  }
}

/**
 * Fetch user list for admin dashboard.
 */
export async function getAdminUsersApi(): Promise<
  { ok: true; data: AuthUser[] } | { ok: false; error: string; status: number }
> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });

    const body = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        ok: false,
        error: body?.message || "Failed to load admin users.",
        status: res.status,
      };
    }

    return { ok: true, data: body.data || [] };
  } catch {
    return { ok: false, error: "Network error loading admin users.", status: 503 };
  }
}
