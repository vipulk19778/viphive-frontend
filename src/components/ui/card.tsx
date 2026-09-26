import type { ElementType, HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const cardVariants = {
  default:
    "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
  elevated:
    "rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900",
  interactive:
    "rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900",
} as const;

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: Extract<ElementType, "div" | "section" | "article" | "aside">;
  variant?: keyof typeof cardVariants;
};

export function Card({
  as: Component = "div",
  variant = "default",
  className = "",
  ...props
}: CardProps) {
  return <Component className={cn(cardVariants[variant], className)} {...props} />;
}

export function CardHeader({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  );
}

export function CardContent({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}
