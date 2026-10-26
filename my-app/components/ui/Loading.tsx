import React from "react";

export type SpinnerSize = "sm" | "md" | "lg";
export type SpinnerColor = "primary" | "navy" | "white" | "current";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  color?: SpinnerColor;
  label?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-3",
};

const colorStyles: Record<SpinnerColor, string> = {
  primary: "text-fixnear-blue border-fixnear-blue border-t-transparent",
  navy: "text-fixnear-navy border-fixnear-navy border-t-transparent",
  white: "text-white border-white border-t-transparent",
  current: "text-current border-current border-t-transparent",
};

export function Spinner({
  size = "md",
  color = "primary",
  label = "Loading...",
  className = "",
  ...props
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center ${className}`}
      {...props}
    >
      <span
        className={`inline-block rounded-full animate-spin ${sizeStyles[size]} ${colorStyles[color]}`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangle" | "circle" | "text";
}

export function Skeleton({
  variant = "rectangle",
  className = "",
  ...props
}: SkeletonProps) {
  const variantClass =
    variant === "circle"
      ? "rounded-full"
      : variant === "text"
      ? "rounded h-4 w-full"
      : "rounded-lg";

  return (
    <div
      aria-hidden="true"
      className={`bg-[#E8EEF5] animate-pulse ${variantClass} ${className}`}
      {...props}
    />
  );
}
