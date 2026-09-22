import { useLayoutEffect } from "react";

import { useThemeStore } from "@/stores/theme.store";

export function ThemeController() {
  const mode = useThemeStore((state) => state.mode);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  return null;
}
