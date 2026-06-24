"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bookmark,
  CircleCheck,
  Film,
  Grid2x2,
  List,
  Plus,
  Search,
  Tv,
  X,
} from "lucide-react";
import { Header } from "@/components/home/header";
import { HomeButton } from "@/components/home/home-button";
import { MobileBottomNav } from "@/components/home/mobile-bottom-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { BulkBar } from "@/components/watchlist/bulk-bar";
import { Segmented } from "@/components/watchlist/segmented";
import { SortMenu, type SortOption } from "@/components/watchlist/sort-menu";
import { StatusChips } from "@/components/watchlist/status-chips";
import { StatusSheet } from "@/components/watchlist/status-sheet";
import { WatchlistGridCard } from "@/components/watchlist/watchlist-grid-card";
import { WatchlistRow } from "@/components/watchlist/watchlist-row";
import {
  WatchlistToast,
  type ToastState,
} from "@/components/watchlist/watchlist-toast";
import {
  useBulkDeleteWatchlistItems,
  useDeleteWatchlistItem,
  useRestoreWatchlistItem,
  useUpdateWatchlistStatus,
  useWatchlist,
} from "@/hooks/use-watchlist";
import { useAuthStore } from "@/lib/store";
import {
  progressInfo,
  STATUS_META,
  STATUS_ORDER,
} from "@/lib/watchlist-status";
import type { WatchlistItem, WatchlistStatus } from "@/lib/api";

type Tab = "all" | WatchlistStatus;
type TypeFilter = "all" | "movie" | "tv";
type Layout = "list" | "grid";

function sortItems(items: WatchlistItem[], sort: SortOption) {
  const sorted = [...items];
  sorted.sort((a, b) => {
    switch (sort) {
      case "title":
        return a.title.localeCompare(b.title);
      case "progress":
        return progressInfo(b).pct - progressInfo(a).pct;
      case "updated":
      default:
        return b.last_updated - a.last_updated;
    }
  });
  return sorted;
}

