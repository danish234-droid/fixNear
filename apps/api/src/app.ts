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

// JSON 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: "Resource not found",
      status: 404,
    },
  });
});

// Global error handler - avoid exposing internal error details
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: {
      message: "Internal Server Error",
      status: 500,
    },
  });
});
