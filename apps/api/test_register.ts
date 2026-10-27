import http from "node:http";
import bcrypt from "bcrypt";
import { app } from "./src/app.js";
import { prisma } from "./src/lib/prisma.js";

async function runTests() {
  console.log("==================================================");
  console.log(" FixNear Module 5, Part 1: Registration Test Suite");
  console.log("==================================================\n");

  // Start Express server on ephemeral port
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 4000;
  const baseUrl = `http://127.0.0.1:${port}/api/auth/register`;

  const timestamp = Date.now();
  const testCustomerEmail = `test.customer.${timestamp}@example.com`;
  const testProEmail = `test.pro.${timestamp}@example.com`;
  const testPassword = "SecurePassword123!";

  let createdCustomerUserId: string | null = null;
  let createdProUserId: string | null = null;

  let passedCount = 0;
  let failedCount = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passedCount++;
    } else {
      console.error(`❌ FAIL: ${testName}${detail ? ` - ${detail}` : ""}`);
      failedCount++;
    }
  }

  try {
    // -------------------------------------------------------------------------
    // Test 1: Valid CUSTOMER registration
    // -------------------------------------------------------------------------
    console.log("Running Test 1: Valid CUSTOMER registration...");
    const res1 = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Customer",
        email: testCustomerEmail,
        password: testPassword,
        role: "CUSTOMER",
      }),
    });
    const body1 = (await res1.json()) as any;
    assert(
      res1.status === 201 &&
        body1.data?.email === testCustomerEmail &&
        body1.data?.role === "CUSTOMER" &&
        body1.data?.id !== undefined,
      "Test 1: Valid CUSTOMER registration returns HTTP 201 with safe user data",
      JSON.stringify(body1)
    );
    if (body1.data?.id) createdCustomerUserId = body1.data.id;

    // -------------------------------------------------------------------------
    // Test 2: Valid PROFESSIONAL registration and profile creation
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 2: Valid PROFESSIONAL registration and profile creation...");
    const res2 = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Professional",
        email: testProEmail,
        password: testPassword,
        role: "PROFESSIONAL",
        city: "Lahore",
        businessName: "Test Services Co",
      }),
    });
    const body2 = (await res2.json()) as any;
    assert(
      res2.status === 201 &&
        body2.data?.email === testProEmail &&
        body2.data?.role === "PROFESSIONAL" &&
        body2.data?.professionalProfile?.city === "Lahore",
      "Test 2: Valid PROFESSIONAL registration returns HTTP 201 with profile",
      JSON.stringify(body2)
    );
    if (body2.data?.id) createdProUserId = body2.data.id;

    // Verify ProfessionalProfile in database
    if (createdProUserId) {
      const dbProfile = await prisma.professionalProfile.findUnique({
        where: { userId: createdProUserId },
      });
      assert(
        dbProfile !== null && dbProfile.city === "Lahore" && dbProfile.isAvailable === true,
        "Test 2b: ProfessionalProfile properly persisted in database with safe defaults"
      );
    }

    // -------------------------------------------------------------------------
    // Test 3: Duplicate email rejection
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 3: Duplicate email registration attempt...");
    const res3 = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Duplicate User",
        email: testCustomerEmail,
        password: testPassword,
        role: "CUSTOMER",
      }),
    });
    const body3 = (await res3.json()) as any;
    assert(
      res3.status === 409 && body3.error === "Conflict",
      "Test 3: Duplicate email returns HTTP 409 Conflict",
      `Status: ${res3.status}, Body: ${JSON.stringify(body3)}`
    );

    // -------------------------------------------------------------------------
    // Test 4: Invalid email format
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 4: Invalid email format...");
    const res4 = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Invalid Email User",
        email: "not-an-email",
        password: testPassword,
        role: "CUSTOMER",
      }),
    });
    const body4 = (await res4.json()) as any;
    assert(
      res4.status === 400 && body4.error === "Bad Request",
      "Test 4: Invalid email returns HTTP 400 Bad Request",
      `Status: ${res4.status}, Body: ${JSON.stringify(body4)}`
    );

    // -------------------------------------------------------------------------
    // Test 5: Missing required fields
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 5: Missing required fields...");
    const res5 = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: `missing.fields.${timestamp}@example.com`,
        // missing name, password, role
      }),
    });
    const body5 = (await res5.json()) as any;
    assert(
      res5.status === 400 && body5.error === "Bad Request",
      "Test 5: Missing required fields returns HTTP 400 Bad Request",
      `Status: ${res5.status}, Body: ${JSON.stringify(body5)}`
    );

    // -------------------------------------------------------------------------
    // Test 6: Weak password
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 6: Weak password rejection...");
    const res6 = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Weak Password User",
        email: `weak.${timestamp}@example.com`,
        password: "short",
        role: "CUSTOMER",
      }),
    });
    const body6 = (await res6.json()) as any;
    assert(
      res6.status === 400 && body6.error === "Bad Request",
      "Test 6: Weak password returns HTTP 400 Bad Request",
      `Status: ${res6.status}, Body: ${JSON.stringify(body6)}`
    );

    // -------------------------------------------------------------------------
    // Test 7: Attempted ADMIN registration rejection
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 7: Attempted ADMIN registration...");
    const res7 = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Admin Attempter",
        email: `admin.attempt.${timestamp}@example.com`,
        password: testPassword,
        role: "ADMIN",
      }),
    });
    const body7 = (await res7.json()) as any;
    assert(
      res7.status === 400 &&
        body7.error === "Bad Request" &&
        body7.message.includes("ADMIN"),
      "Test 7: Attempted ADMIN registration returns HTTP 400 Bad Request",
      `Status: ${res7.status}, Body: ${JSON.stringify(body7)}`
    );

    // -------------------------------------------------------------------------
    // Test 8: Confirming response never includes password hash or secrets
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 8: Confirming response never includes password hash...");
    const body1Str = JSON.stringify(body1);
    const body2Str = JSON.stringify(body2);
    assert(
      !body1Str.includes("passwordHash") &&
        !body1Str.includes(testPassword) &&
        !body2Str.includes("passwordHash") &&
        !body2Str.includes(testPassword),
      "Test 8: Neither response includes passwordHash or plain password"
    );

    // -------------------------------------------------------------------------
    // Test 9: Confirming passwords are stored as hashes in the database
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 9: Confirming passwords are stored as hashes in database...");
    if (createdCustomerUserId) {
      const dbUser = await prisma.user.findUnique({
        where: { id: createdCustomerUserId },
      });
      const isBcryptHash =
        dbUser !== null &&
        typeof dbUser.passwordHash === "string" &&
        dbUser.passwordHash.startsWith("$2");
      const isPlainPasswordDifferent = dbUser?.passwordHash !== testPassword;
      const bcryptVerified = dbUser
        ? await bcrypt.compare(testPassword, dbUser.passwordHash)
        : false;

      assert(
        isBcryptHash && isPlainPasswordDifferent && bcryptVerified,
        "Test 9: Database stores valid bcrypt hash matching the input password, never plaintext",
        `Hash prefix: ${dbUser?.passwordHash.slice(0, 10)}...`
      );
    }
  } finally {
    // -------------------------------------------------------------------------
    // Clean up test data
    // -------------------------------------------------------------------------
    console.log("\nCleaning up test records...");
    if (createdCustomerUserId) {
      await prisma.user.delete({ where: { id: createdCustomerUserId } }).catch(() => {});
    }
    if (createdProUserId) {
      await prisma.user.delete({ where: { id: createdProUserId } }).catch(() => {});
    }
    console.log("Cleanup complete.");

    // Close server and database pool
    server.close();
    await prisma.$disconnect();
  }

  console.log("\n==================================================");
  console.log(` Test Summary: ${passedCount} passed, ${failedCount} failed`);
  console.log("==================================================");

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Test runner encountered error:", err);
  process.exit(1);
});