function EmptyState({
  icon: Icon,
  title,
  hint,
}: {
  icon: typeof Search;
  title: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3.5 px-6 py-20 text-center">
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

function SectionHeader({
  status,
  count,
}: {
  status: WatchlistStatus;
  count: number;
}) {
  const meta = STATUS_META[status];
  return (
    <div className="mb-4.5 flex items-center gap-3">
      <span className={`size-1.75 shrink-0 rounded-full ${meta.dot}`} />
      <h2 className="font-display text-[28px] leading-none text-foreground">
        {meta.label}
      </h2>
      <span className="font-mono text-xs text-muted-foreground/70">
        {count}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function StatChip({
  status,
  count,
}: {
  status: WatchlistStatus;
  count: number;
}) {
  const meta = STATUS_META[status];
  return (
    <div className="flex items-center gap-2">
      <span className={`size-1.5 rounded-full ${meta.dot}`} />
      <span className="font-mono text-xs text-foreground">{count}</span>
      <span className="text-[12.5px] text-muted-foreground">
        {meta.label.toLowerCase()}
      </span>
    </div>
  );
}

export default function WatchlistPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.token !== null);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const { data, isLoading } = useWatchlist({ per_page: 200 });
  const updateStatus = useUpdateWatchlistStatus();
  const deleteItem = useDeleteWatchlistItem();
  const bulkDelete = useBulkDeleteWatchlistItems();
  const restoreItem = useRestoreWatchlistItem();

  const items = useMemo(() => data?.items ?? [], [data]);

  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [sort, setSort] = useState<SortOption>("updated");
  const [layout, setLayout] = useState<Layout>("list");
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [sheetItem, setSheetItem] = useState<WatchlistItem | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) router.replace("/");
  }, [hasHydrated, isAuthenticated, router]);

  const flashToast = (message: string, undo?: () => void) => {
    setToast({ message, undo });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4500);
  };

  const handleChangeStatus = (id: string, status: WatchlistStatus) => {
    const item = items.find((it) => it.id === id);
    if (!item) return;
    const prevStatus = item.status;
    updateStatus.mutate({ id, status });
    flashToast(`Moved to ${STATUS_META[status].label}`, () =>
      updateStatus.mutate({ id, status: prevStatus }),
    );
  };

  const handleRemove = (id: string) => {
    const item = items.find((it) => it.id === id);
    if (!item) return;
    deleteItem.mutate(id);
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    flashToast(`Removed ${item.title}`, () => restoreItem.mutate(item));
  };

  const handleBulkStatus = (status: WatchlistStatus) => {
    const ids = Array.from(selected);
    const prevStatuses = ids.map((id) => ({
      id,
      status: items.find((it) => it.id === id)?.status,
    }));
    ids.forEach((id) => updateStatus.mutate({ id, status }));
    flashToast(`${ids.length} moved to ${STATUS_META[status].label}`, () => {
      prevStatuses.forEach(
        ({ id, status: prev }) =>
          prev && updateStatus.mutate({ id, status: prev }),
      );
    });
    setSelected(new Set());
    setSelectMode(false);
  };

  const handleBulkRemove = () => {
    const ids = Array.from(selected);
    const removed = ids
      .map((id) => items.find((it) => it.id === id))
      .filter((it): it is WatchlistItem => !!it);
    bulkDelete.mutate(ids);
    flashToast(`${ids.length} removed`, () =>
      removed.forEach((it) => restoreItem.mutate(it)),
    );
    setSelected(new Set());
    setSelectMode(false);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const base = useMemo(() => {
    return items.filter((it) => {
      if (typeFilter !== "all" && it.type !== typeFilter) return false;
      if (
        query.trim() &&
        !it.title.toLowerCase().includes(query.trim().toLowerCase())
      )
        return false;
      return true;
    });
  }, [items, typeFilter, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: base.length };
    STATUS_ORDER.forEach((s) => {
      c[s] = base.filter((it) => it.status === s).length;
    });
    return c;
  }, [base]);

  const filtered = useMemo(() => {
    const scoped =
      tab === "all" ? base : base.filter((it) => it.status === tab);
    return sortItems(scoped, sort);
  }, [base, tab, sort]);

  const grouped = tab === "all";

  const tabs: { id: Tab; label: string; status?: WatchlistStatus }[] = [
    { id: "all", label: "All" },
    ...STATUS_ORDER.map((s) => ({
      id: s as Tab,
      label: STATUS_META[s].label,
      status: s,
    })),
  ];

  const renderItems = (list: WatchlistItem[]) =>
    layout === "grid" ? (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(168px,1fr))] md:gap-5.5">
        {list.map((it) => (
          <WatchlistGridCard
            key={it.id}
            item={it}
            selected={selected.has(it.id)}
            selectMode={selectMode}
            onToggleSelect={toggleSelect}
            onChangeStatus={handleChangeStatus}
            onRemove={handleRemove}
          />
        ))}
      </div>
    ) : (
      <div className="border border-border bg-background">
        {list.map((it) => (
          <WatchlistRow
            key={it.id}
            item={it}
            selected={selected.has(it.id)}
            selectMode={selectMode}
            onToggleSelect={toggleSelect}
            onChangeStatus={handleChangeStatus}
            onRemove={handleRemove}
            onOpenSheet={setSheetItem}
          />
        ))}
      </div>
    );

  if (!hasHydrated || !isAuthenticated) return null;

  return (
    <div className="min-h-full bg-background pb-24 text-foreground md:pb-0">
      <Header user={user} active="watchlist" />

      <main className="mx-auto max-w-295 px-5 pt-9 pb-16 md:px-8">
        {/* Hero */}
        <div className="mb-7 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-marquee uppercase">
              Your library
            </span>
            <h1 className="mt-2.5 font-display text-[44px] leading-none tracking-[-0.01em] text-foreground md:text-[64px]">
              Watchlist
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <span className="font-mono text-xs text-muted-foreground">
                {items.length} titles
              </span>
              {items.length > 0 && (
                <>
                  <span className="h-3.5 w-px bg-border" />
                  {STATUS_ORDER.map(
                    (s) =>
                      counts[s] > 0 && (
                        <StatChip key={s} status={s} count={counts[s]} />
                      ),
                  )}
                </>
              )}
            </div>
          </div>
          <HomeButton variant="primary" size="lg">
            <Plus /> Add titles
          </HomeButton>
        </div>

        {/* Toolbar */}
        <div className="sticky top-13 z-40 bg-background pt-2 pb-3.5 md:top-16">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3.5">
            <div className="flex h-8.5 max-w-90 min-w-60 flex-1 items-center gap-2.5 border border-border bg-card px-3">
              <Search size={13} className="text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your watchlist…"
                className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="inline-flex text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="hidden md:block">
                <Segmented
                  value={typeFilter}
                  onChange={setTypeFilter}
                  items={[
                    { id: "all", label: "All" },
                    { id: "movie", label: "Movies", icon: <Film size={14} /> },
                    { id: "tv", label: "Shows", icon: <Tv size={14} /> },
                  ]}
                />
              </div>
              <SortMenu value={sort} onChange={setSort} />
              <div className="hidden md:block">
                <Segmented
                  value={layout}
                  onChange={setLayout}
                  items={[
                    {
                      id: "list",
                      icon: <List size={14} />,
                      title: "List view",
                    },
                    {
                      id: "grid",
                      icon: <Grid2x2 size={14} />,
                      title: "Grid view",
                    },
                  ]}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectMode((m) => !m);
                  if (selectMode) setSelected(new Set());
                }}
                className={`inline-flex h-8.5 items-center gap-1.5 whitespace-nowrap border px-3.5 text-[12.5px] font-medium transition-colors ${
                  selectMode
                    ? "border-marquee bg-marquee/10 text-marquee"
                    : "border-border bg-card text-muted-foreground hover:border-white/25 hover:text-foreground"
                }`}
              >
                <CircleCheck size={14} />
                {selectMode ? "Done" : "Select"}
              </button>
            </div>
          </div>

          <div className="hidden items-center gap-1 overflow-x-auto border-b border-border md:flex">
            {tabs.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`-mb-px inline-flex items-center gap-2 border-b-2 px-3.5 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.status && (
                    <span
                      className={`size-1.5 rounded-full ${STATUS_META[t.status].dot}`}
                      style={{ opacity: active ? 1 : 0.6 }}
                    />
                  )}
                  {t.label}
                  <span className="font-mono text-[11px] text-muted-foreground/70">
                    {counts[t.id] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="md:hidden">
            <StatusChips value={tab} onChange={setTab} counts={counts} />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-17 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          query.trim() ? (
            <EmptyState
              icon={Search}
              title="No matches"
              hint={`Nothing in your watchlist matches "${query}". Try a different title or clear the search.`}
            />
          ) : (
            <EmptyState
              icon={Bookmark}
              title="Nothing here yet"
              hint={
                tab === "all"
                  ? "Your watchlist is empty. Browse and add a few titles to get started."
                  : `You have no ${STATUS_META[tab as WatchlistStatus]?.label.toLowerCase()} titles right now.`
              }
            />
          )
        ) : grouped ? (
          <div className="flex flex-col gap-12">
            {STATUS_ORDER.map((s) => {
              const list = filtered.filter((it) => it.status === s);
              if (!list.length) return null;
              return (
                <section key={s}>
                  <SectionHeader status={s} count={list.length} />
                  {renderItems(list)}
                </section>
              );
            })}
          </div>
        ) : (
          renderItems(filtered)
        )}
      </main>

      <BulkBar
        count={selected.size}
        onChangeStatus={handleBulkStatus}
        onRemove={handleBulkRemove}
        onClear={() => {
          setSelected(new Set());
          setSelectMode(false);
        }}
      />
      <WatchlistToast toast={toast} onDismiss={() => setToast(null)} />
      <StatusSheet
        item={sheetItem}
        onOpenChange={(open) => !open && setSheetItem(null)}
        onChangeStatus={(id, status) => {
          handleChangeStatus(id, status);
          setSheetItem(null);
        }}
        onRemove={(id) => {
          handleRemove(id);
          setSheetItem(null);
        }}
      />
      <MobileBottomNav active="watchlist" />
    </div>
  );
}
