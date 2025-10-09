-- Create drafts table to store content history
CREATE TABLE public.drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;

-- RLS policies for drafts
CREATE POLICY "Users can view their own drafts"
  ON public.drafts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own drafts"
  ON public.drafts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drafts"
  ON public.drafts FOR DELETE
  USING (auth.uid() = user_id);

-- Create shared_posts table for public sharing
CREATE TABLE public.shared_posts (
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
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shared posts"
  ON public.shared_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shared posts"
  ON public.shared_posts FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_shared_posts_updated_at
  BEFORE UPDATE ON public.shared_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_shared_posts_share_id ON public.shared_posts(share_id);
CREATE INDEX idx_drafts_user_id_created_at ON public.drafts(user_id, created_at DESC);