import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leadingIcon,
      trailingIcon,
      id,
      className = "",
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const hasError = Boolean(error);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-fixnear-text flex items-center justify-between"
          >
            <span>
              {label}
              {required && (
                <span className="text-fixnear-error ml-1" aria-hidden="true">
                  *
                </span>
              )}
            </span>
          </label>
        )}

        <div className="relative flex items-center">
          {leadingIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-fixnear-muted">
              {leadingIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            className={`w-full h-10 px-3.5 text-sm bg-white text-fixnear-text rounded-lg border transition-colors duration-150 ease-in-out placeholder:text-fixnear-muted/60 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              leadingIcon ? "pl-10" : ""
            } ${trailingIcon ? "pr-10" : ""} ${
              hasError
                ? "border-fixnear-error focus:border-fixnear-error focus:ring-fixnear-error/30"
                : "border-fixnear-border focus:border-fixnear-ring focus:ring-fixnear-ring/25"
            } ${
              disabled
                ? "bg-[#F0F4F8] text-fixnear-muted cursor-not-allowed border-[#DCE4EC]"
                : ""
            } ${className}`}
            {...props}
          />

          {trailingIcon && (
            <div className="absolute right-3 flex items-center pointer-events-none text-fixnear-muted">
              {trailingIcon}
            </div>
          )}
        </div>

        {hasError && (
          <p
            id={errorId}
            role="alert"
            className="text-xs text-fixnear-error font-medium flex items-center gap-1 mt-0.5"
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
            <span>{error}</span>
          </p>
        )}

        {!hasError && helperText && (
          <p id={helperId} className="text-xs text-fixnear-muted mt-0.5">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
