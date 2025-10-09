import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LlmIconProps {
  llmType: string;
}

const LLM_CONFIG = {
  gemini: {
    name: "Gemini",
    iconUrl: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/gemini-color.png",
    color: "text-foreground",
    bgColor: "bg-accent",
  },
  chatgpt: {
    name: "ChatGPT",
    iconUrl: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/openai.png",
    color: "text-foreground",
    bgColor: "bg-accent",
  },
  claude: {
    name: "Claude",
    iconUrl: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/claude-color.png",
    color: "text-foreground",
    bgColor: "bg-accent",
  },
  perplexity: {
    name: "Perplexity",
    iconUrl: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/perplexity-color.png",
    color: "text-foreground",
    bgColor: "bg-accent",
  },
  mistral: {
    name: "Mistral",
    iconUrl: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/mistral-color.png",
    color: "text-foreground",
    bgColor: "bg-accent",
  },
  groq: {
    name: "Groq",
    iconUrl: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/groq.png",
    color: "text-foreground",
    bgColor: "bg-accent",
  },
  deepseek: {
    name: "DeepSeek",
    iconUrl: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/deepseek-color.png",
    color: "text-foreground",
    bgColor: "bg-accent",
  },
  ollama: {
    name: "Ollama",
    iconUrl: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/ollama.png",
    color: "text-foreground",
    bgColor: "bg-accent",
  },
  anthropic: {
    name: "Anthropic",
    iconUrl: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/anthropic.png",
    color: "text-foreground",
    bgColor: "bg-accent",
  },
};

export const LlmIcon = ({ llmType }: LlmIconProps) => {
  const config = LLM_CONFIG[llmType as keyof typeof LLM_CONFIG];
  
  if (!config) return null;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`inline-flex items-center gap-2 ${config.bgColor} ${config.color} border-current hover:opacity-80`}
        >
          <img src={config.iconUrl} alt={config.name} className="w-4 h-4" />
          <span className="font-medium">{config.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card border-border z-50">
        <DropdownMenuItem className="text-foreground hover:bg-accent">
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem className="text-foreground hover:bg-accent">
          Copy Model Name
        </DropdownMenuItem>
        <DropdownMenuItem className="text-foreground hover:bg-accent">
          Learn More
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
