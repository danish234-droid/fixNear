import { CategorySlug } from "./categories";

export interface DemoProfessional {
  id: string;
  name: string;
  initials: string;
  categorySlug: CategorySlug;
  categoryName: string;
  serviceArea: string;
  shortDescription: string;
  servicesOffered: string[];
  demoRate: string; // Clearly labeled demo rate
  createdAt: string; // ISO date for "Newest" sort
  isDemoRecord: true;
}

/**
 * Clearly labeled demonstration dataset for UI layout and filtering demonstration.
 * In accordance with project requirements:
 * - Does NOT include fake customer ratings or review counts
 * - Does NOT include fake verification badges or years of experience
 * - Price information is explicitly designated as sample/demo data
 * - Profiles are clearly flagged with `isDemoRecord: true`
 */
export const DEMO_PROFESSIONALS: DemoProfessional[] = [
  {
    id: "pro-demo-1",
    name: "Alex Rivera",
    initials: "AR",
    categorySlug: "electricians",
    categoryName: "Electricians",
    serviceArea: "Downtown & Midtown",
    shortDescription:
      "Specializes in electrical panel upgrades, emergency breaker troubleshooting, and recessed LED installations.",
    servicesOffered: [
      "Panel Upgrades",
      "Circuit Diagnostics",
      "Lighting Installation",
    ],
    demoRate: "$55/hr (demo estimate)",
    createdAt: "2026-03-15T09:00:00Z",
    isDemoRecord: true,
  },
  {
    id: "pro-demo-2",
    name: "Priya Sharma",
    initials: "PS",
    categorySlug: "plumbers",
    categoryName: "Plumbers",
    serviceArea: "Northside & Suburbs",
    shortDescription:
      "Handles residential plumbing repairs, pipe leak detection, water heater replacements, and drain cleanouts.",
    servicesOffered: [
      "Leak Diagnostics",
      "Drain Cleaning",
      "Water Heater Service",
    ],
    demoRate: "$60/hr (demo estimate)",
    createdAt: "2026-03-20T14:30:00Z",
    isDemoRecord: true,
  },
  {
    id: "pro-demo-3",
    name: "James Chen",
    initials: "JC",
    categorySlug: "ac-technicians",
    categoryName: "AC Technicians",
    serviceArea: "Central District",
    shortDescription:
      "Provides central AC servicing, seasonal coolant charging, thermostat calibrations, and duct airflow inspections.",
    servicesOffered: [
      "AC Maintenance",
      "Refrigerant Recharging",
      "Thermostat Setup",
    ],
    demoRate: "$65/hr (demo estimate)",
    createdAt: "2026-02-10T11:15:00Z",
    isDemoRecord: true,
  },
  {
    id: "pro-demo-4",
    name: "Maria Lopez",
    initials: "ML",
    categorySlug: "computer-repair",
    categoryName: "Computer Repair",
    serviceArea: "Eastside & Campus Area",
    shortDescription:
      "Focuses on laptop hardware replacement, data recovery, malware removal, and custom desktop computer builds.",
    servicesOffered: [
      "Laptop Screen Repair",
      "Malware Removal",
      "Data Recovery",
    ],
    demoRate: "$50/hr (demo estimate)",
    createdAt: "2026-03-01T08:00:00Z",
    isDemoRecord: true,
  },
  {
    id: "pro-demo-5",
    name: "Marcus Vance",
    initials: "MV",
    categorySlug: "appliance-repair",
    categoryName: "Appliance Repair",
    serviceArea: "Westside & Metro",
    shortDescription:
      "Expert servicing for residential refrigerators, washing machines, electric dryers, and kitchen ovens.",
    servicesOffered: [
      "Refrigerator Repair",
      "Washer & Dryer",
      "Dishwasher Drainage",
    ],
    demoRate: "$58/hr (demo estimate)",
    createdAt: "2026-03-25T16:00:00Z",
    isDemoRecord: true,
  },
  {
    id: "pro-demo-6",
    name: "Elena Rostova",
    initials: "ER",
    categorySlug: "general-maintenance",
    categoryName: "General Maintenance",
    serviceArea: "Downtown & South Hills",
    shortDescription:
      "Experienced handyman for drywall patching, interior caulking, door hanging, and general fixture assembly.",
    servicesOffered: [
      "Drywall Patching",
      "TV & Shelf Mounting",
      "Door Alignment",
    ],
    demoRate: "$45/hr (demo estimate)",
    createdAt: "2026-03-28T10:00:00Z",
    isDemoRecord: true,
  },
  {
    id: "pro-demo-7",
    name: "David Kim",
    initials: "DK",
    categorySlug: "electricians",
    categoryName: "Electricians",
    serviceArea: "Westside & Suburbs",
    shortDescription:
      "Certified electrician offering wiring inspections, outdoor security lighting, and dedicated 240V lines.",
    servicesOffered: [
      "Outdoor Lighting",
      "Safety Inspections",
      "Dedicated Circuits",
    ],
    demoRate: "$56/hr (demo estimate)",
    createdAt: "2026-01-18T13:45:00Z",
    isDemoRecord: true,
  },
  {
    id: "pro-demo-8",
    name: "Sarah Jenkins",
    initials: "SJ",
    categorySlug: "plumbers",
    categoryName: "Plumbers",
    serviceArea: "Downtown & Riverfront",
    shortDescription:
      "Kitchen and bathroom plumbing specialist focusing on faucet installation, garbage disposal fixes, and fixture sealing.",
    servicesOffered: [
      "Faucet Installation",
      "Garbage Disposal",
      "Pipe Repairs",
    ],
    demoRate: "$62/hr (demo estimate)",
    createdAt: "2026-03-29T12:00:00Z",
    isDemoRecord: true,
  },
  {
    id: "pro-demo-9",
    name: "Tariq Mansour",
    initials: "TM",
    categorySlug: "ac-technicians",
    categoryName: "AC Technicians",
    serviceArea: "Northside & Metro",
    shortDescription:
      "Cooling system specialist delivering evaporator cleaning, air duct sealing, and emergency AC breakdowns.",
    servicesOffered: [
      "Evaporator Coil Cleaning",
      "Air Duct Sealing",
      "AC Diagnostics",
    ],
    demoRate: "$64/hr (demo estimate)",
    createdAt: "2026-02-28T09:30:00Z",
    isDemoRecord: true,
  },
  {
    id: "pro-demo-10",
    name: "Kenji Sato",
    initials: "KS",
    categorySlug: "general-maintenance",
    categoryName: "General Maintenance",
    serviceArea: "Midtown & Central District",
    shortDescription:
      "Residential handyman handling tile re-grouting, cabinet hardware, weatherstripping, and minor carpentry.",
    servicesOffered: [
      "Tile Grouting",
      "Weatherstripping",
      "Minor Carpentry",
    ],
    demoRate: "$48/hr (demo estimate)",
    createdAt: "2026-03-22T15:20:00Z",
    isDemoRecord: true,
  },
];

/**
 * Safely looks up a professional by ID from the shared dataset.
 * Returns null if not found.
 */
export function getProfessionalById(
  id: string | null | undefined
): DemoProfessional | null {
  if (!id) return null;
  const normalized = id.trim().toLowerCase();
  return (
    DEMO_PROFESSIONALS.find(
      (pro) => pro.id.toLowerCase() === normalized
    ) || null
  );
}
