"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import {
  PublicLayout,
  PageContainer,
} from "@/components/layout";
import {
  Button,
  Card,
  Badge,
  Avatar,
} from "@/components/ui";

/* ─────────────────────────────────────────────
   Inline SVG Icons (no external icon library)
   ───────────────────────────────────────────── */

function SearchIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function MapPinIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function ZapIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

function DropletIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c0 0-7.5 7.125-7.5 12a7.5 7.5 0 0015 0c0-4.875-7.5-12-7.5-12z" />
    </svg>
  );
}

function ThermometerIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75V6.75m0 0a2.25 2.25 0 10-2.25 2.25H12V6.75zM12 9.75a2.25 2.25 0 012.25 2.25V15M12 9.75V15m0 0a3.75 3.75 0 11-3.75 3.75M12 15a3.75 3.75 0 103.75 3.75" />
    </svg>
  );
}

function MonitorIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
    </svg>
  );
}

function WrenchIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.71 5.71a2.121 2.121 0 01-3-3l5.71-5.71m0 0L15.17 4.42a2.121 2.121 0 013 3l-6.75 6.75zM20.49 3.51a3.75 3.75 0 010 5.3l-.67.67" />
    </svg>
  );
}

function HomeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function CheckCircleIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function UsersIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function CalendarIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function ShieldCheckIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function ClipboardListIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  );
}

function StarIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Data
   ───────────────────────────────────────────── */

const SERVICE_CATEGORIES = [
  { label: "Electricians", description: "Wiring, outlets, panel upgrades, and lighting", icon: ZapIcon, color: "text-fixnear-amber" },
  { label: "Plumbers", description: "Leak repairs, pipe fitting, and drain cleaning", icon: DropletIcon, color: "text-fixnear-blue" },
  { label: "AC Technicians", description: "Installation, maintenance, and AC repair", icon: ThermometerIcon, color: "text-fixnear-blue" },
  { label: "Computer Repair", description: "Laptop, desktop, and network troubleshooting", icon: MonitorIcon, color: "text-fixnear-navy" },
  { label: "Appliance Repair", description: "Washer, dryer, fridge, and oven servicing", icon: WrenchIcon, color: "text-fixnear-amber" },
  { label: "Home Maintenance", description: "General repairs, painting, and handyman tasks", icon: HomeIcon, color: "text-fixnear-navy" },
];

const DEMO_PROFESSIONALS = [
  { name: "Alex Rivera", initials: "AR", category: "Electrician", area: "Downtown & Midtown", rating: 4.8 },
  { name: "Priya Sharma", initials: "PS", category: "Plumber", area: "Northside & Suburbs", rating: 4.9 },
  { name: "James Chen", initials: "JC", category: "AC Technician", area: "Central District", rating: 4.7 },
  { name: "Maria Lopez", initials: "ML", category: "Computer Repair", area: "Eastside & Campus Area", rating: 4.6 },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "Describe Your Need",
    description: "Tell us what service you need and your location. Browse categories or search directly.",
    icon: SearchIcon,
  },
  {
    step: 2,
    title: "Choose a Professional",
    description: "Review profiles, service areas, and availability to find the right match for your job.",
    icon: UsersIcon,
  },
  {
    step: 3,
    title: "Request a Booking",
    description: "Submit a booking request with your preferred time. The professional confirms availability.",
    icon: CalendarIcon,
  },
];

const TRUST_BENEFITS = [
  {
    title: "Browse Local Professionals",
    description: "Discover service providers in your area with clear profiles and service information.",
    icon: SearchIcon,
  },
  {
    title: "Compare Before You Choose",
    description: "View service descriptions, areas covered, and availability to make informed decisions.",
    icon: ClipboardListIcon,
  },
  {
    title: "Manage Bookings Easily",
    description: "Request, track, and manage your service bookings from a simple customer dashboard.",
    icon: CalendarIcon,
  },
  {
    title: "A Straightforward Experience",
    description: "Clear communication between customers and professionals, from request to completion.",
    icon: ShieldCheckIcon,
  },
];

/* ─────────────────────────────────────────────
   Homepage Component
   ───────────────────────────────────────────── */

