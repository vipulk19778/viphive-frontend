import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = {
  neutral: "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300",
  success:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-400",
  danger: "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300",
  accent: "brand-accent-soft",
} as const;

export type BadgeVariant = keyof typeof badgeVariants;

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({
  variant = "neutral",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
