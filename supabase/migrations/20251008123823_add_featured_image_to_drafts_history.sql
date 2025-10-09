/*
  # Update drafts_history structure to include featured images

  1. Changes
    - Update the drafts_history JSONB column structure to support featured_image field
    - Each history entry will now contain: content, timestamp, note (optional), and featuredImage (optional)
    
  2. Notes
    - This is a non-breaking change as we're adding an optional field to the JSONB structure
    - Existing history entries without featuredImage will continue to work
    - The JSONB structure allows for flexible schema evolution
    
  3. Documentation
    - Update column comment to reflect the new structure including featured images
*/

-- Update the comment on the drafts_history column to document the new structure
COMMENT ON COLUMN public.drafts.drafts_history IS 'Array of historical draft entries with content, timestamp, note (optional), and featuredImage (optional)';
