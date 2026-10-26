import React from "react";

export type StatCardAccent = "blue" | "navy" | "amber" | "success" | "warning" | "neutral";

export interface DashboardStatCardProps {
  label: string;
  value: string | number;
  /** Optional short sub-label, e.g. "all time" */
  sub?: string;
  /** Icon rendered inside the accent circle */
  icon: React.ReactNode;
  accent?: StatCardAccent;
  className?: string;
}

const accentMap: Record<StatCardAccent, { bg: string; icon: string; ring: string }> = {
  blue:    { bg: "bg-[#EEF6FC]", icon: "text-fixnear-blue",    ring: "ring-fixnear-blue/20" },
  navy:    { bg: "bg-[#EAF0F6]", icon: "text-fixnear-navy",    ring: "ring-fixnear-navy/20" },
  amber:   { bg: "bg-[#FEF8ED]", icon: "text-[#945600]",       ring: "ring-fixnear-amber/30" },
  success: { bg: "bg-[#EAF5EE]", icon: "text-fixnear-success", ring: "ring-fixnear-success/20" },
  warning: { bg: "bg-[#FEF7ED]", icon: "text-fixnear-warning", ring: "ring-fixnear-warning/20" },
  neutral: { bg: "bg-[#F0F4F8]", icon: "text-fixnear-muted",   ring: "ring-fixnear-border" },
};

export function DashboardStatCard({
  label,
  value,
  sub,
  icon,
  accent = "blue",
  className = "",
}: DashboardStatCardProps) {
  const a = accentMap[accent];
  return (
    <div
      className={`bg-white rounded-xl border border-fixnear-border shadow-xs p-5 flex items-center gap-4 ${className}`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${a.bg} ring-4 ${a.ring}`}
        aria-hidden="true"
      >
        <span className={`w-6 h-6 ${a.icon}`}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-fixnear-muted font-medium truncate">{label}</p>
        <p className="text-2xl font-bold text-fixnear-navy leading-tight mt-0.5 tabular-nums">
          {value}
        </p>
        {sub && (
          <p className="text-[11px] text-fixnear-muted mt-0.5 truncate">{sub}</p>
        )}
      </div>
    </div>
  );
}
