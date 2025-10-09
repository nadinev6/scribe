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
import { BookOpen, FileText, Award, Shield } from "lucide-react";

interface GitHubToolsDropdownProps {
  onFormatClick: (format: string) => void;
}

export const GitHubToolsDropdown = ({ onFormatClick }: GitHubToolsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-primary/10 hover:text-primary"
          title="GitHub Documentation Tools"
        >
          <BookOpen className="h-4 w-4 mr-1" />
          GitHub Tools
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card border-border z-50 w-64">
        <DropdownMenuItem
          onClick={() => onFormatClick('toc')}
          className="text-foreground hover:bg-accent cursor-pointer"
        >
          <FileText className="h-4 w-4 mr-2" />
          Insert Table of Contents
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-foreground hover:bg-accent cursor-pointer">
            <Award className="h-4 w-4 mr-2" />
            License Badges
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-card border-border">
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-mit')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/License-MIT-blue.svg"
                alt="MIT License"
                className="h-4 mr-2"
              />
              MIT License
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-apache')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/License-Apache%202.0-blue.svg"
                alt="Apache 2.0"
                className="h-4 mr-2"
              />
              Apache 2.0
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-gpl')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/License-GPLv3-blue.svg"
                alt="GPL v3"
                className="h-4 mr-2"
              />
              GPL v3
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-foreground hover:bg-accent cursor-pointer">
            <Shield className="h-4 w-4 mr-2" />
            Project Badges
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-card border-border">
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-coc')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg"
                alt="Code of Conduct"
                className="h-4 mr-2"
              />
              Code of Conduct
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-contributing')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg"
                alt="Contributing"
                className="h-4 mr-2"
              />
              Contributing
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-build')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/build-passing-brightgreen.svg"
                alt="Build Status"
                className="h-4 mr-2"
              />
              Build Status
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-coverage')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/coverage-95%25-brightgreen.svg"
                alt="Coverage"
                className="h-4 mr-2"
              />
              Coverage
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-version')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/version-1.0.0-blue.svg"
                alt="Version"
                className="h-4 mr-2"
              />
              Version
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
