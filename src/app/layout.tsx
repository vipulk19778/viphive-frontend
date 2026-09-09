import type { Metadata } from "next";

import "./../styles/globals.css";

import { ThemeManager } from "@/components/layout/theme-toggle";
import { StoreProvider } from "@/store/provider";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "VIPHive",
  description: "VIPHive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeManager>
          <StoreProvider>{children}</StoreProvider>
        </ThemeManager>
        <Analytics />
      </body>
    </html>
  );
}
