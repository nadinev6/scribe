import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>("system");
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const updateEffectiveTheme = (currentTheme: Theme) => {
    const newEffectiveTheme = currentTheme === "system" ? getSystemTheme() : currentTheme;
    setEffectiveTheme(newEffectiveTheme);

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(newEffectiveTheme);
    root.setAttribute("data-theme", newEffectiveTheme);

    document.body.style.transition = "background-color 0.3s ease, color 0.3s ease";
  };

  const loadThemePreference = async () => {
    try {
      const localTheme = localStorage.getItem("theme") as Theme | null;

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: preferences } = await supabase
          .from("user_preferences")
          .select("theme")
          .eq("user_id", user.id)
          .maybeSingle();

        if (preferences?.theme) {
          const savedTheme = preferences.theme as Theme;
          setThemeState(savedTheme);
          updateEffectiveTheme(savedTheme);
          localStorage.setItem("theme", savedTheme);
          return;
        }
      }

      if (localTheme) {
        setThemeState(localTheme);
        updateEffectiveTheme(localTheme);
      } else {
        const systemTheme = getSystemTheme();
        setThemeState("system");
        updateEffectiveTheme("system");
      }
    } catch (error) {
      console.error("Error loading theme preference:", error);
      const localTheme = localStorage.getItem("theme") as Theme | null;
      if (localTheme) {
        setThemeState(localTheme);
        updateEffectiveTheme(localTheme);
      }
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    updateEffectiveTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: existing } = await supabase
          .from("user_preferences")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (existing) {
          await supabase
            .from("user_preferences")
            .update({ theme: newTheme })
            .eq("user_id", user.id);
        } else {
          await supabase
            .from("user_preferences")
            .insert({ user_id: user.id, theme: newTheme });
        }
      }
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadThemePreference();
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === "system") {
        updateEffectiveTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme" && e.newValue) {
        const newTheme = e.newValue as Theme;
        setThemeState(newTheme);
        updateEffectiveTheme(newTheme);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
