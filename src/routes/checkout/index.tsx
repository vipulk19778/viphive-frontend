import { createFileRoute, redirect } from "@tanstack/react-router";

import { CheckoutPage } from "@/features/checkout/pages/CheckoutPage";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/checkout/")({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({
        to: "/login",
        search: { redirectTo: "/checkout" },
      });
    }
  },
  component: CheckoutPage,
});
