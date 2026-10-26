import React from "react";
import {
  Zap,
  Droplet,
  AirVent,
  Monitor,
  Wrench,
  Hammer,
} from "@/components/icons/LucideIcons";

export type CategorySlug =
  | "electricians"
  | "plumbers"
  | "ac-technicians"
  | "computer-repair"
  | "appliance-repair"
  | "general-maintenance";

export interface ServiceCategory {
  id: string;
  slug: CategorySlug;
  name: string;
  shortDescription: string;
  longDescription: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  accentColor: string;
  badgeLabel: string;
  popularServices: string[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "cat-electricians",
    slug: "electricians",
    name: "Electricians",
    shortDescription: "Wiring, circuit panels, lighting fixtures, and electrical repairs.",
    longDescription:
      "Licensed and experienced electricians for safety inspections, breaker upgrades, EV charger installation, ceiling fans, and routine power troubleshooting.",
    icon: Zap,
    accentColor: "text-fixnear-amber",
    badgeLabel: "Electrical",
    popularServices: [
      "Wiring & Rewiring",
      "Circuit Breaker Repair",
      "Lighting Installation",
      "EV Charger Setup",
    ],
  },
  {
    id: "cat-plumbers",
    slug: "plumbers",
    name: "Plumbers",
    shortDescription: "Leak fixes, pipe unclogging, water heaters, and fixture installations.",
    longDescription:
      "Residential and commercial plumbing specialists for burst pipes, drain cleaning, garbage disposals, faucet replacements, and emergency water shutoff assistance.",
    icon: Droplet,
    accentColor: "text-fixnear-blue",
    badgeLabel: "Plumbing",
    popularServices: [
      "Leak Diagnostics",
      "Drain Cleaning",
      "Water Heater Service",
      "Fixture Replacement",
    ],
  },
  {
    id: "cat-ac-technicians",
    slug: "ac-technicians",
    name: "AC Technicians",
    shortDescription: "Cooling diagnostics, seasonal tune-ups, filter replacement, and HVAC repairs.",
    longDescription:
      "HVAC cooling pros for refrigerant recharging, split system installation, compressor diagnostics, thermostat setup, and indoor airflow optimization.",
    icon: AirVent,
    accentColor: "text-fixnear-blue",
    badgeLabel: "HVAC & Cooling",
    popularServices: [
      "AC Tune-Up & Cleaning",
      "Refrigerant Leak Repair",
      "Compressor Check",
      "Thermostat Installation",
    ],
  },
  {
    id: "cat-computer-repair",
    slug: "computer-repair",
    name: "Computer Repair",
    shortDescription: "Laptop diagnostics, OS recovery, virus cleaning, and hardware replacement.",
    longDescription:
      "Local tech support for PC and Mac laptops, desktops, component upgrades, SSD replacements, data transfer, and home office network configuration.",
    icon: Monitor,
    accentColor: "text-fixnear-navy",
    badgeLabel: "Tech Support",
    popularServices: [
      "Laptop Hardware Repair",
      "OS & Software Troubleshooting",
      "Virus & Malware Removal",
      "Data Recovery",
    ],
  },
  {
    id: "cat-appliance-repair",
    slug: "appliance-repair",
    name: "Appliance Repair",
    shortDescription: "Refrigerators, washing machines, dryers, dishwashers, and ovens.",
    longDescription:
      "Skilled technicians to troubleshoot faulty cooling coils, drum motors, heating elements, water valves, and electrical igniters on major household appliances.",
    icon: Wrench,
    accentColor: "text-fixnear-amber",
    badgeLabel: "Appliances",
    popularServices: [
      "Refrigerator Cooling Fixes",
      "Washer & Dryer Servicing",
      "Oven & Stove Diagnostics",
      "Dishwasher Drainage",
    ],
  },
  {
    id: "cat-general-maintenance",
    slug: "general-maintenance",
    name: "General Maintenance",
    shortDescription: "Handyman repairs, drywall fixes, door alignments, painting, and fixture hanging.",
    longDescription:
      "Versatile handyman specialists for small home repairs, wall patching, shelf mounting, caulking, weatherproofing, and preventative residential upkeep.",
    icon: Hammer,
    accentColor: "text-fixnear-navy",
    badgeLabel: "Handyman",
    popularServices: [
      "Drywall Patch & Paint",
      "Fixture & TV Mounting",
      "Door & Lock Adjustments",
      "Caulking & Weatherproofing",
    ],
  },
];

export const VALID_CATEGORY_SLUGS: CategorySlug[] = SERVICE_CATEGORIES.map(
  (c) => c.slug
);

/**
 * Safely looks up a category by slug.
 * Returns null if the slug is unknown or invalid.
 */
export function getCategoryBySlug(
  slug: string | null | undefined
): ServiceCategory | null {
  if (!slug) return null;
  const normalized = slug.trim().toLowerCase();
  return (
    SERVICE_CATEGORIES.find((cat) => cat.slug === normalized) || null
  );
}

/**
 * Checks if a string is a valid CategorySlug.
 */
export function isValidCategorySlug(slug: string): slug is CategorySlug {
  return VALID_CATEGORY_SLUGS.includes(slug as CategorySlug);
}
