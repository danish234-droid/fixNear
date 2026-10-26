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
  title: "Admin Console — FixNear",
  description: "Platform-wide governance and oversight for FixNear administrators.",
};

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
function PendingIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

/* ── Placeholder future nav items ───────────────────────────────── */
interface AdminNavCard {
  title: string;
  description: string;
  href: string | null;  // null = future placeholder
  badge?: string;
}

const ADMIN_NAV_CARDS: AdminNavCard[] = [
  {
    title: "Users (Customers)",
    description: "View and manage registered customer accounts.",
    href: null,
    badge: "Future",
  },
  {
    title: "Professionals",
    description: "Review, approve, and manage registered professionals.",
    href: "/professionals",
    badge: "Browse",
  },
  {
    title: "Booking Requests",
    description: "View all platform booking requests across all users.",
    href: null,
    badge: "Future",
  },
  {
    title: "Settings",
    description: "Platform configuration and feature flags.",
    href: null,
    badge: "Future",
  },
];

export default function AdminDashboardPage() {
  return (
    <DashboardShell
      role="admin"
      title="Administration Console"
      subtitle="Platform-wide governance, verification queues, and booking oversight."
      activeHref="/dashboard/admin"
    >
      <div className="space-y-8">

        {/* ── Security Disclaimer ────────────────────────────────────── */}
        <div
          role="note"
          aria-label="Security notice"
          className="flex items-start gap-3 p-4 rounded-xl bg-[#FDF2F2] border border-[#F9CACA] text-fixnear-error text-xs sm:text-sm"
        >
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>
            <strong>Development preview — no access control enforced.</strong> Visiting
            this URL does not grant administrative privileges. Real admin authorisation
            will be implemented via backend middleware. All stats show zeros; no real
            platform data is loaded.
          </span>
        </div>

        {/* ── Summary Stat Cards ─────────────────────────────────────── */}
        <section aria-labelledby="admin-stats-heading">
          <h2 id="admin-stats-heading" className="text-sm font-semibold text-fixnear-muted uppercase tracking-wider mb-4">
            Platform Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <DashboardStatCard
              label="Registered Customers"
              value={0}
              sub="total"
              accent="blue"
              icon={<UsersIcon />}
            />
            <DashboardStatCard
              label="Registered Professionals"
              value={0}
              sub="total"
              accent="navy"
              icon={<ToolsIcon />}
            />
            <DashboardStatCard
              label="Booking Requests"
              value={0}
              sub="total platform-wide"
              accent="success"
              icon={<BookingsIcon />}
            />
            <DashboardStatCard
              label="Pending Approvals"
              value={0}
              sub="professionals awaiting review"
              accent="warning"
              icon={<PendingIcon />}
            />
          </div>
        </section>

        {/* ── Recent Activity ────────────────────────────────────────── */}
        <section aria-labelledby="admin-activity-heading" id="bookings">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle>Recent Platform Activity</CardTitle>
                  <CardDescription>
                    Latest registrations and booking requests across the platform.
                  </CardDescription>
                </div>
                <Badge variant="neutral" size="sm">0 events</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <EmptyState
                title="No activity data yet"
                description="Platform-wide activity will appear here once the authentication and booking backends are connected and real users start registering and making requests."
                icon={
                  <svg className="w-6 h-6 text-fixnear-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
              />
            </CardContent>
          </Card>
        </section>

        {/* ── Admin Navigation Cards ─────────────────────────────────── */}
        <section aria-labelledby="admin-nav-heading" id="customers">
          <h2 id="admin-nav-heading" className="text-sm font-semibold text-fixnear-muted uppercase tracking-wider mb-4">
            Management Areas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ADMIN_NAV_CARDS.map(({ title, description, href, badge }) => (
              <Card key={title} interactive={!!href} className={!href ? "opacity-70" : ""}>
                <CardContent className="flex items-center gap-4 py-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-fixnear-navy text-sm">{title}</p>
                      {badge && (
                        <Badge
                          variant={href ? "info" : "neutral"}
                          size="sm"
                        >
                          {badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-fixnear-muted">{description}</p>
                  </div>
                  {href ? (
                    <Link
                      href={href}
                      className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-fixnear-blue hover:text-fixnear-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded px-2 py-1 transition-colors"
                    >
                      Open
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ) : (
                    <span className="shrink-0 text-xs text-fixnear-muted font-medium italic">
                      Coming soon
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Pending Approvals placeholder ─────────────────────────── */}
        <section aria-labelledby="admin-approvals-heading" id="technicians">
          <Card>
            <CardHeader>
              <CardTitle>Pending Professional Approvals</CardTitle>
              <CardDescription>
                Professionals who have registered and are awaiting account review.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="No pending approvals"
                description="When professionals register on the platform, their accounts will appear here pending admin review. Approval workflows will be implemented in a future backend module."
                icon={
                  <svg className="w-6 h-6 text-fixnear-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                }
              />
            </CardContent>
          </Card>
        </section>

        {/* ── Reports placeholder ────────────────────────────────────── */}
        <section aria-labelledby="admin-reports-heading" id="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Platform analytics and reporting — available after backend integration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="Reports not yet available"
                description="Analytics, booking reports, and user metrics will be accessible here once the platform backend and data pipelines are connected."
                icon={
                  <svg className="w-6 h-6 text-fixnear-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
              />
            </CardContent>
          </Card>
        </section>

        {/* ── Settings placeholder ───────────────────────────────────── */}
        <section aria-labelledby="admin-settings-heading" id="settings">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>
                Feature flags, configuration, and system settings — future implementation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="Settings not yet available"
                description="Platform configuration options will be implemented in a future module alongside the backend admin API."
                icon={
                  <svg className="w-6 h-6 text-fixnear-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                }
              />
            </CardContent>
          </Card>
        </section>

      </div>
    </DashboardShell>
  );
}
