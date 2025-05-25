-- Fix RLS policy for User table to allow users to create their own record
-- Run this in Supabase SQL Editor

-- Add INSERT policy for User table
CREATE POLICY "Users can insert own data" ON "User"
    FOR INSERT WITH CHECK (auth.uid()::text = id);
