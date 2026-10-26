import React from "react";
import Link from "next/link";
import {
  PublicLayout,
  PageContainer,
  SectionContainer,
} from "@/components/layout";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
} from "@/components/ui";

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Intro Banner */}
      <div className="bg-white border-b border-fixnear-border py-12 sm:py-16">
        <PageContainer>
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#EEF6FC] text-fixnear-blue text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-fixnear-blue" />
              Module 2, Part 3 &middot; Shared Website Layout
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-fixnear-navy leading-tight">
              Shared Layout &amp; Navigation Foundations
            </h1>

            <p className="text-sm sm:text-base text-fixnear-muted leading-relaxed">
              FixNear local services marketplace shared website architecture.
              Features a responsive public navigation bar with mobile drawer,
              structured public footer with dynamic copyright, reusable page
              containers, and configurable dashboard shells for Customers,
              Technicians, and Administrators.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/design-system">
                <Button variant="primary">
                  Explore Design System &amp; Layout Previews &rarr;
                </Button>
              </Link>
              <Link href="/design-system#dashboard-shells">
                <Button variant="outline">
                  Preview Dashboard Shells
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Shared Section Containers Showcase */}
      <SectionContainer
        title="Shared Marketplace Architecture"
        subtitle="Reusable layout foundations established for upcoming functional modules."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Public Layout */}
          <Card className="flex flex-col justify-between">
            <div>
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="info" size="sm">
                    Public Layout
                  </Badge>
                  <span className="text-xs text-fixnear-muted font-mono">
                    PublicLayout.tsx
                  </span>
                </div>
                <CardTitle>Public Website Shell</CardTitle>
                <CardDescription>
                  Customer-facing navigation and global brand footer
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-fixnear-muted space-y-2">
                <p>
                  • <strong>Navbar</strong>: Sticky desktop navigation with active
                  path indicator, auth triggers, and accessible mobile menu drawer.
                </p>
                <p>
                  • <strong>Footer</strong>: Multi-column trade links, service
                  categories, safety policies, and dynamic copyright year.
                </p>
                <p>
                  • <strong>PageContainer</strong>: Standardized 1280px max-width
                  with responsive padding preventing horizontal overflow.
                </p>
              </CardContent>
            </div>
            <CardFooter>
              <Link href="/design-system#public-layout" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  Inspect Public Layout Specs
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Card 2: Dashboard Shells */}
          <Card className="flex flex-col justify-between">
            <div>
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="amber" size="sm">
                    Portals
                  </Badge>
                  <span className="text-xs text-fixnear-muted font-mono">
                    DashboardShell.tsx
                  </span>
                </div>
                <CardTitle>Configurable Dashboard Shells</CardTitle>
                <CardDescription>
                  Foundations for Customer, Technician &amp; Admin areas
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-fixnear-muted space-y-2">
                <p>
                  • <strong>Customer</strong>: Overview, My Bookings, Profile,
                  and Reviews navigation.
                </p>
                <p>
                  • <strong>Technician</strong>: Overview, Bookings, Schedule,
                  Services, and Profile.
                </p>
                <p>
                  • <strong>Admin</strong>: Overview, Customers, Technicians,
                  Bookings, Reports, and Settings.
                </p>
                <p>
                  • <strong>Responsive</strong>: Fixed 64-width desktop sidebar +
                  mobile overlay drawer with Escape key dismiss.
                </p>
              </CardContent>
            </div>
            <CardFooter>
              <Link href="/design-system#dashboard-shells" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  Switch Dashboard Roles &rarr;
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Card 3: Design Tokens & Primitives */}
          <Card className="flex flex-col justify-between">
            <div>
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="success" size="sm">
                    Parts 1 &amp; 2
                  </Badge>
                  <span className="text-xs text-fixnear-muted font-mono">
                    components/ui
                  </span>
                </div>
                <CardTitle>Design Foundation Intact</CardTitle>
                <CardDescription>
                  Consistent tokens, primitives, and accessible controls
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-fixnear-muted space-y-2">
                <p>
                  • <strong>Palette</strong>: Trustworthy Navy (#173B57), Primary
                  Blue (#2878B5), Amber Accent (#F4B544), and Page (#F7F9FC).
                </p>
                <p>
                  • <strong>Inter Typography</strong>: Optimized sans-serif via
                  next/font/google with zero external requests.
                </p>
                <p>
                  • <strong>UI Primitives</strong>: 14+ reusable components
                  (Buttons, Forms, StatusBadges, Modal Dialog, Avatars, States).
                </p>
              </CardContent>
            </div>
            <CardFooter>
              <Link href="/design-system" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  View Complete UI Library
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </SectionContainer>
    </PublicLayout>
  );
}
