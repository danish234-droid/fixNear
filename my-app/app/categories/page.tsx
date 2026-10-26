import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { PublicLayout, PageContainer } from "@/components/layout";
import { Card, Badge } from "@/components/ui";
import { SERVICE_CATEGORIES } from "@/data/categories";
import { ArrowRight, Search } from "@/components/icons/LucideIcons";

export const metadata: Metadata = {
  title: "Explore Local Services | FixNear",
  description:
    "Browse local service professionals by category including electricians, plumbers, AC technicians, computer repair, appliance repair, and general maintenance.",
};

export default function CategoriesPage() {
  return (
    <PublicLayout>
      {/* ─────────────────────────────────────────────
          PAGE HEADER HERO
          ───────────────────────────────────────────── */}
      <section className="bg-fixnear-surface border-b border-fixnear-border py-12 sm:py-16">
        <PageContainer>
          <div className="max-w-3xl">
            {/* Breadcrumb / Category Tag */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center gap-2 text-xs text-fixnear-muted">
                <li>
                  <Link
                    href="/"
                    className="hover:text-fixnear-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded px-1 -mx-1"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="font-semibold text-fixnear-navy" aria-current="page">
                  Services
                </li>
              </ol>
            </nav>

            <Badge variant="info" size="md" className="mb-3">
              Services Directory
            </Badge>

            <h1 className="text-3xl sm:text-4xl font-bold text-fixnear-navy tracking-tight leading-tight">
              Explore Local Services
            </h1>

            <p className="mt-3 text-base sm:text-lg text-fixnear-muted leading-relaxed">
              Customers can browse professionals by service type to find qualified
              technicians in their area. Select a category below to see available
              specialists, coverage zones, and service offerings.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/professionals"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-fixnear-navy text-white hover:bg-fixnear-navy-hover transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring"
                aria-label="Browse all local professionals"
              >
                <Search className="w-4 h-4" />
                <span>Search All Professionals</span>
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ─────────────────────────────────────────────
          SERVICE CATEGORIES GRID
          ───────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-fixnear-bg">
        <PageContainer>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-fixnear-navy tracking-tight">
                All Service Categories
              </h2>
              <p className="text-sm text-fixnear-muted mt-1">
                Showing {SERVICE_CATEGORIES.length} service types currently supported on FixNear.
              </p>
            </div>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
            aria-label="Service categories list"
          >
            {SERVICE_CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              const targetUrl = `/professionals?category=${category.slug}`;

              return (
                <Card
                  key={category.id}
                  className="flex flex-col h-full bg-white hover:shadow-md hover:border-fixnear-blue/40 transition-all duration-200 border-fixnear-border rounded-xl group"
                  role="listitem"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Top Row: Icon and Badge */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-fixnear-bg border border-fixnear-border flex items-center justify-center shrink-0 ${category.accentColor} group-hover:bg-fixnear-blue-light/50 transition-colors`}
                        aria-hidden="true"
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <Badge variant="neutral" size="sm">
                        {category.badgeLabel}
                      </Badge>
                    </div>

                    {/* Category Title & Short Description */}
                    <h3 className="text-lg font-bold text-fixnear-navy group-hover:text-fixnear-blue transition-colors">
                      <Link
                        href={targetUrl}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded"
                      >
                        {category.name}
                      </Link>
                    </h3>

                    <p className="mt-2 text-sm text-fixnear-muted leading-relaxed">
                      {category.shortDescription}
                    </p>

                    {/* Popular Covered Tasks */}
                    <div className="mt-5 pt-4 border-t border-fixnear-border/60">
                      <p className="text-xs font-semibold uppercase tracking-wider text-fixnear-muted mb-2.5">
                        Common Services
                      </p>
                      <ul className="space-y-1.5" role="list">
                        {category.popularServices.map((serviceName) => (
                          <li
                            key={serviceName}
                            className="flex items-center gap-2 text-xs text-fixnear-text"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-fixnear-blue/70 shrink-0"
                              aria-hidden="true"
                            />
                            <span>{serviceName}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-6 py-4 bg-fixnear-bg/50 border-t border-fixnear-border/80 rounded-b-xl flex items-center justify-between">
                    <span className="text-xs text-fixnear-muted font-medium">
                      Find specialists
                    </span>
                    <Link
                      href={targetUrl}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-fixnear-blue group-hover:text-fixnear-blue-hover group-hover:translate-x-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded p-1 -m-1"
                      aria-label={`Browse ${category.name} professionals`}
                    >
                      <span>Browse {category.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Need help choosing banner */}
          <div className="mt-12 p-6 sm:p-8 bg-white rounded-xl border border-fixnear-border flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-bold text-fixnear-navy">
                Not sure which service category you need?
              </h3>
              <p className="text-xs sm:text-sm text-fixnear-muted max-w-xl">
                Browse our complete listing directory to filter providers by location,
                service keywords, or technician name.
              </p>
            </div>
            <Link
              href="/professionals"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-fixnear-blue text-white hover:bg-fixnear-blue-hover transition-colors whitespace-nowrap shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring shrink-0"
            >
              <span>View All Professionals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </PageContainer>
      </section>
    </PublicLayout>
  );
}
