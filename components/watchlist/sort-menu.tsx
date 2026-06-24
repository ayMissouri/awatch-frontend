import { ArrowUpDown, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SortOption = "updated" | "title" | "progress";

const SORTS: { id: SortOption; label: string }[] = [
  { id: "updated", label: "Recently updated" },
  { id: "title", label: "Title (A–Z)" },
  { id: "progress", label: "Progress" },
];

export function SortMenu({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (v: SortOption) => void;
}) {
  const current = SORTS.find((s) => s.id === value) ?? SORTS[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex h-8.5 w-8.5 items-center justify-center gap-2 border border-border bg-card px-0 text-[12.5px] font-medium whitespace-nowrap text-muted-foreground transition-colors hover:border-white/25 hover:text-foreground aria-expanded:border-white/25 aria-expanded:text-foreground sm:w-auto sm:justify-start sm:px-3"
        >
          <ArrowUpDown size={13} className="text-muted-foreground" />
          <span className="hidden text-muted-foreground/70 sm:inline">
            Sort:
          </span>
          <span className="hidden text-foreground sm:inline">
            {current.label}
          </span>
          <ChevronDown
            size={13}
            className="hidden text-muted-foreground/60 sm:inline"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-46">
        {SORTS.map((s) => (
          <DropdownMenuItem key={s.id} onClick={() => onChange(s.id)}>
            <span className="flex-1">{s.label}</span>
            {s.id === value && (
              <span className="text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
