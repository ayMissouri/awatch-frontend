import { t } from "@/i18n";

export type DiscoverMode = "genre" | "year" | "network";
export type DiscoverType = "all" | "movie" | "tv";
export type Curation = "popular" | "featured";

export interface DiscoverSelection {
  mode: DiscoverMode;
  type: DiscoverType;
  genre: string | null;
  curation: Curation;
  year: number | null;
  provider: string | null;
}

export const DISCOVER_MODES: { id: DiscoverMode; label: string }[] = [
  { id: "genre", label: t.discover.modes.genre },
  { id: "year", label: t.discover.modes.year },
  { id: "network", label: t.discover.modes.network },
];

export const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "History",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
];

export const NETWORKS: { id: string; label: string; tint: string }[] = [
  { id: "netflix", label: "Netflix", tint: "#e50914" },
  { id: "hbomax", label: "Max", tint: "#7b2ff7" },
  { id: "disney", label: "Disney+", tint: "#1f80e0" },
  { id: "prime", label: "Prime Video", tint: "#00a8e1" },
  { id: "appletv", label: "Apple TV+", tint: "#9aa0a6" },
];

export const NETWORK_LABEL: Record<string, string> = Object.fromEntries(
  NETWORKS.map((n) => [n.id, n.label]),
);

export const CURATIONS: { id: Curation; label: string }[] = [
  { id: "popular", label: t.discover.curations.popular },
  { id: "featured", label: t.discover.curations.featured },
];

export function parseDiscoverParams(sp: URLSearchParams): DiscoverSelection {
  const typeRaw = sp.get("type");
  const type: DiscoverType =
    typeRaw === "movie" || typeRaw === "tv" ? typeRaw : "all";

  const genreRaw = sp.get("genre");
  const genre =
    (genreRaw &&
      GENRES.find((g) => g.toLowerCase() === genreRaw.toLowerCase())) ||
    null;

  const providerRaw = sp.get("provider");
  const provider =
    providerRaw && NETWORKS.some((n) => n.id === providerRaw)
      ? providerRaw
      : null;

  const yearNum = sp.get("year") ? parseInt(sp.get("year")!, 10) : NaN;
  const year =
    Number.isInteger(yearNum) && yearNum >= 1900 && yearNum <= 2100
      ? yearNum
      : null;

  const curation: Curation =
    sp.get("curation") === "featured" ? "featured" : "popular";

  const modeRaw = sp.get("mode");
  const mode: DiscoverMode =
    modeRaw === "genre" || modeRaw === "year" || modeRaw === "network"
      ? modeRaw
      : year != null
        ? "year"
        : provider != null
          ? "network"
          : "genre";

  return { mode, type, genre, curation, year, provider };
}

export function discoverHeading(sel: DiscoverSelection): string {
  if (sel.mode === "genre")
    return (
      sel.genre ??
      (sel.curation === "featured"
        ? t.discover.curations.featured
        : t.discover.curations.popular)
    );
  if (sel.mode === "year")
    return sel.year ? String(sel.year) : t.discover.heading.allYears;
  return sel.provider
    ? NETWORK_LABEL[sel.provider]
    : t.discover.heading.allNetworks;
}
