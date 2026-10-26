import React from "react";

export type BadgeVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "amber";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "rejected";

export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-[#EAF5EE] text-fixnear-success border-[#C6E7D0]",
  warning: "bg-[#FEF7ED] text-fixnear-warning border-[#FDE3B8]",
  error: "bg-[#FDF2F2] text-fixnear-error border-[#F9CACA]",
  info: "bg-[#EEF6FC] text-fixnear-blue border-[#CEE2F2]",
  neutral: "bg-[#F0F4F8] text-fixnear-navy border-fixnear-border",
  amber: "bg-[#FEF8ED] text-[#945600] border-[#FAD998]",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-xs px-2 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5 font-medium",
};

export function Badge({
  variant = "neutral",
  size = "md",
  icon,
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border leading-none tracking-normal select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

// Dedicated StatusBadge supporting the 6 required semantic statuses
export interface StatusBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  status: BookingStatus;
  size?: BadgeSize;
  label?: string;
  showIcon?: boolean;
}

const statusConfig: Record<
  BookingStatus,
  {
    variant: BadgeVariant;
    defaultLabel: string;
    icon: React.ReactNode;
  }
> = {
  pending: {
    variant: "warning",
    defaultLabel: "Pending",
    icon: (
      <svg
        className="w-3 h-3 text-fixnear-warning"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  confirmed: {
    variant: "info",
    defaultLabel: "Confirmed",
    icon: (
      <svg
        className="w-3 h-3 text-fixnear-blue"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  "in-progress": {
    variant: "info",
    defaultLabel: "In Progress",
    icon: (
      <span
        className="w-2 h-2 rounded-full bg-fixnear-blue animate-pulse"
        aria-hidden="true"
      />
    ),
  },
  completed: {
    variant: "success",
    defaultLabel: "Completed",
    icon: (
      <svg
        className="w-3 h-3 text-fixnear-success"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  cancelled: {
    variant: "error",
    defaultLabel: "Cancelled",
    icon: (
      <svg
        className="w-3 h-3 text-fixnear-error"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  rejected: {
    variant: "error",
    defaultLabel: "Rejected",
    icon: (
      <svg
        className="w-3 h-3 text-fixnear-error"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

export function StatusBadge({
  status,
  size = "md",
  label,
  showIcon = true,
  className = "",
  ...props
}: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      size={size}
      icon={showIcon ? config.icon : undefined}
      className={className}
      {...props}
    >
      {label || config.defaultLabel}
    </Badge>
  );
}
