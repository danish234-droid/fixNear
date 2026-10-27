/**
 * src/routes/categories.ts
 *
 * Service Category routes:
 *  - GET    /api/categories: Public catalog listing
 *  - POST   /api/categories: Admin only (create category)
 *  - PATCH  /api/categories/:id: Admin only (update category)
 *  - DELETE /api/categories/:id: Admin only (delete category)
 */

import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/index.js";
import { UserRole } from "../generated/prisma/enums.js";

const router = Router();

const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(2).max(100),
  description: z.string().trim().max(500).optional(),
  icon: z.string().trim().optional(),
});

const updateCategorySchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  slug: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().max(500).optional(),
  icon: z.string().trim().optional(),
});

// ---------------------------------------------------------------------------
// 1. PUBLIC: GET /api/categories - list all service categories
// ---------------------------------------------------------------------------
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { services: true },
        },
      },
    });
    return res.status(200).json({ status: 200, data: categories });
  } catch (err) {
    return next(err);
  }
});

// ---------------------------------------------------------------------------
// 2. ADMIN ONLY: POST /api/categories - create a new service category
// ---------------------------------------------------------------------------
router.post(
  "/",
  requireAuth,
  requireRole(UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = createCategorySchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          error: "Bad Request",
          message: parseResult.error.issues[0]?.message ?? "Invalid category data.",
          status: 400,
        });
      }

      const category = await prisma.serviceCategory.create({
        data: parseResult.data,
      });

      return res.status(201).json({
        message: "Service category created successfully.",
        status: 201,
        data: category,
      });
    } catch (err) {
      return next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// 3. ADMIN ONLY: PATCH /api/categories/:id - update a service category
// ---------------------------------------------------------------------------
router.patch(
  "/:id",
  requireAuth,
  requireRole(UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const parseResult = updateCategorySchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          error: "Bad Request",
          message: parseResult.error.issues[0]?.message ?? "Invalid category data.",
          status: 400,
        });
      }

      const existing = await prisma.serviceCategory.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ error: "Not Found", message: "Category not found.", status: 404 });
      }

      const updated = await prisma.serviceCategory.update({
        where: { id },
        data: parseResult.data,
      });

      return res.status(200).json({
        message: "Service category updated successfully.",
        status: 200,
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// 4. ADMIN ONLY: DELETE /api/categories/:id - delete a service category
// ---------------------------------------------------------------------------
router.delete(
  "/:id",
  requireAuth,
  requireRole(UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const existing = await prisma.serviceCategory.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ error: "Not Found", message: "Category not found.", status: 404 });
      }

      await prisma.serviceCategory.delete({ where: { id } });

      return res.status(200).json({
        message: "Service category deleted successfully.",
        status: 200,
      });
    } catch (err) {
      return next(err);
    }
  }
);

export const categoriesRouter = router;
