import { createFileRoute, redirect } from "@tanstack/react-router";

import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/_auth/reset-password")({
  beforeLoad: () => {
    const { otpEmail, verifiedOtp } = useAuthStore.getState();
    if (!otpEmail || !verifiedOtp) throw redirect({ to: "/forgot-password" });
  },
  component: ResetPasswordPage,
});
