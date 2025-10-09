import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Quote,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link,
  Image,
  Table,
  Sparkles,
  Bot,
  Cpu,
  ChevronDown,
  AlignCenter,
  MessageSquare
} from "lucide-react";

interface EditorToolbarProps {
  onFormatClick: (format: string) => void;
}

export const EditorToolbar = ({ onFormatClick }: EditorToolbarProps) => {
  return (
    <div className="flex flex-wrap gap-1 p-2 bg-toolbar-bg border-b border-border">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('h1')}
        className="hover:bg-primary/10 hover:text-primary"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('h2')}
        className="hover:bg-primary/10 hover:text-primary"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('h3')}
        className="hover:bg-primary/10 hover:text-primary"
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-1" />
      
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('bold')}
        className="hover:bg-primary/10 hover:text-primary"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('italic')}
        className="hover:bg-primary/10 hover:text-primary"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('strikethrough')}
        className="hover:bg-primary/10 hover:text-primary"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('code')}
        className="hover:bg-primary/10 hover:text-primary"
      >
        <Code className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-1" />
      
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('quote')}
        className="hover:bg-primary/10 hover:text-primary"
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('ul')}
        className="hover:bg-primary/10 hover:text-primary"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('ol')}
        className="hover:bg-primary/10 hover:text-primary"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-1" />
      
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('link')}
        className="hover:bg-primary/10 hover:text-primary"
      >
        <Link className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('image')}
        className="hover:bg-primary/10 hover:text-primary"
      >
        <Image className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormatClick('table')}
        className="hover:bg-primary/10 hover:text-primary"
        title="Insert Table"
      >
        <Table className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormatClick('center')}
        className="hover:bg-primary/10 hover:text-primary"
        title="Center Content (GitHub-compatible)"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormatClick('comment')}
        className="hover:bg-primary/10 hover:text-primary"
        title="Insert Comment (Private Note)"
      >
        <MessageSquare className="h-4 w-4" />
      </Button>
    </div>
  );
};
