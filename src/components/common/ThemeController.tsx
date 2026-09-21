import { useEffect } from "react";

import { useThemeStore } from "@/stores/theme.store";

export function ThemeController() {
  const mode = useThemeStore((state) => state.mode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  return null;
}
