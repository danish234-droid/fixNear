export type DashboardRole = "customer" | "technician" | "admin";

export interface DashboardNavItem {
  label: string;
  href: string;
  badge?: string;
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

export const customerNavItems: DashboardNavItem[] = [
  { label: "Overview", href: "#overview", iconName: "overview" },
  { label: "My Bookings", href: "#bookings", iconName: "bookings" },
  { label: "Profile", href: "#profile", iconName: "profile" },
  { label: "Reviews", href: "#reviews", iconName: "reviews" },
];

export const technicianNavItems: DashboardNavItem[] = [
  { label: "Overview", href: "#overview", iconName: "overview" },
  { label: "Bookings", href: "#bookings", iconName: "bookings" },
  { label: "Schedule", href: "#schedule", iconName: "schedule" },
  { label: "Services", href: "#services", iconName: "services" },
  { label: "Profile", href: "#profile", iconName: "profile" },
];

export const adminNavItems: DashboardNavItem[] = [
  { label: "Overview", href: "#overview", iconName: "overview" },
  { label: "Customers", href: "#customers", iconName: "customers" },
  { label: "Technicians", href: "#technicians", iconName: "technicians" },
  { label: "Bookings", href: "#bookings", iconName: "bookings" },
  { label: "Reports", href: "#reports", iconName: "reports" },
  { label: "Settings", href: "#settings", iconName: "settings" },
];

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
  technician: {
    title: "Technician Portal",
    subtitle: "Manage service listings, incoming job dispatches, and work schedule.",
    badgeLabel: "Technician Pro",
    badgeVariant: "amber",
    navItems: technicianNavItems,
  },
  admin: {
    title: "Administration Console",
    subtitle: "Platform-wide governance, verification queues, and booking oversight.",
    badgeLabel: "Admin Console",
    badgeVariant: "neutral",
    navItems: adminNavItems,
  },
};
