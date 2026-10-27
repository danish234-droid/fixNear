/**
 * apps/api/test_middleware.ts
 *
 * Automated verification test suite for FixNear Module 5, Part 3: Authentication Middleware.
 *
 * Verifies:
 *  1. Missing credentials are rejected with HTTP 401 Unauthorized
 *  2. Invalid or expired sessions/tokens are rejected with HTTP 401 Unauthorized
 *  3. Valid sessions (via cookie or Bearer header) access protected endpoints
 *  4. /api/auth/me returns only safe user information (never password hashes or secrets)
 *  5. A customer cannot read another customer's bookings (returns HTTP 403 Forbidden)
 *  6. Booking creation derives customer identity from authenticated user and rejects
 *     attempts to create bookings for another customer (returns HTTP 403 Forbidden)
 *  7. Public category, professional, and health endpoints remain accessible without credentials
 *  8. Logout continues to invalidate the session correctly
 *  9. Invalid authentication errors never leak internal details, stack traces, or secrets
 */

import http from "node:http";
import bcrypt from "bcrypt";
import { app } from "./src/app.js";
import { prisma } from "./src/lib/prisma.js";
import { signAccessToken } from "./src/lib/jwt.js";

process.env.NODE_ENV = "test";

async function runMiddlewareTests() {
  console.log("================================================================");
  console.log(" FixNear Module 5, Part 3: Authentication Middleware Test Suite");
  console.log("================================================================\n");

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 4000;
  const baseUrl = `http://127.0.0.1:${port}/api`;

  const timestamp = Date.now();
  const password = "TestPassword123!";

  let customerAId: string | null = null;
  let customerBId: string | null = null;
  let proUserId: string | null = null;
  let proServiceId: string | null = null;
  let createdBookingId: string | null = null;

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
    console.log("Setting up test records in database...");
    const passwordHash = await bcrypt.hash(password, 12);

    // 1. Create Customer A
    const customerA = await prisma.user.create({
      data: {
        name: "Customer Alpha",
        email: `cust.a.${timestamp}@example.com`,
        passwordHash,
        role: "CUSTOMER",
        tokenVersion: 0,
      },
    });
    customerAId = customerA.id;

    // 2. Create Customer B
    const customerB = await prisma.user.create({
      data: {
        name: "Customer Beta",
        email: `cust.b.${timestamp}@example.com`,
        passwordHash,
        role: "CUSTOMER",
        tokenVersion: 0,
      },
    });
    customerBId = customerB.id;

    // 3. Find or create a ServiceCategory
    let category = await prisma.serviceCategory.findFirst();
    if (!category) {
      category = await prisma.serviceCategory.create({
        data: {
          name: "Plumbing Test",
          slug: `plumbing-test-${timestamp}`,
          description: "Plumbing test category",
        },
      });
    }

    // 4. Create a Professional with ProfessionalProfile and ProfessionalService
    const proUser = await prisma.user.create({
      data: {
        name: "Pro Technician",
        email: `pro.${timestamp}@example.com`,
        passwordHash,
        role: "PROFESSIONAL",
        tokenVersion: 0,
        professionalProfile: {
          create: {
            city: "Lahore",
            businessName: "Alpha Plumbing",
            isAvailable: true,
            services: {
              create: {
                title: "Pipe Repair",
                description: "Fixing leaking pipes and joints",
                priceFrom: 1500,
                serviceCategoryId: category.id,
              },
            },
          },
        },
      },
      include: {
        professionalProfile: {
          include: {
            services: true,
          },
        },
      },
    });
    proUserId = proUser.id;
    proServiceId = proUser.professionalProfile!.services[0].id;

    console.log("Test records created successfully.\n");

    // Generate tokens for Customer A
    const customerAToken = await signAccessToken({
      sub: customerA.id,
      role: customerA.role,
      ver: customerA.tokenVersion,
    });
    const customerACookieHeader = `fixnear_auth=${customerAToken}`;

    // Generate tokens for Customer B
    const customerBToken = await signAccessToken({
      sub: customerB.id,
      role: customerB.role,
      ver: customerB.tokenVersion,
    });
    const customerBCookieHeader = `fixnear_auth=${customerBToken}`;

    // -------------------------------------------------------------------------
    // Test 1: Missing credentials are rejected with HTTP 401
    // -------------------------------------------------------------------------
    console.log("Running Test 1: Missing credentials rejection...");
    const res1a = await fetch(`${baseUrl}/auth/me`);
    const body1a = (await res1a.json()) as any;

    const res1b = await fetch(`${baseUrl}/bookings/customer/${customerAId}`);
    const body1b = (await res1b.json()) as any;

    const res1c = await fetch(`${baseUrl}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        professionalServiceId: proServiceId,
        address: "123 Main Street",
      }),
    });
    const body1c = (await res1c.json()) as any;

    assert(
      res1a.status === 401 && body1a.error === "Unauthorized",
      "Test 1a: GET /api/auth/me without credentials returns HTTP 401",
      JSON.stringify(body1a)
    );
    assert(
      res1b.status === 401 && body1b.error === "Unauthorized",
      "Test 1b: GET /api/bookings/customer/:id without credentials returns HTTP 401",
      JSON.stringify(body1b)
    );
    assert(
      res1c.status === 401 && body1c.error === "Unauthorized",
      "Test 1c: POST /api/bookings without credentials returns HTTP 401",
      JSON.stringify(body1c)
    );

    // -------------------------------------------------------------------------
    // Test 2: Invalid or expired sessions/tokens are rejected with HTTP 401
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 2: Invalid or malformed tokens rejection...");
    const res2Cookie = await fetch(`${baseUrl}/auth/me`, {
      headers: { Cookie: "fixnear_auth=invalid.malformed.jwt" },
    });
    const body2Cookie = (await res2Cookie.json()) as any;

    const res2Bearer = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: "Bearer totally-fake-token" },
    });
    const body2Bearer = (await res2Bearer.json()) as any;

    assert(
      res2Cookie.status === 401 && body2Cookie.error === "Unauthorized",
      "Test 2a: Invalid JWT in cookie returns HTTP 401",
      JSON.stringify(body2Cookie)
    );
    assert(
      res2Bearer.status === 401 && body2Bearer.error === "Unauthorized",
      "Test 2b: Invalid JWT in Authorization header returns HTTP 401",
      JSON.stringify(body2Bearer)
    );

    // -------------------------------------------------------------------------
    // Test 3: Valid sessions can access protected endpoints
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 3: Valid session access via cookie and Bearer...");
    const res3Cookie = await fetch(`${baseUrl}/auth/me`, {
      headers: { Cookie: customerACookieHeader },
    });
    const body3Cookie = (await res3Cookie.json()) as any;

    const res3Bearer = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${customerAToken}` },
    });
    const body3Bearer = (await res3Bearer.json()) as any;

    assert(
      res3Cookie.status === 200 && body3Cookie.data?.id === customerAId,
      "Test 3a: Valid cookie session successfully accesses /api/auth/me",
      JSON.stringify(body3Cookie)
    );
    assert(
      res3Bearer.status === 200 && body3Bearer.data?.id === customerAId,
      "Test 3b: Valid Bearer token successfully accesses /api/auth/me",
      JSON.stringify(body3Bearer)
    );

    // -------------------------------------------------------------------------
    // Test 4: /api/auth/me returns only safe user information
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 4: /api/auth/me response data sanitization...");
    const body3Str = JSON.stringify(body3Cookie);
    assert(
      !body3Str.includes("passwordHash") &&
        !body3Str.includes("tokenVersion") &&
        !body3Str.includes(password),
      "Test 4: /api/auth/me returns only safe user data, never passwordHash or tokenVersion"
    );

    // -------------------------------------------------------------------------
    // Test 5: A customer cannot read another customer's bookings (403 Forbidden)
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 5: Booking customer ownership enforcement...");
    // Customer A attempts to access Customer B's bookings
    const res5Other = await fetch(`${baseUrl}/bookings/customer/${customerBId}`, {
      headers: { Cookie: customerACookieHeader },
    });
    const body5Other = (await res5Other.json()) as any;

    assert(
      res5Other.status === 403 &&
        body5Other.error === "Forbidden" &&
        body5Other.message.includes("permission"),
      "Test 5a: Customer A attempting to read Customer B's bookings returns HTTP 403 Forbidden",
      `Status: ${res5Other.status}, Body: ${JSON.stringify(body5Other)}`
    );

    // Customer A accesses their own bookings
    const res5Own = await fetch(`${baseUrl}/bookings/customer/${customerAId}`, {
      headers: { Cookie: customerACookieHeader },
    });
    const body5Own = (await res5Own.json()) as any;

    assert(
      res5Own.status === 200 && Array.isArray(body5Own.data),
      "Test 5b: Customer A accessing their own bookings returns HTTP 200 OK",
      JSON.stringify(body5Own)
    );

    // -------------------------------------------------------------------------
    // Test 6: Booking creation uses authenticated user's identity
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 6: Booking creation identity enforcement...");
    // 6a: Attempt to create booking with spoofed customerId (Customer A provides Customer B's ID)
    const res6Spoofed = await fetch(`${baseUrl}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: customerACookieHeader,
      },
      body: JSON.stringify({
        customerId: customerBId,
        professionalServiceId: proServiceId,
        address: "456 Spoofed Lane",
      }),
    });
    const body6Spoofed = (await res6Spoofed.json()) as any;

    assert(
      res6Spoofed.status === 403 &&
        body6Spoofed.error === "Forbidden" &&
        body6Spoofed.message.includes("another user"),
      "Test 6a: Attempt to create booking for another customer is rejected with HTTP 403 Forbidden",
      `Status: ${res6Spoofed.status}, Body: ${JSON.stringify(body6Spoofed)}`
    );

    // 6b: Legitimate creation (customerId omitted or matching authenticated user)
    const res6Valid = await fetch(`${baseUrl}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: customerACookieHeader,
      },
      body: JSON.stringify({
        professionalServiceId: proServiceId,
        address: "789 Pine Road, Lahore",
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        description: "Need quick pipe maintenance",
      }),
    });
    const body6Valid = (await res6Valid.json()) as any;

    assert(
      res6Valid.status === 201 &&
        body6Valid.data?.id !== undefined &&
        body6Valid.data?.customerId === customerAId,
      "Test 6b: Booking creation derives customerId strictly from authenticated user (HTTP 201)",
      JSON.stringify(body6Valid)
    );
    if (body6Valid.data?.id) {
      createdBookingId = body6Valid.data.id;
    }

    // Verify Customer A can now see the newly created booking
    const res6Check = await fetch(`${baseUrl}/bookings/customer/${customerAId}`, {
      headers: { Cookie: customerACookieHeader },
    });
    const body6Check = (await res6Check.json()) as any;
    assert(
      res6Check.status === 200 &&
        body6Check.data.some((b: any) => b.id === createdBookingId),
      "Test 6c: Newly created booking appears in Customer A's booking list"
    );

    // -------------------------------------------------------------------------
    // Test 7: Public endpoints remain accessible without credentials
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 7: Public endpoint availability...");
    const res7Health = await fetch(`${baseUrl}/health`);
    const body7Health = (await res7Health.json()) as any;

    const res7Categories = await fetch(`${baseUrl}/categories`);
    const body7Categories = (await res7Categories.json()) as any;

    const res7Pros = await fetch(`${baseUrl}/professionals`);
    const body7Pros = (await res7Pros.json()) as any;

    assert(
      res7Health.status === 200 && body7Health.status === "ok",
      "Test 7a: GET /api/health is publicly accessible",
      JSON.stringify(body7Health)
    );
    assert(
      res7Categories.status === 200 && Array.isArray(body7Categories.data),
      "Test 7b: GET /api/categories is publicly accessible",
      `Categories count: ${body7Categories.data?.length}`
    );
    assert(
      res7Pros.status === 200 && Array.isArray(body7Pros.data),
      "Test 7c: GET /api/professionals is publicly accessible",
      `Pros count: ${body7Pros.data?.length}`
    );

    // -------------------------------------------------------------------------
    // Test 8: Logout continues to work correctly
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 8: Logout functionality and invalidation...");
    const res8Logout = await fetch(`${baseUrl}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Requested": "1",
        Cookie: customerACookieHeader,
      },
    });
    const setCookie8 = res8Logout.headers.get("set-cookie") || "";

    assert(
      res8Logout.status === 200 &&
        (setCookie8.includes("fixnear_auth=;") || setCookie8.includes("Max-Age=0")),
      "Test 8a: POST /api/auth/logout succeeds and clears the authentication cookie",
      `Set-Cookie: ${setCookie8}`
    );

    // After logout, Customer A's old token must be rejected because tokenVersion incremented
    const res8After = await fetch(`${baseUrl}/auth/me`, {
      headers: { Cookie: customerACookieHeader },
    });
    const body8After = (await res8After.json()) as any;

    assert(
      res8After.status === 401 && body8After.error === "Unauthorized",
      "Test 8b: Old token rejected with HTTP 401 after logout due to tokenVersion increment",
      JSON.stringify(body8After)
    );

    // -------------------------------------------------------------------------
    // Test 9: Invalid authentication does not leak internal errors or secrets
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 9: Error safety and information leakage audit...");
    const errorResponses = [
      JSON.stringify(body1a),
      JSON.stringify(body1b),
      JSON.stringify(body1c),
      JSON.stringify(body2Cookie),
      JSON.stringify(body2Bearer),
      JSON.stringify(body5Other),
      JSON.stringify(body6Spoofed),
      JSON.stringify(body8After),
    ].join(" ");

    assert(
      !errorResponses.includes("stack") &&
        !errorResponses.includes("node_modules") &&
        !errorResponses.includes("PrismaClient") &&
        !errorResponses.includes("passwordHash") &&
        !errorResponses.includes("JWT_SECRET"),
      "Test 9: Error responses contain only safe public messages without stack traces, database internals, or secrets"
    );
  } finally {
    console.log("\nCleaning up test records from database...");
    if (createdBookingId) {
      await prisma.booking.delete({ where: { id: createdBookingId } }).catch(() => {});
    }
    if (proUserId) {
      await prisma.user.delete({ where: { id: proUserId } }).catch(() => {});
    }
    if (customerAId) {
      await prisma.user.delete({ where: { id: customerAId } }).catch(() => {});
    }
    if (customerBId) {
      await prisma.user.delete({ where: { id: customerBId } }).catch(() => {});
    }
    console.log("Cleanup complete.");

    server.close();
    await prisma.$disconnect();
  }

  console.log("\n================================================================");
  console.log(` Test Summary: ${passedCount} passed, ${failedCount} failed`);
  console.log("================================================================");

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runMiddlewareTests().catch((err) => {
  console.error("Test runner encountered error:", err);
  process.exit(1);
});
