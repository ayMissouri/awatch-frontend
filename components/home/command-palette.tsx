"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ArrowUpDown, Clock, Loader, Search } from "lucide-react";
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

const MAX_RESULTS = 8;

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-5 items-center justify-center border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
      {children}
    </kbd>
  );
}

// Global `CTRL/CMD + K` keybind to search.
export function CommandPalette() {
  const router = useRouter();
  const open = useNavUI((s) => s.paletteOpen);
  const setOpen = useNavUI((s) => s.setPaletteOpen);

  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<SearchScope>("movie");
  const [active, setActive] = useState(0);
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
      setActive(0);
      setRecent(getRecentSearches());
    }
  }

  const resultsKey = `${scope}:${results.length}`;
  const [prevResultsKey, setPrevResultsKey] = useState(resultsKey);
  if (resultsKey !== prevResultsKey) {
    setPrevResultsKey(resultsKey);
    setActive(0);
  }

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(id);
  }, [open]);

  const go = (type: string, id: string) => {
    if (debounced.trim()) setRecent(addRecentSearch(debounced));
    setOpen(false);
    router.push(detailHref(type, id, "from=search"));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item) go(item.type, item.id);
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-200 bg-black/70 backdrop-blur-[2px] duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onKeyDown={onKeyDown}
          className="fixed top-[14vh] left-1/2 z-200 w-[600px] max-w-[calc(100vw-2rem)] -translate-x-1/2 border border-[var(--border-strong)] bg-popover shadow-[0_24px_64px_-12px_rgba(0,0,0,0.8)] outline-none duration-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
        >
          <DialogPrimitive.Title className="sr-only">
            Search movies and shows
          </DialogPrimitive.Title>

          {/* Input */}
          <div className="flex h-14 items-center gap-3 border-b border-border px-4">
            {isFetching ? (
              <Loader
                size={17}
                className="animate-spin text-muted-foreground"
              />
            ) : (
              <Search size={17} className="text-muted-foreground" />
            )}
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies and shows…"
              className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
            />
            <Kbd>ESC</Kbd>
          </div>

          {/* Scope */}
          <div className="flex items-center gap-3 border-b border-border px-3.5 py-2.5">
            <span className="font-mono text-[9px] tracking-[0.14em] whitespace-nowrap text-muted-foreground/80 uppercase">
              Search in
            </span>
            <div className="max-w-70 flex-1">
              <ScopeToggle scope={scope} onChange={setScope} />
            </div>
          </div>

          {/* Body */}
          <div className="max-h-95 overflow-y-auto p-1.5">
            {!hasQuery ? (
              recent.length > 0 ? (
                <>
                  <div className="px-2.5 pt-2 pb-1.5 font-mono text-[9px] tracking-[0.14em] text-muted-foreground/80 uppercase">
                    Recent
                  </div>
                  {recent.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setQuery(term);
                        inputRef.current?.focus();
                      }}
                      className="flex w-full items-center gap-[11px] px-2.5 py-2 text-left transition-colors hover:bg-white/[0.04]"
                    >
                      <Clock size={15} className="text-muted-foreground" />
                      <span className="flex-1 truncate text-[13px] font-medium text-foreground">
                        {term}
                      </span>
                      <ArrowUpDown
                        size={13}
                        className="text-muted-foreground/50"
                      />
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-3 py-10 text-center text-[13px] text-muted-foreground">
                  Search the catalog for movies and shows.
                </div>
              )
            ) : results.length === 0 && !isFetching ? (
              <div className="px-3 py-10 text-center text-[13px] text-muted-foreground">
                No {scope === "movie" ? "movies" : "shows"} match “
                {debounced.trim()}”.
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-2.5 pt-2 pb-1.5 font-mono text-[9px] tracking-[0.14em] text-muted-foreground/80 uppercase">
                  <span>{scope === "movie" ? "Movies" : "Shows"}</span>
                  <span>
                    {results.length} result{results.length === 1 ? "" : "s"}
                  </span>
                </div>
                {results.map((item, i) => (
                  <SearchResultRow
                    key={`${item.type}-${item.id}`}
                    item={item}
                    active={i === active}
                    onSelect={() => go(item.type, item.id)}
                    onMouseEnter={() => setActive(i)}
                  />
                ))}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd> Navigate
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Kbd>↵</Kbd> Open
            </span>
            <span className="ml-auto inline-flex items-center gap-1.5">
              <Kbd>⌘K</Kbd> Toggle
            </span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
