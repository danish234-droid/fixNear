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
  StatusBadge,
  BookingStatus,
} from "@/components/ui";
import {
  getCurrentUserApi,
  getCustomerBookingsApi,
  AuthUser,
  BookingItem,
} from "@/lib/auth";

/* ── Icon helpers ───────────────────────────────────────────────── */
function BookingIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function mapStatusToBadge(status: string): BookingStatus {
  switch (status) {
    case "PENDING":
      return "pending";
    case "ACCEPTED":
      return "confirmed";
    case "IN_PROGRESS":
      return "in-progress";
    case "COMPLETED":
      return "completed";
    case "CANCELLED":
      return "cancelled";
    case "REJECTED":
      return "rejected";
    default:
      return "pending";
  }
}

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        const currentUser = await getCurrentUserApi();
        if (!mounted) return;

        if (!currentUser) {
          router.push("/login?redirect=/dashboard/customer");
          return;
        }

        if (currentUser.role !== "CUSTOMER" && currentUser.role !== "ADMIN") {
          if (currentUser.role === "PROFESSIONAL") {
            router.push("/dashboard/professional");
          } else {
            router.push("/dashboard/admin");
          }
          return;
        }

        setUser(currentUser);

        const res = await getCustomerBookingsApi(currentUser.id);
        if (!mounted) return;

        if (res.ok) {
          setBookings(res.data);
        } else {
          setError(res.error);
        }
      } catch {
        if (mounted) setError("Failed to load customer dashboard.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-fixnear-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-fixnear-muted">
          <div className="w-8 h-8 border-3 border-fixnear-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading customer dashboard...</p>
        </div>
      </div>
    );
  }

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED").length;

  return (
    <DashboardShell
      role="customer"
      title={`Welcome back, ${user?.name || "Customer"}`}
      subtitle="Here's what's happening with your service requests."
      activeHref="/dashboard/customer"
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
        <section aria-labelledby="customer-stats-heading">
          <h2
            id="customer-stats-heading"
            className="text-sm font-semibold text-fixnear-muted uppercase tracking-wider mb-4"
          >
            Your Activity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DashboardStatCard
              label="Total Booking Requests"
              value={totalBookings}
              sub="all time"
              accent="blue"
              icon={<BookingIcon />}
            />
            <DashboardStatCard
              label="Pending Requests"
              value={pendingBookings}
              sub="awaiting pro response"
              accent="warning"
              icon={<ClockIcon />}
            />
            <DashboardStatCard
              label="Completed Bookings"
              value={completedBookings}
              sub="successfully completed"
              accent="success"
              icon={<CheckIcon />}
            />
          </div>
        </section>

        {/* ── Quick Actions ──────────────────────────────────────────── */}
        <section aria-labelledby="customer-actions-heading">
          <h2
            id="customer-actions-heading"
            className="text-sm font-semibold text-fixnear-muted uppercase tracking-wider mb-4"
          >
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card interactive className="group">
              <CardContent className="flex items-center gap-4 py-5">
                <div className="w-11 h-11 rounded-full bg-[#EEF6FC] flex items-center justify-center shrink-0 ring-4 ring-fixnear-blue/10">
                  <SearchIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-fixnear-navy text-sm">Find Professionals</p>
                  <p className="text-xs text-fixnear-muted mt-0.5">Browse vetted local service providers</p>
                </div>
                <Link
                  href="/professionals"
                  className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-fixnear-blue hover:text-fixnear-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded px-2 py-1 transition-colors"
                  aria-label="Browse professionals"
                >
                  Browse
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </CardContent>
            </Card>

            <Card interactive className="group">
              <CardContent className="flex items-center gap-4 py-5">
                <div className="w-11 h-11 rounded-full bg-[#EAF5EE] flex items-center justify-center shrink-0 ring-4 ring-fixnear-success/10">
                  <svg className="w-5 h-5 text-fixnear-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-fixnear-navy text-sm">Browse Categories</p>
                  <p className="text-xs text-fixnear-muted mt-0.5">Plumbing, electrical, cleaning &amp; more</p>
                </div>
                <Link
                  href="/categories"
                  className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-fixnear-blue hover:text-fixnear-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded px-2 py-1 transition-colors"
                  aria-label="Browse service categories"
                >
                  Browse
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── Recent Booking Requests ────────────────────────────────── */}
        <section aria-labelledby="recent-bookings-heading" id="bookings">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Booking Requests</CardTitle>
                  <CardDescription>
                    Real bookings requested by your account.
                  </CardDescription>
                </div>
                <Badge variant="info" size="sm">
                  {bookings.length} {bookings.length === 1 ? "request" : "requests"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              {bookings.length === 0 ? (
                <EmptyState
                  title="No booking requests yet"
                  description="When you request a service from a professional, your live booking details will appear here."
                  icon={
                    <svg className="w-6 h-6 text-fixnear-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                  action={
                    <Link
                      href="/professionals"
                      className="inline-flex items-center justify-center font-medium leading-none select-none transition-colors duration-150 ease-in-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring focus-visible:ring-offset-2 bg-fixnear-blue text-white hover:bg-fixnear-blue-hover active:bg-[#1A5785] border border-transparent shadow-xs h-8 px-3 text-xs gap-1.5 rounded-md"
                    >
                      Find a Professional
                    </Link>
                  }
                />
              ) : (
                <div className="overflow-x-auto -mx-5 sm:-mx-6">
                  <table className="w-full text-sm min-w-[560px]">
                    <thead>
                      <tr className="border-b border-fixnear-border bg-fixnear-bg/50 text-xs text-fixnear-muted uppercase tracking-wide">
                        <th scope="col" className="text-left px-5 sm:px-6 py-3 font-semibold">Ref</th>
                        <th scope="col" className="text-left px-4 py-3 font-semibold">Service</th>
                        <th scope="col" className="text-left px-4 py-3 font-semibold">Address</th>
                        <th scope="col" className="text-left px-4 py-3 font-semibold">Created</th>
                        <th scope="col" className="text-left px-4 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-fixnear-border/60">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-fixnear-bg/40 transition-colors">
                          <td className="px-5 sm:px-6 py-3.5 font-mono text-xs text-fixnear-muted whitespace-nowrap">
                            {b.id.slice(0, 8)}...
                          </td>
                          <td className="px-4 py-3.5 font-medium text-fixnear-navy">
                            {b.professionalService?.title || "Professional Service"}
                            {b.professionalService?.serviceCategory?.name && (
                              <span className="block text-xs text-fixnear-muted font-normal">
                                {b.professionalService.serviceCategory.name}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-fixnear-text text-xs">
                            {b.address}
                          </td>
                          <td className="px-4 py-3.5 text-fixnear-muted text-xs whitespace-nowrap">
                            {new Date(b.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3.5">
                            <StatusBadge status={mapStatusToBadge(b.status)} size="sm" />
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
      </div>
    </DashboardShell>
  );
}
