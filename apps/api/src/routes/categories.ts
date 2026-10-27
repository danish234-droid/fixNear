// src/routes/categories.ts
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { z } from "zod";

const router = Router();

// GET /categories - list all service categories
router.get("/", async (_req, res, next) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { name: "asc" },
    });
    res.status(200).json({ data: categories });
  } catch (err) {
    next(err);
  }
});

export const categoriesRouter = router;
