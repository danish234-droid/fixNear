/**
 * FixNear Development Seed Script
 *
 * ⚠️  FOR DEVELOPMENT USE ONLY — DO NOT RUN IN PRODUCTION ⚠️
 *
 * Creates sample service categories, professional users, professional profiles,
 * and professional services. All records are clearly fictional.
 *
 * Safe to rerun: uses upsert with stable unique identifiers.
 * Does NOT delete or overwrite existing non-seed records.
 * Does NOT create customer records or real-world reviews.
 */

import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Service Categories
// ---------------------------------------------------------------------------
const CATEGORIES = [
  {
    slug: "electrician",
    name: "Electrician",
    description: "Electrical installation, repair, and maintenance services.",
    icon: "zap",
  },
  {
    slug: "plumber",
    name: "Plumber",
    description: "Plumbing installation, leak detection, and pipe repair.",
    icon: "droplets",
  },
  {
    slug: "ac-technician",
    name: "AC Technician",
    description: "Air conditioner installation, servicing, and gas refilling.",
    icon: "wind",
  },
  {
    slug: "computer-repair",
    name: "Computer Repair",
    description: "Hardware and software repair for laptops and desktops.",
    icon: "monitor",
  },
  {
    slug: "appliance-repair",
    name: "Appliance Repair",
    description: "Repair and maintenance of household appliances.",
    icon: "settings",
  },
];

// ---------------------------------------------------------------------------
// Professional seed data
// ---------------------------------------------------------------------------
// passwordHash field is required by schema but authentication is NOT implemented.
// This placeholder value is intentionally non-functional — it cannot be used to log in.
// Replace with a real bcrypt hash once Module 5 (auth) is implemented.
const DEV_PLACEHOLDER_HASH = "__DEV_SEED_PLACEHOLDER__NOT_A_REAL_HASH__";

