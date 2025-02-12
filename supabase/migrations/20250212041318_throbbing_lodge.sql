/*
  # Add favorites table and download count function

  1. New Tables
    - `favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `document_id` (uuid, references documents)
      - `created_at` (timestamp)

  2. New Functions
    - `increment_download_count`: Safely increments document download count
*/

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  document_id uuid REFERENCES documents NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, document_id)
);

-- Enable RLS on favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for favorites
CREATE POLICY "Users can read their own favorites"
  ON favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites"
  ON favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(doc_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE documents
  SET download_count = download_count + 1
  WHERE id = doc_id;
END;
$$;