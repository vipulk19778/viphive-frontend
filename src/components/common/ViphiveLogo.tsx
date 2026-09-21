import { Crown } from "lucide-react";

interface ViphiveLogoProps {
  compact?: boolean;
}

export function ViphiveLogo({ compact = false }: ViphiveLogoProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-slate-950 shadow-sm">
        <Crown className="h-5 w-5" strokeWidth={2.4} />
      </span>
      {!compact && (
        <span className="font-display text-xl font-bold tracking-tight text-slate-950 dark:text-white">
          VIP<span className="text-amber-500">Hive</span>
        </span>
      )}
    </span>
  );
}
