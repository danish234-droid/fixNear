"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui";
import {
  DashboardRole,
  DashboardNavItem,
  roleConfig,
} from "./dashboardNavConfig";

export interface DashboardShellProps {
  role?: DashboardRole;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  activeHref?: string;
  onNavItemClick?: (item: DashboardNavItem) => void;
  customNavItems?: DashboardNavItem[];
  children: React.ReactNode;
}

function NavIcon({ name }: { name: DashboardNavItem["iconName"] }) {
  switch (name) {
    case "overview":
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    case "bookings":
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case "schedule":
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "services":
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case "profile":
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    case "reviews":
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    case "customers":
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case "technicians":
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "reports":
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case "settings":
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      );
    default:
      return null;
  }
}

export function DashboardShell({
  role = "customer",
  title,
  subtitle,
  actions,
  activeHref = "#overview",
  onNavItemClick,
  customNavItems,
  children,
}: DashboardShellProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const config = roleConfig[role];
  const items = customNavItems || config.navItems;

  const resolvedTitle = title || config.title;
  const resolvedSubtitle = subtitle || config.subtitle;

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileDrawerOpen]);

  // Lock scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [mobileDrawerOpen]);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-fixnear-border">
      {/* Brand & Portal Header */}
      <div className="p-4 sm:p-5 border-b border-fixnear-border flex items-center justify-between gap-2">
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded min-w-0"
          aria-label="FixNear Homepage"
        >
          <div className="w-8 h-8 rounded-lg bg-fixnear-navy text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
            F
          </div>
          <div className="min-w-0">
            <span className="font-bold text-lg text-fixnear-navy tracking-tight block leading-tight truncate">
              FixNear
            </span>
            <span className="text-[10px] text-fixnear-muted font-medium uppercase tracking-wider block">
              Portal Foundation
            </span>
          </div>
        </Link>
        <Badge variant={config.badgeVariant} size="sm" className="shrink-0">
          {config.badgeLabel}
        </Badge>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto" aria-label="Portal Navigation">
        {items.map((item) => {
          const isActive = activeHref === item.href;

          return (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                if (onNavItemClick) {
                  e.preventDefault();
                  onNavItemClick(item);
                }
                setMobileDrawerOpen(false);
              }}
              className={`flex items-center justify-between px-3.5 py-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring ${
                isActive
                  ? "bg-[#EEF6FC] text-fixnear-blue font-semibold"
                  : "text-fixnear-text hover:bg-fixnear-bg hover:text-fixnear-navy active:bg-slate-100"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="flex items-center gap-3 min-w-0">
                <NavIcon name={item.iconName} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-fixnear-blue/10 text-fixnear-blue font-semibold shrink-0 ml-2">
                  {item.badge}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-fixnear-border bg-fixnear-bg/60">
        <div className="text-[11px] text-fixnear-muted leading-relaxed">
          <p className="font-semibold text-fixnear-navy">Dashboard Foundation</p>
          <p className="mt-0.5">
            Configurable shell layout for future authenticated modules.
          </p>
        </div>
        <div className="mt-3 pt-3 border-t border-fixnear-border/60">
          <Link
            href="/"
            className="text-xs text-fixnear-blue hover:text-fixnear-blue-hover font-medium flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded min-h-[36px]"
          >
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Exit to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-fixnear-bg text-fixnear-text w-full overflow-x-hidden">
      {/* Desktop Static Sidebar (w-64) */}
      <aside className="hidden lg:block w-64 shrink-0 fixed inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-[#0F2232]/50 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[calc(100vw-3rem)] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content Area (Offset by lg:pl-64) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 w-full">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-fixnear-border h-16 flex items-center justify-between px-3 sm:px-6 lg:px-8 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile Toggle with comfortable 44px touch target */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open sidebar navigation"
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-fixnear-muted hover:text-fixnear-navy hover:bg-fixnear-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring shrink-0 cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="text-xs font-medium text-fixnear-muted hidden md:inline truncate">
                FixNear Portal &middot;
              </span>
              <span className="text-xs font-semibold text-fixnear-navy truncate">
                {config.badgeLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/design-system"
              className="text-xs font-medium text-fixnear-muted hover:text-fixnear-navy transition-colors px-2 py-1 rounded hidden sm:inline"
            >
              Design System
            </Link>
            <div className="w-8 h-8 rounded-full bg-fixnear-navy text-white text-xs font-bold flex items-center justify-center shrink-0">
              FN
            </div>
          </div>
        </header>

        {/* Page Heading Banner - responsive flex-col to flex-row */}
        <div className="bg-white border-b border-fixnear-border py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-fixnear-navy tracking-tight break-words leading-tight">
                {resolvedTitle}
              </h1>
              {resolvedSubtitle && (
                <p className="text-xs sm:text-sm text-fixnear-muted mt-1 break-words">
                  {resolvedSubtitle}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto pt-1 sm:pt-0">
                {actions}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
