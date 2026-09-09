"use client";

import { Moon, Sun } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export function ThemeManager({ children }: { children: ReactNode }) {
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("viphive-theme");
    const shouldUseDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  return <>{children}</>;
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("viphive-theme");
    const shouldUseDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", shouldUseDark);
    const frame = window.requestAnimationFrame(() => setIsDark(shouldUseDark));

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    document.documentElement.classList.toggle("dark", nextIsDark);
    window.localStorage.setItem("viphive-theme", nextIsDark ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
