-- SQL Database Schema for Certificate Verification System
-- Run this in your Supabase SQL Editor.

-- Drop table if it exists
-- DROP TABLE IF EXISTS certificates;

CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barcode_number TEXT UNIQUE NOT NULL,
    certificate_name TEXT NOT NULL,
    date_applied TIMESTAMP WITH TIME ZONE NOT NULL,
    date_digitally_signed BOOLEAN DEFAULT FALSE NOT NULL,
    applicant_name TEXT NOT NULL,
    beneficiary_name TEXT NOT NULL,
    designation_of_signatory TEXT NOT NULL,
    taluka_of_signatory TEXT NOT NULL,
    district_of_signatory TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- 1. Enable read-only access for everyone (Public Verification Side)
CREATE POLICY "Allow public read access" 
ON certificates 
FOR SELECT 
USING (true);

-- 2. Enable full access for authenticated admins (Admin Dashboard Side)
CREATE POLICY "Allow authenticated admin full access" 
ON certificates 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Indexes for performance optimization (barcode search is primary query path)
CREATE INDEX idx_certificates_barcode ON certificates(barcode_number);
CREATE INDEX idx_certificates_applicant ON certificates(applicant_name);
CREATE INDEX idx_certificates_status ON certificates(status);

-- Optional trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_certificates_modtime
    BEFORE UPDATE ON certificates
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

-- Instructions on Admin User Creation:
-- Go to your Supabase dashboard > Authentication > Users > Add User
-- Or run a manual script to create a user using the Supabase API.
