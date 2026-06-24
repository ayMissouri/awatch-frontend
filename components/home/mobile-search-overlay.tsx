"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ChevronLeft, Clock, Loader, Search, X } from "lucide-react";
import { HomeIconButton } from "@/components/home/home-button";
import {
  ScopeToggle,
  SearchResultRow,
  type SearchScope,
} from "@/components/home/nav-shared";
import { useSearch } from "@/hooks/use-search";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useNavUI } from "@/lib/ui-store";
import { addRecentSearch, getRecentSearches } from "@/lib/recent-searches";
import { detailHref } from "@/lib/utils";

const MAX_RESULTS = 12;

export function MobileSearchOverlay() {
  const router = useRouter();
  const open = useNavUI((s) => s.searchOpen);
  const setOpen = useNavUI((s) => s.setSearchOpen);

  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<SearchScope>("movie");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const debounced = useDebouncedValue(query, 220);
  const { data, isFetching } = useSearch(debounced, scope);
  const results = useMemo(
    () => (data?.items ?? []).slice(0, MAX_RESULTS),
    [data],
  );
  const hasQuery = debounced.trim().length >= 2;

  const [wasOpen, setWasOpen] = useState(false);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setQuery("");
      setRecent(getRecentSearches());
    }
  }

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(id);
  }, [open]);

  const go = (type: string, id: string) => {
    if (debounced.trim()) setRecent(addRecentSearch(debounced));
    setOpen(false);
    router.push(detailHref(type, id, "from=search"));
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-190 flex flex-col bg-background outline-none duration-200 data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-bottom-4 data-closed:animate-out data-closed:fade-out-0 md:hidden"
        >
          <DialogPrimitive.Title className="sr-only">
            Search
          </DialogPrimitive.Title>

          {/* Input row */}
          <div className="flex items-center gap-2.5 border-b border-border px-5 py-2.5">
            <HomeIconButton
              variant="ghost"
              size={36}
              onClick={() => setOpen(false)}
              aria-label="Close search"
            >
              <ChevronLeft />
            </HomeIconButton>
            <div className="flex h-9.5 flex-1 items-center gap-2.5 border border-[var(--border-strong)] bg-popover px-3">
              {isFetching ? (
                <Loader
                  size={14}
                  className="animate-spin text-muted-foreground"
                />
              ) : (
                <Search size={14} className="text-muted-foreground" />
              )}
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies and shows…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear"
                  className="inline-flex text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Scope */}
          <div className="px-5 pt-3 pb-0.5">
            <ScopeToggle scope={scope} onChange={setScope} size="lg" />
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {!hasQuery ? (
              recent.length > 0 ? (
                <div className="px-5 pt-3.5">
                  <div className="mb-2.5 font-mono text-[9px] tracking-[0.14em] text-muted-foreground/80 uppercase">
                    Recent
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          setQuery(term);
                          inputRef.current?.focus();
                        }}
                        className="inline-flex items-center gap-1.5 border border-border bg-popover px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-white/25 hover:text-foreground"
                      >
                        <Clock size={11} className="text-muted-foreground/70" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="px-6 py-16 text-center text-sm text-muted-foreground">
                  Search the catalog for movies and shows.
                </div>
              )
            ) : results.length === 0 && !isFetching ? (
              <div className="px-6 py-16 text-center text-sm text-muted-foreground">
                No {scope === "movie" ? "movies" : "shows"} match “
                {debounced.trim()}”.
              </div>
            ) : (
              <div className="pt-3.5">
                <div className="flex items-center justify-between px-5 pb-2 font-mono text-[9px] tracking-[0.14em] text-muted-foreground/80 uppercase">
                  <span>{scope === "movie" ? "Movies" : "Shows"}</span>
                  <span>{results.length}</span>
                </div>
                <div className="border-t border-border">
                  {results.map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="border-b border-border px-2.5"
                    >
                      <SearchResultRow
                        item={item}
                        onSelect={() => go(item.type, item.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
