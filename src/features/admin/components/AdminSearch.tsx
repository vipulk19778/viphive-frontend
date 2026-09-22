import { Search } from "lucide-react";

type AdminSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export function AdminSearch({
  value,
  onChange,
  placeholder,
}: AdminSearchProps) {
  return (
    <label className="brand-focus-within flex w-full max-w-sm items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-400 transition dark:border-slate-800 dark:bg-slate-900">
      <Search className="h-4 w-4 shrink-0" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="brand-search-input min-w-0 flex-1 bg-transparent text-sm text-slate-950 placeholder:text-slate-400 dark:text-white"
      />
    </label>
  );
}
