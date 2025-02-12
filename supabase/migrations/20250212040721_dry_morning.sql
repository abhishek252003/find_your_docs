/*
  # Create documents table and security policies

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `subject` (text)
      - `course` (text)
      - `university` (text)
      - `file_url` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
      - `rating` (numeric)
      - `download_count` (integer)

  2. Security
    - Enable RLS on `documents` table
    - Add policies for:
      - Anyone can read documents
      - Users can create their own documents
      - Users can update their own documents
*/

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  subject text,
  course text,
  university text,
  file_url text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  rating numeric DEFAULT 0,
  download_count integer DEFAULT 0,
  CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 5)
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read documents"
  ON documents
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own documents"
  ON documents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
  ON documents
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create a trigger to update the updated_at column
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();