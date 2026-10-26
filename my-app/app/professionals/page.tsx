"use client";

import React, { useState, useMemo, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PublicLayout, PageContainer } from "@/components/layout";
import {
  Card,
  Button,
  Avatar,
  Badge,
  EmptyState,
} from "@/components/ui";
import {
  SERVICE_CATEGORIES,
  isValidCategorySlug,
} from "@/data/categories";
import {
  DEMO_PROFESSIONALS,
} from "@/data/professionals";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  RotateCcw,
  Info,
  X,
} from "@/components/icons/LucideIcons";

type SortOption = "name-asc" | "name-desc" | "newest";

function ProfessionalsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL is the single source of truth for category selection
  const categoryParam = searchParams.get("category");
  const isCategoryValid = categoryParam ? isValidCategorySlug(categoryParam) : false;
  const selectedCategory: string = isCategoryValid && categoryParam ? categoryParam : "all";

  // Track user-dismissed notice for unknown category parameter
  const [dismissedUnknownCategory, setDismissedUnknownCategory] = useState<string | null>(null);
  const unknownCategoryNotice =
    categoryParam && !isCategoryValid && dismissedUnknownCategory !== categoryParam
      ? categoryParam
      : null;

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");


  // Update URL category parameter safely
  const updateCategoryInUrl = useCallback(
    (newCategory: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newCategory === "all") {
        params.delete("category");
      } else {
        params.set("category", newCategory);
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Clear all filters action
  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setLocationQuery("");
    setSortBy("name-asc");
    setDismissedUnknownCategory(null);
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  // Client-side filtering & sorting against available demo dataset
  const filteredProfessionals = useMemo(() => {
    return DEMO_PROFESSIONALS.filter((pro) => {
      // Category filter
      if (selectedCategory !== "all" && pro.categorySlug !== selectedCategory) {
        return false;
      }

      // Name or Service search
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesName = pro.name.toLowerCase().includes(query);
        const matchesCategory = pro.categoryName.toLowerCase().includes(query);
        const matchesDescription = pro.shortDescription.toLowerCase().includes(query);
        const matchesService = pro.servicesOffered.some((service) =>
          service.toLowerCase().includes(query)
        );

        if (!matchesName && !matchesCategory && !matchesDescription && !matchesService) {
          return false;
        }
      }

      // Location / Service Area filter
      if (locationQuery.trim()) {
        const loc = locationQuery.trim().toLowerCase();
        if (!pro.serviceArea.toLowerCase().includes(loc)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
  }, [selectedCategory, searchQuery, locationQuery, sortBy]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    Boolean(locationQuery.trim()) ||
    selectedCategory !== "all" ||
    sortBy !== "name-asc";

  const categoryOptions = useMemo(() => {
    return [
      { label: "All Categories", value: "all" },
      ...SERVICE_CATEGORIES.map((cat) => ({
        label: cat.name,
        value: cat.slug,
      })),
    ];
  }, []);

  const sortOptions = useMemo(() => {
    return [
      { label: "Name (A – Z)", value: "name-asc" },
      { label: "Name (Z – A)", value: "name-desc" },
      { label: "Newest First", value: "newest" },
    ];
  }, []);

  return (
    <PublicLayout>
      {/* ─────────────────────────────────────────────
          PAGE HEADER
          ───────────────────────────────────────────── */}
      <section className="bg-fixnear-surface border-b border-fixnear-border py-10 sm:py-14">
        <PageContainer>
          <div className="max-w-3xl">
            {/* Breadcrumbs */}
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
                <li>
                  <Link
                    href="/categories"
                    className="hover:text-fixnear-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded px-1 -mx-1"
                  >
                    Services
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="font-semibold text-fixnear-navy" aria-current="page">
                  Professionals
                </li>
              </ol>
            </nav>

            <Badge variant="info" size="md" className="mb-3">
              Trade Network Directory
            </Badge>

            <h1 className="text-3xl sm:text-4xl font-bold text-fixnear-navy tracking-tight leading-tight">
              Local Service Professionals
            </h1>

            <p className="mt-3 text-base sm:text-lg text-fixnear-muted leading-relaxed">
              Find qualified technicians for home and office repairs. Filter by
              service category, search by specific repair needs, or narrow down by
              service area.
            </p>
          </div>
        </PageContainer>
      </section>

      {/* ─────────────────────────────────────────────
          DEMO DATASET NOTICE BANNER
          ───────────────────────────────────────────── */}
      <div className="bg-fixnear-amber-light border-b border-[#FAD998] py-3.5 px-4">
        <PageContainer>
          <div className="flex items-start gap-3 text-xs sm:text-sm text-[#945600]" role="note">
            <Info className="w-4 h-4 mt-0.5 shrink-0 text-[#945600]" />
            <div className="leading-relaxed">
              <strong className="font-semibold">Demonstration Dataset:</strong> FixNear
              is currently showcasing frontend UI features. The listings below are sample
              demonstration records used to verify search, filtering, and responsive cards.
              They do not represent real businesses, verified reviews, or live booking availability.
            </div>
          </div>
        </PageContainer>
      </div>

      {/* ─────────────────────────────────────────────
          UNKNOWN CATEGORY WARNING BANNER (if invalid URL)
          ───────────────────────────────────────────── */}
      {unknownCategoryNotice && (
        <div className="bg-fixnear-blue-light border-b border-[#CEE2F2] py-3 px-4">
          <PageContainer>
            <div className="flex items-center justify-between gap-3 text-xs sm:text-sm text-fixnear-blue" role="status">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>
                  The requested category &ldquo;<strong>{unknownCategoryNotice}</strong>&rdquo; was not found.
                  Showing all service categories instead.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDismissedUnknownCategory(unknownCategoryNotice)}
                className="text-fixnear-blue hover:text-fixnear-navy text-xs font-semibold underline cursor-pointer"
                aria-label="Dismiss unknown category notice"
              >
                Dismiss
              </button>
            </div>
          </PageContainer>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          MAIN CONTENT & FILTERS SECTION
          ───────────────────────────────────────────── */}
      <section className="py-8 sm:py-12 bg-fixnear-bg">
        <PageContainer>
          {/* Filter Controls Card */}
          <div className="bg-white rounded-xl border border-fixnear-border shadow-xs p-5 sm:p-6 mb-8">
            <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-fixnear-border/60">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-fixnear-blue" />
                <h2 className="text-sm font-bold text-fixnear-navy uppercase tracking-wider">
                  Filter Professionals
                </h2>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-fixnear-blue hover:text-fixnear-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded px-1 -mx-1 transition-colors cursor-pointer"
                  aria-label="Reset all search filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear all filters</span>
                </button>
              )}
            </div>

            {/* Grid of Filter Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search Input */}
              <div>
                <label
                  htmlFor="filter-search"
                  className="block text-xs font-medium text-fixnear-text mb-1.5"
                >
                  Search Name or Service
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-fixnear-muted pointer-events-none">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    id="filter-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Alex, wiring, leak"
                    className="w-full h-10 pl-9 pr-8 text-sm text-fixnear-text bg-white rounded-lg border border-fixnear-border focus:outline-none focus:ring-2 focus:ring-fixnear-ring focus:border-fixnear-ring transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 text-fixnear-muted hover:text-fixnear-navy p-1"
                      aria-label="Clear search input"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Location Input */}
              <div>
                <label
                  htmlFor="filter-location"
                  className="block text-xs font-medium text-fixnear-text mb-1.5"
                >
                  Location or Area
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-fixnear-muted pointer-events-none">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    id="filter-location"
                    type="search"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="e.g. Downtown, Midtown"
                    className="w-full h-10 pl-9 pr-8 text-sm text-fixnear-text bg-white rounded-lg border border-fixnear-border focus:outline-none focus:ring-2 focus:ring-fixnear-ring focus:border-fixnear-ring transition-colors"
                  />
                  {locationQuery && (
                    <button
                      type="button"
                      onClick={() => setLocationQuery("")}
                      className="absolute right-2.5 text-fixnear-muted hover:text-fixnear-navy p-1"
                      aria-label="Clear location input"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Select */}
              <div>
                <label
                  htmlFor="filter-category"
                  className="block text-xs font-medium text-fixnear-text mb-1.5"
                >
                  Service Category
                </label>
                <select
                  id="filter-category"
                  value={selectedCategory}
                  onChange={(e) => updateCategoryInUrl(e.target.value)}
                  className="w-full h-10 px-3 text-sm text-fixnear-text bg-white rounded-lg border border-fixnear-border focus:outline-none focus:ring-2 focus:ring-fixnear-ring focus:border-fixnear-ring transition-colors cursor-pointer"
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Select */}
              <div>
                <label
                  htmlFor="filter-sort"
                  className="block text-xs font-medium text-fixnear-text mb-1.5"
                >
                  Sort By
                </label>
                <select
                  id="filter-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full h-10 px-3 text-sm text-fixnear-text bg-white rounded-lg border border-fixnear-border focus:outline-none focus:ring-2 focus:ring-fixnear-ring focus:border-fixnear-ring transition-colors cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Category Chips for rapid 1-click filtering */}
            <div className="mt-4 pt-3.5 border-t border-fixnear-border/60">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-fixnear-muted mb-2">
                Quick Category Filter:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2" role="group" aria-label="Category filter chips">
                <button
                  type="button"
                  onClick={() => updateCategoryInUrl("all")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring ${
                    selectedCategory === "all"
                      ? "bg-fixnear-navy text-white shadow-xs"
                      : "bg-fixnear-bg text-fixnear-muted hover:bg-slate-200/70 hover:text-fixnear-navy"
                  }`}
                  aria-pressed={selectedCategory === "all"}
                >
                  All ({DEMO_PROFESSIONALS.length})
                </button>
                {SERVICE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.slug;
                  const catCount = DEMO_PROFESSIONALS.filter(
                    (p) => p.categorySlug === cat.slug
                  ).length;

                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => updateCategoryInUrl(cat.slug)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring ${
                        isSelected
                          ? "bg-fixnear-blue text-white shadow-xs"
                          : "bg-fixnear-bg text-fixnear-muted hover:bg-slate-200/70 hover:text-fixnear-navy"
                      }`}
                      aria-pressed={isSelected}
                    >
                      {cat.name} ({catCount})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-fixnear-navy">
                Showing {filteredProfessionals.length} of {DEMO_PROFESSIONALS.length} demo{" "}
                {filteredProfessionals.length === 1 ? "professional" : "professionals"}
              </span>
              {hasActiveFilters && (
                <span className="text-xs text-fixnear-muted">
                  (filtered results)
                </span>
              )}
            </div>

            {/* Active filter tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2">
                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EEF6FC] text-fixnear-blue border border-[#CEE2F2]">
                    Category: {categoryOptions.find((c) => c.value === selectedCategory)?.label}
                    <button
                      type="button"
                      onClick={() => updateCategoryInUrl("all")}
                      className="hover:text-fixnear-navy ml-0.5 cursor-pointer"
                      aria-label="Remove category filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-fixnear-bg text-fixnear-navy border border-fixnear-border">
                    Search: &ldquo;{searchQuery}&rdquo;
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="hover:text-fixnear-navy ml-0.5 cursor-pointer"
                      aria-label="Remove search filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {locationQuery.trim() && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-fixnear-bg text-fixnear-navy border border-fixnear-border">
                    Area: &ldquo;{locationQuery}&rdquo;
                    <button
                      type="button"
                      onClick={() => setLocationQuery("")}
                      className="hover:text-fixnear-navy ml-0.5 cursor-pointer"
                      aria-label="Remove location filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs text-fixnear-muted hover:text-fixnear-navy underline cursor-pointer ml-1"
                >
                  Reset all
                </button>
              </div>
            )}
          </div>

          {/* Results Area */}
          {filteredProfessionals.length > 0 ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              role="list"
              aria-label="Local professionals listings"
            >
              {filteredProfessionals.map((pro) => (
                <Card
                  key={pro.id}
                  className="flex flex-col bg-white border-fixnear-border rounded-xl hover:shadow-md hover:border-fixnear-blue/40 transition-all duration-200"
                  role="listitem"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Top Row: Avatar & Name */}
                    <div className="flex items-start gap-3.5 mb-4">
                      <Avatar
                        name={pro.name}
                        fallback={pro.initials}
                        size="lg"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-base font-bold text-fixnear-navy truncate hover:text-fixnear-blue transition-colors">
                            <Link href={`/professionals/${pro.id}`}>
                              {pro.name}
                            </Link>
                          </h3>
                          <Badge variant="amber" size="sm" className="shrink-0 text-[10px]">
                            Demo
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="info" size="sm">
                            {pro.categoryName}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Service Area */}
                    <div className="flex items-center gap-2 text-xs text-fixnear-muted mb-3">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-fixnear-blue" />
                      <span className="font-medium text-fixnear-text truncate">
                        {pro.serviceArea}
                      </span>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs sm:text-sm text-fixnear-muted leading-relaxed line-clamp-3 mb-4">
                      {pro.shortDescription}
                    </p>

                    {/* Services Offered Tags */}
                    <div className="mt-auto pt-3 border-t border-fixnear-border/60">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-fixnear-muted mb-2">
                        Common Tasks
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {pro.servicesOffered.map((service) => (
                          <span
                            key={service}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-fixnear-bg text-fixnear-navy border border-fixnear-border/80"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Demo Rate and Non-misleading Profile Action */}
                  <div className="px-6 py-4 bg-fixnear-bg/40 border-t border-fixnear-border rounded-b-xl flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="block text-[10px] text-fixnear-muted font-medium uppercase tracking-wider">
                        Estimate
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-fixnear-navy truncate block">
                        {pro.demoRate}
                      </span>
                    </div>

                    {/* View Profile Link to Dynamic Profile Route */}
                    <Link
                      href={`/professionals/${pro.id}`}
                      className="inline-flex items-center justify-center h-8 px-3.5 rounded-md text-xs font-semibold bg-white text-fixnear-navy hover:bg-fixnear-bg border border-fixnear-border shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring shrink-0"
                      aria-label={`View profile of ${pro.name}`}
                    >
                      View Profile
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* Helpful Empty State */
            <EmptyState
              title="No professionals match your filters"
              description="We couldn't find any service professionals matching your current search terms, category selection, or location filter."
              icon={<Search className="w-6 h-6 text-fixnear-muted" />}
              action={
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleClearFilters}
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                  >
                    Clear All Filters
                  </Button>
                  <Link
                    href="/categories"
                    className="text-xs font-semibold text-fixnear-blue hover:text-fixnear-navy underline py-2"
                  >
                    Browse Service Categories Instead
                  </Link>
                </div>
              }
            />
          )}
        </PageContainer>
      </section>


    </PublicLayout>
  );
}

function ProfessionalsLoading() {
  return (
    <PublicLayout>
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-fixnear-blue border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-fixnear-muted font-medium">
          Loading professional listings...
        </p>
      </div>
    </PublicLayout>
  );
}

export default function ProfessionalsPage() {
  return (
    <Suspense fallback={<ProfessionalsLoading />}>
      <ProfessionalsContent />
    </Suspense>
  );
}
