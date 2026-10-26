import React from "react";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({
  required,
  className = "",
  children,
  ...props
}: LabelProps) {
  return (
    <label
      className={`text-sm font-medium text-fixnear-text flex items-center justify-between select-none ${className}`}
      {...props}
    >
      <span>
        {children}
        {required && (
          <span className="text-fixnear-error ml-1 font-bold" aria-hidden="true">
            *
          </span>
        )}
      </span>
    </label>
  );
}
