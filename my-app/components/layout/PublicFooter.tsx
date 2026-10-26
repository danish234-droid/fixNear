"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export function PublicFooter() {
  const [currentYear, setCurrentYear] = useState<string>("2026");

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentYear(String(new Date().getFullYear()));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "Services Directory", href: "/categories" },
    { label: "Find Professionals", href: "/professionals" },
    { label: "How FixNear Works", href: "/#how-it-works" },
    { label: "Design System", href: "/design-system" },
  ];

  const serviceCategories = [
    { label: "Electricians", href: "/professionals?category=electricians" },
    { label: "Plumbers", href: "/professionals?category=plumbers" },
    { label: "AC Technicians", href: "/professionals?category=ac-technicians" },
    { label: "Computer Repair", href: "/professionals?category=computer-repair" },
    { label: "Appliance Repair", href: "/professionals?category=appliance-repair" },
    { label: "General Maintenance", href: "/professionals?category=general-maintenance" },
  ];

  const supportLinks = [
    { label: "Help & Support Center", href: "/#support" },
    { label: "Trust & Safety Standards", href: "/#safety" },
    { label: "Service Guarantee", href: "/#guarantee" },
    { label: "Terms of Service", href: "/#terms" },
    { label: "Privacy Policy", href: "/#privacy" },
  ];

  return (
    <footer className="bg-fixnear-surface border-t border-fixnear-border mt-auto w-full">
      <div className="fixnear-container py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column (spans 2 on large screens, full width on mobile) */}
          <div className="sm:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded-lg p-1 -m-1"
              aria-label="FixNear Homepage"
            >
              <div className="w-8 h-8 rounded-lg bg-fixnear-navy text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                F
              </div>
              <span className="font-bold text-xl text-fixnear-navy tracking-tight">
                FixNear
              </span>
            </Link>

            <p className="text-sm text-fixnear-muted max-w-sm leading-relaxed break-words">
              FixNear is a local services marketplace connecting customers with
              verified independent technicians for electrical, plumbing, AC, and
              computer repair services.
            </p>

            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAF5EE] text-fixnear-success text-xs font-medium border border-[#C6E7D0]">
                <span className="w-1.5 h-1.5 rounded-full bg-fixnear-success shrink-0" />
                Verified Local Trade Network
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <nav aria-label="Quick navigation"><div>
            <h3 className="text-xs font-semibold text-fixnear-navy uppercase tracking-wider mb-3">
              Explore FixNear
            </h3>
            <ul className="space-y-2.5 text-sm" role="list">
              {navigationLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-fixnear-muted hover:text-fixnear-blue transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-fixnear-ring rounded py-0.5 inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div></nav>

          {/* Service Disciplines */}
          <nav aria-label="Service categories"><div>
            <h3 className="text-xs font-semibold text-fixnear-navy uppercase tracking-wider mb-3">
              Service Categories
            </h3>
            <ul className="space-y-2.5 text-sm" role="list">
              {serviceCategories.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-fixnear-muted hover:text-fixnear-blue transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-fixnear-ring rounded py-0.5 inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div></nav>

          {/* Help & Policies */}
          <nav aria-label="Support and policies"><div>
            <h3 className="text-xs font-semibold text-fixnear-navy uppercase tracking-wider mb-3">
              Support &amp; Trust
            </h3>
            <ul className="space-y-2.5 text-sm" role="list">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-fixnear-muted hover:text-fixnear-blue transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-fixnear-ring rounded py-0.5 inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div></nav>
        </div>

        {/* Bottom Legal & Dynamic Copyright Bar */}
        <div className="fixnear-container mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-fixnear-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-fixnear-muted">
          <p>
            &copy; {currentYear} FixNear Marketplace. All rights reserved.
          </p>
          <p className="text-[11px] text-fixnear-muted/80">
            Platform layout designed for Customer, Technician, and Administrator portals.
          </p>
        </div>
      </div>
    </footer>
  );
}
