import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, Share2, Mail, Globe } from "lucide-react";

interface SocialMediaIconsDropdownProps {
  onFormatClick: (format: string) => void;
}

interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  placeholder: string;
  urlPattern: string;
}

const socialPlatforms: SocialPlatform[] = [
  {
    id: "x",
    name: "X (Twitter)",
    icon: "https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg",
    placeholder: "username",
    urlPattern: "https://x.com/",
  },
  {
    id: "email",
    name: "Email",
    icon: "lucide:mail",
    placeholder: "your@email.com",
    urlPattern: "mailto:",
  },
  {
    id: "discord",
    name: "Discord",
    icon: "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0b5061df29d55a92d945_full_logo_blurple_RGB.svg",
    placeholder: "username#1234 or server invite",
    urlPattern: "https://discord.gg/",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
    placeholder: "@channel or channel-id",
    urlPattern: "https://youtube.com/",
  },
  {
    id: "website",
    name: "Website",
    icon: "lucide:globe",
    placeholder: "https://example.com",
    urlPattern: "",
  },
  {
    id: "dev",
    name: "Dev.to",
    icon: "https://dev-to-uploads.s3.amazonaws.com/uploads/logos/resized_logo_UQww2soKuUsjaOGNB38o.png",
    placeholder: "username",
    urlPattern: "https://dev.to/",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca",
    placeholder: "username or in/username",
    urlPattern: "https://linkedin.com/in/",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "https://static.cdninstagram.com/rsrc.php/v3/yt/r/30PrGfR3xhB.png",
    placeholder: "username",
    urlPattern: "https://instagram.com/",
  },
];

export const SocialMediaIconsDropdown = ({ onFormatClick }: SocialMediaIconsDropdownProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
  const [profileInput, setProfileInput] = useState("");

  const handlePlatformSelect = (platform: SocialPlatform) => {
    setSelectedPlatform(platform);
    setProfileInput("");
    setDialogOpen(true);
  };

  const handleInsert = () => {
    if (!selectedPlatform || !profileInput.trim()) return;

    let profileUrl = profileInput.trim();

    if (selectedPlatform.id === "email") {
      if (!profileUrl.startsWith("mailto:")) {
        profileUrl = "mailto:" + profileUrl;
      }
    } else if (selectedPlatform.id === "website") {
      if (!profileUrl.startsWith("http")) {
        profileUrl = "https://" + profileUrl;
      }
    } else if (!profileUrl.startsWith("http")) {
      profileUrl = selectedPlatform.urlPattern + profileUrl.replace(/^@/, "");
    }

    onFormatClick(`social-${selectedPlatform.id}::${profileUrl}`);

    setDialogOpen(false);
    setProfileInput("");
    setSelectedPlatform(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInsert();
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/10 hover:text-primary"
            title="Insert Social Media Icon"
          >
            <Share2 className="h-4 w-4" />
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-card border-border z-50">
          {socialPlatforms.map((platform) => (
            <DropdownMenuItem
              key={platform.id}
              onClick={() => handlePlatformSelect(platform)}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              {platform.icon === "lucide:mail" ? (
                <span className="mr-2">📧</span>
              ) : platform.icon === "lucide:globe" ? (
                <span className="mr-2">🌐</span>
              ) : (
                <img
                  src={platform.icon}
                  alt={platform.name}
                  className="w-4 h-4 mr-2"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              {platform.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Add {selectedPlatform?.name} Profile
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="profile" className="text-foreground">
                Profile Username or URL
              </Label>
              <Input
                id="profile"
                value={profileInput}
                onChange={(e) => setProfileInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={selectedPlatform?.placeholder}
                className="mt-1.5 bg-background text-foreground border-border"
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter your username or full profile URL
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-border hover:bg-accent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInsert}
              disabled={!profileInput.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Insert Icon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
