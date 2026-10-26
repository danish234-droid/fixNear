import React from "react";

export type ButtonVariant =
  | "primary"
  | "navy"
  | "secondary"
  | "outline"
  | "amber"
  | "danger"
  | "destructive"
  | "ghost"
  | "link";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-fixnear-blue text-white hover:bg-fixnear-blue-hover active:bg-[#1A5785] border border-transparent shadow-xs",
  navy:
    "bg-fixnear-navy text-white hover:bg-fixnear-navy-hover active:bg-[#0D2335] border border-transparent shadow-xs",
  secondary:
    "bg-[#F0F4F8] text-fixnear-navy hover:bg-[#E2E8F0] active:bg-[#CBD5E1] border border-transparent",
  outline:
    "bg-white text-fixnear-text hover:bg-fixnear-bg active:bg-[#EDF2F7] border border-fixnear-border shadow-xs",
  amber:
    "bg-fixnear-amber text-fixnear-text hover:bg-fixnear-amber-hover active:bg-[#CF9226] border border-transparent font-medium shadow-xs",
  danger:
    "bg-fixnear-error text-white hover:bg-[#A82222] active:bg-[#8B1C1C] border border-transparent shadow-xs",
  destructive:
    "bg-fixnear-error text-white hover:bg-[#A82222] active:bg-[#8B1C1C] border border-transparent shadow-xs",
  ghost:
    "bg-transparent text-fixnear-text hover:bg-fixnear-bg active:bg-[#EDF2F7] border border-transparent",
  link:
    "bg-transparent text-fixnear-blue hover:text-fixnear-blue-hover underline-offset-4 hover:underline border-0 p-0 h-auto shadow-none font-medium",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-6 text-base gap-2.5 rounded-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;
    const isLink = variant === "link";

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`inline-flex items-center justify-center font-medium leading-none select-none transition-colors duration-150 ease-in-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring focus-visible:ring-offset-2 ${
          isDisabled ? "opacity-55 cursor-not-allowed pointer-events-none" : ""
        } ${variantStyles[variant]} ${!isLink ? sizeStyles[size] : ""} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span
            className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"
            aria-hidden="true"
          />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
