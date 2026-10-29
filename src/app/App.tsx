import { useEffect } from "react";
import { Toaster, toast } from "sonner";
import { QueryProvider } from "./providers/QueryProvider";
import { RouterProvider } from "@tanstack/react-router";

import { ThemeController } from "../components/common/ThemeController";
import { router } from "../router";
import {
  setSessionExpiredHandler,
  startSessionWatcher,
} from "@/lib/api/client";
import { SESSION_EXPIRED_MESSAGE } from "@/lib/api/errors";
import { useThemeStore } from "@/stores/theme.store";
import { useAuthStore } from "@/stores/auth.store";

function App() {
  const themeMode = useThemeStore((state) => state.mode);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      toast.error(SESSION_EXPIRED_MESSAGE, { id: "session-expired" });

      const { pathname, search } = router.state.location;
      if (pathname === "/login") return;

      void router.navigate({
        to: "/login",
        search: { reason: "expired", redirectTo: `${pathname}${search}` },
      });
    });

    // Keep tabs in sync so a token rotated in one tab isn't reused in another
    const syncAuth = (event: StorageEvent) => {
      if (event.key === "viphive-auth") {
        void useAuthStore.persist.rehydrate();
      }
    };
    window.addEventListener("storage", syncAuth);

    const stopWatcher = startSessionWatcher();

    return () => {
      stopWatcher();
      setSessionExpiredHandler(null);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  return (
    <QueryProvider>
      <ThemeController />
      <Toaster position="top-right" richColors closeButton theme={themeMode} />
      <RouterProvider router={router} />
    </QueryProvider>
  );
}

export default App;
