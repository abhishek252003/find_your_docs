/*
  # Create Storage Bucket for Documents

  1. Storage
    - Create a new public bucket for storing documents
    - Enable public access for document downloads
*/

-- Create a new storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true);

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public access to read files
CREATE POLICY "Allow public to read files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'documents');