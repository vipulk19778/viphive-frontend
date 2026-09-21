export function RouteLoadingFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center bg-transparent px-6">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#F5B942] dark:border-slate-600 dark:border-t-[#F5B942]" />
        Loading page...
      </div>
    </div>
  );
}
