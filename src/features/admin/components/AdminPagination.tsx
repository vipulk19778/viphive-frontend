import { ChevronLeft, ChevronRight } from "lucide-react";

type AdminPaginationProps = {
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

export function AdminPagination({
  page,
  limit,
  totalPages,
  onPageChange,
  onLimitChange,
}: AdminPaginationProps) {
  return (
    <div className="flex flex-col gap-3 px-1 py-4 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center justify-between gap-3 sm:justify-start">
        <span>
          Page {page} of {Math.max(totalPages, 1)}
        </span>
        <div className="flex gap-2 sm:order-first">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
          title="Previous page"
          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
          title="Next page"
          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-start">
        <span>Rows</span>
        <select
          value={limit}
          onChange={(event) => onLimitChange(Number(event.target.value))}
          aria-label="Rows per page"
          className="brand-focus-within rounded-lg border border-slate-200 bg-white px-2 py-1.5 font-semibold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          {[5, 10, 25, 50, 100].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
