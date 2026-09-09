"use client";

import Link from "next/link";

const navigationItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Cart",
    href: "/cart",
  },
  {
    label: "Orders",
    href: "/orders",
  },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background lg:block">
      <div className="sticky top-16 h-[calc(100vh-4rem)] p-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-4 py-3 text-sm font-medium hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
