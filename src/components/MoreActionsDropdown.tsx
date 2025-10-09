import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Save, Download, Copy, FolderArchive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { downloadMarkdownFile, downloadHtmlFile, copyMarkdownForPlatform, downloadGitHubExport, downloadDevToExport } from "@/utils/exportUtils";
import { SaveDraftDialog } from "./SaveDraftDialog";
import { useAuth } from "@/contexts/AuthContext";

interface MoreActionsDropdownProps {
  markdown: string;
  featuredImage: string;
  htmlContent: string;
}

export const MoreActionsDropdown = ({
  markdown,
  featuredImage,
  htmlContent,
}: MoreActionsDropdownProps) => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [saveDraftOpen, setSaveDraftOpen] = useState(false);

  const handleAuthCheck = (action: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: `Please sign in to ${action}`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleExportMarkdown = () => {
    if (!handleAuthCheck("export markdown")) return;
    const timestamp = new Date().toISOString().split("T")[0];
    downloadMarkdownFile(markdown, `document-${timestamp}.md`);
    toast({
      title: "Markdown Exported",
      description: "Your markdown file has been downloaded",
    });
  };

  const handleExportHtml = () => {
    if (!handleAuthCheck("export HTML")) return;
    const timestamp = new Date().toISOString().split("T")[0];
    downloadHtmlFile(htmlContent, `document-${timestamp}.html`);
    toast({
      title: "HTML Exported",
      description: "Your HTML file has been downloaded",
    });
  };

  const handleExportForGitHub = () => {
    if (!handleAuthCheck("export for GitHub")) return;
    const exported = copyMarkdownForPlatform(markdown, "github");
    navigator.clipboard.writeText(exported);
    toast({
      title: "Copied to Clipboard",
      description: "Content ready for GitHub - paste it directly into your README",
    });
  };

  const handleExportForDevTo = () => {
    if (!handleAuthCheck("export for Dev.to")) return;
    const exported = copyMarkdownForPlatform(markdown, "devto");
    navigator.clipboard.writeText(exported);
    toast({
      title: "Copied to Clipboard",
      description: "Content ready for Dev.to - paste it directly into your blog post",
    });
  };

  const handleExportGitHubFolder = async () => {
    if (!handleAuthCheck("export GitHub package")) return;

    toast({
      title: "Preparing Export",
      description: "Collecting images and creating ZIP file...",
    });

    try {
      await downloadGitHubExport(markdown, featuredImage);
      toast({
        title: "GitHub Package Ready",
        description: "ZIP file downloaded with README.md and images folder",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error creating the export package",
        variant: "destructive",
      });
    }
  };

  const handleExportDevToFolder = async () => {
    if (!handleAuthCheck("export Dev.to package")) return;

    toast({
      title: "Preparing Export",
      description: "Collecting images and creating ZIP file...",
    });

    try {
      await downloadDevToExport(markdown, featuredImage);
      toast({
        title: "Dev.to Package Ready",
        description: "ZIP file downloaded with article.md and images folder",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error creating the export package",
        variant: "destructive",
      });
    }
  };

  const handleSaveDraft = () => {
    if (!handleAuthCheck("save draft")) return;
    setSaveDraftOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreVertical className="w-4 h-4 mr-2" />
            More Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-card border-border z-50 w-64">
          <DropdownMenuItem
            onClick={handleSaveDraft}
            className="text-foreground hover:bg-accent cursor-pointer"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleExportMarkdown}
            className="text-foreground hover:bg-accent cursor-pointer"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Markdown File
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleExportHtml}
            className="text-foreground hover:bg-accent cursor-pointer"
          >
            <Download className="h-4 w-4 mr-2" />
            Export HTML File
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-foreground hover:bg-accent cursor-pointer">
              <Copy className="h-4 w-4 mr-2" />
              Copy for Platform
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-card border-border">
              <DropdownMenuItem
                onClick={handleExportForGitHub}
                className="text-foreground hover:bg-accent cursor-pointer"
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub README
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleExportForDevTo}
                className="text-foreground hover:bg-accent cursor-pointer"
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.3zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z"/>
                </svg>
                Dev.to Blog
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-foreground hover:bg-accent cursor-pointer">
              <FolderArchive className="h-4 w-4 mr-2" />
              Download Platform Package
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-card border-border">
              <DropdownMenuItem
                onClick={handleExportGitHubFolder}
                className="text-foreground hover:bg-accent cursor-pointer"
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub Package (ZIP)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleExportDevToFolder}
                className="text-foreground hover:bg-accent cursor-pointer"
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.3zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z"/>
                </svg>
                Dev.to Package (ZIP)
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>

      <SaveDraftDialog
        content={markdown}
        featuredImage={featuredImage}
        open={saveDraftOpen}
        onOpenChange={setSaveDraftOpen}
      />
    </>
  );
};
