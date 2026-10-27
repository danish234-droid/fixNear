/**
 * apps/api/test_status_transitions.ts
 *
 * Dedicated verification for booking status transitions and ownership restrictions:
 *  - PENDING -> ACCEPTED (assigned professional)
 *  - PENDING -> REJECTED (assigned professional)
 *  - ACCEPTED -> COMPLETED (assigned professional)
 *  - PENDING/ACCEPTED -> CANCELLED (assigned professional / admin)
 *  - Customer cannot update booking status (403 Forbidden)
 *  - Unauthorized professional cannot update booking status (403 Forbidden)
 *  - Unauthenticated request returns 401 Unauthorized
 *  - Admin can update booking status across all valid statuses
 *  - Invalid status value rejected (400 Bad Request)
 *  - Non-existent booking returns 404 Not Found
 */

import http from "node:http";
import bcrypt from "bcrypt";
import { app } from "./src/app.js";
import { prisma } from "./src/lib/prisma.js";
import { BookingStatus } from "./src/generated/prisma/enums.js";

process.env.NODE_ENV = "test";

async function runBookingTransitionTests() {
  console.log("=======================================================================");
  console.log(" FixNear Booking Status Transitions & Ownership Test Suite");
  console.log("=======================================================================\n");

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 4000;
  const baseUrl = `http://127.0.0.1:${port}/api`;

  const timestamp = Date.now();
  const testPassword = "SecurePassword123!";
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

  async function request(
    path: string,
    options: {
      method?: string;
      headers?: Record<string, string>;
      body?: any;
      cookie?: string;
    } = {}
  ): Promise<{ status: number; headers: Headers; body: any }> {
    const headers: Record<string, string> = { ...(options.headers || {}) };
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

  let customerId = "";
  let customerCookie = "";
  let pro1Id = "";
  let pro1Cookie = "";
  let pro1ProfileId = "";
  let pro1ServiceId = "";
  let pro2Id = "";
  let pro2Cookie = "";
  let pro2ProfileId = "";
  let adminId = "";
  let adminCookie = "";

  const createdBookingIds: string[] = [];

  try {
    // 1. Setup Customer
    const regCust = await request("/auth/register", {
      method: "POST",
      body: {
        name: "Transition Customer",
        email: `cust_trans_${timestamp}@example.com`,
        password: testPassword,
        role: "CUSTOMER",
      },
    });
    customerId = regCust.body?.data?.id;
    const loginCust = await request("/auth/login", {
      method: "POST",
      body: { email: `cust_trans_${timestamp}@example.com`, password: testPassword },
    });
    customerCookie = extractCookie(loginCust.headers) || "";

    // 2. Setup Pro 1 (Service Provider)
    const regPro1 = await request("/auth/register", {
      method: "POST",
      body: {
        name: "Pro One",
        email: `pro1_trans_${timestamp}@example.com`,
        password: testPassword,
        role: "PROFESSIONAL",
        city: "Seattle",
        businessName: "Pro 1 Services",
      },
    });
    pro1Id = regPro1.body?.data?.id;
    pro1ProfileId = regPro1.body?.data?.professionalProfile?.id;
    const loginPro1 = await request("/auth/login", {
      method: "POST",
      body: { email: `pro1_trans_${timestamp}@example.com`, password: testPassword },
    });
    pro1Cookie = extractCookie(loginPro1.headers) || "";

    // 3. Setup Pro 2 (Unassigned Provider)
    const regPro2 = await request("/auth/register", {
      method: "POST",
      body: {
        name: "Pro Two",
        email: `pro2_trans_${timestamp}@example.com`,
        password: testPassword,
        role: "PROFESSIONAL",
        city: "Seattle",
        businessName: "Pro 2 Services",
      },
    });
    pro2Id = regPro2.body?.data?.id;
    pro2ProfileId = regPro2.body?.data?.professionalProfile?.id;
    const loginPro2 = await request("/auth/login", {
      method: "POST",
      body: { email: `pro2_trans_${timestamp}@example.com`, password: testPassword },
    });
    pro2Cookie = extractCookie(loginPro2.headers) || "";

    // 4. Setup Admin
    const adminHash = await bcrypt.hash(testPassword, 12);
    const adminUser = await prisma.user.create({
      data: {
        name: "Transition Admin",
        email: `admin_trans_${timestamp}@example.com`,
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

    // 5. Ensure Category & Service exist under Pro 1
    let category = await prisma.serviceCategory.findFirst();
    if (!category) {
      category = await prisma.serviceCategory.create({
        data: {
          name: "Transition Category",
          slug: `trans-cat-${timestamp}`,
          description: "Category for transition testing",
        },
      });
    }

    const serviceRes = await request("/professionals/services", {
      method: "POST",
      cookie: pro1Cookie,
      body: {
        serviceCategoryId: category.id,
        title: "Transition Test Service",
        description: "Service for transition testing",
        priceFrom: 99,
      },
    });
    pro1ServiceId = serviceRes.body?.data?.id;

    // Helper to create a new PENDING booking
    async function createTestBooking(desc: string): Promise<string> {
      const bRes = await request("/bookings", {
        method: "POST",
        cookie: customerCookie,
        body: {
          professionalServiceId: pro1ServiceId,
          address: "100 Transition Way",
          description: desc,
        },
      });
      const bId = bRes.body?.data?.id;
      if (bId) createdBookingIds.push(bId);
      return bId;
    }

    // ------------------------------------------------------------------------
    // TEST 1: PENDING -> ACCEPTED by assigned professional
    // ------------------------------------------------------------------------
    const b1 = await createTestBooking("Booking 1 for ACCEPTED transition");
    const acceptRes = await request(`/bookings/${b1}/status`, {
      method: "PATCH",
      cookie: pro1Cookie,
      body: { status: BookingStatus.ACCEPTED },
    });
    assert(
      acceptRes.status === 200 && acceptRes.body?.data?.status === "ACCEPTED",
      "Transition PENDING -> ACCEPTED succeeds for assigned professional",
      JSON.stringify(acceptRes.body)
    );

    // ------------------------------------------------------------------------
    // TEST 2: ACCEPTED -> COMPLETED by assigned professional
    // ------------------------------------------------------------------------
    const completeRes = await request(`/bookings/${b1}/status`, {
      method: "PATCH",
      cookie: pro1Cookie,
      body: { status: BookingStatus.COMPLETED },
    });
    assert(
      completeRes.status === 200 && completeRes.body?.data?.status === "COMPLETED",
      "Transition ACCEPTED -> COMPLETED succeeds for assigned professional",
      JSON.stringify(completeRes.body)
    );

    // ------------------------------------------------------------------------
    // TEST 3: PENDING -> REJECTED by assigned professional
    // ------------------------------------------------------------------------
    const b2 = await createTestBooking("Booking 2 for REJECTED transition");
    const rejectRes = await request(`/bookings/${b2}/status`, {
      method: "PATCH",
      cookie: pro1Cookie,
      body: { status: BookingStatus.REJECTED },
    });
    assert(
      rejectRes.status === 200 && rejectRes.body?.data?.status === "REJECTED",
      "Transition PENDING -> REJECTED succeeds for assigned professional",
      JSON.stringify(rejectRes.body)
    );

    // ------------------------------------------------------------------------
    // TEST 4: PENDING -> CANCELLED by assigned professional
    // ------------------------------------------------------------------------
    const b3 = await createTestBooking("Booking 3 for CANCELLED transition");
    const cancelRes = await request(`/bookings/${b3}/status`, {
      method: "PATCH",
      cookie: pro1Cookie,
      body: { status: BookingStatus.CANCELLED },
    });
    assert(
      cancelRes.status === 200 && cancelRes.body?.data?.status === "CANCELLED",
      "Transition PENDING -> CANCELLED succeeds for assigned professional",
      JSON.stringify(cancelRes.body)
    );

    // ------------------------------------------------------------------------
    // TEST 5: Status update by unassigned professional (Pro 2) is blocked (403)
    // ------------------------------------------------------------------------
    const b4 = await createTestBooking("Booking 4 for cross-ownership test");
    const pro2Res = await request(`/bookings/${b4}/status`, {
      method: "PATCH",
      cookie: pro2Cookie,
      body: { status: BookingStatus.ACCEPTED },
    });
    assert(
      pro2Res.status === 403,
      "Unauthorized professional (Pro 2) cannot update status on Pro 1's booking (403)",
      JSON.stringify(pro2Res.body)
    );

    // ------------------------------------------------------------------------
    // TEST 6: Customer cannot update booking status (403)
    // ------------------------------------------------------------------------
    const custStatusRes = await request(`/bookings/${b4}/status`, {
      method: "PATCH",
      cookie: customerCookie,
      body: { status: BookingStatus.ACCEPTED },
    });
    assert(
      custStatusRes.status === 403,
      "Customer cannot update booking status (403 Forbidden)",
      JSON.stringify(custStatusRes.body)
    );

    // ------------------------------------------------------------------------
    // TEST 7: Unauthenticated request to update status is blocked (401)
    // ------------------------------------------------------------------------
    const unauthStatusRes = await request(`/bookings/${b4}/status`, {
      method: "PATCH",
      body: { status: BookingStatus.ACCEPTED },
    });
    assert(
      unauthStatusRes.status === 401,
      "Unauthenticated status update request returns 401 Unauthorized",
      JSON.stringify(unauthStatusRes.body)
    );

    // ------------------------------------------------------------------------
    // TEST 8: Admin can update booking status (200 OK)
    // ------------------------------------------------------------------------
    const adminStatusRes = await request(`/bookings/${b4}/status`, {
      method: "PATCH",
      cookie: adminCookie,
      body: { status: BookingStatus.ACCEPTED },
    });
    assert(
      adminStatusRes.status === 200 && adminStatusRes.body?.data?.status === "ACCEPTED",
      "Admin can update booking status across services (200 OK)",
      JSON.stringify(adminStatusRes.body)
    );

    // ------------------------------------------------------------------------
    // TEST 9: Invalid status value rejected (400 Bad Request)
    // ------------------------------------------------------------------------
    const badStatusRes = await request(`/bookings/${b4}/status`, {
      method: "PATCH",
      cookie: pro1Cookie,
      body: { status: "INVALID_STATUS" },
    });
    assert(
      badStatusRes.status === 400,
      "Invalid status value (e.g. INVALID_STATUS) rejected with 400 Bad Request",
      JSON.stringify(badStatusRes.body)
    );

    // ------------------------------------------------------------------------
    // TEST 10: Non-existent booking ID returns 404 Not Found
    // ------------------------------------------------------------------------
    const notFoundRes = await request("/bookings/non-existent-booking-id/status", {
      method: "PATCH",
      cookie: pro1Cookie,
      body: { status: BookingStatus.ACCEPTED },
    });
    assert(
      notFoundRes.status === 404,
      "Non-existent booking returns 404 Not Found",
      JSON.stringify(notFoundRes.body)
    );
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    // Cleanup
    try {
      if (createdBookingIds.length > 0) {
        await prisma.booking.deleteMany({ where: { id: { in: createdBookingIds } } });
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
      const userIds = [customerId, pro1Id, pro2Id, adminId].filter(Boolean);
      if (userIds.length > 0) {
        await prisma.user.deleteMany({ where: { id: { in: userIds } } });
      }
    } catch {
      // Best effort cleanup
    }

    server.close();

    console.log("\n=======================================================================");
    console.log(` Status Transitions Summary: ${passedCount}/10 PASSED, ${failedCount} FAILED`);
    console.log("=======================================================================\n");

    if (failedCount > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}

runBookingTransitionTests().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
