/**
 * src/routes/bookings.ts
 *
 * Booking endpoints protected by authentication middleware:
 *  - POST /api/bookings: Create booking using authenticated user's ID
 *  - GET  /api/bookings/customer/:customerId: Retrieve bookings with customer ownership check
 */

import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/index.js";

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

// ---------------------------------------------------------------------------
// POST /api/bookings - create a new booking
// ---------------------------------------------------------------------------
router.post(
  "/",
  requireAuth,
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

      // Reject attempts to create bookings for another customer
      if (customerId && customerId !== authenticatedUser.id) {
        return res.status(403).json({
          error: "Forbidden",
          message: "You cannot create a booking on behalf of another user.",
          status: 403,
        });
      }

      // Always bind the booking to the verified authenticated user's ID
      const targetCustomerId = authenticatedUser.id;

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
// GET /api/bookings/customer/:customerId - list bookings for a customer
// ---------------------------------------------------------------------------
router.get(
  "/customer/:customerId",
  requireAuth,
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
      if (authenticatedUser.id !== customerId) {
        return res.status(403).json({
          error: "Forbidden",
          message: "You do not have permission to access these bookings.",
          status: 403,
        });
      }

      const bookings = await prisma.booking.findMany({
        where: { customerId: authenticatedUser.id },
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

export const bookingsRouter = router;
