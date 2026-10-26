import React from "react";
import { Label } from "./Label";
import { HelperText } from "./HelperText";
import { ErrorMessage } from "./ErrorMessage";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      id,
      className = "",
      disabled,
      required,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const helperId = `${textareaId}-helper`;
    const errorId = `${textareaId}-error`;

    const hasError = Boolean(error);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <Label htmlFor={textareaId} required={required}>
            {label}
          </Label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={hasError ? "true" : undefined}
          aria-describedby={
            hasError ? errorId : helperText ? helperId : undefined
          }
          className={`w-full min-h-[96px] p-3 text-sm bg-white text-fixnear-text rounded-lg border transition-colors duration-150 ease-in-out placeholder:text-fixnear-muted/60 focus:outline-none focus:ring-2 focus:ring-offset-1 resize-y ${
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

        {hasError && <ErrorMessage id={errorId}>{error}</ErrorMessage>}
        {!hasError && helperText && (
          <HelperText id={helperId}>{helperText}</HelperText>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
