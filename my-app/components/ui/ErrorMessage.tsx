import React from "react";

export type ErrorMessageProps = React.HTMLAttributes<HTMLParagraphElement>;

export function ErrorMessage({
  className = "",
  children,
  id,
  ...props
}: ErrorMessageProps) {
  if (!children) return null;
  return (
    <p
      id={id}
      role="alert"
      className={`text-xs text-fixnear-error font-medium flex items-center gap-1.5 mt-0.5 ${className}`}
      {...props}
    >
      <svg
        className="w-3.5 h-3.5 shrink-0"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      <span>{children}</span>
    </p>
  );
}
