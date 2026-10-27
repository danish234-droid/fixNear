import { app } from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`FixNear API server running on port ${env.PORT}`);
  console.log(`Health endpoint: http://localhost:${env.PORT}/api/health`);
  console.log(`Allowed CORS origins: ${env.WEB_ORIGIN}, http://localhost:3000, http://127.0.0.1:3000`);
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
