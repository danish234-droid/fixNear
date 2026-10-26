"use client";

import React, { useState } from "react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  fallback?: string;
  size?: AvatarSize;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string }> = {
  xs: { container: "w-6 h-6", text: "text-[10px]" },
  sm: { container: "w-8 h-8", text: "text-xs" },
  md: { container: "w-10 h-10", text: "text-sm" },
  lg: { container: "w-12 h-12", text: "text-base" },
  xl: { container: "w-16 h-16", text: "text-lg font-bold" },
};

function getInitials(name?: string, fallback?: string): string {
  if (fallback) return fallback.slice(0, 2).toUpperCase();
  if (!name) return "FN";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

export function Avatar({
  src,
  alt = "",
  name,
  fallback,
  size = "md",
  className = "",
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  const initials = getInitials(name, fallback);
  const sizeConfig = sizeStyles[size];

  const showImage = Boolean(src && !hasError);

  return (
    <div
      role="img"
      aria-label={alt || name || `Avatar of ${initials}`}
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden select-none shrink-0 border border-fixnear-border/80 bg-[#EEF6FC] text-fixnear-navy font-semibold ${sizeConfig.container} ${sizeConfig.text} ${className}`}
      {...props}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt || name || "User avatar"}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  );
}
