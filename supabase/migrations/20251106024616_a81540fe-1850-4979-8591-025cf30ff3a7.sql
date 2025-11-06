-- Add a sequential numerical ID column to scammers table
ALTER TABLE public.scammers 
ADD COLUMN IF NOT EXISTS report_number INTEGER;

-- Create a sequence for report_number
CREATE SEQUENCE IF NOT EXISTS scammers_report_number_seq;

-- Set the sequence as default for the column
ALTER TABLE public.scammers 
ALTER COLUMN report_number SET DEFAULT nextval('scammers_report_number_seq');

-- Backfill existing scammers with sequential numbers based on creation date
DO $$
DECLARE
  scammer_record RECORD;
  counter INTEGER := 1;
BEGIN
  FOR scammer_record IN 
    SELECT id FROM public.scammers ORDER BY created_at
  LOOP
    UPDATE public.scammers 
    SET report_number = counter 
    WHERE id = scammer_record.id;
    counter := counter + 1;
  END LOOP;
  
  -- Set the sequence to the next value after backfill
  PERFORM setval('scammers_report_number_seq', counter);
END $$;

-- Make report_number NOT NULL after backfilling
ALTER TABLE public.scammers 
ALTER COLUMN report_number SET NOT NULL;

-- Create a unique index on report_number for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_scammers_report_number ON public.scammers(report_number);