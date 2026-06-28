import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  discoverApi,
  type DiscoverAllResponse,
  type DiscoverItem,
  type DiscoverProvider,
  type DiscoverSort,
} from "@/lib/api";
import type { DiscoverSelection } from "@/components/discover/discover-data";

const DISCOVER_CACHE_KEY = "discover-all-cache";
const DISCOVER_CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24h

type DiscoverCache = { data: DiscoverAllResponse; ts: number };

function readDiscoverCache(): DiscoverCache | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(DISCOVER_CACHE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as DiscoverCache;
    if (!parsed?.data || typeof parsed.ts !== "number") return undefined;
    if (Date.now() - parsed.ts > DISCOVER_CACHE_MAX_AGE) return undefined;
    return parsed;
  } catch {
    return undefined;
  }
}

function writeDiscoverCache(data: DiscoverAllResponse) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      DISCOVER_CACHE_KEY,
      JSON.stringify({ data, ts: Date.now() } satisfies DiscoverCache),
    );
  } catch {}
}

export function useDiscoverAll() {
  const cached = useMemo(() => readDiscoverCache(), []);
  return useQuery({
    queryKey: ["discover", "all"],
    queryFn: async () => {
      const data = await discoverApi.all();
      writeDiscoverCache(data);
      return data;
    },
    initialData: cached?.data,
    initialDataUpdatedAt: cached?.ts,
  });
}

function toApiParams(sel: DiscoverSelection): {
  sort?: DiscoverSort;
  genre?: string;
  year?: number;
  provider?: DiscoverProvider;
} {
  if (sel.mode === "genre") {
    return {
      sort: sel.curation === "featured" ? "top_rated" : "popular",
      genre: sel.genre ? sel.genre.toLowerCase() : undefined,
    };
  }
  if (sel.mode === "year") {
    return sel.year ? { year: sel.year } : { sort: "popular" };
  }
  return sel.provider
    ? { provider: sel.provider as DiscoverProvider }
    : { sort: "popular" };
}

// Interleave movie + show results so the "All" type filter shows a mix.
function interleave(a: DiscoverItem[], b: DiscoverItem[]): DiscoverItem[] {
  const out: DiscoverItem[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i]) out.push(a[i]);
    if (b[i]) out.push(b[i]);
  }
  return out;
}

// Fetches one Discover catalog for the active selection. The /discover endpoint
// is per-type, so "All" fans out to movie + series and interleaves the results.
export function useDiscoverCatalog(sel: DiscoverSelection) {
  const params = toApiParams(sel);
  return useQuery({
    queryKey: ["discover", "catalog", sel.type, params],
    queryFn: async (): Promise<DiscoverItem[]> => {
      if (sel.type === "all") {
        const [movies, shows] = await Promise.all([
          discoverApi.catalog({ type: "movie", ...params }),
          discoverApi.catalog({ type: "series", ...params }),
        ]);
        return interleave(movies.items, shows.items);
      }
      const res = await discoverApi.catalog({
        type: sel.type === "tv" ? "series" : "movie",
        ...params,
      });
      return res.items;
    },
    staleTime: 5 * 60 * 1000,
  });
}
