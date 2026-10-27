import express, { type Request, type Response, type NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";

export const app = express();

// Security headers
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: env.WEB_ORIGIN,
    credentials: true,
  })
);

// Body parsing with size limit
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// API routes
app.use("/api", apiRouter);

// JSON 404 handler for unknown routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
    status: 404,
  });
});

// Centralized error-handling middleware - do not expose stack traces or internal details
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const error = err as { status?: number; statusCode?: number; message?: string };
  const statusCode =
    typeof error?.status === "number"
      ? error.status
      : typeof error?.statusCode === "number"
      ? error.statusCode
      : 500;

  if (statusCode >= 500) {
    console.error("Unhandled error:", err);
  }

  const isProduction = env.NODE_ENV === "production";
  const message =
    statusCode >= 500 && isProduction
      ? "Internal Server Error"
      : error?.message || "Internal Server Error";

  res.status(statusCode).json({
    error: statusCode >= 500 ? "Internal Server Error" : "Error",
    message,
    status: statusCode,
  });
});
