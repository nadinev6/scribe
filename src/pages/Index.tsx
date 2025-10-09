import { useState, useRef, useEffect } from "react";
import { marked, Renderer } from "marked";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeaturedImagePlaceholder } from "@/components/FeaturedImagePlaceholder";
import { ImageGenerationChat } from "@/components/ImageGenerationChat";
import { EditorToolbarWithActions } from "@/components/EditorToolbarWithActions";
import { PlainTextToolbar } from "@/components/PlainTextToolbar";
import { MoreActionsDropdown } from "@/components/MoreActionsDropdown";
import { ShareDialog } from "@/components/ShareDialog";
import { CollapsibleHistoryPanel } from "@/components/CollapsibleHistoryPanel";
import { UserMenu } from "@/components/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GitHubStarButton } from "@/components/GitHubStarButton";
import { SharedView } from "./SharedView";
import { markdownToPlainText, insertMarkdownFormat, plainTextToMarkdown } from "@/utils/markdownUtils";
import { processTocInHtml } from "@/utils/tocUtils";
import { proofreadWithGemini } from "@/utils/geminiApi";
import { stripComments } from "@/utils/commentUtils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Index = () => {
  const { isAuthenticated } = useAuth();

  // Check if we're in shared view mode
  const urlParams = new URLSearchParams(window.location.search);
  const isSharedView = urlParams.get('view') === 'shared';
  const shareId = urlParams.get('id');

  if (isSharedView && shareId) {
    return <SharedView shareId={shareId} />;
  }

  const [markdown, setMarkdown] = useState(`# Markdown Content Editor 

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](/LICENSE) [![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#) [![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](#) [![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen.svg)](#)

Welcome to the **Markdown Content Editor**! This editor supports three viewing modes and includes a comprehensive toolbar with advanced formatting options. Explore all the features below.

{{TOC}}

## Heading Styles

The editor supports three levels of headings to create clear document hierarchy.

### Third Level Heading

Use headings to organize your content and create a logical structure. The Table of Contents automatically generates navigation from your headings.

## Text Formatting

Transform your text with multiple formatting options:

- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- ~~Strikethrough~~ for deleted content
- \`inline code\` for technical terms
- Combined: **_bold and italic_** or **~~bold strikethrough~~**

You can mix and match formatting styles to create exactly the look you need.

## Lists

### Unordered Lists

Create bullet-point lists for non-sequential items:

- First item
- Second item
- Third item with sub-items:
  - Nested item A
  - Nested item B
    - Double nested item
- Fourth item

### Ordered Lists

Use numbered lists for sequential steps:

1. First step
2. Second step
3. Third step with details:
   1. Sub-step A
   2. Sub-step B
4. Final step

## Blockquotes

Use blockquotes to highlight important information or citations:

> "Markdown is a lightweight markup language with plain-text formatting syntax. Its design allows it to be converted to many output formats, but the original tool by the same name only supports HTML."
>
> This is a multi-paragraph blockquote that can span multiple lines and include **formatted text**.

## Code Examples

### Inline Code

Use inline code like \`const editor = true\` when referencing code within text.

### Code Blocks

Create multi-line code blocks for larger examples:

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return true;
}

const result = greet("World");
\`\`\`

\`\`\`python
def calculate_sum(a, b):
    """Calculate the sum of two numbers."""
    return a + b

result = calculate_sum(10, 20)
print(f"Result: {result}")
\`\`\`

## Links

Add hyperlinks to external resources: [Visit GitHub](https://github.com) or [Read the Docs](https://docs.example.com)

You can also use [reference-style links][1] for cleaner markdown source.

[1]: https://example.com

## Tables

Create structured data tables with alignment options:

| Feature | Description | Status |
| :--- | :--- | :---: |
| **Rich Text View** | Rendered markdown preview | ✅ |
| **Markdown Source** | Raw markdown editing | ✅ |
| **Plain Text View** | Unformatted text output | ✅ |
| **Toolbar** | Comprehensive formatting tools | ✅ |
| **LLM Icons** | AI model icons | ✅ |

| Syntax | Description | Example |
| :--- | :--- | :--- |
| \`# Heading 1\` | Largest heading | # Like This |
| \`**bold**\` | Bold text | **Bold** |
| \`*italic*\` | Italic text | *Italic* |
| \`[link](url)\` | Hyperlink | [Link](#) |

## LLM Integration

The editor includes built-in support for LLM icons. Sign in to access the LLM Icons dropdown:

Supported AI models: ![Gemini](llm-icon://gemini) ![ChatGPT](llm-icon://chatgpt) ![Claude](llm-icon://claude) ![Perplexity](llm-icon://perplexity) ![Mistral](llm-icon://mistral) ![Groq](llm-icon://groq) ![DeepSeek](llm-icon://deepseek) ![Ollama](llm-icon://ollama) ![Anthropic](llm-icon://anthropic)

## GitHub Tools

Access professional documentation tools via the **GitHub Tools** dropdown:

### Status Badges

Add project badges for licenses, build status, coverage, and more:

- [![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](/LICENSE)
- [![Code of Conduct](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](/CODE_OF_CONDUCT.md)
- [![Contributing](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)](/CONTRIBUTING.md)

### Dynamic Table of Contents

The \`{{TOC}}\` placeholder automatically generates a navigation menu from your document headings.

## Centered Content

Create centered content using HTML alignment:

<div align="center">

**This content is centered**

Perfect for titles, images, or important announcements.

</div>

## Horizontal Rules

Separate sections with horizontal rules:

---

## Getting Started

1. **Switch tabs** to view your content in different formats
2. **Use the toolbar** to format text without remembering markdown syntax
3. **Try GitHub Tools** for badges and table of contents
4. **Sign in** to unlock LLM icons, draft history, and sharing features
5. **Generate images** with AI in the "Generate with AI" tab
6. **Export** your content as Markdown, HTML, or plain text

Happy editing! 🎉`);
  
  const [featuredImage, setFeaturedImage] = useState("");
  const [isProofreading, setIsProofreading] = useState(false);
  const [plainText, setPlainText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const plainTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setPlainText(markdownToPlainText(markdown));
  }, [markdown]);

  const handlePlainTextChange = (newPlainText: string) => {
    setPlainText(newPlainText);
    setMarkdown(plainTextToMarkdown(newPlainText));
  };

  const handleFormatClick = (format: string) => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    
    const { newText, newCursorPos } = insertMarkdownFormat(markdown, start, end, format);
    setMarkdown(newText);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleEmojiSelect = (emoji: string) => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    
    const before = markdown.substring(0, start);
    const after = markdown.substring(end);
    const newText = before + emoji + after;
    
    setMarkdown(newText);
    
    setTimeout(() => {
      if (textareaRef.current) {
        const newPos = start + emoji.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  const handleRestore = (content: string, featuredImage?: string | null) => {
    setMarkdown(content);
    setFeaturedImage(featuredImage || "");
  };

  const handleProofread = async (variant: 'US' | 'UK') => {
    if (!markdown.trim()) {
      toast.error('No content to proofread');
      return;
    }

    setIsProofreading(true);
    toast.loading(`Proofreading with ${variant} English...`);

    try {
      const proofreadText = await proofreadWithGemini(markdown, variant);
      setMarkdown(proofreadText);
      toast.dismiss();
      toast.success('Proofreading Complete!');
    } catch (error) {
      toast.dismiss();
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to proofread content');
      }
    } finally {
      setIsProofreading(false);
    }
  };

  const renderMarkdown = () => {
    const renderer = new Renderer();

    renderer.image = ({ href, title, text }: { href: string; title: string | null; text: string }) => {
      if (href?.startsWith('llm-icon://')) {
        const llmType = href.replace('llm-icon://', '');
        const iconConfig: Record<string, string> = {
          gemini: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/gemini-color.png',
          chatgpt: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/openai.png',
          claude: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/claude-color.png',
          perplexity: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/perplexity-color.png',
          mistral: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/mistral-color.png',
          groq: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/groq.png',
          deepseek: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/deepseek-color.png',
          ollama: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/ollama.png',
          anthropic: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/anthropic.png',
        };
        const iconUrl = iconConfig[llmType];
        if (iconUrl) {
          return `<img src="${iconUrl}" alt="${text}" title="${text}" class="inline-block w-6 h-6 mx-1 align-middle" />`;
        }
      }
      return `<img src="${href}" alt="${text}" title="${title || ''}" />`;
    };

    marked.setOptions({
      gfm: true,
      breaks: true,
      renderer: renderer,
    });

    const markdownWithoutComments = stripComments(markdown);
    let renderedHtml = marked(markdownWithoutComments) as string;
    renderedHtml = processTocInHtml(renderedHtml);

    return renderedHtml;
  };

  const getRenderedHtml = () => {
    return { __html: renderMarkdown() };
  };

  return (
    <div className="min-h-screen animated-gradient">
      {/* Collapsible History Panel */}
      <CollapsibleHistoryPanel 
        onRestore={handleRestore}
        currentContent={markdown}
      />

      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="bg-card rounded-xl shadow-2xl overflow-hidden border border-border">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Markdown Content Editor</h1>
            <div className="flex gap-4 items-center">
              <ThemeToggle />

              {isAuthenticated && (
                <div className="flex gap-2 items-center">
                  <ShareDialog markdown={markdown} featuredImage={featuredImage} />
                  <MoreActionsDropdown
                    markdown={markdown}
                    featuredImage={featuredImage}
                    htmlContent={renderMarkdown()}
                  />
                </div>
              )}

              <div className="flex gap-2 items-center pl-4 border-l border-border">
                <GitHubStarButton />
              </div>
            </div>
          </div>

          {/* Floating User Menu */}
          <UserMenu />
          
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-toolbar-bg px-6">
              <TabsTrigger
                value="upload"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Upload Image
              </TabsTrigger>
              <TabsTrigger
                value="generate"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Generate with AI
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="m-0 p-6">
              <FeaturedImagePlaceholder
                imageUrl={featuredImage}
                onImageChange={setFeaturedImage}
              />
            </TabsContent>

            <TabsContent value="generate" className="m-0">
              <ImageGenerationChat onImageGenerated={setFeaturedImage} />
            </TabsContent>
          </Tabs>
          
          <Tabs defaultValue="rich" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-toolbar-bg px-6">
              <TabsTrigger 
                value="rich"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Rich Text
              </TabsTrigger>
              <TabsTrigger 
                value="markdown"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Markdown Source
              </TabsTrigger>
              <TabsTrigger 
                value="plain"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Plain Text
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="rich" className="m-0">
              <div className="p-8 prose max-w-none" style={{ lineHeight: '1.8' }}>
                <div dangerouslySetInnerHTML={getRenderedHtml()} />
              </div>
            </TabsContent>
            
            <TabsContent value="markdown" className="m-0">
              <EditorToolbarWithActions
                onFormatClick={handleFormatClick}
                onEmojiSelect={handleEmojiSelect}
              />
              <textarea
                ref={textareaRef}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full min-h-[500px] p-8 bg-editor-bg text-foreground font-mono text-sm resize-none focus:outline-none"
                spellCheck={false}
              />
            </TabsContent>
            
            <TabsContent value="plain" className="m-0">
              <PlainTextToolbar
                onProofread={handleProofread}
                isProofreading={isProofreading}
                plainText={plainText}
                onPlainTextChange={handlePlainTextChange}
                textareaRef={plainTextareaRef}
              />
              <textarea
                ref={plainTextareaRef}
                value={plainText}
                onChange={(e) => handlePlainTextChange(e.target.value)}
                className="w-full min-h-[500px] p-8 bg-editor-bg text-foreground font-mono text-sm resize-none focus:outline-none"
                spellCheck={false}
              />
            </TabsContent>
            
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
