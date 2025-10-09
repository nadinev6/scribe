import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronLeft, Clock, FileText, Trash2, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DraftHistoryEntry {
  content: string;
  timestamp: number;
  note?: string;
  featuredImage?: string;
}

interface CollapsibleHistoryPanelProps {
  onRestore: (content: string, featuredImage?: string | null) => void;
  currentContent: string;
}

export const CollapsibleHistoryPanel = ({ onRestore, currentContent }: CollapsibleHistoryPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<DraftHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to view history");
        return;
      }

      const { data, error } = await supabase
        .from("drafts")
        .select("drafts_history")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data?.drafts_history) {
        const historyData = data.drafts_history as unknown as DraftHistoryEntry[];
        setHistory(Array.isArray(historyData) ? historyData : []);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error("Error loading history:", error);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = (entry: DraftHistoryEntry) => {
    onRestore(entry.content, entry.featuredImage);
    toast.success("Draft restored successfully");
  };

  const handleDelete = async (index: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please sign in to delete history");
        return;
      }

      const { data: existingDraft } = await supabase
        .from("drafts")
        .select("id, drafts_history")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!existingDraft) return;

      let updatedHistory = Array.isArray(existingDraft.drafts_history)
        ? [...existingDraft.drafts_history]
        : [];

      updatedHistory.splice(index, 1);

      const { error } = await supabase
        .from("drafts")
        .update({ drafts_history: updatedHistory })
        .eq("id", existingDraft.id);

      if (error) throw error;

      setHistory(updatedHistory);
      toast.success("History entry deleted");
    } catch (error) {
      console.error("Error deleting history entry:", error);
      toast.error("Failed to delete history entry");
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPreview = (content: string) => {
    const plainText = content.replace(/[#*_~`]/g, "").trim();
    return plainText.substring(0, 60) + (plainText.length > 60 ? "..." : "");
  };

  return (
    <>
      {/* Collapsed state - toggle button */}
      {!isOpen && (
        <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsOpen(true)}
            className="rounded-l-none rounded-r-lg shadow-lg bg-card border-border hover:bg-accent"
            title="Show draft history"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Expanded state - panel */}
      {isOpen && (
        <div className="fixed left-0 top-0 h-full w-80 bg-card border-r border-border shadow-xl z-40 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">Draft History</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-4">
            {loading ? (
              <div className="text-center text-muted-foreground py-8">
                Loading history...
              </div>
            ) : history.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No draft history yet</p>
                <p className="text-sm mt-2">Save drafts to build your history</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((entry, index) => (
                  <div
                    key={index}
                    className="p-3 bg-accent/50 rounded-lg border border-border hover:border-primary transition-colors relative group"
                  >
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(index)}
                      className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                      title="Delete this entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1">
                          {formatDate(entry.timestamp)}
                        </p>
                        {entry.note && (
                          <p className="text-sm font-medium text-foreground mb-1 truncate">
                            {entry.note}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {getPreview(entry.content)}
                        </p>
                      </div>
                    </div>
                    {entry.featuredImage && (
                      <div className="mt-2 mb-2 rounded overflow-hidden border border-border">
                        <img
                          src={entry.featuredImage}
                          alt="Featured"
                          className="w-full h-20 object-cover"
                        />
                      </div>
                    )}
                    {!entry.featuredImage && (
                      <div className="mt-2 mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <Image className="h-3 w-3" />
                        <span>No image</span>
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRestore(entry)}
                      className="w-full mt-2 hover:bg-primary hover:text-primary-foreground"
                    >
                      Restore
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </>
  );
};