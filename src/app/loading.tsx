import { Logo } from "@/components/common/logo";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
        <Logo />
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-950 dark:border-zinc-800 dark:border-t-zinc-50" />
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Loading VIPHive...
        </p>
      </div>
    </div>
  );
}
