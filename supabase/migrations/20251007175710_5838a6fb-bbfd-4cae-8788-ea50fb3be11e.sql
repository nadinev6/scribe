-- Add drafts_history column to drafts table to store array of historical drafts
ALTER TABLE public.drafts 
ADD COLUMN drafts_history jsonb DEFAULT '[]'::jsonb;

-- Add comment
COMMENT ON COLUMN public.drafts.drafts_history IS 'Array of historical draft entries with content, timestamp, and note';

-- Add updated_at column and trigger for drafts table
ALTER TABLE public.drafts 
ADD COLUMN updated_at timestamp with time zone DEFAULT now();

CREATE TRIGGER update_drafts_updated_at
BEFORE UPDATE ON public.drafts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add RLS policy for updating drafts
CREATE POLICY "Users can update their own drafts"
ON public.drafts
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);