// src/routes/professionals.ts
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { z } from "zod";

const router = Router();

// GET /professionals
// Query params: city (string, optional), categoryId (string, optional), limit (int, default 20), offset (int, default 0)
router.get("/", async (req, res, next) => {
  try {
    const schema = z.object({
      city: z.string().optional(),
      categoryId: z.string().optional(),
      limit: z.coerce.number().int().min(1).max(100).optional().default(20),
      offset: z.coerce.number().int().min(0).optional().default(0),
    });
    const { city, categoryId, limit, offset } = schema.parse(req.query);

    const where: any = {};
    if (city) where.city = city;
    if (categoryId) where.serviceCategoryId = categoryId; // will be used in nested relation

    const professionals = await prisma.professionalProfile.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        services: true,
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    });
    res.status(200).json({ data: professionals, limit, offset });
  } catch (err) {
    next(err);
  }
});

// GET /professionals/:id - fetch a single professional profile with services
router.get("/:id", async (req, res, next) => {
  try {
    const schema = z.object({ id: z.string().cuid() });
    const { id } = schema.parse(req.params);
    const professional = await prisma.professionalProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
          },
        },
        services: true,
      },
    });
    if (!professional) {
      return res.status(404).json({ error: "Professional not found" });
    }
    res.status(200).json({ data: professional });
  } catch (err) {
    next(err);
  }
});

export const professionalsRouter = router;
