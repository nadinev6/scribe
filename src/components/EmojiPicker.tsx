import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from "lucide-react";
import EmojiPickerReact, { EmojiClickData } from "emoji-picker-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  const [open, setOpen] = useState(false);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="hover:bg-primary/10 hover:text-primary"
          title="Insert Emoji"
        >
          <Smile className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-card border-border z-50" align="start">
        <EmojiPickerReact onEmojiClick={handleEmojiClick} />
      </PopoverContent>
    </Popover>
  );
};
