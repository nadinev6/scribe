import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { usePollinationsImage } from "@/hooks/pollinations";
import { useTranslation } from "@/contexts/LanguageContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
}

interface ImageGenerationChatProps {
  onImageGenerated?: (url: string) => void;
}

export const ImageGenerationChat = ({ onImageGenerated }: ImageGenerationChatProps) => {
  const { t, language } = useTranslation();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: t.imageGeneration.greeting
    }
  ]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { generateImage } = usePollinationsImage();

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: t.imageGeneration.greeting
      }
    ]);
  }, [language, t.imageGeneration.greeting]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleGenerate = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    setInput("");

    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsGenerating(true);

    try {
      const enhancedPrompt = `Create a professional, high-quality featured image. ${userMessage}. The image should be suitable for a blog post header with good composition and visual appeal.`;
      const encodedPrompt = encodeURIComponent(enhancedPrompt);

      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1900&height=900&nologo=true`;

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: t.imageGeneration.successMessage,
          imageUrl: imageUrl
        }
      ]);
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate image";
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I encountered an error: ${errorMessage}. Please try again with a different prompt.`
        }
      ]);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseImage = (imageUrl: string) => {
    onImageGenerated?.(imageUrl);
    toast.success("Image set as featured image!");
  };

  return (
    <div className="flex flex-col h-[700px] bg-card">
      <div className="p-4 border-b border-border bg-toolbar-bg">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">{t.imageGeneration.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {t.imageGeneration.subtitle}
        </p>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.imageUrl && (
                  <div className="mt-3 space-y-3">
                    <div className="rounded-lg overflow-hidden" style={{ maxHeight: '400px' }}>
                      <img
                        src={message.imageUrl}
                        alt="Generated"
                        className="rounded-lg w-full h-full object-contain"
                      />
                    </div>
                    <Button
                      onClick={() => handleUseImage(message.imageUrl!)}
                      className="w-full"
                      variant="secondary"
                    >
                      {t.imageGeneration.useThisImage}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-4 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">{t.imageGeneration.generating}</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder={t.imageGeneration.placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleGenerate()}
            disabled={isGenerating}
          />
          <Button
            onClick={handleGenerate}
            disabled={!input.trim() || isGenerating}
            className="shrink-0"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {t.imageGeneration.examplePrompts}
        </p>
      </div>
    </div>
  );
};
