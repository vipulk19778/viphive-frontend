import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

type AdminSortableHeaderProps = {
  children: ReactNode;
  direction: false | "asc" | "desc";
  onToggle: () => void;
};

export function AdminSortableHeader({
  children,
  direction,
  onToggle,
}: AdminSortableHeaderProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex cursor-pointer items-center gap-1 font-bold uppercase tracking-wider text-slate-500 hover:text-slate-950 dark:hover:text-white"
    >
      {children}
      {direction === "desc" ? (
        <ArrowDown className="h-3.5 w-3.5" />
      ) : direction === "asc" ? (
        <ArrowUp className="h-3.5 w-3.5" />
      ) : (
        <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
      )}
    </button>
  );
}
