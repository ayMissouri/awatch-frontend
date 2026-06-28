import { t } from "@/i18n";
import type { ProfileStat } from "@/components/profile/profile-data";

function StatCard({ stat }: { stat: ProfileStat }) {
  return (
    <div className="flex flex-col gap-2.5 border border-border bg-[var(--bg-elev)] p-4.5 transition-colors hover:border-[var(--border-strong)] md:p-5.5">
      <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
        {t.profile.stats[stat.key]}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-[30px] font-medium leading-none tracking-[-0.02em] text-[var(--fg-strong)] md:text-[40px]">
          {stat.value}
        </span>
        {stat.unit && (
          <span className="font-mono text-xs tracking-[0.04em] text-muted-foreground uppercase md:text-sm">
            {stat.unit}
          </span>
        )}
      </div>
      <span className="font-mono text-[10px] tracking-[0.06em] text-[var(--fg-subtle)] uppercase">
        {stat.meta}
      </span>
    </div>
  );
}

export function StatsRow({ stats }: { stats: ProfileStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-[repeat(auto-fit,minmax(170px,1fr))] md:gap-3.5">
      {stats.map((s) => (
        <StatCard key={s.key} stat={s} />
      ))}
    </div>
  );
}

export function MobileStatsGrid({ stats }: { stats: ProfileStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-px border border-border bg-border">
      {stats.map((s) => (
        <div key={s.key} className="flex flex-col gap-1.5 bg-[var(--bg-elev)] p-4">
          <span className="font-mono text-[9.5px] tracking-[0.07em] text-muted-foreground uppercase">
            {t.profile.stats[s.key]}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-[30px] font-medium leading-none tracking-[-0.02em] text-[var(--fg-strong)]">
              {s.value}
            </span>
            {s.unit && (
              <span className="font-mono text-xs text-muted-foreground uppercase">
                {s.unit}
              </span>
            )}
          </div>
          <span className="truncate font-mono text-[9px] tracking-[0.05em] text-[var(--fg-subtle)] uppercase">
            {s.meta}
          </span>
        </div>
      ))}
    </div>
  );
}
