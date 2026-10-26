import React from "react";
import { HelperText } from "./HelperText";
import { ErrorMessage } from "./ErrorMessage";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  helperText?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helperText,
      error,
      id,
      className = "",
      disabled,
      checked,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;
    const helperId = `${checkboxId}-helper`;
    const errorId = `${checkboxId}-error`;

    const hasError = Boolean(error);

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <label
          htmlFor={checkboxId}
          className={`inline-flex items-start gap-2.5 cursor-pointer select-none ${
            disabled ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              disabled={disabled}
              checked={checked}
              aria-invalid={hasError ? "true" : undefined}
              aria-describedby={
                hasError ? errorId : helperText ? helperId : undefined
              }
              className="peer sr-only"
              {...props}
            />
            <div
              className={`w-4.5 h-4.5 rounded-md border transition-all duration-150 flex items-center justify-center bg-white ${
                hasError
                  ? "border-fixnear-error peer-focus-visible:ring-fixnear-error/30"
                  : "border-fixnear-border peer-focus-visible:ring-fixnear-ring"
              } peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-checked:bg-fixnear-blue peer-checked:border-fixnear-blue`}
            >
              <svg
                className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150"
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
            </div>
          </div>

          {label && (
            <div className="flex flex-col text-sm text-fixnear-text font-normal leading-snug">
              <span>{label}</span>
              {!hasError && helperText && (
                <HelperText id={helperId}>{helperText}</HelperText>
              )}
            </div>
          )}
        </label>

        {hasError && <ErrorMessage id={errorId}>{error}</ErrorMessage>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
