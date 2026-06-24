// localStorage list of recent search terms, used in the search bar modal.
const KEY = "awatch:recent-searches"
const MAX = 6

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : []
  } catch {
    return []
  }
}

export function addRecentSearch(term: string): string[] {
  const t = term.trim()
  if (!t) return getRecentSearches()
  const next = [t, ...getRecentSearches().filter((s) => s.toLowerCase() !== t.toLowerCase())].slice(0, MAX)
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next))
  } catch {}
  return next
}
