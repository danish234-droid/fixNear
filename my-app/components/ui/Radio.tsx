import React from "react";
import { HelperText } from "./HelperText";
import { ErrorMessage } from "./ErrorMessage";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  helperText?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, helperText, id, className = "", disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const radioId = id || generatedId;
    const helperId = `${radioId}-helper`;

    return (
      <label
        htmlFor={radioId}
        className={`inline-flex items-start gap-2.5 cursor-pointer select-none ${
          disabled ? "cursor-not-allowed opacity-60" : ""
        } ${className}`}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            disabled={disabled}
            aria-describedby={helperText ? helperId : undefined}
            className="peer sr-only"
            {...props}
          />
          <div className="w-4.5 h-4.5 rounded-full border border-fixnear-border bg-white transition-all duration-150 flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-fixnear-ring peer-focus-visible:ring-offset-2 peer-checked:border-fixnear-blue">
            <div className="w-2 h-2 rounded-full bg-fixnear-blue opacity-0 peer-checked:opacity-100 transition-opacity duration-150" />
          </div>
        </div>

        {label && (
          <div className="flex flex-col text-sm text-fixnear-text font-normal leading-snug">
            <span>{label}</span>
            {helperText && <HelperText id={helperId}>{helperText}</HelperText>}
          </div>
        )}
      </label>
    );
  }
);

Radio.displayName = "Radio";

export interface RadioGroupProps {
  label?: string;
  helperText?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

export function RadioGroup({
  label,
  helperText,
  error,
  children,
  className = "",
  required,
}: RadioGroupProps) {
  const generatedId = React.useId();
  const errorId = `${generatedId}-error`;
  const helperId = `${generatedId}-helper`;
  const hasError = Boolean(error);

  return (
    <fieldset className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <legend className="text-sm font-medium text-fixnear-text mb-1">
          {label}
          {required && (
            <span className="text-fixnear-error ml-1 font-bold" aria-hidden="true">
              *
            </span>
          )}
        </legend>
      )}

      <div className="flex flex-col gap-2.5">{children}</div>

      {hasError && <ErrorMessage id={errorId}>{error}</ErrorMessage>}
      {!hasError && helperText && (
        <HelperText id={helperId}>{helperText}</HelperText>
      )}
    </fieldset>
  );
}
