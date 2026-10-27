/**
 * apps/api/test_authorization.ts
 *
 * Comprehensive Automated Security & Authorization Test Suite
 * Covering all 24 required verification scenarios for FixNear Module 5, Parts 4 & 5.
 */

import http from "node:http";
import bcrypt from "bcrypt";
import { app } from "./src/app.js";
import { prisma } from "./src/lib/prisma.js";
import { signAccessToken } from "./src/lib/jwt.js";

process.env.NODE_ENV = "test";

async function runAuthorizationTests() {
  console.log("=======================================================================");
  console.log(" FixNear Module 5, Parts 4 & 5: Security & Authorization Test Suite");
  console.log("=======================================================================\n");

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 4000;
  const baseUrl = `http://127.0.0.1:${port}/api`;

  const timestamp = Date.now();
  const testPassword = "SecurePass123!";
  let passedCount = 0;
  let failedCount = 0;

  function assert(condition: boolean, num: number, description: string, detail?: string) {
    if (condition) {
      console.log(`✅ [${num}/24] PASS: ${description}`);
      passedCount++;
    } else {
      console.error(`❌ [${num}/24] FAIL: ${description}${detail ? ` - ${detail}` : ""}`);
      failedCount++;
    }
  }

  // Helper for making requests with cookies
  async function request(
    path: string,
    options: {
      method?: string;
      headers?: Record<string, string>;
      body?: any;
      cookie?: string;
    } = {}
  ): Promise<{ status: number; headers: Headers; body: any }> {
    const headers: Record<string, string> = {
      ...(options.headers || {}),
    };
    if (options.cookie) {
      headers["Cookie"] = options.cookie;
    }
    if (options.body && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${baseUrl}${path}`, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const text = await res.text();
    let body: any = null;
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }

    return { status: res.status, headers: res.headers, body };
  }

  function extractCookie(headers: Headers): string | undefined {
    const setCookie = headers.get("set-cookie");
    if (!setCookie) return undefined;
    return setCookie.split(";")[0];
  }

  let customer1Id = "";
  let customer1Cookie = "";
  let customer2Id = "";
  let customer2Cookie = "";
  let pro1Id = "";
  let pro1Cookie = "";
  let pro1ProfileId = "";
  let pro1ServiceId = "";
  let pro2Id = "";
  let pro2Cookie = "";
  let pro2ProfileId = "";
  let adminId = "";
  let adminCookie = "";
  let booking1Id = "";

  try {
    // ------------------------------------------------------------------------
    // SCENARIO 1: Customer registration creates a CUSTOMER user
    // ------------------------------------------------------------------------
    const cust1Email = `cust1_${timestamp}@example.com`;
    const regCust1 = await request("/auth/register", {
      method: "POST",
      body: {
        name: "Test Customer 1",
        email: cust1Email,
        password: testPassword,
        role: "CUSTOMER",
        phone: "555-0101",
      },
    });
    customer1Id = regCust1.body?.data?.id;
    assert(
      regCust1.status === 201 &&
        regCust1.body?.data?.role === "CUSTOMER" &&
        regCust1.body?.data?.email === cust1Email &&
        regCust1.body?.data?.passwordHash === undefined,
      1,
      "Customer registration creates a CUSTOMER user"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 2: Professional registration creates a PROFESSIONAL user with profile
    // ------------------------------------------------------------------------
    const pro1Email = `pro1_${timestamp}@example.com`;
    const regPro1 = await request("/auth/register", {
      method: "POST",
      body: {
        name: "Test Professional 1",
        email: pro1Email,
        password: testPassword,
        role: "PROFESSIONAL",
        city: "Seattle",
        businessName: "Pro 1 Plumbing",
      },
    });
    pro1Id = regPro1.body?.data?.id;
    pro1ProfileId = regPro1.body?.data?.professionalProfile?.id;
    assert(
      regPro1.status === 201 &&
        regPro1.body?.data?.role === "PROFESSIONAL" &&
        regPro1.body?.data?.professionalProfile?.city === "Seattle" &&
        regPro1.body?.data?.professionalProfile?.businessName === "Pro 1 Plumbing",
      2,
      "Professional registration creates a PROFESSIONAL user with profile"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 3: Admin cannot be registered via registration endpoint
    // ------------------------------------------------------------------------
    const regAdminAttempt = await request("/auth/register", {
      method: "POST",
      body: {
        name: "Hacker Admin",
        email: `hacker_${timestamp}@example.com`,
        password: testPassword,
        role: "ADMIN",
      },
    });
    assert(
      regAdminAttempt.status === 400,
      3,
      "Admin cannot be registered via registration endpoint (rejected with 400)"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 4: Duplicate email registration is rejected (409 Conflict)
    // ------------------------------------------------------------------------
    const regDup = await request("/auth/register", {
      method: "POST",
      body: {
        name: "Duplicate User",
        email: cust1Email,
        password: testPassword,
        role: "CUSTOMER",
      },
    });
    assert(
      regDup.status === 409,
      4,
      "Duplicate email registration is rejected (409 Conflict)"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 5: Registration validation rejects invalid inputs
    // ------------------------------------------------------------------------
    const regShortPass = await request("/auth/register", {
      method: "POST",
      body: {
        name: "Short Pass",
        email: `shortpass_${timestamp}@example.com`,
        password: "short",
        role: "CUSTOMER",
      },
    });
    const regBadEmail = await request("/auth/register", {
      method: "POST",
      body: {
        name: "Bad Email",
        email: "not-an-email",
        password: testPassword,
        role: "CUSTOMER",
      },
    });
    assert(
      regShortPass.status === 400 && regBadEmail.status === 400,
      5,
      "Registration validation rejects short password and invalid email (400)"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 6: Customer login succeeds with correct credentials, sets HttpOnly cookie
    // ------------------------------------------------------------------------
    const loginCust1 = await request("/auth/login", {
      method: "POST",
      body: { email: cust1Email, password: testPassword },
    });
    customer1Cookie = extractCookie(loginCust1.headers) || "";
    const setCookieHeader1 = loginCust1.headers.get("set-cookie") || "";
    assert(
      loginCust1.status === 200 &&
        setCookieHeader1.toLowerCase().includes("httponly") &&
        loginCust1.body?.data?.role === "CUSTOMER",
      6,
      "Customer login succeeds with correct credentials and sets HttpOnly cookie"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 7: Professional login succeeds with correct credentials, sets HttpOnly cookie
    // ------------------------------------------------------------------------
    const loginPro1 = await request("/auth/login", {
      method: "POST",
      body: { email: pro1Email, password: testPassword },
    });
    pro1Cookie = extractCookie(loginPro1.headers) || "";
    const setCookieHeaderPro = loginPro1.headers.get("set-cookie") || "";
    assert(
      loginPro1.status === 200 &&
        setCookieHeaderPro.toLowerCase().includes("httponly") &&
        loginPro1.body?.data?.role === "PROFESSIONAL",
      7,
      "Professional login succeeds with correct credentials and sets HttpOnly cookie"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 8: Login fails with invalid password (401 Unauthorized, generic message)
    // ------------------------------------------------------------------------
    const loginWrongPass = await request("/auth/login", {
      method: "POST",
      body: { email: cust1Email, password: "WrongPassword999!" },
    });
    assert(
      loginWrongPass.status === 401 &&
        loginWrongPass.body?.message?.toLowerCase().includes("invalid"),
      8,
      "Login fails with invalid password (401 Unauthorized, generic error message)"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 9: Login fails with non-existent email (401 Unauthorized, generic message)
    // ------------------------------------------------------------------------
    const loginWrongEmail = await request("/auth/login", {
      method: "POST",
      body: { email: `nonexistent_${timestamp}@example.com`, password: testPassword },
    });
    assert(
      loginWrongEmail.status === 401 &&
        loginWrongEmail.body?.message?.toLowerCase().includes("invalid"),
      9,
      "Login fails with non-existent email (401 Unauthorized, generic error message)"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 10: Unauthenticated request to protected endpoints returns 401
    // ------------------------------------------------------------------------
    const unauthCustomer = await request(`/bookings/customer/${customer1Id}`);
    const unauthAdmin = await request("/admin/overview");
    assert(
      unauthCustomer.status === 401 && unauthAdmin.status === 401,
      10,
      "Unauthenticated request to protected endpoints returns 401 Unauthorized"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 11: Valid session allows access to protected endpoints
    // ------------------------------------------------------------------------
    const meRes = await request("/auth/me", { cookie: customer1Cookie });
    assert(
      meRes.status === 200 && meRes.body?.data?.id === customer1Id,
      11,
      "Valid session allows access to protected endpoints (/api/auth/me)"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 12: Customer accessing admin-only endpoint returns 403 Forbidden
    // ------------------------------------------------------------------------
    const custAccessAdmin = await request("/admin/overview", { cookie: customer1Cookie });
    assert(
      custAccessAdmin.status === 403,
      12,
      "Customer accessing admin-only endpoint returns 403 Forbidden"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 13: Customer accessing professional-only endpoint returns 403 Forbidden
    // ------------------------------------------------------------------------
    const custAccessPro = await request("/bookings/professional", { cookie: customer1Cookie });
    assert(
      custAccessPro.status === 403,
      13,
      "Customer accessing professional-only endpoint returns 403 Forbidden"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 14: Professional accessing customer-only endpoint returns 403 Forbidden
    // ------------------------------------------------------------------------
    const proAccessBookingCreate = await request("/bookings", {
      method: "POST",
      cookie: pro1Cookie,
      body: {
        professionalServiceId: "any-service-id",
        address: "123 Main St",
      },
    });
    assert(
      proAccessBookingCreate.status === 403,
      14,
      "Professional accessing customer booking creation returns 403 Forbidden"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 15: Professional accessing admin-only endpoint returns 403 Forbidden
    // ------------------------------------------------------------------------
    const proAccessAdmin = await request("/admin/overview", { cookie: pro1Cookie });
    assert(
      proAccessAdmin.status === 403,
      15,
      "Professional accessing admin-only endpoint returns 403 Forbidden"
    );

    // ------------------------------------------------------------------------
    // Set up Admin, Category, Service & Secondary Fixtures
    // ------------------------------------------------------------------------
    const adminHash = await bcrypt.hash(testPassword, 12);
    const adminUser = await prisma.user.create({
      data: {
        name: "Platform Administrator",
        email: `admin_${timestamp}@example.com`,
        passwordHash: adminHash,
        role: "ADMIN",
        tokenVersion: 0,
      },
    });
    adminId = adminUser.id;
    const loginAdmin = await request("/auth/login", {
      method: "POST",
      body: { email: adminUser.email, password: testPassword },
    });
    adminCookie = extractCookie(loginAdmin.headers) || "";

    // Register Customer 2
    const cust2Email = `cust2_${timestamp}@example.com`;
    const regCust2 = await request("/auth/register", {
      method: "POST",
      body: {
        name: "Test Customer 2",
        email: cust2Email,
        password: testPassword,
        role: "CUSTOMER",
      },
    });
    customer2Id = regCust2.body?.data?.id;
    const loginCust2 = await request("/auth/login", {
      method: "POST",
      body: { email: cust2Email, password: testPassword },
    });
    customer2Cookie = extractCookie(loginCust2.headers) || "";

    // Register Pro 2
    const pro2Email = `pro2_${timestamp}@example.com`;
    const regPro2 = await request("/auth/register", {
      method: "POST",
      body: {
        name: "Test Professional 2",
        email: pro2Email,
        password: testPassword,
        role: "PROFESSIONAL",
        city: "Portland",
        businessName: "Pro 2 Electrical",
      },
    });
    pro2Id = regPro2.body?.data?.id;
    pro2ProfileId = regPro2.body?.data?.professionalProfile?.id;
    const loginPro2 = await request("/auth/login", {
      method: "POST",
      body: { email: pro2Email, password: testPassword },
    });
    pro2Cookie = extractCookie(loginPro2.headers) || "";

    // Ensure Category exists
    let cat = await prisma.serviceCategory.findFirst();
    if (!cat) {
      cat = await prisma.serviceCategory.create({
        data: {
          name: "Plumbing Category",
          slug: `plumbing-${timestamp}`,
          description: "Plumbing services",
        },
      });
    }

    // Pro 1 creates a service
    const pro1ServRes = await request("/professionals/services", {
      method: "POST",
      cookie: pro1Cookie,
      body: {
        serviceCategoryId: cat.id,
        title: "Standard Plumbing Inspection",
        description: "Inspection and leak detection",
        priceFrom: 120,
      },
    });
    pro1ServiceId = pro1ServRes.body?.data?.id;

    // Customer 1 books Pro 1's service
    const createBookingRes = await request("/bookings", {
      method: "POST",
      cookie: customer1Cookie,
      body: {
        professionalServiceId: pro1ServiceId,
        address: "742 Evergreen Terrace",
        description: "Faucet leaking",
      },
    });
    booking1Id = createBookingRes.body?.data?.id;

    // ------------------------------------------------------------------------
    // SCENARIO 16: Admin can access admin-only endpoints
    // ------------------------------------------------------------------------
    const adminOverviewRes = await request("/admin/overview", { cookie: adminCookie });
    const adminUsersRes = await request("/admin/users", { cookie: adminCookie });
    assert(
      adminOverviewRes.status === 200 &&
        adminUsersRes.status === 200 &&
        Array.isArray(adminUsersRes.body?.data),
      16,
      "Admin can access admin-only endpoints (/api/admin/overview and /api/admin/users)"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 17: Customer can only access their own bookings (403 on other customer's)
    // ------------------------------------------------------------------------
    const cust1AccessCust2Bookings = await request(`/bookings/customer/${customer2Id}`, {
      cookie: customer1Cookie,
    });
    const cust1AccessOwnBookings = await request(`/bookings/customer/${customer1Id}`, {
      cookie: customer1Cookie,
    });
    assert(
      cust1AccessCust2Bookings.status === 403 &&
        cust1AccessOwnBookings.status === 200 &&
        cust1AccessOwnBookings.body?.data?.length >= 1,
      17,
      "Customer can only access their own bookings (403 Forbidden on another customer's bookings)"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 18: Professional can only access their own assigned bookings
    // ------------------------------------------------------------------------
    const pro1Bookings = await request("/bookings/professional", { cookie: pro1Cookie });
    const pro2Bookings = await request("/bookings/professional", { cookie: pro2Cookie });
    assert(
      pro1Bookings.status === 200 &&
        pro1Bookings.body?.data?.some((b: any) => b.id === booking1Id) &&
        pro2Bookings.status === 200 &&
        !pro2Bookings.body?.data?.some((b: any) => b.id === booking1Id),
      18,
      "Professional can only access their own assigned bookings"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 19: Professional can only accept/reject bookings for their services
    // ------------------------------------------------------------------------
    const pro2UpdateBooking1 = await request(`/bookings/${booking1Id}/status`, {
      method: "PATCH",
      cookie: pro2Cookie,
      body: { status: "ACCEPTED" },
    });
    const pro1UpdateBooking1 = await request(`/bookings/${booking1Id}/status`, {
      method: "PATCH",
      cookie: pro1Cookie,
      body: { status: "ACCEPTED" },
    });
    assert(
      pro2UpdateBooking1.status === 403 &&
        pro1UpdateBooking1.status === 200 &&
        pro1UpdateBooking1.body?.data?.status === "ACCEPTED",
      19,
      "Professional can only accept/reject bookings for their own services (403 for unauthorized pro)"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 20: Customer cannot accept/reject bookings (403 Forbidden)
    // ------------------------------------------------------------------------
    const custUpdateBookingStatus = await request(`/bookings/${booking1Id}/status`, {
      method: "PATCH",
      cookie: customer1Cookie,
      body: { status: "REJECTED" },
    });
    assert(
      custUpdateBookingStatus.status === 403,
      20,
      "Customer cannot accept/reject bookings (403 Forbidden)"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 21: Professional can only update their own profile and services
    // ------------------------------------------------------------------------
    const pro2EditPro1Service = await request(`/professionals/services/${pro1ServiceId}`, {
      method: "PATCH",
      cookie: pro2Cookie,
      body: { title: "Hijacked Title" },
    });
    const pro1EditPro1Service = await request(`/professionals/services/${pro1ServiceId}`, {
      method: "PATCH",
      cookie: pro1Cookie,
      body: { title: "Updated Inspection Title" },
    });
    assert(
      pro2EditPro1Service.status === 403 &&
        pro1EditPro1Service.status === 200 &&
        pro1EditPro1Service.body?.data?.title === "Updated Inspection Title",
      21,
      "Professional can only update their own profile and services (403 for other pro)"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 22: Tampered or expired token returns 401 Unauthorized
    // ------------------------------------------------------------------------
    const tamperedRes = await request("/auth/me", {
      headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.token",
      },
    });
    assert(
      tamperedRes.status === 401,
      22,
      "Tampered or invalid token returns 401 Unauthorized"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 23: Public endpoints remain accessible without authentication
    // ------------------------------------------------------------------------
    const pubCategories = await request("/categories");
    const pubProfessionals = await request("/professionals");
    assert(
      pubCategories.status === 200 &&
        pubProfessionals.status === 200 &&
        Array.isArray(pubCategories.body?.data),
      23,
      "Public endpoints (/api/categories, /api/professionals) remain accessible without authentication"
    );

    // ------------------------------------------------------------------------
    // SCENARIO 24: Response data is sanitized — no password hashes or secrets
    // ------------------------------------------------------------------------
    const responsesToCheck = [
      regCust1.body,
      regPro1.body,
      loginCust1.body,
      meRes.body,
      adminUsersRes.body,
      cust1AccessOwnBookings.body,
    ];
    let leaksFound = false;
    for (const body of responsesToCheck) {
      const str = JSON.stringify(body);
      if (str.includes("passwordHash") || str.includes("$2b$") || str.includes("tokenVersion")) {
        leaksFound = true;
        break;
      }
    }
    assert(
      !leaksFound,
      24,
      "Response data is sanitized — no password hashes, password fields, or internal tokens exposed"
    );
  } catch (err) {
    console.error("Test execution threw error:", err);
  } finally {
    // Clean up created test records
    try {
      if (booking1Id) {
        await prisma.booking.deleteMany({ where: { id: booking1Id } });
      }
      if (pro1ServiceId) {
        await prisma.professionalService.deleteMany({ where: { id: pro1ServiceId } });
      }
      if (pro1ProfileId) {
        await prisma.professionalProfile.deleteMany({ where: { id: pro1ProfileId } });
      }
      if (pro2ProfileId) {
        await prisma.professionalProfile.deleteMany({ where: { id: pro2ProfileId } });
      }
      const testUserIds = [customer1Id, customer2Id, pro1Id, pro2Id, adminId].filter(Boolean);
      if (testUserIds.length > 0) {
        await prisma.user.deleteMany({ where: { id: { in: testUserIds } } });
      }
    } catch {
      // Cleanup best effort
    }

    server.close();

    console.log("\n=======================================================================");
    console.log(` Summary: ${passedCount}/24 PASSED, ${failedCount} FAILED`);
    console.log("=======================================================================\n");

    if (failedCount > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}

runAuthorizationTests().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
