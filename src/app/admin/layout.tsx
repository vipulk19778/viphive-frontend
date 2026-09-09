import type { ReactNode } from "react";

import { AdminLayout } from "@/features/admin/components/admin-layout";

export default function Layout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
