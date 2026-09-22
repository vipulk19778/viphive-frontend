import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

type AdminSortableHeaderProps = {
  label: string;
  sortKey: string;
  activeSort: string;
  onSort: (sortKey: string) => void;
};

export function AdminSortableHeader({
  label,
  sortKey,
  activeSort,
  onSort,
}: AdminSortableHeaderProps) {
  const isActive = activeSort.startsWith(`${sortKey}-`);
  const descending = activeSort.endsWith("-desc");

  return (
    <button
      type="button"
      onClick={() =>
        onSort(`${sortKey}-${isActive && !descending ? "desc" : "asc"}`)
      }
      className="inline-flex cursor-pointer items-center gap-1 font-bold uppercase tracking-wider text-slate-500 hover:text-slate-950 dark:hover:text-white"
    >
      {label}
      {isActive ? (
        descending ? (
          <ArrowDown className="h-3.5 w-3.5" />
        ) : (
          <ArrowUp className="h-3.5 w-3.5" />
        )
      ) : (
        <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
      )}
    </button>
  );
}
