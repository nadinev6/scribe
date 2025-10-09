import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles, MessageSquare } from "lucide-react";
import { RefObject } from "react";

interface PlainTextToolbarProps {
  onProofread: (variant: 'US' | 'UK') => void;
  isProofreading: boolean;
  plainText: string;
  onPlainTextChange: (text: string) => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
}

export const PlainTextToolbar = ({
  onProofread,
  isProofreading,
  plainText,
  onPlainTextChange,
  textareaRef
}: PlainTextToolbarProps) => {
  const handleCommentClick = () => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;

    const before = plainText.substring(0, start);
    const selected = plainText.substring(start, end);
    const after = plainText.substring(end);

    let insert = '';
    let cursorOffset = 11;

    if (selected) {
      insert = `[[comment: ${selected}]]`;
      cursorOffset = 11;
    } else {
      insert = '[[comment: Your note here]]';
      cursorOffset = 11;
    }

    const newText = before + insert + after;
    onPlainTextChange(newText);

    setTimeout(() => {
      if (textareaRef.current) {
        const newPos = start + cursorOffset;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-toolbar-bg border-b border-border">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            size="sm"
            disabled={isProofreading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isProofreading ? 'Proofreading...' : 'Proofread & Fix'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => onProofread('US')}>
            US English
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onProofread('UK')}>
            UK English
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={handleCommentClick}
        className="hover:bg-primary/10 hover:text-primary"
        title="Insert Comment (Private Note)"
      >
        <MessageSquare className="h-4 w-4" />
      </Button>
    </div>
  );
};
