import { SearchX, Table2 } from "lucide-react";

type AdminEmptyStateProps = {
  searched: boolean;
  resource: string;
};

export function AdminEmptyState({ searched, resource }: AdminEmptyStateProps) {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center gap-2 px-5 py-8 text-center text-slate-500 dark:text-slate-400">
      {searched ? (
        <SearchX className="h-7 w-7" />
      ) : (
        <Table2 className="h-7 w-7" />
      )}
      <p className="font-semibold">
        {searched
          ? `No matching ${resource} found.`
          : `No ${resource} to show yet.`}
      </p>
      {searched && <p className="text-xs">Try a different search.</p>}
    </div>
  );
}
