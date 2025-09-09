"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

export function ThemeSwitch() {
  const { theme, setTheme, systemTheme } = useTheme();
  const effective = theme === "system" ? systemTheme : theme;
  const toggle = () => setTheme(effective === "dark" ? "light" : "dark");
  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="fixed top-4 right-4 z-50 rounded-full border px-3 py-2 bg-[color:var(--color-background)]/60 backdrop-blur"
    >
      {effective === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

