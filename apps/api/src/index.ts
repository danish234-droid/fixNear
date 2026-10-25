import { app } from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.log(`FixNear API server running on port ${env.PORT}`);
  console.log(`Health endpoint: http://localhost:${env.PORT}/api/health`);
  console.log(`Allowed CORS origin: ${env.WEB_ORIGIN}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
  });
});
