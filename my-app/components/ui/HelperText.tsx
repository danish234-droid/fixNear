import React from "react";

export type HelperTextProps = React.HTMLAttributes<HTMLParagraphElement>;

export function HelperText({
  className = "",
  children,
  ...props
}: HelperTextProps) {
  if (!children) return null;
  return (
    <p
      className={`text-xs text-fixnear-muted mt-0.5 leading-normal ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}
