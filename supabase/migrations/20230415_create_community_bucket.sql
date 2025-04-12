
-- Create storage bucket for community images
INSERT INTO storage.buckets (id, name, public)
VALUES ('community', 'Community Images', true);

-- Set up policy to allow users to upload images
CREATE POLICY "Anyone can upload community images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'community');

-- Set up policy to allow anyone to view community images
CREATE POLICY "Anyone can view community images"
ON storage.objects FOR SELECT
USING (bucket_id = 'community');
