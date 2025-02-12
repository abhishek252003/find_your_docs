export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  university?: string;
  created_at: string;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  subject: string;
  course: string;
  university: string;
  file_url: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  rating: number;
  download_count: number;
}

export interface DocumentFilter {
  subject?: string;
  university?: string;
  course?: string;
}