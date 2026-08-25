"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" aria-label="Toggle theme">
        <Sun className="h-4 w-4 text-muted-foreground" />
      </Button>
    );
  }

  const cycleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
      title={`Current theme: ${theme}. Click to switch.`}
      aria-label="Switch Theme"
    >
      {theme === "dark" ? (
        <Moon className="h-4 w-4 text-indigo-400" />
      ) : theme === "light" ? (
        <Sun className="h-4 w-4 text-amber-500" />
      ) : (
        <Monitor className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
}
