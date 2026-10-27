// src/routes/bookings.ts
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { z } from "zod";

const router = Router();

// POST /bookings - create a new booking (development use only)
router.post("/", async (req, res, next) => {
  try {
    const schema = z.object({
      customerId: z.string().cuid(),
      professionalServiceId: z.string().cuid(),
      address: z.string(),
      scheduledAt: z.string().optional(), // ISO date string
      description: z.string().optional(),
    });
    const { customerId, professionalServiceId, address, scheduledAt, description } = schema.parse(req.body);

    const booking = await prisma.booking.create({
      data: {
        customerId,
        professionalServiceId,
        address,
        description,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      },
    });
    res.status(201).json({ data: booking });
  } catch (err) {
    next(err);
  }
});

// GET /bookings/customer/:customerId - list bookings for a customer
router.get("/customer/:customerId", async (req, res, next) => {
  try {
    const schema = z.object({
      customerId: z.string().cuid(),
    });
    const { customerId } = schema.parse(req.params);
    const bookings = await prisma.booking.findMany({
      where: { customerId },
      include: {
        professionalService: {
          include: {
            professionalProfile: true,
            serviceCategory: true,
          },
        },
        review: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ data: bookings });
  } catch (err) {
    next(err);
  }
});

export const bookingsRouter = router;
