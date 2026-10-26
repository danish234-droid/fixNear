import React from "react";
import Link from "next/link";
import { ArrowLeft, Info } from "@/components/icons/LucideIcons";

export interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-fixnear-bg text-fixnear-text">
      {/* ─────────────────────────────────────────────
          AUTH HEADER BAR
          ───────────────────────────────────────────── */}
      <header className="bg-white border-b border-fixnear-border py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* FixNear Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded-lg p-1 -m-1"
            aria-label="FixNear Homepage"
          >
            <div className="w-9 h-9 rounded-lg bg-fixnear-navy text-white flex items-center justify-center font-bold text-lg shadow-xs group-hover:bg-[#122E44] transition-colors shrink-0">
              F
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl text-fixnear-navy tracking-tight leading-tight">
                FixNear
              </span>
              <span className="text-[10px] text-fixnear-muted font-medium tracking-wide uppercase leading-none hidden sm:block">
                Local Services Marketplace
              </span>
            </div>
          </Link>

          {/* Return link to homepage */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-fixnear-muted hover:text-fixnear-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded px-2 py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to FixNear</span>
          </Link>
        </div>
      </header>

      {/* ─────────────────────────────────────────────
          PROTOTYPE NOTICE BANNER
          ───────────────────────────────────────────── */}
      <div className="bg-fixnear-amber-light border-b border-[#FAD998] py-2.5 px-4">
        <div className="max-w-xl mx-auto flex items-start gap-2 text-xs text-[#945600]" role="note">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong>Frontend Prototype:</strong> Authentication screens and validation are active for demonstration. Credentials are not sent over the network or saved.
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          CENTERED AUTH CARD
          ───────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center py-10 sm:py-14 px-4 sm:px-6">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl border border-fixnear-border shadow-xs p-6 sm:p-10">
            {/* Title & Subtitle */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-fixnear-navy tracking-tight">
                {title}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-fixnear-muted leading-relaxed max-w-md mx-auto">
                {subtitle}
              </p>
            </div>

            {children}
          </div>

          {/* Quick trust / footer links */}
          <div className="mt-6 text-center text-xs text-fixnear-muted space-y-2">
            <div className="flex items-center justify-center gap-4">
              <Link href="/categories" className="hover:text-fixnear-navy underline">
                Browse Services
              </Link>
              <span>•</span>
              <Link href="/professionals" className="hover:text-fixnear-navy underline">
                Find Professionals
              </Link>
            </div>
            <p className="text-[11px] text-fixnear-muted/70">
              FixNear Local Services Marketplace &copy; 2026
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
