import { useEffect, useState } from "react";
import { marked, Renderer } from "marked";
import { supabase } from "@/integrations/supabase/client";
import { processTocInHtml } from "@/utils/tocUtils";
import { stripComments } from "@/utils/commentUtils";

interface SharedPost {
  content: string;
  featured_image: string | null;
}

export const SharedView = ({ shareId }: { shareId: string }) => {
  const [post, setPost] = useState<SharedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSharedPost();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`shared-post-${shareId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "shared_posts",
          filter: `share_id=eq.${shareId}`,
        },
        (payload) => {
          setPost(payload.new as SharedPost);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shareId]);

  const loadSharedPost = async () => {
    try {
      const { data, error } = await supabase
        .from("shared_posts")
        .select("content, featured_image")
        .eq("share_id", shareId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setError("Shared content not found");
      } else {
        setPost(data);
      }
    } catch (err) {
      console.error("Error loading shared post:", err);
      setError("Failed to load shared content");
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdown = (markdown: string) => {
    const renderer = new Renderer();

    renderer.image = ({ href, title, text }: { href: string; title: string | null; text: string }) => {
      if (href?.startsWith("llm-icon://")) {
        const llmType = href.replace("llm-icon://", "");
        const iconConfig: Record<string, string> = {
          gemini: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/gemini-color.png',
          chatgpt: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/openai-color.png',
          claude: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/claude-color.png',
          perplexity: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/perplexity-color.png',
          mistral: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/mistral-color.png',
          groq: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/groq-color.png',
          deepseek: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/deepseek-color.png',
          ollama: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/ollama-color.png',
          anthropic: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/anthropic-color.png',
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
          email: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect width="20" height="16" x="2" y="4" rx="2"/%3E%3Cpath d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/%3E%3C/svg%3E',
          website: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Ccircle cx="12" cy="12" r="10"/%3E%3Cpath d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/%3E%3Cpath d="M2 12h20"/%3E%3C/svg%3E',
        };
        const iconUrl = socialIconConfig[platformId];
        if (iconUrl) {
          return `<img src="${iconUrl}" alt="${text}" title="${text}" class="inline-block w-5 h-5 mx-1 align-middle" />`;
        }
      }

      return `<img src="${href}" alt="${text}" title="${title || ""}" />`;
    };

    marked.setOptions({
      gfm: true,
      breaks: true,
      renderer: renderer,
    });

    const markdownWithoutComments = stripComments(markdown);
    let renderedHtml = marked(markdownWithoutComments) as string;
    renderedHtml = processTocInHtml(renderedHtml);

    return { __html: renderedHtml };
  };


  if (loading) {
    return (
      <div className="min-h-screen animated-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading shared content...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen animated-gradient flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg mb-2">{error || "Content not found"}</p>
          <p className="text-muted-foreground">This link may be invalid or expired</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-gradient">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="bg-card rounded-xl shadow-2xl overflow-hidden border border-border">
          {post.featured_image && (
            <div className="w-full overflow-hidden bg-muted">
              <img
                src={post.featured_image}
                alt="Featured"
                className="w-full aspect-[19/9] object-cover"
              />
            </div>
          )}
          <div className="p-8 prose max-w-none" style={{ lineHeight: '1.8' }}>
            <div dangerouslySetInnerHTML={renderMarkdown(post.content)} />
          </div>
        </div>
      </div>
    </div>
  );
};
