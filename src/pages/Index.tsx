import { useState, useRef, useEffect, useCallback } from "react";
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
import { useHistoryManager } from "@/hooks/useHistoryManager";
import { useTextareaState } from "@/hooks/useTextareaState";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/contexts/LanguageContext";
import { Language } from "@/i18n";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useTranslation();

  // Check if we're in shared view mode
  const urlParams = new URLSearchParams(window.location.search);
  const isSharedView = urlParams.get('view') === 'shared';
  const shareId = urlParams.get('id');

  if (isSharedView && shareId) {
    return <SharedView shareId={shareId} />;
  }

  const initialMarkdown = `# Markdown Content Editor 

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

Happy editing! 🎉`;

  const markdownHistory = useHistoryManager(initialMarkdown);
  const plainTextHistory = useHistoryManager("");

  const [featuredImage, setFeaturedImage] = useState("");
  const [isProofreading, setIsProofreading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const plainTextareaRef = useRef<HTMLTextAreaElement>(null);

  const { savePosition: saveMarkdownPosition } = useTextareaState(textareaRef, markdownHistory.present);
  const { savePosition: savePlainTextPosition } = useTextareaState(plainTextareaRef, plainTextHistory.present);

  useEffect(() => {
    const plainTextValue = markdownToPlainText(markdownHistory.present);
    plainTextHistory.updateHistory(plainTextValue);
  }, [markdownHistory.present]);

  const handleMarkdownChange = useCallback((newMarkdown: string) => {
    saveMarkdownPosition();
    markdownHistory.updateHistory(newMarkdown);
  }, [markdownHistory, saveMarkdownPosition]);

  const handlePlainTextChange = useCallback((newPlainText: string) => {
    savePlainTextPosition();
    plainTextHistory.updateHistory(newPlainText);
    const correspondingMarkdown = plainTextToMarkdown(newPlainText);
    markdownHistory.updateHistory(correspondingMarkdown);
  }, [plainTextHistory, markdownHistory, savePlainTextPosition]);

  const handleFormatClick = useCallback((format: string) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;

    const { newText, newCursorPos } = insertMarkdownFormat(markdownHistory.present, start, end, format);
    markdownHistory.updateHistory(newText);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  }, [markdownHistory, textareaRef]);

  const handleEmojiSelect = useCallback((emoji: string) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;

    const before = markdownHistory.present.substring(0, start);
    const after = markdownHistory.present.substring(end);
    const newText = before + emoji + after;

    markdownHistory.updateHistory(newText);

    setTimeout(() => {
      if (textareaRef.current) {
        const newPos = start + emoji.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  }, [markdownHistory, textareaRef]);

  const handleRestore = useCallback((content: string, featuredImageUrl?: string | null) => {
    markdownHistory.resetHistory(content);
    setFeaturedImage(featuredImageUrl || "");
  }, [markdownHistory]);

  const handleProofread = useCallback(async (variant?: 'US' | 'UK' | 'zh-CN' | 'zh-TW') => {
    const proofreadVariant = variant || (language as 'US' | 'UK' | 'zh-CN' | 'zh-TW');
    const contentToProofread = proofreadVariant === 'US' || proofreadVariant === 'UK'
      ? plainTextHistory.present
      : markdownHistory.present;

    if (!contentToProofread.trim()) {
      toast.error('No content to proofread');
      return;
    }

    setIsProofreading(true);
    const languageLabel = proofreadVariant === 'zh-CN' ? 'Simplified Chinese' :
                          proofreadVariant === 'zh-TW' ? 'Traditional Chinese' :
                          `${proofreadVariant} English`;
    toast.loading(`Proofreading with ${languageLabel}...`);

    try {
      const proofreadText = await proofreadWithGemini(contentToProofread, proofreadVariant);

      if (proofreadVariant === 'US' || proofreadVariant === 'UK') {
        plainTextHistory.updateHistory(proofreadText);
        const correspondingMarkdown = plainTextToMarkdown(proofreadText);
        markdownHistory.updateHistory(correspondingMarkdown);
      } else {
        markdownHistory.updateHistory(proofreadText);
      }

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
  }, [markdownHistory, plainTextHistory, language]);

  const renderMarkdown = useCallback(() => {
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

      if (href?.startsWith('social-icon://')) {
        const platformId = href.replace('social-icon://', '');
        const socialIconConfig: Record<string, string> = {
          x: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg',
          discord: 'https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6ca814282eca7172c6_icon_clyde_white_RGB.svg',
          dev: 'https://dev-to-uploads.s3.amazonaws.com/uploads/logos/resized_logo_UQww2soKuUsjaOGNB38o.png',
          youtube: 'https://www.youtube.com/s/desktop/d743f786/img/favicon_144x144.png',
          linkedin: 'https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca',
          instagram: 'https://static.cdninstagram.com/rsrc.php/v3/yt/r/30PrGfR3xhB.png',
          email: '📧',
          website: '🌐',
        };
        const iconUrl = socialIconConfig[platformId];
        if (iconUrl) {
          if (platformId === 'email' || platformId === 'website') {
            return `<span class="inline-block mx-1 align-middle" title="${text}">${iconUrl}</span>`;
          }
          return `<img src="${iconUrl}" alt="${text}" title="${text}" class="inline-block w-5 h-5 mx-1 align-middle" />`;
        }
      }

      return `<img src="${href}" alt="${text}" title="${title || ''}" />`;
    };

    marked.setOptions({
      gfm: true,
      breaks: true,
      renderer: renderer,
    });

    const markdownWithoutComments = stripComments(markdownHistory.present);
    let renderedHtml = marked(markdownWithoutComments) as string;
    renderedHtml = processTocInHtml(renderedHtml);

    return renderedHtml;
  }, [markdownHistory.present]);

  const getRenderedHtml = useCallback(() => {
    return { __html: renderMarkdown() };
  }, [renderMarkdown]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        markdownHistory.undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        markdownHistory.redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [markdownHistory]);

  return (
    <div className="min-h-screen animated-gradient">
      {/* Collapsible History Panel */}
      <CollapsibleHistoryPanel
        onRestore={handleRestore}
        currentContent={markdownHistory.present}
      />

      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="bg-card rounded-xl shadow-2xl overflow-hidden border border-border">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">{t.app.title}</h1>
            <div className="flex gap-4 items-center">
              <LanguageSwitcher
                selectedLanguage={language}
                onLanguageChange={(lang) => setLanguage(lang as Language)}
              />
              <ThemeToggle />

              {isAuthenticated && (
                <div className="flex gap-2 items-center">
                  <ShareDialog markdown={markdownHistory.present} featuredImage={featuredImage} />
                  <MoreActionsDropdown
                    markdown={markdownHistory.present}
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
                {t.tabs.uploadImage}
              </TabsTrigger>
              <TabsTrigger
                value="generate"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {t.tabs.generateWithAI}
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
                {t.tabs.richText}
              </TabsTrigger>
              <TabsTrigger
                value="markdown"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {t.tabs.markdownSource}
              </TabsTrigger>
              <TabsTrigger
                value="plain"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {t.tabs.plainText}
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
                onUndo={markdownHistory.undo}
                onRedo={markdownHistory.redo}
                canUndo={markdownHistory.canUndo}
                canRedo={markdownHistory.canRedo}
              />
              <textarea
                ref={textareaRef}
                value={markdownHistory.present}
                onChange={(e) => handleMarkdownChange(e.target.value)}
                className="w-full min-h-[500px] p-8 bg-editor-bg text-foreground font-mono text-sm resize-none focus:outline-none"
                spellCheck={false}
              />
            </TabsContent>
            
            <TabsContent value="plain" className="m-0">
              <PlainTextToolbar
                onProofread={handleProofread}
                isProofreading={isProofreading}
                plainText={plainTextHistory.present}
                onPlainTextChange={handlePlainTextChange}
                textareaRef={plainTextareaRef}
                onUndo={plainTextHistory.undo}
                onRedo={plainTextHistory.redo}
                canUndo={plainTextHistory.canUndo}
                canRedo={plainTextHistory.canRedo}
                currentLanguage={language}
              />
              <textarea
                ref={plainTextareaRef}
                value={plainTextHistory.present}
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
