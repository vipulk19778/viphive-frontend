import { createFileRoute, redirect } from "@tanstack/react-router";

import { CheckoutPage } from "@/features/checkout/pages/CheckoutPage";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/checkout/")({
  beforeLoad: () => {
    const { user, accessToken, refreshToken } = useAuthStore.getState();

    if (!user || !accessToken || !refreshToken) {
      throw redirect({
        to: "/login",
        search: { redirectTo: "/checkout" },
      });
    }
  },
  component: CheckoutPage,
});
