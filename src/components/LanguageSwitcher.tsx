import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export const LanguageSwitcher = ({ selectedLanguage, onLanguageChange }: LanguageSwitcherProps) => {
  const languages = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'zh-CN', label: '中文简体', flag: '🇨🇳' },
    { value: 'zh-TW', label: '中文繁體', flag: '🇹🇼' },
  ];

  const currentLanguage = languages.find(lang => lang.value === selectedLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          title="Change Language"
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card border-border z-50">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.value}
            onClick={() => onLanguageChange(language.value)}
            className={`text-foreground hover:bg-accent cursor-pointer ${
              selectedLanguage === language.value ? 'bg-accent' : ''
            }`}
          >
            <span className="mr-2">{language.flag}</span>
            {language.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
