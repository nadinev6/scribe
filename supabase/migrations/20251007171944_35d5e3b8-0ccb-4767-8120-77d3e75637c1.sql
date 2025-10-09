-- Fix security warning: Drop trigger, then function, then recreate with proper settings
DROP TRIGGER IF EXISTS update_shared_posts_updated_at ON public.shared_posts;
DROP FUNCTION IF EXISTS public.update_updated_at_column();

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

-- Recreate trigger
CREATE TRIGGER update_shared_posts_updated_at
  BEFORE UPDATE ON public.shared_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();