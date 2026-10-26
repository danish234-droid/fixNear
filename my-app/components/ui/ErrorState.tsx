import React from "react";
import { Button } from "./Button";

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
  icon?: React.ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  icon,
  onRetry,
  retryLabel = "Try Again",
  className = "",
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-[#FDF2F2]/60 rounded-xl border border-[#F9CACA] ${className}`}
      {...props}
    >
      <div className="w-12 h-12 rounded-full bg-[#FDF2F2] border border-[#F9CACA] flex items-center justify-center text-fixnear-error mb-4 shrink-0">
        {icon || (
          <svg
            className="w-6 h-6 text-fixnear-error"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        )}
      </div>

      <h3 className="text-base sm:text-lg font-bold text-fixnear-navy leading-snug">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-fixnear-muted max-w-sm mt-1.5 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <div className="mt-5">
          <Button variant="outline" size="sm" onClick={onRetry}>
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
