-- Add tokenVersion column to User table for JWT invalidation on logout
-- Default 0 means all existing users start with version 0 and their
-- next-issued JWT will embed tokenVersion=0, which will match.
ALTER TABLE "User" ADD COLUMN "tokenVersion" INTEGER NOT NULL DEFAULT 0;
