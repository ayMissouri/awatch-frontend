import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { t } from "@/i18n";
import {
  ACTIVITY_VERB_COLOR,
  type ActivityDay,
  type ActivityDayEntry,
  type ActivityFilter,
  type ActivityType,
} from "@/components/profile/profile-data";

const FILTER_ORDER: ActivityType[] = ["watched", "finished", "paused"];

export interface ChipOption<T extends string> {
  value: T;
  label: string;
}

export function ChipGroup<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: T;
  options: ChipOption<T>[];
  onChange: (next: T) => void;
  ariaLabel?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "border px-3 py-1.5 font-mono text-[11px] tracking-[0.04em] uppercase transition-colors",
              active
                ? "border-marquee/60 bg-marquee/10 text-foreground"
                : "border-border text-muted-foreground hover:border-[var(--border-strong)] hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function ActivityFilters({
  value,
  available,
  onChange,
}: {
  value: ActivityFilter;
  available: Set<string>;
  onChange: (next: ActivityFilter) => void;
}) {
  const present = FILTER_ORDER.filter(
    (type) => available.has(type) || type === value,
  );
  if (present.length < 2 && value === "all") return null;

  const options: ChipOption<ActivityFilter>[] = [
    { value: "all", label: t.profile.activity.filter.all },
    ...present.map((type) => ({ value: type, label: t.profile.activity.filter[type] })),
  ];

  return (
    <ChipGroup
      value={value}
      options={options}
      onChange={onChange}
      ariaLabel={t.profile.activityPage.filterLabel}
    />
  );
}

function ActivityHistoryRow({ entry }: { entry: ActivityDayEntry }) {
  const inner = (
    <>
      <div className="relative aspect-2/3 w-10 shrink-0 overflow-hidden bg-[var(--ink-900)]">
        {entry.poster && (
          <Image src={entry.poster} alt="" fill sizes="40px" className="object-cover" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 items-baseline gap-2">
          <span
            className={cn(
              "shrink-0 text-[11px] font-semibold tracking-[0.06em] uppercase",
              ACTIVITY_VERB_COLOR[entry.type],
            )}
          >
            {t.profile.activity.verb[entry.type]}
          </span>
          <span className="truncate text-sm font-medium text-foreground">
            {entry.title}
          </span>
        </div>
        <span className="truncate font-mono text-[11px] tracking-[0.02em] text-muted-foreground">
          {entry.sub}
        </span>
      </div>
      <span className="shrink-0 self-center font-mono text-[10px] tracking-[0.05em] whitespace-nowrap text-[var(--fg-subtle)] uppercase">
        {entry.time}
      </span>
    </>
  );

  const base = "flex items-center gap-3.5 border-t border-border py-3";

  if (entry.href) {
    return (
      <Link
        href={entry.href}
        className={cn(base, "-mx-2 px-2 transition-colors hover:bg-white/[0.025]")}
      >
        {inner}
      </Link>
    );
  }
  return <div className={base}>{inner}</div>;
}

function ActivityDaySection({ day }: { day: ActivityDay }) {
  return (
    <section>
      <div className="sticky top-13 z-10 -mx-[18px] flex items-baseline justify-between gap-3 border-b border-border bg-background/85 px-[18px] py-2.5 backdrop-blur-sm md:top-16 md:-mx-8 md:px-8">
        <div className="flex items-baseline gap-2.5">
          <h2 className="font-display text-lg leading-none tracking-[-0.005em] text-foreground md:text-xl">
            {day.label}
          </h2>
          <span className="font-mono text-[11px] tracking-[0.02em] text-muted-foreground">
            {day.date}
          </span>
        </div>
        {day.summary && (
          <span className="shrink-0 text-right font-mono text-[10px] tracking-[0.04em] whitespace-nowrap text-[var(--fg-subtle)] uppercase">
            {day.summary}
          </span>
        )}
      </div>
      <div className="mt-1">
        {day.entries.map((entry, i) => (
          <ActivityHistoryRow key={`${day.key}-${i}`} entry={entry} />
        ))}
      </div>
    </section>
  );
}

export function ActivityHistory({ days }: { days: ActivityDay[] }) {
  return (
    <div className="flex flex-col gap-8">
      {days.map((day) => (
        <ActivityDaySection key={day.key} day={day} />
      ))}
    </div>
  );
}

export function ActivityHistorySkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {Array.from({ length: 3 }).map((_, d) => (
        <div key={d}>
          <div className="flex items-baseline justify-between border-b border-border py-2.5">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="mt-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 border-t border-border py-3"
              >
                <Skeleton className="aspect-2/3 w-10 shrink-0" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-3.5 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
