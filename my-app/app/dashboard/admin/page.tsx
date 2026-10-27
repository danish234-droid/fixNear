"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout";
import { DashboardStatCard } from "@/components/dashboard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  EmptyState,
  Badge,
} from "@/components/ui";
import {
  getCurrentUserApi,
  getAdminOverviewApi,
  getAdminUsersApi,
  AuthUser,
  AdminOverview,
} from "@/lib/auth";

/* ── Icon helpers ───────────────────────────────────────────────── */
function UsersIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}
function ToolsIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function BookingsIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
function LayersIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadAdminDashboard() {
      try {
        const currentUser = await getCurrentUserApi();
        if (!mounted) return;

        if (!currentUser) {
          router.push("/login?redirect=/dashboard/admin");
          return;
        }

        if (currentUser.role !== "ADMIN") {
          // Access denied - redirect to customer or professional dashboard
          if (currentUser.role === "PROFESSIONAL") {
            router.push("/dashboard/professional");
          } else {
            router.push("/dashboard/customer");
          }
          return;
        }

        setUser(currentUser);

        const [ovRes, usersRes] = await Promise.all([
          getAdminOverviewApi(),
          getAdminUsersApi(),
        ]);

        if (!mounted) return;

        if (ovRes.ok) {
          setOverview(ovRes.data);
        } else {
          setError(ovRes.error);
        }

        if (usersRes.ok) {
          setUsers(usersRes.data);
        }
      } catch {
        if (mounted) setError("Failed to load admin console.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAdminDashboard();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-fixnear-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-fixnear-muted">
          <div className="w-8 h-8 border-3 border-fixnear-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Authenticating admin console...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell
      role="admin"
      title="Administration Console"
      subtitle="Platform-wide governance, verification queues, and booking oversight."
      activeHref="/dashboard/admin"
    >
      <div className="space-y-8">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 p-4 rounded-xl bg-[#FDF2F2] border border-[#F9CACA] text-fixnear-error text-xs sm:text-sm"
          >
            <span>{error}</span>
          </div>
        )}

        {/* ── Summary Stat Cards ─────────────────────────────────────── */}
        <section aria-labelledby="admin-stats-heading">
          <h2
            id="admin-stats-heading"
            className="text-sm font-semibold text-fixnear-muted uppercase tracking-wider mb-4"
          >
            Platform Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <DashboardStatCard
              label="Registered Customers"
              value={overview?.totalCustomers ?? 0}
              sub={`of ${overview?.totalUsers ?? 0} total users`}
              accent="blue"
              icon={<UsersIcon />}
            />
            <DashboardStatCard
              label="Registered Professionals"
              value={overview?.totalProfessionals ?? 0}
              sub="active service providers"
              accent="navy"
              icon={<ToolsIcon />}
            />
            <DashboardStatCard
              label="Booking Requests"
              value={overview?.totalBookings ?? 0}
              sub="total platform-wide"
              accent="success"
              icon={<BookingsIcon />}
            />
            <DashboardStatCard
              label="Service Categories"
              value={overview?.totalCategories ?? 0}
              sub="active categories"
              accent="warning"
              icon={<LayersIcon />}
            />
          </div>
        </section>

        {/* ── User Accounts Table ────────────────────────────────────── */}
        <section aria-labelledby="admin-users-heading" id="customers">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle>Platform Accounts</CardTitle>
                  <CardDescription>
                    All registered users with roles and registration dates.
                  </CardDescription>
                </div>
                <Badge variant="info" size="sm">
                  {users.length} {users.length === 1 ? "user" : "users"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {users.length === 0 ? (
                <EmptyState
                  title="No users found"
                  description="No registered user records returned by the administration API."
                  icon={<UsersIcon />}
                />
              ) : (
                <div className="overflow-x-auto -mx-5 sm:-mx-6">
                  <table className="w-full text-sm min-w-[560px]">
                    <thead>
                      <tr className="border-b border-fixnear-border bg-fixnear-bg/50 text-xs text-fixnear-muted uppercase tracking-wide">
                        <th scope="col" className="text-left px-5 sm:px-6 py-3 font-semibold">User</th>
                        <th scope="col" className="text-left px-4 py-3 font-semibold">Email</th>
                        <th scope="col" className="text-left px-4 py-3 font-semibold">Role</th>
                        <th scope="col" className="text-left px-4 py-3 font-semibold">Phone / Profile</th>
                        <th scope="col" className="text-left px-4 py-3 font-semibold">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-fixnear-border/60">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-fixnear-bg/40 transition-colors">
                          <td className="px-5 sm:px-6 py-3.5 font-medium text-fixnear-navy whitespace-nowrap">
                            {u.name}
                          </td>
                          <td className="px-4 py-3.5 text-fixnear-text text-xs whitespace-nowrap font-mono">
                            {u.email}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <Badge
                              variant={
                                u.role === "ADMIN"
                                  ? "error"
                                  : u.role === "PROFESSIONAL"
                                  ? "info"
                                  : "success"
                              }
                              size="sm"
                              className="font-semibold"
                            >
                              {u.role}
                            </Badge>
                          </td>
                          <td className="px-4 py-3.5 text-fixnear-muted text-xs">
                            {u.professionalProfile
                              ? `${u.professionalProfile.businessName || "Profile"} (${u.professionalProfile.city})`
                              : u.phone || "—"}
                          </td>
                          <td className="px-4 py-3.5 text-fixnear-muted text-xs whitespace-nowrap">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* ── Quick Admin Links ──────────────────────────────────────── */}
        <section aria-labelledby="admin-links-heading">
          <h2
            id="admin-links-heading"
            className="text-sm font-semibold text-fixnear-muted uppercase tracking-wider mb-4"
          >
            Management Portals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card interactive>
              <CardContent className="flex items-center gap-4 py-5">
                <div className="w-11 h-11 rounded-full bg-[#EEF6FC] flex items-center justify-center shrink-0 ring-4 ring-fixnear-blue/10">
                  <ToolsIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-fixnear-navy text-sm">Directory of Professionals</p>
                  <p className="text-xs text-fixnear-muted mt-0.5">Explore active trade professional listings</p>
                </div>
                <Link
                  href="/professionals"
                  className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-fixnear-blue hover:text-fixnear-blue-hover rounded px-2 py-1 transition-colors"
                >
                  View
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </CardContent>
            </Card>

            <Card interactive>
              <CardContent className="flex items-center gap-4 py-5">
                <div className="w-11 h-11 rounded-full bg-[#EAF5EE] flex items-center justify-center shrink-0 ring-4 ring-fixnear-success/10">
                  <LayersIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-fixnear-navy text-sm">Service Categories</p>
                  <p className="text-xs text-fixnear-muted mt-0.5">Explore platform service taxonomy</p>
                </div>
                <Link
                  href="/categories"
                  className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-fixnear-blue hover:text-fixnear-blue-hover rounded px-2 py-1 transition-colors"
                >
                  View
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
