-- Add UsageRecord table for subscription usage tracking
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS "UsageRecord" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    month TEXT NOT NULL, -- Format: YYYY-MM (e.g., 2025-05)
    "feedbackRequests" INTEGER DEFAULT 0 NOT NULL,
    "socialShares" INTEGER DEFAULT 0 NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE("userId", month)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "UsageRecord_userId_idx" ON "UsageRecord"("userId");
CREATE INDEX IF NOT EXISTS "UsageRecord_month_idx" ON "UsageRecord"(month);

-- Enable Row Level Security (RLS)
ALTER TABLE "UsageRecord" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for UsageRecord table
CREATE POLICY "Users can view own usage records" ON "UsageRecord"
    FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own usage records" ON "UsageRecord"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own usage records" ON "UsageRecord"
    FOR UPDATE USING (auth.uid()::text = "userId");

-- Update User table to only have free and pro plans
UPDATE "User" SET plan = 'free' WHERE plan NOT IN ('free', 'pro');
