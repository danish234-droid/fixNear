import { Router } from "express";
import { healthRouter } from "./health.js";
import { categoriesRouter } from "./categories.js";
import { professionalsRouter } from "./professionals.js";
import { bookingsRouter } from "./bookings.js";
import { authRouter } from "./auth.js";
import { adminRouter } from "./admin.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/professionals", professionalsRouter);
apiRouter.use("/bookings", bookingsRouter);
apiRouter.use("/admin", adminRouter);
