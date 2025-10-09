import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Share2, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface ShareDialogProps {
  markdown: string;
  featuredImage: string;
}

export const ShareDialog = ({ markdown, featuredImage }: ShareDialogProps) => {
  const [open, setOpen] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (shareId) {
      const url = `${window.location.origin}?view=shared&id=${shareId}`;
      setShareUrl(url);
    }
  }, [shareId]);

  const generateShareLink = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to share content",
          variant: "destructive",
        });
        return;
      }

      // Generate a unique share ID
      const newShareId = crypto.randomUUID().split('-')[0];

      if (shareId) {
        // Update existing share
        const { error } = await supabase
          .from("shared_posts")
          .update({
            content: markdown,
            featured_image: featuredImage || null,
          })
          .eq("share_id", shareId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Shared content updated",
        });
      } else {
        // Create new share
        const { error } = await supabase.from("shared_posts").insert({
          share_id: newShareId,
          user_id: user.id,
          content: markdown,
          featured_image: featuredImage || null,
        });

        if (error) throw error;

        setShareId(newShareId);
        toast({
          title: "Success",
          description: "Share link generated",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Error",
        description: "Failed to generate share link",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied",
      description: "Link copied to clipboard",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>Share Your Content</DialogTitle>
          <DialogDescription>
            {shareId
              ? "Update your shared content or copy the link below"
              : "Generate a public link to share your content"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {shareUrl && (
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button onClick={generateShareLink} disabled={loading}>
            {loading
              ? "Processing..."
              : shareId
              ? "Update Shared Content"
              : "Generate Share Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
