// Watchlist page and its controls (status, sort, bulk actions, toasts).
export const watchlist = {
  hero: {
    eyebrow: "Your library",
    title: "Watchlist",
    titleCount: (n: number) => `${n} title${n === 1 ? "" : "s"}`,
    addTitles: "Add titles",
  },
  toolbar: {
    searchPlaceholder: "Search your watchlist…",
    select: "Select",
    done: "Done",
    listView: "List view",
    gridView: "Grid view",
  },
  filter: {
    all: "All",
    movies: "Movies",
    shows: "Shows",
  },
  sort: {
    label: "Sort:",
    updated: "Recently updated",
    title: "Title (A–Z)",
    progress: "Progress",
  },
  status: {
    watching: "Watching",
    planned: "Planned",
    watched: "Watched",
    paused: "Paused",
    dropped: "Dropped",
    setStatus: "Set status",
    moveSelectionTo: "Move selection to",
    current: "Current",
    removeFromList: "Remove from list",
    removeFromWatchlist: "Remove from watchlist",
    manage: (title: string) => `Manage ${title}`,
  },
  mediaType: {
    series: "Series",
    film: "Film",
    tv: "TV",
    movie: "Movie",
  },
  progress: {
    finished: "Finished",
    notStarted: "Not started",
    percentIn: (pct: number) => `${pct}% in`,
  },
  card: {
    status: "Status",
    remove: "Remove",
  },
  bulk: {
    selected: "selected",
    remove: "Remove",
  },
  toast: {
    undo: "Undo",
    movedTo: (label: string) => `Moved to ${label}`,
    removed: (title: string) => `Removed ${title}`,
    bulkMovedTo: (n: number, label: string) => `${n} moved to ${label}`,
    bulkRemoved: (n: number) => `${n} removed`,
  },
  empty: {
    noMatchesTitle: "No matches",
    noMatchesHint: (query: string) =>
      `Nothing in your watchlist matches “${query}”. Try a different title or clear the search.`,
    nothingTitle: "Nothing here yet",
    nothingAllHint:
      "Your watchlist is empty. Browse and add a few titles to get started.",
    nothingStatusHint: (label: string) =>
      `You have no ${label} titles right now.`,
  },
};
