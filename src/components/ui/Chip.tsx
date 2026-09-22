import type { HTMLAttributes } from "react";

const chipVariants = {
  neutral: "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300",
  success:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-400",
  danger: "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300",
  accent: "brand-accent-soft",
} as const;

type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof chipVariants;
};

export function Chip({
  variant = "neutral",
  className = "",
  ...props
}: ChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${chipVariants[variant]} ${className}`}
      {...props}
    />
  );
}
