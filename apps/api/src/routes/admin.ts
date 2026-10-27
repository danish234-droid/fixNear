/**
 * src/routes/admin.ts
 *
 * Admin-only APIs:
 *  - GET /api/admin/overview: Platform statistics
 *  - GET /api/admin/users: User list management
 */

import { Router, type Request, type Response, type NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/index.js";
import { UserRole } from "../generated/prisma/enums.js";

const router = Router();

// Apply requireAuth and requireRole(ADMIN) to all admin sub-routes
router.use(requireAuth, requireRole(UserRole.ADMIN));

// ---------------------------------------------------------------------------
// GET /api/admin/overview - platform metrics
// ---------------------------------------------------------------------------
router.get("/overview", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalUsers, totalCustomers, totalProfessionals, totalBookings, totalCategories] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: UserRole.CUSTOMER } }),
        prisma.user.count({ where: { role: UserRole.PROFESSIONAL } }),
        prisma.booking.count(),
        prisma.serviceCategory.count(),
      ]);

    const bookingsByStatus = await prisma.booking.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    return res.status(200).json({
      status: 200,
      data: {
        totalUsers,
        totalCustomers,
        totalProfessionals,
        totalBookings,
        totalCategories,
        bookingsByStatus: bookingsByStatus.reduce(
          (acc, curr) => ({ ...acc, [curr.status]: curr._count.id }),
          {}
        ),
      },
    });
  } catch (err) {
    return next(err);
  }
});

// ---------------------------------------------------------------------------
// GET /api/admin/users - list all platform users safely
// ---------------------------------------------------------------------------
router.get("/users", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roleParam = typeof req.query.role === "string" ? req.query.role.toUpperCase() : undefined;
    const role =
      roleParam && Object.values(UserRole).includes(roleParam as UserRole)
        ? (roleParam as UserRole)
        : undefined;

    const users = await prisma.user.findMany({
      where: role ? { role } : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        professionalProfile: {
          select: {
            id: true,
            city: true,
            businessName: true,
            isAvailable: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return res.status(200).json({
      status: 200,
      data: users,
    });
  } catch (err) {
    return next(err);
  }
});

export const adminRouter = router;
