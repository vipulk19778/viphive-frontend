import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          The page you&apos;re looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
