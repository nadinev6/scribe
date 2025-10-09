import { useState, useEffect } from "react";
import { Star, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GitHubStarButtonProps {
  repoUrl?: string;
  owner?: string;
  repo?: string;
}

interface GitHubRepoData {
  stargazers_count: number;
}

export const GitHubStarButton = ({
  repoUrl = "https://github.com/nadinev6/multi-view-scribe",
  owner = "nadinev6",
  repo = "multi-view-scribe"
}: GitHubStarButtonProps) => {
  const [starCount, setStarCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (response.ok) {
          const data: GitHubRepoData = await response.json();
          setStarCount(data.stargazers_count);
        }
      } catch (error) {
        console.error("Failed to fetch GitHub stars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStarCount();
  }, [owner, repo]);

  const handleClick = () => {
    window.open(repoUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="sm"
      className="group"
      aria-label="Star on GitHub"
    >
      <Github className="w-4 h-4 mr-2" />
      <span>Star on GitHub</span>
      <span className="flex items-center ml-3 pl-3 border-l border-border">
        <Star className="text-yellow-500 w-4 h-4 fill-yellow-500" />
        <span className="ml-1.5">{loading ? "..." : starCount}</span>
      </span>
    </Button>
  );
};
