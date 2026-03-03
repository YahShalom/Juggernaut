"use client";

import { useEffect, useState } from "react";
import { MoonStar, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const initial: Theme =
      saved === "light" || saved === "dark"
        ? saved
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    setTheme(initial);
    applyTheme(initial);
    setReady(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <Button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      variant="outline"
      size="sm"
      className="h-9 rounded-full border-[hsl(45_100%_58%_/_0.35)] bg-gradient-to-r from-[hsl(210_80%_48%_/_0.9)] via-[hsl(210_74%_38%_/_0.88)] to-[hsl(45_100%_58%_/_0.88)] px-3 text-xs font-semibold text-white backdrop-blur-sm hover:opacity-95 dark:from-[hsl(210_80%_38%_/_0.95)] dark:to-[hsl(45_100%_56%_/_0.9)]"
    >
      {!ready ? (
        "Theme"
      ) : theme === "dark" ? (
        <>
          <Sun className="mr-1 h-3.5 w-3.5" />
          Day
        </>
      ) : (
        <>
          <MoonStar className="mr-1 h-3.5 w-3.5" />
          Night
        </>
      )}
    </Button>
  );
}
