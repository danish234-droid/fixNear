import React from "react";
import Link from "next/link";
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

export const metadata = {
  title: "Customer Dashboard — FixNear",
  description: "Manage your local service booking requests on FixNear.",
};

/* ── Icon helpers (inline SVGs to avoid extra deps) ─────────────── */
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

export default function CustomerDashboardPage() {
  return (
    <DashboardShell
      role="customer"
      title="Welcome back"
      subtitle="Here's what's happening with your service requests."
      activeHref="/dashboard/customer"
    >
      <div className="space-y-8">

        {/* ── Dev Notice ────────────────────────────────────────────── */}
        <div
          role="note"
          aria-label="Development notice"
          className="flex items-start gap-3 p-4 rounded-xl bg-[#FEF8ED] border border-[#FAD998] text-[#945600] text-xs sm:text-sm"
        >
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <strong>Development preview.</strong> Role-based authentication is not yet
            connected. This page is a UI prototype — no real bookings or user data are
            loaded.
          </span>
        </div>

        {/* ── Summary Stat Cards ─────────────────────────────────────── */}
        <section aria-labelledby="customer-stats-heading">
          <h2 id="customer-stats-heading" className="text-sm font-semibold text-fixnear-muted uppercase tracking-wider mb-4">
            Your Activity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DashboardStatCard
              label="Total Booking Requests"
              value={0}
              sub="all time"
              accent="blue"
              icon={<BookingIcon />}
            />
            <DashboardStatCard
              label="Pending Requests"
              value={0}
              sub="awaiting response"
              accent="warning"
              icon={<ClockIcon />}
            />
            <DashboardStatCard
              label="Completed Bookings"
              value={0}
              sub="successfully completed"
              accent="success"
              icon={<CheckIcon />}
            />
          </div>
        </section>

        {/* ── Quick Actions ──────────────────────────────────────────── */}
        <section aria-labelledby="customer-actions-heading">
          <h2 id="customer-actions-heading" className="text-sm font-semibold text-fixnear-muted uppercase tracking-wider mb-4">
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
                  <CardDescription>Your latest service requests will appear here.</CardDescription>
                </div>
                <Badge variant="neutral" size="sm">0 requests</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <EmptyState
                title="No booking requests yet"
                description="Once you send a booking request to a professional, it will appear here. Booking data will be loaded from the backend once authentication is connected."
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
            </CardContent>
          </Card>
        </section>

        {/* ── Help & Info ────────────────────────────────────────────── */}
        <section aria-labelledby="how-it-works-heading">
          <Card>
            <CardHeader>
              <CardTitle>How FixNear works</CardTitle>
              <CardDescription>Get started in three easy steps.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 text-sm text-fixnear-text">
                {[
                  { step: 1, title: "Browse professionals", desc: "Search by category or location to find vetted local service providers." },
                  { step: 2, title: "Send a booking request", desc: "Fill in your requirements, preferred date, and contact details." },
                  { step: 3, title: "Get the job done", desc: "The professional confirms your request and arrives at the scheduled time." },
                ].map(({ step, title, desc }) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="w-7 h-7 rounded-full bg-fixnear-blue text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {step}
                    </span>
                    <div>
                      <p className="font-semibold text-fixnear-navy">{title}</p>
                      <p className="text-xs text-fixnear-muted mt-0.5">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </section>

      </div>
    </DashboardShell>
  );
}
