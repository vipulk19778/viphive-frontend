import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

interface ShopLayoutProps {
  children: ReactNode;
}

export default function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="min-h-[calc(100vh-4rem)]">{children}</main>

      <Footer />
    </div>
  );
}
