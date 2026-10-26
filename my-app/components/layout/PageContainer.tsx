import React from "react";

export type ContainerSize = "default" | "narrow" | "wide" | "full";

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  cleanPadding?: boolean;
}

const sizeClasses: Record<ContainerSize, string> = {
  narrow: "max-w-4xl",
  default: "max-w-7xl",
  wide: "max-w-[90rem]",
  full: "max-w-full",
};

export function PageContainer({
  size = "default",
  cleanPadding = false,
  className = "",
  children,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={`w-full mx-auto ${
        cleanPadding ? "" : "px-4 sm:px-6 lg:px-8"
      } ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface PageHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  actions,
  breadcrumbs,
  className = "",
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={`border-b border-fixnear-border/80 bg-white py-6 sm:py-8 ${className}`}
      {...props}
    >
      <PageContainer>
        {breadcrumbs && <div className="mb-2 text-xs">{breadcrumbs}</div>}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-fixnear-navy tracking-tight leading-tight">
                {title}
              </h1>
              {badge}
            </div>
            {subtitle && (
              <p className="text-xs sm:text-sm text-fixnear-muted max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
        </div>
      </PageContainer>
    </div>
  );
}

export interface SectionContainerProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  size?: ContainerSize;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}

export function SectionContainer({
  size = "default",
  title,
  subtitle,
  action,
  className = "",
  children,
  ...props
}: SectionContainerProps) {
  return (
    <section className={`py-8 sm:py-12 ${className}`} {...props}>
      <PageContainer size={size}>
        {(title || subtitle || action) && (
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 sm:mb-8 pb-3 border-b border-fixnear-border">
            <div>
              {title && (
                <h2 className="text-xl sm:text-2xl font-bold text-fixnear-navy tracking-tight">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-fixnear-muted mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </PageContainer>
    </section>
  );
}
