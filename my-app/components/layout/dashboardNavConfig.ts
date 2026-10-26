/**
 * dashboardNavConfig.ts
 *
 * Centralised role configuration for the FixNear dashboard shell.
 * Roles: customer | professional | admin
 *
 * NOTE: Authentication and authorisation are NOT yet implemented.
 * These configs establish navigation structure only. Real access control
 * will be enforced by backend middleware in a future module.
 */

export type DashboardRole = "customer" | "professional" | "admin";

export interface DashboardNavItem {
  label: string;
  href: string;
  badge?: string;
  /** Key used to render the correct inline SVG icon inside DashboardShell */
  iconName:
    | "overview"
    | "bookings"
    | "schedule"
    | "services"
    | "profile"
    | "reviews"
    | "customers"
    | "technicians"
    | "reports"
    | "settings";
}

/* ── Customer nav ──────────────────────────────────────────────── */
export const customerNavItems: DashboardNavItem[] = [
  { label: "Overview",       href: "/dashboard/customer",           iconName: "overview"  },
  { label: "My Bookings",    href: "/dashboard/customer#bookings",  iconName: "bookings"  },
  { label: "Browse Services",href: "/categories",                   iconName: "services"  },
  { label: "Find Professionals", href: "/professionals",            iconName: "customers" },
];

/* ── Professional nav ─────────────────────────────────────────── */
export const professionalNavItems: DashboardNavItem[] = [
  { label: "Overview",       href: "/dashboard/professional",              iconName: "overview"  },
  { label: "Booking Requests",href: "/dashboard/professional#bookings",    iconName: "bookings"  },
  { label: "My Profile",     href: "/professionals/demo-professional-1",   iconName: "profile"   },
  { label: "Services Offered",href: "/dashboard/professional#services",    iconName: "services"  },
];

/* ── Admin nav ─────────────────────────────────────────────────── */
export const adminNavItems: DashboardNavItem[] = [
  { label: "Overview",       href: "/dashboard/admin",              iconName: "overview"    },
  { label: "Customers",      href: "/dashboard/admin#customers",    iconName: "customers"   },
  { label: "Professionals",  href: "/dashboard/admin#technicians",  iconName: "technicians" },
  { label: "Bookings",       href: "/dashboard/admin#bookings",     iconName: "bookings"    },
  { label: "Reports",        href: "/dashboard/admin#reports",      iconName: "reports"     },
  { label: "Settings",       href: "/dashboard/admin#settings",     iconName: "settings"    },
];

/* ── Role → config map ─────────────────────────────────────────── */
export const roleConfig: Record<
  DashboardRole,
  {
    title: string;
    subtitle: string;
    badgeLabel: string;
    badgeVariant: "info" | "amber" | "neutral";
    navItems: DashboardNavItem[];
  }
> = {
  customer: {
    title: "Customer Dashboard",
    subtitle: "Manage your local service requests and technician bookings.",
    badgeLabel: "Customer Portal",
    badgeVariant: "info",
    navItems: customerNavItems,
  },
  professional: {
    title: "Professional Portal",
    subtitle: "Manage service listings, incoming job requests, and your public profile.",
    badgeLabel: "Professional Pro",
    badgeVariant: "amber",
    navItems: professionalNavItems,
  },
  admin: {
    title: "Administration Console",
    subtitle: "Platform-wide governance, verification queues, and booking oversight.",
    badgeLabel: "Admin Console",
    badgeVariant: "neutral",
    navItems: adminNavItems,
  },
};
