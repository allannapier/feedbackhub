-- Add new columns to the Response table
ALTER TABLE "Response" 
ADD COLUMN "respondentCompany" TEXT,
ADD COLUMN "respondentPhone" TEXT,
ADD COLUMN "consentToShare" BOOLEAN NOT NULL DEFAULT false;

-- Update existing records to have consentToShare = false by default
-- (This is already handled by the DEFAULT clause above)
