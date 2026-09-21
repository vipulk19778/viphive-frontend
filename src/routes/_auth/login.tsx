import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { LoginPage } from "@/features/auth/pages/LoginPage";
import { useAuthStore } from "@/stores/auth.store";

const loginSearchSchema = z.object({ redirectTo: z.string().optional() });

export const Route = createFileRoute("/_auth/login")({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) throw redirect({ to: "/" });
  },
  component: LoginPage,
  validateSearch: loginSearchSchema,
});