import Image from "next/image";
import { cn } from "@/lib/utils";
import { t } from "@/i18n";
import {
  ACTIVITY_BUCKET_ORDER,
  ACTIVITY_VERB_COLOR,
  type ActivityEntry,
} from "@/components/profile/profile-data";

function ActivityRow({ entry }: { entry: ActivityEntry }) {
  return (
    <div className="flex items-center gap-3.5 border-t border-border py-3">
      <div className="relative aspect-2/3 w-9.5 shrink-0 overflow-hidden bg-[var(--ink-900)]">
        {entry.poster && (
          <Image src={entry.poster} alt="" fill sizes="38px" className="object-cover" />
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
      <span className="shrink-0 font-mono text-[10px] tracking-[0.05em] whitespace-nowrap text-[var(--fg-subtle)] uppercase">
        {entry.when}
      </span>
    </div>
  );
}

export function ActivityFeed({ entries }: { entries: ActivityEntry[] }) {
  const buckets = ACTIVITY_BUCKET_ORDER.map((bucket) => ({
    bucket,
    items: entries.filter((e) => e.bucket === bucket),
  })).filter((b) => b.items.length > 0);

  return (
    <div className="flex flex-col gap-6">
      {buckets.map(({ bucket, items }) => (
        <div key={bucket}>
          <span className="mb-1.5 block font-mono text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            {t.profile.activity.bucket[bucket]}
          </span>
          <div>
            {items.map((entry, i) => (
              <ActivityRow key={`${bucket}-${i}`} entry={entry} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
