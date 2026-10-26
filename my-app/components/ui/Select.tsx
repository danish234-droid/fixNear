import React from "react";
import { Label } from "./Label";
import { HelperText } from "./HelperText";
import { ErrorMessage } from "./ErrorMessage";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      options,
      placeholder,
      id,
      className = "",
      disabled,
      required,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;

    const hasError = Boolean(error);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <Label htmlFor={selectId} required={required}>
            {label}
          </Label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            className={`w-full h-10 pl-3.5 pr-10 text-sm bg-white text-fixnear-text rounded-lg border appearance-none transition-colors duration-150 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              hasError
                ? "border-fixnear-error focus:border-fixnear-error focus:ring-fixnear-error/30"
                : "border-fixnear-border focus:border-fixnear-ring focus:ring-fixnear-ring/25"
            } ${
              disabled
                ? "bg-[#F0F4F8] text-fixnear-muted cursor-not-allowed border-[#DCE4EC]"
                : ""
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="absolute right-3.5 pointer-events-none text-fixnear-muted">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {hasError && <ErrorMessage id={errorId}>{error}</ErrorMessage>}
        {!hasError && helperText && (
          <HelperText id={helperId}>{helperText}</HelperText>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
