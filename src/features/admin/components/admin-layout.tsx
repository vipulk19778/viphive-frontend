"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  LayoutDashboard,
  Menu,
  Package,
  Receipt,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

import { AuthGate } from "@/components/auth/auth-gate";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useAppSelector } from "@/store/hooks";

const navigation = [
  { href: "/admin/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: Receipt },
  { href: "/admin/payments", label: "Payments", icon: CircleDollarSign },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/users", label: "Users", icon: Users },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (user?.role !== "admin") {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account does not have permission to view this area.
          </p>
        </div>
      </main>
    );
  }

  const sidebarWidth = collapsed ? "lg:w-20" : "lg:w-64";
  const contentOffset = collapsed ? "lg:pl-20" : "lg:pl-64";

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="fixed inset-x-0 top-0 z-40 h-16 border-b bg-background/95 backdrop-blur">
        <div className="flex h-full items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="inline-flex size-9 items-center justify-center rounded-lg hover:bg-muted lg:hidden"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            >
              {mobileOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
            <Logo
              href="/admin/overview"
              label="VIPHive Admin"
              className="text-lg"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.name}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <aside
        className={`fixed bottom-0 left-0 top-16 z-30 border-r bg-background transition-all duration-200 ${sidebarWidth} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex h-full flex-col p-3">
          <nav className="space-y-1">
            {navigation.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href ||
                (href === "/admin/overview" && pathname === "/admin");
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? label : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className={collapsed ? "lg:hidden" : ""}>{label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto hidden lg:block">
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <>
                  <ChevronLeft className="size-4" /> Collapse
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-20 bg-black/20 lg:hidden"
        />
      )}
      <main
        className={`min-h-screen pt-16 transition-[padding] duration-200 ${contentOffset}`}
      >
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <AdminShell>{children}</AdminShell>
    </AuthGate>
  );
}
