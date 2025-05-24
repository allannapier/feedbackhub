-- FeedbackHub Database Schema - Part 2
-- Run this after Part 1

-- Response table
CREATE TABLE IF NOT EXISTS "Response" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "formId" TEXT NOT NULL REFERENCES "Form"(id) ON DELETE CASCADE,
    rating INTEGER,
    text TEXT,
    answer TEXT,
    "respondentEmail" TEXT,
    "respondentName" TEXT,
    metadata JSONB,
    shared BOOLEAN DEFAULT false NOT NULL,
    "sharedAt" TIMESTAMP WITH TIME ZONE,
    "shareData" JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Request table
CREATE TABLE IF NOT EXISTS "Request" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "formId" TEXT NOT NULL REFERENCES "Form"(id) ON DELETE CASCADE,
    "recipientEmail" TEXT NOT NULL,
    "recipientName" TEXT,
    status TEXT DEFAULT 'pending' NOT NULL,
    "sentAt" TIMESTAMP WITH TIME ZONE,
    "openedAt" TIMESTAMP WITH TIME ZONE,
    "respondedAt" TIMESTAMP WITH TIME ZONE,
    "responseId" TEXT,
    "reminderCount" INTEGER DEFAULT 0 NOT NULL,
    "lastReminder" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ShareTemplate table
CREATE TABLE IF NOT EXISTS "ShareTemplate" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    platform TEXT NOT NULL,
    template TEXT NOT NULL,
    "isDefault" BOOLEAN DEFAULT false NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
