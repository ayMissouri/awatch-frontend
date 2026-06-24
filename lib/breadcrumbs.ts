import type { ReadonlyURLSearchParams } from "next/navigation"
import { NETWORK_LABEL } from "@/components/discover/discover-data"

// href renders a link, onClick a button; a crumb with neither it renders as the current stage.
export type Crumb = { label: string; href?: string; onClick?: () => void }

const TYPE_LABEL: Record<string, string> = { movie: "Movies", tv: "Shows" }

// discover page breadcrumbs work based on the filters applied.
export interface DiscoverContext {
  type?: string | null // "all" | "movie" | "tv"
  curation?: string | null // "popular" | "featured"
  genre?: string | null // display label, e.g. "Sci-Fi"
  year?: number | null
  provider?: string | null // provider id, e.g. "netflix"
}

export function discoverCrumbs(ctx: DiscoverContext): Crumb[] {
  const crumbs: Crumb[] = [{ label: "Discover", href: "/discover" }]
  const type = ctx.type === "movie" || ctx.type === "tv" ? ctx.type : null

  if (type) {
    crumbs.push({ label: TYPE_LABEL[type], href: `/discover?${new URLSearchParams({ type })}` })
  }

  const dim = ctx.genre
    ? { key: "genre", value: ctx.genre, label: ctx.genre }
    : ctx.year
      ? { key: "year", value: String(ctx.year), label: String(ctx.year) }
      : ctx.provider
        ? { key: "provider", value: ctx.provider, label: NETWORK_LABEL[ctx.provider] ?? ctx.provider }
        : null

  if (dim) {
    const p = new URLSearchParams()
    if (type) p.set("type", type)
    if (ctx.curation === "featured") p.set("curation", "featured")
    p.set(dim.key, dim.value)
    crumbs.push({ label: dim.label, href: `/discover?${p}` })
  }

  return crumbs
}

export function fromQuery(origin: { from: string } & DiscoverContext): string {
  const p = new URLSearchParams()
  p.set("from", origin.from)
  if (origin.type === "movie" || origin.type === "tv") p.set("type", origin.type)
  if (origin.curation === "featured") p.set("curation", "featured")
  if (origin.genre) p.set("genre", origin.genre)
  if (origin.year) p.set("year", String(origin.year))
  if (origin.provider) p.set("provider", origin.provider)
  return p.toString()
}

export function originCrumbs(sp: URLSearchParams | ReadonlyURLSearchParams): Crumb[] {
  switch (sp.get("from")) {
    case "discover":
      return discoverCrumbs({
        type: sp.get("type"),
        curation: sp.get("curation"),
        genre: sp.get("genre"),
        year: sp.get("year") ? Number(sp.get("year")) : null,
        provider: sp.get("provider"),
      })
    case "watchlist":
      return [{ label: "Watchlist", href: "/watchlist" }]
    case "calendar":
      return [{ label: "Calendar", href: "/calendar" }]
    case "search":
      return [{ label: "Search" }]
    default:
      return [{ label: "Home", href: "/" }]
  }
}
