-- FeedbackHub Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User table
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    "avatarUrl" TEXT,
    plan TEXT DEFAULT 'free' NOT NULL,
    "customerId" TEXT UNIQUE,
    subscription JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Form table
CREATE TABLE IF NOT EXISTS "Form" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    question TEXT NOT NULL,
    type TEXT NOT NULL,
    settings JSONB NOT NULL DEFAULT '{}',
    slug TEXT UNIQUE NOT NULL,
    "isActive" BOOLEAN DEFAULT true NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "Form_userId_idx" ON "Form"("userId");
CREATE INDEX IF NOT EXISTS "Form_slug_idx" ON "Form"(slug);
CREATE INDEX IF NOT EXISTS "Response_formId_idx" ON "Response"("formId");
CREATE INDEX IF NOT EXISTS "Response_createdAt_idx" ON "Response"("createdAt");
CREATE INDEX IF NOT EXISTS "Request_formId_idx" ON "Request"("formId");
CREATE INDEX IF NOT EXISTS "Request_status_idx" ON "Request"(status);

-- Enable Row Level Security (RLS)
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Form" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Response" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Request" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ShareTemplate" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for User table
CREATE POLICY "Users can view own data" ON "User"
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can insert own data" ON "User"
    FOR INSERT WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can update own data" ON "User"
    FOR UPDATE USING (auth.uid()::text = id);

-- RLS Policies for Form table
CREATE POLICY "Users can view own forms" ON "Form"
    FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can create own forms" ON "Form"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own forms" ON "Form"
    FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own forms" ON "Form"
    FOR DELETE USING (auth.uid()::text = "userId");

-- RLS Policies for Response table (forms are public for responses)
CREATE POLICY "Anyone can view responses" ON "Response"
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create responses" ON "Response"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Form owners can view responses" ON "Response"
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM "Form" WHERE "Form".id = "Response"."formId" AND "Form"."userId" = auth.uid()::text
    ));

-- RLS Policies for Request table
CREATE POLICY "Users can view own requests" ON "Request"
    FOR ALL USING (EXISTS (
        SELECT 1 FROM "Form" WHERE "Form".id = "Request"."formId" AND "Form"."userId" = auth.uid()::text
    ));

-- RLS Policies for ShareTemplate table (public read, admin write)
CREATE POLICY "Anyone can view share templates" ON "ShareTemplate"
    FOR SELECT USING (true);

-- Insert default share templates
INSERT INTO "ShareTemplate" (name, platform, template, "isDefault") VALUES
('Default Twitter', 'twitter', 'Check out this amazing feedback: "{{feedback}}" - {{name}}', true),
('Default LinkedIn', 'linkedin', 'Grateful for this feedback from {{name}}: "{{feedback}}"', true),
('Simple Twitter', 'twitter', '"{{feedback}}" - {{name}}', false),
('Detailed LinkedIn', 'linkedin', 'We received some wonderful feedback: "{{feedback}}" Thank you {{name}} for sharing your experience!', false)
ON CONFLICT DO NOTHING;
