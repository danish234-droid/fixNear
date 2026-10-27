import { prisma } from "./src/lib/prisma.js";

async function main() {
  const categories = await prisma.serviceCategory.findMany();
  console.log("Categories query succeeded, count:", categories.length);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Error connecting to database:", err);
  process.exit(1);
});
