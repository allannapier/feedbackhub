-- FeedbackHub Database Schema - Part 3 (Indexes and Security)
-- Run this after Part 1 and 2

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
CREATE POLICY "Anyone can create responses" ON "Response"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Form owners can view responses" ON "Response"
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM "Form" WHERE "Form".id = "Response"."formId" AND "Form"."userId" = auth.uid()::text
    ));

-- RLS Policies for Request table
CREATE POLICY "Users can manage own requests" ON "Request"
    FOR ALL USING (EXISTS (
        SELECT 1 FROM "Form" WHERE "Form".id = "Request"."formId" AND "Form"."userId" = auth.uid()::text
    ));

-- RLS Policies for ShareTemplate table (public read)
CREATE POLICY "Anyone can view share templates" ON "ShareTemplate"
    FOR SELECT USING (true);
