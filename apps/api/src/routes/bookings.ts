/**
 * src/routes/bookings.ts
 *
 * Booking endpoints protected by authentication and role-based authorization:
 *  - POST  /api/bookings: Create booking (CUSTOMER only, derives customerId from authenticated user)
 *  - GET   /api/bookings/customer/:customerId: View customer bookings (Ownership check: own customerId only)
 *  - GET   /api/bookings/professional: View bookings assigned to the authenticated professional
 *  - PATCH /api/bookings/:id/status: Accept, reject, or update status (PROFESSIONAL or ADMIN only, with service ownership check)
 */

import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/index.js";
import { UserRole, BookingStatus } from "../generated/prisma/enums.js";

const router = Router();

const createBookingSchema = z.object({
  customerId: z.string().trim().optional(),
  professionalServiceId: z.string().trim().min(1, "professionalServiceId is required."),
  address: z.string().trim().min(2, "Address must be at least 2 characters long."),
  scheduledAt: z
    .string()
    .trim()
    .refine((val) => !isNaN(Date.parse(val)), "scheduledAt must be a valid ISO date string.")
    .optional(),
  description: z.string().trim().max(1000).optional(),
});

const customerParamSchema = z.object({
  customerId: z.string().trim().min(1, "Customer ID parameter is required."),
});

const statusUpdateSchema = z.object({
  status: z.enum(
    [
      BookingStatus.PENDING,
      BookingStatus.ACCEPTED,
      BookingStatus.REJECTED,
      BookingStatus.CANCELLED,
      BookingStatus.COMPLETED,
    ],
    {
      error: () => ({
        message: "Invalid booking status. Allowed: PENDING, ACCEPTED, REJECTED, CANCELLED, COMPLETED.",
      }),
    }
  ),
});

// ---------------------------------------------------------------------------
// POST /api/bookings - create a new booking (CUSTOMER or ADMIN)
// ---------------------------------------------------------------------------
router.post(
  "/",
  requireAuth,
  requireRole(UserRole.CUSTOMER, UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authenticatedUser = req.user!;
      const parseResult = createBookingSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          error: "Bad Request",
          message: parseResult.error.issues[0]?.message ?? "Invalid booking input.",
          status: 400,
        });
      }

      const { customerId, professionalServiceId, address, scheduledAt, description } =
        parseResult.data;

      // Reject attempts to create bookings for another customer (unless ADMIN)
      if (
        customerId &&
        customerId !== authenticatedUser.id &&
        authenticatedUser.role !== UserRole.ADMIN
      ) {
        return res.status(403).json({
          error: "Forbidden",
          message: "You cannot create a booking on behalf of another user.",
          status: 403,
        });
      }

      // Always bind the booking to the verified authenticated user's ID
      const targetCustomerId =
        authenticatedUser.role === UserRole.ADMIN && customerId
          ? customerId
          : authenticatedUser.id;

      // Verify that the referenced service exists
      const service = await prisma.professionalService.findUnique({
        where: { id: professionalServiceId },
      });

      if (!service) {
        return res.status(404).json({
          error: "Not Found",
          message: "The requested professional service was not found.",
          status: 404,
        });
      }

      const booking = await prisma.booking.create({
        data: {
          customerId: targetCustomerId,
          professionalServiceId,
          address,
          description: description || null,
          scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        },
        include: {
          professionalService: {
            include: {
              professionalProfile: {
                select: {
                  id: true,
                  city: true,
                  businessName: true,
                },
              },
              serviceCategory: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      });

      return res.status(201).json({
        message: "Booking created successfully.",
        status: 201,
        data: booking,
      });
    } catch (err) {
      return next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// GET /api/bookings/professional - list bookings assigned to the professional
// ---------------------------------------------------------------------------
router.get(
  "/professional",
  requireAuth,
  requireRole(UserRole.PROFESSIONAL, UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authenticatedUser = req.user!;

      // Find the professional profile associated with the current user
      const profile = await prisma.professionalProfile.findUnique({
        where: { userId: authenticatedUser.id },
        select: { id: true },
      });

      if (!profile && authenticatedUser.role !== UserRole.ADMIN) {
        return res.status(404).json({
          error: "Not Found",
          message: "Professional profile not found for this account.",
          status: 404,
        });
      }

      const bookings = await prisma.booking.findMany({
        where: profile
          ? {
              professionalService: {
                professionalProfileId: profile.id,
              },
            }
          : {},
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          professionalService: {
            include: {
              serviceCategory: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          review: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        status: 200,
        data: bookings,
      });
    } catch (err) {
      return next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// GET /api/bookings/customer/:customerId - list bookings for a customer
// ---------------------------------------------------------------------------
router.get(
  "/customer/:customerId",
  requireAuth,
  requireRole(UserRole.CUSTOMER, UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authenticatedUser = req.user!;
      const paramResult = customerParamSchema.safeParse(req.params);
      if (!paramResult.success) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Invalid customer ID parameter.",
          status: 400,
        });
      }

      const { customerId } = paramResult.data;

      // Ownership enforcement: Customers can only retrieve their own bookings
      if (authenticatedUser.role !== UserRole.ADMIN && authenticatedUser.id !== customerId) {
        return res.status(403).json({
          error: "Forbidden",
          message: "You do not have permission to access these bookings.",
          status: 403,
        });
      }

      const targetId = authenticatedUser.role === UserRole.ADMIN ? customerId : authenticatedUser.id;

      const bookings = await prisma.booking.findMany({
        where: { customerId: targetId },
        include: {
          professionalService: {
            include: {
              professionalProfile: {
                select: {
                  id: true,
                  city: true,
                  businessName: true,
                },
              },
              serviceCategory: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          review: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        status: 200,
        data: bookings,
      });
    } catch (err) {
      return next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// PATCH /api/bookings/:id/status - accept, reject, or update booking status
// Only PROFESSIONAL (assigned to service) or ADMIN can change status
// ---------------------------------------------------------------------------
router.patch(
  "/:id/status",
  requireAuth,
  requireRole(UserRole.PROFESSIONAL, UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authenticatedUser = req.user!;
      const id = req.params.id as string;

      const parseResult = statusUpdateSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          error: "Bad Request",
          message: parseResult.error.issues[0]?.message ?? "Invalid status.",
          status: 400,
        });
      }

      const { status } = parseResult.data;

      const booking: any = await prisma.booking.findUnique({
        where: { id },
        include: {
          professionalService: {
            include: {
              professionalProfile: {
                select: {
                  id: true,
                  userId: true,
                },
              },
            },
          },
        },
      });

      if (!booking) {
        return res.status(404).json({
          error: "Not Found",
          message: "Booking not found.",
          status: 404,
        });
      }

      // Enforce professional resource ownership:
      // Only the professional whose service was booked (or an ADMIN) can accept/reject/modify
      if (
        authenticatedUser.role !== UserRole.ADMIN &&
        booking.professionalService.professionalProfile.userId !== authenticatedUser.id
      ) {
        return res.status(403).json({
          error: "Forbidden",
          message: "You can only manage bookings assigned to your own professional services.",
          status: 403,
        });
      }

      const updated = await prisma.booking.update({
        where: { id },
        data: { status },
        include: {
          customer: {
            select: { id: true, name: true, email: true },
          },
          professionalService: {
            select: { id: true, title: true },
          },
        },
      });

      return res.status(200).json({
        message: `Booking status updated to ${status}.`,
        status: 200,
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  }
);

export const bookingsRouter = router;
