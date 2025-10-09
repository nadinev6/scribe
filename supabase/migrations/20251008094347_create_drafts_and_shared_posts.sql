/*
  # Create drafts and shared_posts tables

  1. New Tables
    - `drafts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `content` (text, markdown content)
      - `featured_image` (text, nullable)
      - `note` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `drafts_history` (jsonb, array of historical drafts)
    
    - `shared_posts`
      - `id` (uuid, primary key)
      - `share_id` (text, unique identifier for sharing)
      - `user_id` (uuid, references auth.users)
      - `content` (text, markdown content)
      - `featured_image` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Drafts: Users can only view/edit/delete their own drafts
    - Shared posts: Anyone can view, but only owners can modify
    - Add proper indexes for performance

  3. Functions and Triggers
    - Auto-update `updated_at` timestamps on changes
    - Secure function with SECURITY DEFINER and search_path
*/

-- Create drafts table to store content history
CREATE TABLE IF NOT EXISTS public.drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  drafts_history JSONB DEFAULT '[]'::jsonb
);

-- Enable RLS
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;

-- RLS policies for drafts
CREATE POLICY "Users can view their own drafts"
  ON public.drafts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own drafts"
  ON public.drafts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drafts"
  ON public.drafts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drafts"
  ON public.drafts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create shared_posts table for public sharing
CREATE TABLE IF NOT EXISTS public.shared_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shared_posts ENABLE ROW LEVEL SECURITY;

-- RLS policies for shared_posts
CREATE POLICY "Anyone can view shared posts"
  ON public.shared_posts FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own shared posts"
  ON public.shared_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shared posts"
  ON public.shared_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shared posts"
  ON public.shared_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_shared_posts_updated_at
  BEFORE UPDATE ON public.shared_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_drafts_updated_at
  BEFORE UPDATE ON public.drafts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_shared_posts_share_id ON public.shared_posts(share_id);
CREATE INDEX IF NOT EXISTS idx_drafts_user_id_created_at ON public.drafts(user_id, created_at DESC);

-- Add comments
COMMENT ON COLUMN public.drafts.drafts_history IS 'Array of historical draft entries with content, timestamp, and note';
