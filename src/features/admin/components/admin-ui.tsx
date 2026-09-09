"use client";

import type { ReactNode } from "react";

export const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;
export const date = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border bg-card ${className}`}>
      {children}
    </section>
  );
}

export function StatusPill({ value }: { value: string }) {
  return (
    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize">
      {value}
    </span>
  );
}

export function TableHeading({
  title,
  count,
}: {
  title: string;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between border-b px-5 py-4">
      <h1 className="font-semibold">{title}</h1>
      <span className="text-sm text-muted-foreground">{count} total</span>
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">
      Loading admin data...
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return <Panel className="p-6 text-sm text-destructive">{message}</Panel>;
}

export function Empty({ text }: { text: string }) {
  return <p className="py-5 text-sm text-muted-foreground">{text}</p>;
}
