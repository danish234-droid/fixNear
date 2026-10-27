"use client";

import React, { useEffect, useState, useCallback } from "react";
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
  Button,
  StatusBadge,
  BookingStatus,
} from "@/components/ui";
import {
  getCurrentUserApi,
  getProfessionalBookingsApi,
  updateBookingStatusApi,
  AuthUser,
  BookingItem,
} from "@/lib/auth";

/* ── Icon helpers ───────────────────────────────────────────────── */
function InboxIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
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
function BriefcaseIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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

export default function ProfessionalDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    const res = await getProfessionalBookingsApi();
    if (res.ok) {
      setBookings(res.data);
    } else {
      setError(res.error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        const currentUser = await getCurrentUserApi();
        if (!mounted) return;

        if (!currentUser) {
          router.push("/login?redirect=/dashboard/professional");
          return;
        }

        if (currentUser.role !== "PROFESSIONAL" && currentUser.role !== "ADMIN") {
          if (currentUser.role === "CUSTOMER") {
            router.push("/dashboard/customer");
          } else {
            router.push("/dashboard/admin");
          }
          return;
        }

        setUser(currentUser);
        await fetchBookings();
      } catch {
        if (mounted) setError("Failed to load professional dashboard.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [router, fetchBookings]);

  const handleStatusUpdate = async (
    bookingId: string,
    newStatus: "ACCEPTED" | "REJECTED" | "COMPLETED"
  ) => {
    setActionInProgress(bookingId);
    try {
      const res = await updateBookingStatusApi(bookingId, newStatus);
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        );
      } else {
        alert(res.error || "Failed to update booking status.");
      }
    } catch {
      alert("Error contacting the server.");
    } finally {
      setActionInProgress(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-fixnear-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-fixnear-muted">
          <div className="w-8 h-8 border-3 border-fixnear-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading professional portal...</p>
        </div>
      </div>
    );
  }

  const incomingTotal = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;

  return (
    <DashboardShell
      role="professional"
      title={user?.professionalProfile?.businessName || `Professional Portal — ${user?.name || ""}`}
      subtitle="Manage incoming client requests and monitor your active bookings."
      activeHref="/dashboard/professional"
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

        {/* ── Profile Snapshot Card ──────────────────────────────────── */}
        <div className="p-4 rounded-xl bg-white border border-fixnear-border shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#EEF6FC] text-fixnear-blue flex items-center justify-center font-bold text-lg">
              {user?.name?.[0]?.toUpperCase() || "P"}
            </div>
            <div>
              <p className="font-bold text-fixnear-navy text-sm sm:text-base">
                {user?.professionalProfile?.businessName || user?.name}
              </p>
              <p className="text-xs text-fixnear-muted">
                {user?.professionalProfile?.city || "City Unspecified"} • {user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" size="sm">
              Active Professional
            </Badge>
          </div>
        </div>

        {/* ── Summary Stat Cards ─────────────────────────────────────── */}
        <section aria-labelledby="pro-stats-heading">
          <h2
            id="pro-stats-heading"
            className="text-sm font-semibold text-fixnear-muted uppercase tracking-wider mb-4"
          >
            Your Activity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DashboardStatCard
              label="Incoming Requests"
              value={incomingTotal}
              sub="total received"
              accent="blue"
              icon={<InboxIcon />}
            />
            <DashboardStatCard
              label="Pending Requests"
              value={pendingCount}
              sub="awaiting your response"
              accent="warning"
              icon={<ClockIcon />}
            />
            <DashboardStatCard
              label="Completed Jobs"
              value={completedCount}
              sub="completed bookings"
              accent="success"
              icon={<BriefcaseIcon />}
            />
          </div>
        </section>

        {/* ── Booking Requests Section ───────────────────────────────── */}
        <section aria-labelledby="pro-bookings-heading" id="bookings">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle>Incoming Booking Requests</CardTitle>
                  <CardDescription>
                    Client requests submitted for your services. Accept or reject pending jobs below.
                  </CardDescription>
                </div>
                <Badge variant="info" size="sm">
                  {bookings.length} {bookings.length === 1 ? "job" : "jobs"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {bookings.length === 0 ? (
                <div className="py-6">
                  <EmptyState
                    title="No incoming bookings yet"
                    description="When customers book your services, their requests will appear here with contact details and action buttons."
                    icon={
                      <svg className="w-6 h-6 text-fixnear-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    }
                  />
                </div>
              ) : (
                <div className="overflow-x-auto -mx-5 sm:-mx-6">
                  <table className="w-full text-sm min-w-[640px]">
                    <thead>
                      <tr className="border-b border-fixnear-border bg-fixnear-bg/50 text-xs text-fixnear-muted uppercase tracking-wide">
                        <th scope="col" className="text-left px-5 sm:px-6 py-3 font-semibold">Ref</th>
                        <th scope="col" className="text-left px-4 py-3 font-semibold">Customer</th>
                        <th scope="col" className="text-left px-4 py-3 font-semibold">Service</th>
                        <th scope="col" className="text-left px-4 py-3 font-semibold">Address</th>
                        <th scope="col" className="text-left px-4 py-3 font-semibold">Status</th>
                        <th scope="col" className="text-right px-5 sm:px-6 py-3 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-fixnear-border/60">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-fixnear-bg/40 transition-colors">
                          <td className="px-5 sm:px-6 py-3.5 font-mono text-xs text-fixnear-muted whitespace-nowrap">
                            {b.id.slice(0, 8)}...
                          </td>
                          <td className="px-4 py-3.5 font-medium text-fixnear-navy whitespace-nowrap">
                            {b.customer?.name || "Client"}
                            {b.customer?.email && (
                              <span className="block text-xs text-fixnear-muted font-normal">
                                {b.customer.email}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-fixnear-text">
                            {b.professionalService?.title || "Custom Service"}
                          </td>
                          <td className="px-4 py-3.5 text-fixnear-muted text-xs">
                            {b.address}
                          </td>
                          <td className="px-4 py-3.5">
                            <StatusBadge status={mapStatusToBadge(b.status)} size="sm" />
                          </td>
                          <td className="px-5 sm:px-6 py-3.5 text-right whitespace-nowrap">
                            {b.status === "PENDING" && (
                              <div className="inline-flex items-center gap-1.5 justify-end">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  disabled={actionInProgress === b.id}
                                  onClick={() => handleStatusUpdate(b.id, "ACCEPTED")}
                                  className="h-7 text-xs px-2.5"
                                >
                                  Accept
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={actionInProgress === b.id}
                                  onClick={() => handleStatusUpdate(b.id, "REJECTED")}
                                  className="h-7 text-xs px-2.5 text-fixnear-error border-fixnear-error/30 hover:bg-fixnear-error/10"
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                            {b.status === "ACCEPTED" && (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={actionInProgress === b.id}
                                onClick={() => handleStatusUpdate(b.id, "COMPLETED")}
                                className="h-7 text-xs px-2.5 text-fixnear-success border-fixnear-success/30 hover:bg-fixnear-success/10"
                              >
                                Mark Completed
                              </Button>
                            )}
                            {(b.status === "COMPLETED" || b.status === "REJECTED" || b.status === "CANCELLED") && (
                              <span className="text-xs text-fixnear-muted italic">Archived</span>
                            )}
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
