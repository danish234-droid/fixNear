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
  title: "Professional Dashboard — FixNear",
  description: "Manage incoming booking requests and your professional profile on FixNear.",
};

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

/* ── Sample demo row (clearly labelled as demo) ─────────────────── */
interface DemoBooking {
  id: string;
  customer: string;
  service: string;
  date: string;
  status: "pending" | "confirmed";
}

const DEMO_BOOKINGS: DemoBooking[] = [
  { id: "DEMO-001", customer: "Jane D.", service: "Plumbing — Pipe Repair", date: "Demo date", status: "pending" },
  { id: "DEMO-002", customer: "Mark S.", service: "Electrical — Socket Install", date: "Demo date", status: "confirmed" },
];

export default function ProfessionalDashboardPage() {
  return (
    <DashboardShell
      role="professional"
      title="Professional Portal"
      subtitle="Manage your incoming booking requests and service profile."
      activeHref="/dashboard/professional"
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
            <strong>Development preview.</strong> Authentication is not yet connected.
            Stats show zeros and the booking rows below are clearly labelled demo data.
            Real booking requests will appear here after backend integration.
          </span>
        </div>

        {/* ── Summary Stat Cards ─────────────────────────────────────── */}
        <section aria-labelledby="pro-stats-heading">
          <h2 id="pro-stats-heading" className="text-sm font-semibold text-fixnear-muted uppercase tracking-wider mb-4">
            Your Activity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DashboardStatCard
              label="Incoming Requests"
              value={0}
              sub="new this week"
              accent="blue"
              icon={<InboxIcon />}
            />
            <DashboardStatCard
              label="Pending Requests"
              value={0}
              sub="awaiting your response"
              accent="warning"
              icon={<ClockIcon />}
            />
            <DashboardStatCard
              label="Completed Jobs"
              value={0}
              sub="all time"
              accent="success"
              icon={<BriefcaseIcon />}
            />
          </div>
        </section>

        {/* ── Quick Actions ──────────────────────────────────────────── */}
        <section aria-labelledby="pro-actions-heading">
          <h2 id="pro-actions-heading" className="text-sm font-semibold text-fixnear-muted uppercase tracking-wider mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* View / Edit public profile — links to the real profile page */}
            <Card interactive>
              <CardContent className="flex items-center gap-4 py-5">
                <div className="w-11 h-11 rounded-full bg-[#EEF6FC] flex items-center justify-center shrink-0 ring-4 ring-fixnear-blue/10">
                  <svg className="w-5 h-5 text-fixnear-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-fixnear-navy text-sm">My Public Profile</p>
                  <p className="text-xs text-fixnear-muted mt-0.5">View how customers see your profile</p>
                </div>
                <Link
                  href="/professionals/demo-professional-1"
                  className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-fixnear-blue hover:text-fixnear-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded px-2 py-1 transition-colors"
                  aria-label="View public profile (demo)"
                >
                  View
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </CardContent>
            </Card>

            {/* Browse categories */}
            <Card interactive>
              <CardContent className="flex items-center gap-4 py-5">
                <div className="w-11 h-11 rounded-full bg-[#EAF5EE] flex items-center justify-center shrink-0 ring-4 ring-fixnear-success/10">
                  <svg className="w-5 h-5 text-fixnear-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-fixnear-navy text-sm">All Service Categories</p>
                  <p className="text-xs text-fixnear-muted mt-0.5">See what services customers are browsing</p>
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

        {/* ── Booking Requests Section ───────────────────────────────── */}
        <section aria-labelledby="pro-bookings-heading" id="bookings">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle>Booking Requests</CardTitle>
                  <CardDescription>
                    Incoming requests from customers. Real data loads after backend integration.
                  </CardDescription>
                </div>
                <Badge variant="amber" size="sm">Demo data below</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Demo table — clearly labelled */}
              <div className="mb-4 p-3 bg-[#FEF8ED] border border-[#FAD998] rounded-lg text-[11px] text-[#945600] font-medium">
                ⚠ The rows below are demo layout samples only. They do not represent real customers or bookings.
              </div>
              <div className="overflow-x-auto -mx-5 sm:-mx-6">
                <table className="w-full text-sm min-w-[520px]">
                  <thead>
                    <tr className="border-b border-fixnear-border bg-fixnear-bg/50 text-xs text-fixnear-muted uppercase tracking-wide">
                      <th scope="col" className="text-left px-5 sm:px-6 py-3 font-semibold">Ref</th>
                      <th scope="col" className="text-left px-4 py-3 font-semibold">Customer</th>
                      <th scope="col" className="text-left px-4 py-3 font-semibold">Service</th>
                      <th scope="col" className="text-left px-4 py-3 font-semibold">Date</th>
                      <th scope="col" className="text-left px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-fixnear-border/60">
                    {DEMO_BOOKINGS.map((b) => (
                      <tr key={b.id} className="hover:bg-fixnear-bg/40 transition-colors">
                        <td className="px-5 sm:px-6 py-3.5 font-mono text-xs text-fixnear-muted whitespace-nowrap">{b.id}</td>
                        <td className="px-4 py-3.5 font-medium text-fixnear-navy whitespace-nowrap">{b.customer}</td>
                        <td className="px-4 py-3.5 text-fixnear-text">{b.service}</td>
                        <td className="px-4 py-3.5 text-fixnear-muted text-xs whitespace-nowrap">{b.date}</td>
                        <td className="px-4 py-3.5">
                          <Badge
                            variant={b.status === "confirmed" ? "info" : "warning"}
                            size="sm"
                          >
                            {b.status === "confirmed" ? "Confirmed" : "Pending"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Empty state below demo rows */}
              <div className="mt-4 border-t border-fixnear-border pt-4">
                <EmptyState
                  title="No real booking requests yet"
                  description="Real incoming booking requests will appear here once customers submit them and the booking backend is connected."
                  icon={
                    <svg className="w-6 h-6 text-fixnear-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  }
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ── Services Offered placeholder ──────────────────────────── */}
        <section aria-labelledby="pro-services-heading" id="services">
          <Card>
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
              <CardDescription>
                Configure which services you offer. Service management will be available after backend integration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="Service management coming soon"
                description="Once the backend is connected, you will be able to add, edit, and remove the services you offer. Customers will see these on your public profile."
                action={
                  <Link
                    href="/categories"
                    className="inline-flex items-center justify-center font-medium leading-none select-none transition-colors duration-150 ease-in-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring focus-visible:ring-offset-2 bg-white text-fixnear-text hover:bg-fixnear-bg active:bg-[#EDF2F7] border border-fixnear-border shadow-xs h-8 px-3 text-xs gap-1.5 rounded-md"
                  >
                    Browse All Categories
                  </Link>
                }
              />
            </CardContent>
          </Card>
        </section>

      </div>
    </DashboardShell>
  );
}
