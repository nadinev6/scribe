import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SaveDraftDialogProps {
  content: string;
  featuredImage?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const SaveDraftDialog = ({
  content,
  featuredImage,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: SaveDraftDialogProps) => {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to save drafts");
        return;
      }

      // Create new history entry
      const newHistoryEntry = {
        content,
        timestamp: Date.now(),
        note: note.trim() || undefined,
        featuredImage: featuredImage || undefined,
      };

      // Check if user has a draft document
      const { data: existingDraft } = await supabase
        .from("drafts")
        .select("id, drafts_history")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingDraft) {
        // Get existing history, ensure it's an array
        let history = Array.isArray(existingDraft.drafts_history) ? existingDraft.drafts_history : [];
        
        // Add new entry to the beginning
        history.unshift(newHistoryEntry);
        
        // Limit to 10 entries
        if (history.length > 10) {
          history = history.slice(0, 10);
        }

        // Update existing draft
        const { error } = await supabase
          .from("drafts")
          .update({
            content,
            featured_image: featuredImage,
            drafts_history: history,
          })
          .eq("id", existingDraft.id);

        if (error) throw error;
      } else {
        // Create new draft with history
        const { error } = await supabase
          .from("drafts")
          .insert({
            user_id: user.id,
            content,
            featured_image: featuredImage,
            drafts_history: [newHistoryEntry],
          });

        if (error) throw error;
      }

      toast.success("Draft saved successfully!");
      setNote("");
      setOpen(false);
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {controlledOpen === undefined && (
        <DialogTrigger asChild>
          <Button variant="outline" className="border-border hover:bg-accent">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Save Draft</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="note" className="text-foreground">Note (Optional)</Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this version..."
              className="mt-1.5 bg-background text-foreground border-border"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This draft will be added to your history (limit: 10 entries)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={saving}
            className="border-border hover:bg-accent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {saving ? "Saving..." : "Save Draft"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
