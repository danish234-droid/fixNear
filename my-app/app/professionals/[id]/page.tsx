import React, { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { PublicLayout, PageContainer } from "@/components/layout";
import { Card, Badge, Avatar } from "@/components/ui";
import {
  getProfessionalById,
  DEMO_PROFESSIONALS,
} from "@/data/professionals";
import { BookingRequestForm } from "@/components/booking/BookingRequestForm";
import {
  MapPin,
  ArrowLeft,
  Info,
  CheckCircle,
  Tag,
  Briefcase,
  Search,
} from "@/components/icons/LucideIcons";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return DEMO_PROFESSIONALS.map((pro) => ({
    id: pro.id,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const professional = getProfessionalById(id);

  if (!professional) {
    return {
      title: "Professional Not Found | FixNear",
      description: "The requested service professional profile could not be found.",
    };
  }

  return {
    title: `${professional.name} — ${professional.categoryName} | FixNear`,
    description: `View profile and request services with ${professional.name}, providing ${professional.categoryName} in ${professional.serviceArea}.`,
  };
}

export default async function ProfessionalProfilePage({ params }: PageProps) {
  const { id } = await params;
  const professional = getProfessionalById(id);

  // ─────────────────────────────────────────────
  // 1. NOT FOUND STATE
  // ─────────────────────────────────────────────
  if (!professional) {
    return (
      <PublicLayout>
        <section className="py-16 sm:py-24 bg-fixnear-bg">
          <PageContainer>
            <div className="max-w-xl mx-auto text-center bg-white p-8 sm:p-12 rounded-xl border border-fixnear-border shadow-xs">
              <div className="w-14 h-14 rounded-full bg-fixnear-bg border border-fixnear-border flex items-center justify-center text-fixnear-muted mx-auto mb-4">
                <Search className="w-6 h-6 text-fixnear-muted" />
              </div>

              <Badge variant="error" size="sm" className="mb-3">
                Not Found
              </Badge>

              <h1 className="text-2xl sm:text-3xl font-bold text-fixnear-navy tracking-tight">
                Professional Not Found
              </h1>

              <p className="mt-3 text-sm text-fixnear-muted leading-relaxed">
                We couldn&apos;t find a service provider matching ID &ldquo;
                <strong className="text-fixnear-text">{id}</strong>&rdquo;. The
                profile may have been removed or the link might be misspelled.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/professionals"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-fixnear-blue text-white hover:bg-fixnear-blue-hover transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to All Professionals</span>
                </Link>
                <Link
                  href="/categories"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-fixnear-bg text-fixnear-navy hover:bg-slate-200/70 transition-colors"
                >
                  <span>Browse Categories</span>
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>
      </PublicLayout>
    );
  }

  // ─────────────────────────────────────────────
  // 2. EXISTING PROFESSIONAL PROFILE VIEW
  // ─────────────────────────────────────────────
  return (
    <PublicLayout>
      {/* ─────────────────────────────────────────────
          BREADCRUMBS & TOP NAV BAR
          ───────────────────────────────────────────── */}
      <div className="bg-fixnear-surface border-b border-fixnear-border py-4">
        <PageContainer>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Breadcrumb Hierarchy */}
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-xs text-fixnear-muted flex-wrap">
                <li>
                  <Link
                    href="/"
                    className="hover:text-fixnear-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded px-1 -mx-1"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/categories"
                    className="hover:text-fixnear-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded px-1 -mx-1"
                  >
                    Services
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href={`/professionals?category=${professional.categorySlug}`}
                    className="hover:text-fixnear-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded px-1 -mx-1"
                  >
                    {professional.categoryName}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li
                  className="font-semibold text-fixnear-navy truncate max-w-[200px]"
                  aria-current="page"
                >
                  {professional.name}
                </li>
              </ol>
            </nav>

            {/* Back link */}
            <Link
              href="/professionals"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-fixnear-blue hover:text-fixnear-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded p-1 -m-1 shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Professionals</span>
            </Link>
          </div>
        </PageContainer>
      </div>

      {/* ─────────────────────────────────────────────
          DEMONSTRATION CONTENT NOTICE BANNER
          ───────────────────────────────────────────── */}
      <div className="bg-fixnear-amber-light border-b border-[#FAD998] py-3 px-4">
        <PageContainer>
          <div
            className="flex items-start gap-2.5 text-xs sm:text-sm text-[#945600]"
            role="note"
          >
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-semibold">Demonstration Profile:</strong> This
              profile is a sample demonstration record used to illustrate FixNear&apos;s
              profile layout and frontend booking interface. It does not represent a
              real business, verified credentials, or genuine customer reviews.
            </div>
          </div>
        </PageContainer>
      </div>

      {/* ─────────────────────────────────────────────
          MAIN PROFILE & BOOKING LAYOUT
          ───────────────────────────────────────────── */}
      <section className="py-8 sm:py-12 bg-fixnear-bg">
        <PageContainer>
          {/* Responsive Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ══════════════════════════════════════════
                LEFT COLUMN: PROFESSIONAL DETAILS (7 COLS)
                ══════════════════════════════════════════ */}
            <div className="lg:col-span-7 space-y-6">
              {/* Profile Header Card */}
              <Card className="bg-white border-fixnear-border rounded-xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  <Avatar
                    name={professional.name}
                    fallback={professional.initials}
                    size="xl"
                    className="border-2 border-fixnear-border shadow-xs"
                  />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl sm:text-3xl font-bold text-fixnear-navy tracking-tight">
                        {professional.name}
                      </h1>
                      <Badge variant="amber" size="sm" className="text-[10px]">
                        Demo Profile
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <Link
                        href={`/professionals?category=${professional.categorySlug}`}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded"
                      >
                        <Badge variant="info" size="md">
                          {professional.categoryName}
                        </Badge>
                      </Link>

                      <span className="flex items-center gap-1 text-fixnear-muted text-xs sm:text-sm">
                        <MapPin className="w-4 h-4 text-fixnear-blue shrink-0" />
                        <span>{professional.serviceArea}</span>
                      </span>
                    </div>

                    {/* Pricing Information (Identified as Demo Data) */}
                    <div className="pt-2 flex items-baseline gap-2">
                      <span className="text-xs text-fixnear-muted uppercase tracking-wider font-semibold">
                        Service Rate:
                      </span>
                      <span className="text-base font-bold text-fixnear-navy">
                        {professional.demoRate}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* About the Technician Card */}
              <Card className="bg-white border-fixnear-border rounded-xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-fixnear-border/60">
                  <Briefcase className="w-5 h-5 text-fixnear-blue" />
                  <h2 className="text-lg font-bold text-fixnear-navy">
                    About This Technician
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-fixnear-muted leading-relaxed">
                  {professional.shortDescription}
                </p>
                <div className="p-4 bg-fixnear-bg rounded-lg border border-fixnear-border/60 text-xs text-fixnear-muted space-y-1">
                  <p className="font-semibold text-fixnear-navy">
                    Coverage Area Details
                  </p>
                  <p>
                    Primary service zone covers{" "}
                    <strong>{professional.serviceArea}</strong>. Travel outside
                    this zone may incur additional travel fees depending on distance.
                  </p>
                </div>
              </Card>

              {/* Services Offered Card */}
              <Card className="bg-white border-fixnear-border rounded-xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-fixnear-border/60">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-fixnear-blue" />
                    <h2 className="text-lg font-bold text-fixnear-navy">
                      Services Offered
                    </h2>
                  </div>
                  <span className="text-xs text-fixnear-muted">
                    {professional.servicesOffered.length} services available
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-fixnear-muted">
                  The following trade services are supported by this technician.
                  You can select any of these services in the booking request form.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {professional.servicesOffered.map((serviceName) => (
                    <div
                      key={serviceName}
                      className="p-3.5 rounded-lg bg-fixnear-bg border border-fixnear-border flex items-center gap-3"
                    >
                      <CheckCircle className="w-4 h-4 text-fixnear-success shrink-0" />
                      <span className="text-sm font-semibold text-fixnear-navy">
                        {serviceName}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* FixNear Standards Notice */}
              <Card className="bg-white border-fixnear-border rounded-xl p-6 space-y-3">
                <h3 className="text-sm font-bold text-fixnear-navy uppercase tracking-wider">
                  How Booking Requests Work
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-fixnear-muted" role="list">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-fixnear-blue mt-2 shrink-0" />
                    <span>
                      Submit your preferred date, time window, and problem details.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-fixnear-blue mt-2 shrink-0" />
                    <span>
                      The technician reviews availability before confirming appointments.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-fixnear-blue mt-2 shrink-0" />
                    <span>
                      Payment is settled after service completion. No upfront card charges.
                    </span>
                  </li>
                </ul>
              </Card>
            </div>

            {/* ══════════════════════════════════════════
                RIGHT COLUMN: BOOKING REQUEST FORM (5 COLS)
                ══════════════════════════════════════════ */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <Suspense
                fallback={
                  <div className="bg-white rounded-xl border border-fixnear-border p-8 text-center">
                    <div className="inline-block w-6 h-6 border-2 border-fixnear-blue border-t-transparent rounded-full animate-spin mb-2" />
                    <p className="text-xs text-fixnear-muted">
                      Loading booking form...
                    </p>
                  </div>
                }
              >
                <BookingRequestForm professional={professional} />
              </Suspense>
            </div>
          </div>
        </PageContainer>
      </section>
    </PublicLayout>
  );
}
