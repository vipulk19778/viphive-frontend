import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = {
  primary: "brand-primary brand-primary-hover",
  secondary:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
  ghost:
    "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
  danger: "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-400/10",
} as const;

const buttonSizes = {
  default: "px-4 py-2.5",
  icon: "h-7 min-h-7 w-7 min-w-7 p-0",
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: keyof typeof buttonSizes;
  variant?: keyof typeof buttonVariants;
};

export function Button({
  size = "default",
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-xl text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        buttonSizes[size],
        buttonVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
