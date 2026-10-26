"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui";

export interface NavItem {
  label: string;
  href: string;
}

export const defaultNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/categories" },
  { label: "Find Professionals", href: "/professionals" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Design System", href: "/design-system" },
];

export interface PublicNavbarProps {
  navItems?: NavItem[];
}

export function PublicNavbar({ navItems = defaultNavItems }: PublicNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-fixnear-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          {/* Brand Mark - guaranteed visible even on 320px viewports */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded-lg p-1 -m-1 min-w-0"
            aria-label="FixNear Homepage"
          >
            <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg bg-fixnear-navy text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-xs group-hover:bg-[#122E44] transition-colors shrink-0">
              F
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-lg sm:text-xl text-fixnear-navy tracking-tight leading-tight truncate">
                FixNear
              </span>
              <span className="text-[10px] text-fixnear-muted font-medium tracking-wide uppercase leading-none hidden md:block">
                Local Services Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-1 lg:gap-2"
            aria-label="Main Navigation"
          >
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring whitespace-nowrap ${
                    isActive
                      ? "text-fixnear-blue bg-[#EEF6FC] font-semibold"
                      : "text-fixnear-muted hover:text-fixnear-navy hover:bg-fixnear-bg"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center gap-2.5 lg:gap-3 shrink-0">
            <Link href="/#login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/#signup">
              <Button variant="primary" size="sm">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button (with comfortable touch target >= 44x44px) */}
          <div className="flex items-center md:hidden shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-fixnear-muted hover:text-fixnear-navy hover:bg-fixnear-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
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
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-fixnear-border bg-white px-4 pt-3 pb-6 shadow-xl max-h-[calc(100vh-4.25rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-150"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`min-h-[44px] flex items-center px-3.5 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? "text-fixnear-blue bg-[#EEF6FC] font-semibold"
                      : "text-fixnear-muted hover:text-fixnear-navy hover:bg-fixnear-bg active:bg-slate-100"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 pt-4 border-t border-fixnear-border flex flex-col gap-2.5">
            <Link
              href="/#login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button variant="outline" size="md" className="w-full min-h-[44px]">
                Log In
              </Button>
            </Link>
            <Link
              href="/#signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button variant="primary" size="md" className="w-full min-h-[44px]">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
