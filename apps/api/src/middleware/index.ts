/**
 * src/middleware/index.ts
 *
 * Centralized middleware exports for FixNear API.
 */

export {
  requireAuth,
  authenticate,
  type AuthenticatedUser,
  type AuthenticatedRequest,
} from "./requireAuth.js";
