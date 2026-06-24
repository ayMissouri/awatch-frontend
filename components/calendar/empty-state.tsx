import type { LucideIcon } from "lucide-react";

export function CalendarEmpty({
  icon: Icon,
  title,
  hint,
}: {
  icon: LucideIcon;
  title: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3.5 px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center border border-border bg-card">
        <Icon size={22} className="text-muted-foreground/60" />
      </div>
      <div className="font-display text-[28px] leading-none text-foreground">
        {title}
      </div>
      <div className="max-w-85 text-[13.5px] leading-relaxed text-muted-foreground">
        {hint}
      </div>
    </div>
  );
}
