-- Add company name field to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "companyName" TEXT;
