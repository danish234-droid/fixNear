/**
 * src/routes/professionals.ts
 *
 * Professional endpoints:
 *  - Public:
 *    - GET /api/professionals: Search and list professionals
 *    - GET /api/professionals/:id: View professional profile & services
 *  - Protected (PROFESSIONAL only, with resource ownership enforcement):
 *    - PATCH  /api/professionals/profile: Update own profile
 *    - POST   /api/professionals/services: Add a service to own profile
 *    - PATCH  /api/professionals/services/:serviceId: Update own service (ownership verified)
 *    - DELETE /api/professionals/services/:serviceId: Remove own service (ownership verified)
 */

import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/index.js";
import { UserRole } from "../generated/prisma/enums.js";

const router = Router();

// Validation schemas
const searchSchema = z.object({
  city: z.string().optional(),
  categoryId: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

const profileUpdateSchema = z.object({
  city: z.string().trim().min(2).max(100).optional(),
  businessName: z.string().trim().max(150).nullable().optional(),
  bio: z.string().trim().max(1000).nullable().optional(),
  isAvailable: z.boolean().optional(),
});

const createServiceSchema = z.object({
  serviceCategoryId: z.string().trim().min(1, "serviceCategoryId is required."),
  title: z.string().trim().min(3, "Title must be at least 3 characters long.").max(150),
  description: z.string().trim().max(1000).optional(),
  priceFrom: z.coerce.number().positive("Price must be a positive number.").optional(),
});

const updateServiceSchema = z.object({
  title: z.string().trim().min(3).max(150).optional(),
  description: z.string().trim().max(1000).optional(),
  priceFrom: z.coerce.number().positive().optional(),
});

// ---------------------------------------------------------------------------
// 1. PUBLIC: GET /api/professionals - list / filter professionals
// ---------------------------------------------------------------------------
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { city, categoryId, limit, offset } = searchSchema.parse(req.query);

    const where: any = {};
    if (city) where.city = { contains: city, mode: "insensitive" };
    if (categoryId) {
      where.services = {
        some: { serviceCategoryId: categoryId },
      };
    }

    const professionals = await prisma.professionalProfile.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        services: {
          include: {
            serviceCategory: { select: { id: true, name: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    });

    return res.status(200).json({ status: 200, data: professionals, limit, offset });
  } catch (err) {
    return next(err);
  }
});

// ---------------------------------------------------------------------------
// 2. PROTECTED: PATCH /api/professionals/profile - update own profile
// ---------------------------------------------------------------------------
router.patch(
  "/profile",
  requireAuth,
  requireRole(UserRole.PROFESSIONAL, UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authenticatedUser = req.user!;
      const parseResult = profileUpdateSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          error: "Bad Request",
          message: parseResult.error.issues[0]?.message ?? "Invalid profile input.",
          status: 400,
        });
      }

      const existingProfile = await prisma.professionalProfile.findUnique({
        where: { userId: authenticatedUser.id },
      });

      if (!existingProfile) {
        return res.status(404).json({
          error: "Not Found",
          message: "Professional profile not found for this account.",
          status: 404,
        });
      }

      const updated = await prisma.professionalProfile.update({
        where: { id: existingProfile.id },
        data: parseResult.data,
      });

      return res.status(200).json({
        message: "Profile updated successfully.",
        status: 200,
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// 3. PROTECTED: POST /api/professionals/services - add service to own profile
// ---------------------------------------------------------------------------
router.post(
  "/services",
  requireAuth,
  requireRole(UserRole.PROFESSIONAL, UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authenticatedUser = req.user!;
      const parseResult = createServiceSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          error: "Bad Request",
          message: parseResult.error.issues[0]?.message ?? "Invalid service input.",
          status: 400,
        });
      }

      const profile = await prisma.professionalProfile.findUnique({
        where: { userId: authenticatedUser.id },
      });

      if (!profile) {
        return res.status(404).json({
          error: "Not Found",
          message: "Professional profile not found for this account.",
          status: 404,
        });
      }

      const { serviceCategoryId, title, description, priceFrom } = parseResult.data;

      // Verify category exists
      const category = await prisma.serviceCategory.findUnique({
        where: { id: serviceCategoryId },
      });
      if (!category) {
        return res.status(404).json({
          error: "Not Found",
          message: "Service category not found.",
          status: 404,
        });
      }

      const newService = await prisma.professionalService.create({
        data: {
          professionalProfileId: profile.id,
          serviceCategoryId,
          title,
          description: description || null,
          priceFrom: priceFrom ?? null,
        },
        include: {
          serviceCategory: true,
        },
      });

      return res.status(201).json({
        message: "Service created successfully.",
        status: 201,
        data: newService,
      });
    } catch (err) {
      return next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// 4. PROTECTED: PATCH /api/professionals/services/:serviceId - update own service
// Enforces ownership: only owner can edit prices/details (or ADMIN)
// ---------------------------------------------------------------------------
router.patch(
  "/services/:serviceId",
  requireAuth,
  requireRole(UserRole.PROFESSIONAL, UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authenticatedUser = req.user!;
      const serviceId = req.params.serviceId as string;

      const parseResult = updateServiceSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          error: "Bad Request",
          message: parseResult.error.issues[0]?.message ?? "Invalid input.",
          status: 400,
        });
      }

      const service: any = await prisma.professionalService.findUnique({
        where: { id: serviceId },
        include: { professionalProfile: true },
      });

      if (!service) {
        return res.status(404).json({
          error: "Not Found",
          message: "Service not found.",
          status: 404,
        });
      }

      // Enforce professional resource ownership:
      // A professional cannot change another professional's services or prices
      if (
        authenticatedUser.role !== UserRole.ADMIN &&
        service.professionalProfile.userId !== authenticatedUser.id
      ) {
        return res.status(403).json({
          error: "Forbidden",
          message: "You can only modify services belonging to your own professional profile.",
          status: 403,
        });
      }

      const updated = await prisma.professionalService.update({
        where: { id: serviceId },
        data: parseResult.data,
      });

      return res.status(200).json({
        message: "Service updated successfully.",
        status: 200,
        data: updated,
      });
    } catch (err) {
      return next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// 5. PROTECTED: DELETE /api/professionals/services/:serviceId - delete own service
// ---------------------------------------------------------------------------
router.delete(
  "/services/:serviceId",
  requireAuth,
  requireRole(UserRole.PROFESSIONAL, UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authenticatedUser = req.user!;
      const serviceId = req.params.serviceId as string;

      const service: any = await prisma.professionalService.findUnique({
        where: { id: serviceId },
        include: { professionalProfile: true },
      });

      if (!service) {
        return res.status(404).json({
          error: "Not Found",
          message: "Service not found.",
          status: 404,
        });
      }

      if (
        authenticatedUser.role !== UserRole.ADMIN &&
        service.professionalProfile.userId !== authenticatedUser.id
      ) {
        return res.status(403).json({
          error: "Forbidden",
          message: "You can only delete services belonging to your own professional profile.",
          status: 403,
        });
      }

      await prisma.professionalService.delete({
        where: { id: serviceId },
      });

      return res.status(200).json({
        message: "Service deleted successfully.",
        status: 200,
      });
    } catch (err) {
      return next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// 6. PUBLIC: GET /api/professionals/:id - fetch single professional
// ---------------------------------------------------------------------------
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
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
        services: {
          include: {
            serviceCategory: true,
          },
        },
      },
    });

    if (!professional) {
      return res.status(404).json({ error: "Not Found", message: "Professional not found", status: 404 });
    }

    return res.status(200).json({ status: 200, data: professional });
  } catch (err) {
    return next(err);
  }
});

export const professionalsRouter = router;
