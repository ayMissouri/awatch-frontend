import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SegmentedItem<T extends string> {
  id: T;
  label?: string;
  icon?: ReactNode;
  title?: string;
}

export function Segmented<T extends string>({
  items,
  value,
  onChange,
}: {
  items: SegmentedItem<T>[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="inline-flex h-[34px] border border-border bg-card">
      {items.map((item, i) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            title={item.title}
            onClick={() => onChange(item.id)}
            className={cn(
              "inline-flex h-full items-center justify-center gap-1.5 text-[12.5px] font-medium whitespace-nowrap transition-colors",
              item.label ? "px-3.5" : "w-[34px]",
              i > 0 && "border-l border-border",
              active
                ? "bg-white/6 text-foreground"
                : "text-muted-foreground/80 hover:text-muted-foreground",
            )}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
