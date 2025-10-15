import { EditorToolbar } from "./EditorToolbar";
import { EmojiPicker } from "./EmojiPicker";
import { GitHubToolsDropdown } from "./GitHubToolsDropdown";
import { SocialMediaIconsDropdown } from "./SocialMediaIconsDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface EditorToolbarWithActionsProps {
  onFormatClick: (format: string) => void;
  onEmojiSelect: (emoji: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const EditorToolbarWithActions = ({
  onFormatClick,
  onEmojiSelect,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}: EditorToolbarWithActionsProps) => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleLlmIconClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use LLM Icons",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 p-2 bg-toolbar-bg border-b border-border">
      <div className="flex items-center gap-1 flex-wrap flex-1">
        <EditorToolbar
          onFormatClick={onFormatClick}
          onUndo={onUndo}
          onRedo={onRedo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      </div>

      <div className="flex items-center gap-1">
        <GitHubToolsDropdown onFormatClick={onFormatClick} />
        <SocialMediaIconsDropdown onFormatClick={onFormatClick} />
        <EmojiPicker onEmojiSelect={onEmojiSelect} />

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-primary/10 hover:text-primary"
                title="Insert LLM Icon"
              >
                <img
                  src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/openai.png"
                  alt="AI"
                  className="w-4 h-4"
                />
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-border z-50">
            <DropdownMenuItem 
              onClick={() => onFormatClick('llm-gemini')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img 
                src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/gemini-color.png" 
                alt="Gemini"
                className="w-4 h-4 mr-2"
              />
              Gemini
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onFormatClick('llm-chatgpt')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/openai.png"
                alt="ChatGPT"
                className="w-4 h-4 mr-2"
              />
              ChatGPT
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onFormatClick('llm-claude')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img 
                src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/claude-color.png" 
                alt="Claude"
                className="w-4 h-4 mr-2"
              />
              Claude
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onFormatClick('llm-perplexity')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img 
                src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/perplexity-color.png" 
                alt="Perplexity"
                className="w-4 h-4 mr-2"
              />
              Perplexity
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onFormatClick('llm-mistral')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img 
                src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/mistral-color.png" 
                alt="Mistral"
                className="w-4 h-4 mr-2"
              />
              Mistral
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onFormatClick('llm-groq')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/groq.png"
                alt="Groq"
                className="w-4 h-4 mr-2"
              />
              Groq
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onFormatClick('llm-deepseek')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img 
                src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/deepseek-color.png" 
                alt="DeepSeek"
                className="w-4 h-4 mr-2"
              />
              DeepSeek
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onFormatClick('llm-ollama')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/ollama.png"
                alt="Ollama"
                className="w-4 h-4 mr-2"
              />
              Ollama
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onFormatClick('llm-anthropic')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/anthropic.png"
                alt="Anthropic"
                className="w-4 h-4 mr-2"
              />
              Anthropic
            </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/10 hover:text-primary opacity-50"
            title="Sign in to use LLM Icons"
            onClick={handleLlmIconClick}
          >
            <Lock className="h-3 w-3 mr-1" />
            <img
              src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/openai.png"
              alt="AI"
              className="w-4 h-4"
            />
          </Button>
        )}
      </div>
    </div>
  );
};