export default function Home() {
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSearchSubmitted(true);
    },
    []
  );

  const resetSearch = useCallback(() => {
    setSearchSubmitted(false);
    setService("");
    setLocation("");
  }, []);

  return (
    <PublicLayout>
      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-[#173B57] via-[#1C4466] to-[#2878B5] text-white overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/[0.03]" />
          <div className="absolute -bottom-32 -left-16 w-[30rem] h-[30rem] rounded-full bg-fixnear-amber/[0.04]" />
        </div>

        <PageContainer>
          <div className="relative py-16 sm:py-20 lg:py-28 max-w-3xl">
            <Badge
              variant="amber"
              size="md"
              className="mb-5"
              icon={
                <span className="w-1.5 h-1.5 rounded-full bg-fixnear-amber" aria-hidden="true" />
              }
            >
              Local Services Marketplace
            </Badge>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-white">
              Find Trusted Local{" "}
              <span className="text-fixnear-amber">Professionals</span>{" "}
              Near You
            </h1>

            <p className="mt-4 sm:mt-5 text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl">
              FixNear helps you discover and book skilled electricians, plumbers,
              AC technicians, and more for your everyday repair and home-service
              needs.
            </p>

            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="mt-8 sm:mt-10"
              role="search"
              aria-label="Search for local services"
            >
              <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-2.5 shadow-lg">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-1.5">
                  {/* Service Input */}
                  <div className="relative flex-1 min-w-0">
                    <label htmlFor="hero-service" className="sr-only">
                      Service or problem
                    </label>
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fixnear-muted pointer-events-none">
                      <SearchIcon className="w-4.5 h-4.5" />
                    </div>
                    <input
                      id="hero-service"
                      type="text"
                      value={service}
                      onChange={(e) => {
                        setService(e.target.value);
                        if (searchSubmitted) setSearchSubmitted(false);
                      }}
                      placeholder="What do you need? (e.g. fix a leaky faucet)"
                      className="w-full h-11 sm:h-12 pl-11 pr-3.5 text-sm sm:text-base text-fixnear-text bg-fixnear-bg rounded-lg border border-fixnear-border/60 placeholder:text-fixnear-muted/60 focus:outline-none focus:ring-2 focus:ring-fixnear-ring/30 focus:border-fixnear-ring transition-colors"
                    />
                  </div>

                  {/* Location Input */}
                  <div className="relative flex-1 min-w-0 sm:max-w-[14rem] lg:max-w-[16rem]">
                    <label htmlFor="hero-location" className="sr-only">
                      Location
                    </label>
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fixnear-muted pointer-events-none">
                      <MapPinIcon className="w-4.5 h-4.5" />
                    </div>
                    <input
                      id="hero-location"
                      type="text"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        if (searchSubmitted) setSearchSubmitted(false);
                      }}
                      placeholder="Your location"
                      className="w-full h-11 sm:h-12 pl-11 pr-3.5 text-sm sm:text-base text-fixnear-text bg-fixnear-bg rounded-lg border border-fixnear-border/60 placeholder:text-fixnear-muted/60 focus:outline-none focus:ring-2 focus:ring-fixnear-ring/30 focus:border-fixnear-ring transition-colors"
                    />
                  </div>

                  {/* Search Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="sm:px-6 whitespace-nowrap shrink-0"
                    rightIcon={<ArrowRightIcon className="w-4 h-4" />}
                  >
                    Search
                  </Button>
                </div>
              </div>

              {/* Search result message */}
              {searchSubmitted && (
                <div
                  className="mt-4 bg-white/10 backdrop-blur-xs border border-white/20 rounded-lg px-4 py-3 text-sm text-white/90 flex items-start gap-3"
                  role="status"
                  aria-live="polite"
                >
                  <CheckCircleIcon className="w-5 h-5 text-fixnear-amber shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Search results are coming soon</p>
                    <p className="text-white/70 mt-0.5">
                      The search results page is under development.
                      {service && <> You searched for &ldquo;{service}&rdquo;</>}
                      {location && <> in &ldquo;{location}&rdquo;</>}
                      . Browse our service categories below to explore available services.
                    </p>
                    <button
                      type="button"
                      onClick={resetSearch}
                      className="mt-2 text-fixnear-amber hover:text-white text-xs font-medium underline underline-offset-2 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-amber rounded"
                    >
                      Clear search
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Quick stats row */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <ZapIcon className="w-4 h-4 text-fixnear-amber" />
                6 service categories
              </span>
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="w-4 h-4 text-fixnear-amber" />
                Local professionals
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheckIcon className="w-4 h-4 text-fixnear-amber" />
                Profile-based discovery
              </span>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ═══════════════════════════════════════════
          POPULAR SERVICE CATEGORIES
          ═══════════════════════════════════════════ */}
      <section id="services" className="py-14 sm:py-20 bg-fixnear-bg">
        <PageContainer>
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <Badge variant="info" size="md" className="mb-3">
              Service Categories
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-fixnear-navy tracking-tight">
              What Do You Need Help With?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-fixnear-muted leading-relaxed">
              Browse popular service categories to find the right professional
              for your job.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {SERVICE_CATEGORIES.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <Card
                  key={cat.label}
                  interactive
                  className="group flex items-start gap-4 p-5 sm:p-6"
                  role="article"
                >
                  <div
                    className={`w-11 h-11 rounded-lg bg-fixnear-bg border border-fixnear-border/60 flex items-center justify-center shrink-0 ${cat.color} group-hover:border-fixnear-blue/30 transition-colors`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-fixnear-navy leading-snug group-hover:text-fixnear-blue transition-colors">
                      {cat.label}
                    </h3>
                    <p className="mt-1 text-sm text-fixnear-muted leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURED PROFESSIONALS (Demo Content)
          ═══════════════════════════════════════════ */}
      <section id="professionals" className="py-14 sm:py-20 bg-fixnear-surface border-y border-fixnear-border">
        <PageContainer>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10 sm:mb-12">
            <div>
              <Badge variant="amber" size="md" className="mb-3">
                Preview
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-fixnear-navy tracking-tight">
                Featured Professionals
              </h2>
              <p className="mt-2 text-sm sm:text-base text-fixnear-muted leading-relaxed max-w-xl">
                A preview of how professional profiles will appear on FixNear.
                These are demonstration profiles for design purposes.
              </p>
            </div>
          </div>

          {/* Demo Notice */}
          <div
            className="mb-6 bg-fixnear-amber-light border border-[#FAD998] rounded-lg px-4 py-3 text-sm text-[#945600] flex items-start gap-2.5"
            role="note"
          >
            <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
            <span>
              <strong>Demonstration content.</strong> The profiles below are
              sample data used for layout development. They do not represent
              real service providers.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {DEMO_PROFESSIONALS.map((pro) => (
              <Card key={pro.name} className="flex flex-col">
                <div className="p-5 sm:p-6 flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar
                      name={pro.name}
                      fallback={pro.initials}
                      size="lg"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-fixnear-navy truncate">
                        {pro.name}
                      </h3>
                      <p className="text-xs text-fixnear-muted mt-0.5">
                        {pro.category}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-2 text-fixnear-muted">
                      <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{pro.area}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <StarIcon className="w-4 h-4 text-fixnear-amber" />
                      <span className="text-sm font-medium text-fixnear-navy">
                        {pro.rating}
                      </span>
                      <span className="text-xs text-fixnear-muted">
                        (sample)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      // Placeholder — profiles are not yet implemented
                    }}
                    aria-label={`View demo profile of ${pro.name}`}
                  >
                    View Profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════ */}
      <section id="how-it-works" className="py-14 sm:py-20 bg-fixnear-bg">
        <PageContainer>
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <Badge variant="info" size="md" className="mb-3">
              Simple Process
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-fixnear-navy tracking-tight">
              How FixNear Works
            </h2>
            <p className="mt-3 text-sm sm:text-base text-fixnear-muted leading-relaxed">
              Finding and booking a local professional is designed to be
              straightforward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {HOW_IT_WORKS_STEPS.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={item.step} className="text-center relative">
                  {/* Connector line on desktop between steps */}
                  {idx < HOW_IT_WORKS_STEPS.length - 1 && (
                    <div
                      className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px bg-fixnear-border"
                      aria-hidden="true"
                    />
                  )}

                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-fixnear-surface border border-fixnear-border shadow-xs text-fixnear-blue mb-4 relative">
                    <IconComponent className="w-7 h-7" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-fixnear-navy text-white text-xs font-bold flex items-center justify-center shadow-xs">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-fixnear-navy mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-fixnear-muted leading-relaxed max-w-xs mx-auto">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* ═══════════════════════════════════════════
          TRUST & VALUE SECTION
          ═══════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-fixnear-surface border-y border-fixnear-border">
        <PageContainer>
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <Badge variant="success" size="md" className="mb-3">
              Why FixNear
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-fixnear-navy tracking-tight">
              A Better Way to Find Local Services
            </h2>
            <p className="mt-3 text-sm sm:text-base text-fixnear-muted leading-relaxed">
              FixNear is designed to make finding, comparing, and booking
              local service professionals simple and transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
            {TRUST_BENEFITS.map((benefit) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="flex items-start gap-4 p-5 sm:p-6 bg-fixnear-bg rounded-xl border border-fixnear-border/60"
                >
                  <div className="w-10 h-10 rounded-lg bg-fixnear-surface border border-fixnear-border flex items-center justify-center shrink-0 text-fixnear-blue">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-fixnear-navy leading-snug">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-sm text-fixnear-muted leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* ═══════════════════════════════════════════
          FINAL CALL TO ACTION
          ═══════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-gradient-to-br from-[#173B57] via-[#1C4466] to-[#2878B5] text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-fixnear-amber/[0.05]" />
        </div>

        <PageContainer>
          <div className="relative text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Ready to Find a Local Professional?
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-white/75 leading-relaxed">
              Browse service categories or search for the help you need.
              FixNear connects you with professionals in your area.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="#services">
                <Button
                  variant="amber"
                  size="lg"
                  rightIcon={<ArrowRightIcon className="w-4 h-4" />}
                >
                  Browse Services
                </Button>
              </Link>
              <a href="#top">
                <Button variant="outline" size="lg" className="bg-white/10 border-white/25 text-white hover:bg-white/20 hover:text-white">
                  Back to Search
                </Button>
              </a>
            </div>
          </div>
        </PageContainer>
      </section>
    </PublicLayout>
  );
}
