import { getErrorMessage } from "@/lib/api/errors";

interface QueryErrorProps {
  error: unknown;
  fallback: string;
  onRetry?: () => void;
}

export function QueryError({ error, fallback, onRetry }: QueryErrorProps) {
  return (
    <div
      role="alert"
      className="rounded-2xl bg-rose-50 p-6 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300"
    >
      <p className="font-semibold">{fallback}</p>
      <p className="mt-1 text-sm">{getErrorMessage(error)}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 cursor-pointer rounded-lg border border-current px-3 py-1.5 text-sm font-semibold transition hover:bg-rose-100 dark:hover:bg-rose-400/10"
        >
          Try again
        </button>
      )}
    </div>
  );
}
