/**
 * apps/api/test_auth.ts
 *
 * Automated test suite for FixNear Module 5, Part 2: Login and Secure Sessions.
 *
 * Covers:
 *  1. Successful login (returns 200, safe user, HttpOnly cookie)
 *  2. Incorrect password (returns 401 with generic message)
 *  3. Unknown email (returns 401 with identical generic message — no enumeration)
 *  4. Missing or malformed fields (returns 400 Bad Request)
 *  5. Successful /api/auth/me with valid session cookie (returns 200 + safe profile)
 *  6. /api/auth/me without authentication (returns 401 Unauthorized)
 *  7. Successful logout and session invalidation (cookie cleared, subsequent /me returns 401)
 *  8. Cookie security attributes and CORS configuration (HttpOnly, SameSite=Lax, credentials)
 *  9. CSRF protection on state-changing logout (requires X-CSRF-Requested header, 403 otherwise)
 * 10. Security audit: responses never expose password hashes or secrets
 */

import http from "node:http";
import bcrypt from "bcrypt";
import { app } from "./src/app.js";
import { prisma } from "./src/lib/prisma.js";

process.env.NODE_ENV = "test";

async function runAuthTests() {
  console.log("================================================================");
  console.log(" FixNear Module 5, Part 2: Login & Secure Sessions Test Suite");
  console.log("================================================================\n");

  // Start Express on an ephemeral port
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 4000;
  const baseUrl = `http://127.0.0.1:${port}/api/auth`;

  const timestamp = Date.now();
  const testCustomerEmail = `login.customer.${timestamp}@example.com`;
  const testProEmail = `login.pro.${timestamp}@example.com`;
  const testPassword = "SecureLoginPass123!";
  const wrongPassword = "WrongPassword999!";

  let customerUserId: string | null = null;
  let proUserId: string | null = null;

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
    // Setup: Create test customer and professional users in DB with bcrypt hash
    // -------------------------------------------------------------------------
    console.log("Setting up test users in database...");
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(testPassword, saltRounds);

    const customerUser = await prisma.user.create({
      data: {
        name: "Test Customer User",
        email: testCustomerEmail,
        passwordHash,
        role: "CUSTOMER",
        tokenVersion: 0,
      },
    });
    customerUserId = customerUser.id;

    const proUser = await prisma.user.create({
      data: {
        name: "Test Professional User",
        email: testProEmail,
        passwordHash,
        role: "PROFESSIONAL",
        tokenVersion: 0,
        professionalProfile: {
          create: {
            city: "Lahore",
            businessName: "Elite Repairs",
            isAvailable: true,
          },
        },
      },
    });
    proUserId = proUser.id;
    console.log("Test users created successfully.\n");

    // -------------------------------------------------------------------------
    // Test 1: Successful login
    // -------------------------------------------------------------------------
    console.log("Running Test 1: Successful login...");
    const res1 = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testCustomerEmail,
        password: testPassword,
      }),
    });

    const body1 = (await res1.json()) as any;
    const setCookie1 = res1.headers.get("set-cookie") || "";

    assert(
      res1.status === 200 &&
        body1.status === 200 &&
        body1.data?.email === testCustomerEmail &&
        body1.data?.role === "CUSTOMER" &&
        body1.data?.id === customerUserId,
      "Test 1: Successful login returns HTTP 200 with safe user data",
      JSON.stringify(body1)
    );

    assert(
      setCookie1.includes("fixnear_auth=") &&
        setCookie1.toLowerCase().includes("httponly") &&
        setCookie1.toLowerCase().includes("samesite=lax"),
      "Test 1b: Login sets HttpOnly; SameSite=Lax authentication cookie",
      `Set-Cookie: ${setCookie1}`
    );

    // Extract cookie value for subsequent tests
    const cookieMatch = setCookie1.match(/fixnear_auth=([^;]+)/);
    const authCookieHeader = cookieMatch ? `fixnear_auth=${cookieMatch[1]}` : "";

    // -------------------------------------------------------------------------
    // Test 2: Incorrect password
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 2: Incorrect password...");
    const res2 = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testCustomerEmail,
        password: wrongPassword,
      }),
    });
    const body2 = (await res2.json()) as any;

    assert(
      res2.status === 401 &&
        body2.error === "Unauthorized" &&
        body2.message === "Invalid email or password.",
      "Test 2: Incorrect password returns HTTP 401 with generic error message",
      JSON.stringify(body2)
    );

    // -------------------------------------------------------------------------
    // Test 3: Unknown email
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 3: Unknown email (no enumeration)...");
    const res3 = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: `nonexistent.${timestamp}@example.com`,
        password: testPassword,
      }),
    });
    const body3 = (await res3.json()) as any;

    assert(
      res3.status === 401 &&
        body3.error === "Unauthorized" &&
        body3.message === "Invalid email or password.",
      "Test 3: Unknown email returns identical HTTP 401 generic message without enumeration",
      JSON.stringify(body3)
    );

    // -------------------------------------------------------------------------
    // Test 4: Missing or malformed fields
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 4: Missing or malformed input...");
    const res4a = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "not-an-email",
        password: testPassword,
      }),
    });
    const body4a = (await res4a.json()) as any;

    const res4b = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testCustomerEmail,
      }),
    });
    const body4b = (await res4b.json()) as any;

    assert(
      res4a.status === 400 &&
        res4b.status === 400 &&
        body4a.error === "Bad Request" &&
        body4b.error === "Bad Request",
      "Test 4: Malformed email or missing password returns HTTP 400 Bad Request",
      `4a: ${JSON.stringify(body4a)}, 4b: ${JSON.stringify(body4b)}`
    );

    // -------------------------------------------------------------------------
    // Test 5: Successful /api/auth/me with valid session cookie
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 5: GET /api/auth/me with valid session...");
    const res5 = await fetch(`${baseUrl}/me`, {
      method: "GET",
      headers: {
        Cookie: authCookieHeader,
      },
    });
    const body5 = (await res5.json()) as any;

    assert(
      res5.status === 200 &&
        body5.status === 200 &&
        body5.data?.id === customerUserId &&
        body5.data?.email === testCustomerEmail &&
        body5.data?.role === "CUSTOMER",
      "Test 5: /api/auth/me with valid cookie returns HTTP 200 with authenticated user profile",
      JSON.stringify(body5)
    );

    // Also test professional user login & /me
    const res5ProLogin = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testProEmail,
        password: testPassword,
      }),
    });
    const setCookiePro = res5ProLogin.headers.get("set-cookie") || "";
    const cookieMatchPro = setCookiePro.match(/fixnear_auth=([^;]+)/);
    const authCookieHeaderPro = cookieMatchPro ? `fixnear_auth=${cookieMatchPro[1]}` : "";

    const res5ProMe = await fetch(`${baseUrl}/me`, {
      method: "GET",
      headers: { Cookie: authCookieHeaderPro },
    });
    const body5Pro = (await res5ProMe.json()) as any;

    assert(
      res5ProMe.status === 200 &&
        body5Pro.data?.role === "PROFESSIONAL" &&
        body5Pro.data?.professionalProfile?.city === "Lahore",
      "Test 5b: Professional user session returns professional profile in /me",
      JSON.stringify(body5Pro)
    );

    // -------------------------------------------------------------------------
    // Test 6: /api/auth/me without authentication returns 401
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 6: GET /api/auth/me without cookie...");
    const res6 = await fetch(`${baseUrl}/me`, {
      method: "GET",
    });
    const body6 = (await res6.json()) as any;

    assert(
      res6.status === 401 && body6.error === "Unauthorized",
      "Test 6: /api/auth/me without cookie returns HTTP 401 Unauthorized",
      JSON.stringify(body6)
    );

    // -------------------------------------------------------------------------
    // Test 7: Successful logout and subsequent session invalidation
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 7: POST /api/auth/logout and session invalidation...");
    const res7 = await fetch(`${baseUrl}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Requested": "1",
        Cookie: authCookieHeader,
      },
    });
    const body7 = (await res7.json()) as any;
    const setCookie7 = res7.headers.get("set-cookie") || "";

    assert(
      res7.status === 200 && body7.message === "Logged out successfully.",
      "Test 7a: POST /api/auth/logout returns HTTP 200 success",
      JSON.stringify(body7)
    );

    assert(
      setCookie7.includes("fixnear_auth=;") || setCookie7.includes("Max-Age=0"),
      "Test 7b: Logout response clears the authentication cookie",
      `Set-Cookie: ${setCookie7}`
    );

    // Now attempt to use the previous cookie on /me — must be rejected (tokenVersion incremented)
    const res7After = await fetch(`${baseUrl}/me`, {
      method: "GET",
      headers: { Cookie: authCookieHeader },
    });
    const body7After = (await res7After.json()) as any;

    assert(
      res7After.status === 401 && body7After.error === "Unauthorized",
      "Test 7c: Invalidation check: old cookie is rejected with HTTP 401 after logout",
      `Status: ${res7After.status}, Body: ${JSON.stringify(body7After)}`
    );

    // -------------------------------------------------------------------------
    // Test 8: Cookie security attributes and CORS configuration
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 8: Cookie attributes and CORS checks...");
    // Check CORS with allowed origin
    const corsRes = await fetch(`${baseUrl}/login`, {
      method: "OPTIONS",
      headers: {
        Origin: "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
      },
    });

    const acao = corsRes.headers.get("access-control-allow-origin");
    const acac = corsRes.headers.get("access-control-allow-credentials");

    assert(
      acao === "http://localhost:3000" && acac === "true",
      "Test 8a: CORS config allows credentials with specific trusted origin, never wildcard",
      `Origin: ${acao}, Credentials: ${acac}`
    );

    // Check Set-Cookie attributes on login
    assert(
      setCookie1.toLowerCase().includes("httponly") &&
        setCookie1.toLowerCase().includes("samesite=lax") &&
        setCookie1.toLowerCase().includes("path=/"),
      "Test 8b: Cookie attributes include HttpOnly, SameSite=Lax, and Path=/",
      setCookie1
    );

    // -------------------------------------------------------------------------
    // Test 9: CSRF protection on state-changing logout
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 9: CSRF protection on logout...");
    // Create a fresh session for this test
    const loginResForCsrf = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testProEmail,
        password: testPassword,
      }),
    });
    const proCookieHeader =
      loginResForCsrf.headers.get("set-cookie")?.match(/fixnear_auth=([^;]+)/)?.[0] || "";

    // Attempt logout WITHOUT the X-CSRF-Requested header
    const res9NoCsrf = await fetch(`${baseUrl}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: proCookieHeader,
        // intentionally omitting X-CSRF-Requested
      },
    });
    const body9NoCsrf = (await res9NoCsrf.json()) as any;

    assert(
      res9NoCsrf.status === 403 &&
        body9NoCsrf.error === "Forbidden" &&
        body9NoCsrf.message.includes("CSRF"),
      "Test 9: Logout without X-CSRF-Requested header is blocked with HTTP 403 Forbidden",
      `Status: ${res9NoCsrf.status}, Body: ${JSON.stringify(body9NoCsrf)}`
    );

    // -------------------------------------------------------------------------
    // Test 10: Security audit: responses never expose password hashes or secrets
    // -------------------------------------------------------------------------
    console.log("\nRunning Test 10: Security leak audit across all responses...");
    const allResponsesStr = [
      JSON.stringify(body1),
      JSON.stringify(body2),
      JSON.stringify(body3),
      JSON.stringify(body4a),
      JSON.stringify(body5),
      JSON.stringify(body5Pro),
      JSON.stringify(body7),
    ].join(" ");

    assert(
      !allResponsesStr.includes("passwordHash") &&
        !allResponsesStr.includes(testPassword) &&
        !allResponsesStr.includes("tokenVersion") &&
        !allResponsesStr.includes("JWT_SECRET"),
      "Test 10: No response exposes passwordHash, plaintext password, tokenVersion, or JWT_SECRET"
    );
  } finally {
    // -------------------------------------------------------------------------
    // Cleanup: Delete test user records from PostgreSQL
    // -------------------------------------------------------------------------
    console.log("\nCleaning up test records from database...");
    if (customerUserId) {
      await prisma.user.delete({ where: { id: customerUserId } }).catch(() => {});
    }
    if (proUserId) {
      await prisma.user.delete({ where: { id: proUserId } }).catch(() => {});
    }
    console.log("Cleanup complete.");

    // Close server and database connection
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

runAuthTests().catch((err) => {
  console.error("Test runner encountered error:", err);
  process.exit(1);
});
