import Image from "next/image";
import Link from "next/link";
import { detailHref } from "@/lib/utils";
import { t } from "@/i18n";
import type { UpNextItem } from "@/components/profile/profile-data";

function UpNextCard({ item }: { item: UpNextItem }) {
  return (
    <Link
      href={detailHref(item.type, item.id, "from=profile")}
      className="grid grid-cols-[78px_1fr] border border-border bg-[var(--bg-elev)] transition-colors hover:border-[var(--border-strong)]"
    >
      <div className="relative aspect-2/3 bg-[var(--ink-900)]">
        {item.poster && (
          <Image
            src={item.poster}
            alt=""
            fill
            sizes="78px"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-1 p-3 px-3.5">
        <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-marquee uppercase">
          {t.profile.upNextKind[item.kind]}
        </span>
        <span className="truncate text-sm font-semibold text-foreground">
          {item.title}
        </span>
        {item.detail && (
          <span className="truncate font-mono text-[10px] tracking-[0.05em] text-muted-foreground uppercase">
            {item.detail}
          </span>
        )}
      </div>
    </Link>
  );
}

export function UpNextGrid({ items }: { items: UpNextItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
      {items.map((it) => (
        <UpNextCard key={it.id} item={it} />
      ))}
    </div>
  );
}

export function UpNextRail({ items }: { items: UpNextItem[] }) {
  return (
    <div className="-mx-[18px] flex gap-3 overflow-x-auto px-[18px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => (
        <Link
          key={item.id}
          href={detailHref(item.type, item.id, "from=profile")}
          className="flex w-[132px] shrink-0 flex-col gap-2"
        >
          <div className="relative aspect-2/3 overflow-hidden border border-border bg-[var(--ink-900)]">
            {item.poster && (
              <Image src={item.poster} alt="" fill sizes="132px" className="object-cover" />
            )}
            <span className="absolute top-0 left-0 bg-[var(--ink-950)] px-1.5 py-1 font-mono text-[8.5px] font-semibold tracking-[0.06em] text-marquee uppercase">
              {t.profile.upNextKind[item.kind]}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="truncate text-[12.5px] font-medium text-foreground">
              {item.title}
            </span>
            {item.detail && (
              <span className="truncate font-mono text-[9.5px] tracking-[0.04em] text-[var(--fg-subtle)] uppercase">
                {item.detail}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
