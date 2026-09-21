import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { VerifyOtpPage } from "@/features/auth/pages/VerifyOtpPage";
import { useAuthStore } from "@/stores/auth.store";

const verifyOtpSearchSchema = z.object({
  email: z.string().email(),
  purpose: z.string().default("REGISTER"),
});

export const Route = createFileRoute("/_auth/verify-otp")({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) throw redirect({ to: "/" });
  },
  validateSearch: verifyOtpSearchSchema,
  component: VerifyOtpPage,
});