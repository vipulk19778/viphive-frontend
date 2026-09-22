import { createFileRoute, redirect } from "@tanstack/react-router";

import { VerifyOtpPage } from "@/features/auth/pages/VerifyOtpPage";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/_auth/verify-otp")({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) throw redirect({ to: "/" });
    if (!useAuthStore.getState().otpEmail) throw redirect({ to: "/login" });
  },
  component: VerifyOtpPage,
});
