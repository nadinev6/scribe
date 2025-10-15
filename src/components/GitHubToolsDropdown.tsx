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
import { Github, FileText, Award, Shield, Package, ChevronDown } from "lucide-react";

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
          <Github className="h-4 w-4" />
          <ChevronDown className="h-3 w-3 ml-1" />
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

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-foreground hover:bg-accent cursor-pointer">
            <Package className="h-4 w-4 mr-2" />
            Technology Badges
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-card border-border max-h-[400px] overflow-y-auto">
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-react')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB"
                alt="React"
                className="h-4 mr-2"
              />
              React
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-typescript')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white"
                alt="TypeScript"
                className="h-4 mr-2"
              />
              TypeScript
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-javascript')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black"
                alt="JavaScript"
                className="h-4 mr-2"
              />
              JavaScript
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-vite')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white"
                alt="Vite"
                className="h-4 mr-2"
              />
              Vite
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-tailwind')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white"
                alt="Tailwind CSS"
                className="h-4 mr-2"
              />
              Tailwind CSS
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-nodejs')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white"
                alt="Node.js"
                className="h-4 mr-2"
              />
              Node.js
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-vue')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/Vue.js-4FC08D?style=flat&logo=vue.js&logoColor=white"
                alt="Vue.js"
                className="h-4 mr-2"
              />
              Vue.js
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-angular')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white"
                alt="Angular"
                className="h-4 mr-2"
              />
              Angular
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-svelte')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/Svelte-FF3E00?style=flat&logo=svelte&logoColor=white"
                alt="Svelte"
                className="h-4 mr-2"
              />
              Svelte
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-nextjs')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white"
                alt="Next.js"
                className="h-4 mr-2"
              />
              Next.js
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-webpack')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/Webpack-8DD6F9?style=flat&logo=webpack&logoColor=black"
                alt="Webpack"
                className="h-4 mr-2"
              />
              Webpack
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-npm')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/npm-CB3837?style=flat&logo=npm&logoColor=white"
                alt="npm"
                className="h-4 mr-2"
              />
              npm
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-yarn')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/Yarn-2C8EBB?style=flat&logo=yarn&logoColor=white"
                alt="Yarn"
                className="h-4 mr-2"
              />
              Yarn
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-pnpm')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/pnpm-F69220?style=flat&logo=pnpm&logoColor=white"
                alt="pnpm"
                className="h-4 mr-2"
              />
              pnpm
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-supabase')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white"
                alt="Supabase"
                className="h-4 mr-2"
              />
              Supabase
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-postgresql')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white"
                alt="PostgreSQL"
                className="h-4 mr-2"
              />
              PostgreSQL
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-mongodb')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white"
                alt="MongoDB"
                className="h-4 mr-2"
              />
              MongoDB
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-express')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white"
                alt="Express"
                className="h-4 mr-2"
              />
              Express
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-bootstrap')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white"
                alt="Bootstrap"
                className="h-4 mr-2"
              />
              Bootstrap
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFormatClick('badge-sass')}
              className="text-foreground hover:bg-accent cursor-pointer"
            >
              <img
                src="https://img.shields.io/badge/Sass-CC6699?style=flat&logo=sass&logoColor=white"
                alt="Sass"
                className="h-4 mr-2"
              />
              Sass
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
