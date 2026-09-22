import type { ElementType, HTMLAttributes } from "react";

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
  return (
    <Component className={`${cardVariants[variant]} ${className}`} {...props} />
  );
}
