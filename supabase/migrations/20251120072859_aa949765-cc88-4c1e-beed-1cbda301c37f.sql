-- RLS policies for media bucket (announcements, chat images, etc.)

-- Allow authenticated users to upload to media bucket
CREATE POLICY "Authenticated users can upload to media bucket"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media' 
  AND auth.uid() IS NOT NULL
);

-- Allow anyone to view media files (bucket is public)
CREATE POLICY "Anyone can view media files"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Allow authenticated users to update their own uploads
CREATE POLICY "Users can update their own media uploads"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'media'
  AND auth.uid() IS NOT NULL
)
WITH CHECK (
  bucket_id = 'media'
  AND auth.uid() IS NOT NULL
);

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Users can delete their own media uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media'
  AND auth.uid() IS NOT NULL
);