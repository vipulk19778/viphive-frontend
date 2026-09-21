import { createFileRoute } from "@tanstack/react-router";

import { AdminPaymentsPage } from "@/features/admin/pages/AdminPaymentsPage";

export const Route = createFileRoute("/admin/payments/")({
  component: AdminPaymentsPage,
});