const PROFESSIONALS = [
  {
    email: "dev.seed.ali.electrician@fixnear.invalid",
    name: "Ali Hassan (Dev Seed)",
    phone: "+92-300-0000001",
    profile: {
      businessName: "Ali Electric Services (Dev)",
      bio: "Fictional dev-seed account. Licensed electrician with 10 years of experience.",
      city: "Karachi",
      address: "Block 5, Clifton, Karachi (fictional)",
    },
    services: [
      {
        categorySlug: "electrician",
        title: "Home Wiring Inspection",
        description: "Complete inspection of home electrical wiring.",
        priceFrom: 1500,
      },
      {
        categorySlug: "electrician",
        title: "MCB / Fuse Box Installation",
        description: "Install or replace MCBs and fuse boxes.",
        priceFrom: 2500,
      },
    ],
  },
  {
    email: "dev.seed.fatima.plumber@fixnear.invalid",
    name: "Fatima Malik (Dev Seed)",
    phone: "+92-300-0000002",
    profile: {
      businessName: "Fatima Plumbing Works (Dev)",
      bio: "Fictional dev-seed account. Expert plumber specialising in leak detection.",
      city: "Lahore",
      address: "Model Town, Lahore (fictional)",
    },
    services: [
      {
        categorySlug: "plumber",
        title: "Pipe Leak Repair",
        description: "Detect and fix pipe leaks in kitchens and bathrooms.",
        priceFrom: 800,
      },
      {
        categorySlug: "plumber",
        title: "Bathroom Fitting Installation",
        description: "Install showers, taps, and other bathroom fittings.",
        priceFrom: 2000,
      },
    ],
  },
  {
    email: "dev.seed.umar.ac@fixnear.invalid",
    name: "Umar Siddiqui (Dev Seed)",
    phone: "+92-300-0000003",
    profile: {
      businessName: "Cool Breeze AC Services (Dev)",
      bio: "Fictional dev-seed account. Certified AC technician for all major brands.",
      city: "Islamabad",
      address: "F-10 Markaz, Islamabad (fictional)",
    },
    services: [
      {
        categorySlug: "ac-technician",
        title: "AC Service & Cleaning",
        description: "Full AC service including filter cleaning and gas check.",
        priceFrom: 1200,
      },
      {
        categorySlug: "ac-technician",
        title: "AC Gas Refilling",
        description: "Recharge refrigerant gas for optimal cooling.",
        priceFrom: 3000,
      },
    ],
  },
  {
    email: "dev.seed.sara.computers@fixnear.invalid",
    name: "Sara Raza (Dev Seed)",
    phone: "+92-300-0000004",
    profile: {
      businessName: "Sara Tech Repair (Dev)",
      bio: "Fictional dev-seed account. Computer technician handling hardware and software issues.",
      city: "Karachi",
      address: "Gulshan-e-Iqbal, Karachi (fictional)",
    },
    services: [
      {
        categorySlug: "computer-repair",
        title: "Laptop Screen Replacement",
        description: "Replace broken or cracked laptop screens.",
        priceFrom: 4500,
      },
      {
        categorySlug: "computer-repair",
        title: "Virus Removal & OS Reinstall",
        description: "Remove malware and reinstall the operating system.",
        priceFrom: 1500,
      },
    ],
  },
  {
    email: "dev.seed.bilal.appliances@fixnear.invalid",
    name: "Bilal Chaudhry (Dev Seed)",
    phone: "+92-300-0000005",
    profile: {
      businessName: "Bilal Home Appliances (Dev)",
      bio: "Fictional dev-seed account. Appliance repair specialist for washing machines, fridges, and ovens.",
      city: "Rawalpindi",
      address: "Saddar, Rawalpindi (fictional)",
    },
    services: [
      {
        categorySlug: "appliance-repair",
        title: "Washing Machine Repair",
        description: "Diagnose and repair all washing machine faults.",
        priceFrom: 1000,
      },
      {
        categorySlug: "appliance-repair",
        title: "Refrigerator Repair",
        description: "Fix cooling issues, compressor faults, and leaks.",
        priceFrom: 1500,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Seed runner
// ---------------------------------------------------------------------------
async function main() {
  console.log("🌱 FixNear Dev Seed — starting...\n");

  // 1. Upsert service categories
  console.log("📂 Seeding service categories...");
  const categoryIdMap: Record<string, string> = {};

  for (const cat of CATEGORIES) {
    const record = await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
      },
    });
    categoryIdMap[cat.slug] = record.id;
    console.log(`  ✓ Category: ${cat.name} (id: ${record.id})`);
  }

  // 2. Upsert professional users + profiles + services
  console.log("\n👷 Seeding professional accounts...");
  for (const pro of PROFESSIONALS) {
    // Upsert User
    const user = await prisma.user.upsert({
      where: { email: pro.email },
      update: { name: pro.name, phone: pro.phone },
      create: {
        email: pro.email,
        name: pro.name,
        phone: pro.phone,
        role: "PROFESSIONAL",
        passwordHash: DEV_PLACEHOLDER_HASH,
      },
    });

    // Upsert ProfessionalProfile
    const profile = await prisma.professionalProfile.upsert({
      where: { userId: user.id },
      update: {
        businessName: pro.profile.businessName,
        bio: pro.profile.bio,
        city: pro.profile.city,
        address: pro.profile.address,
      },
      create: {
        userId: user.id,
        businessName: pro.profile.businessName,
        bio: pro.profile.bio,
        city: pro.profile.city,
        address: pro.profile.address,
        isAvailable: true,
      },
    });

    // Upsert services (keyed on title + professionalProfileId)
    for (const svc of pro.services) {
      const categoryId = categoryIdMap[svc.categorySlug];
      if (!categoryId) {
        console.warn(`  ⚠ Unknown category slug: ${svc.categorySlug}`);
        continue;
      }

      // Check if service already exists for this profile with same title
      const existing = await prisma.professionalService.findFirst({
        where: { professionalProfileId: profile.id, title: svc.title },
      });

      if (!existing) {
        await prisma.professionalService.create({
          data: {
            professionalProfileId: profile.id,
            serviceCategoryId: categoryId,
            title: svc.title,
            description: svc.description,
            priceFrom: svc.priceFrom,
          },
        });
        console.log(`    + Service created: "${svc.title}"`);
      } else {
        console.log(`    ~ Service already exists: "${svc.title}" (skipped)`);
      }
    }

    console.log(`  ✓ Professional: ${pro.name} | ${pro.profile.city}`);
  }

  // 3. Summary
  const catCount = await prisma.serviceCategory.count();
  const profileCount = await prisma.professionalProfile.count();
  const serviceCount = await prisma.professionalService.count();

  console.log("\n📊 Database summary after seed:");
  console.log(`  ServiceCategory    : ${catCount}`);
  console.log(`  ProfessionalProfile: ${profileCount}`);
  console.log(`  ProfessionalService: ${serviceCount}`);

  console.log("\n✅ Dev seed complete. Safe to rerun.\n");
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
    void pool.end();
  });
