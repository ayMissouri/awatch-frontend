export const profile = {
  eyebrow: "Profile",
  memberSince: (date: string) => `Member since ${date}`,
  editProfile: "Edit profile",
  preferences: "Preferences",
  edit: {
    title: "Edit profile",
    description: "Choose how your name appears across awatch.fun.",
    displayNameLabel: "Display name",
    hint: (username: string) => `Leave blank to use @${username}.`,
    save: "Save",
    saving: "Saving…",
    cancel: "Cancel",
    error: "Couldn’t save your profile. Please try again.",
  },
  stats: {
    titlesTracked: "Titles tracked",
    episodesWatched: "Episodes watched",
    watchTime: "Watch time",
    finishRate: "Finish rate",
    currentStreak: "Current streak",
    thisYear: "This year",
  },
  units: {
    hours: (n: number) => (n === 1 ? "hr" : "hrs"),
    days: (n: number) => (n === 1 ? "day" : "days"),
    percent: "%",
  },
  statMeta: {
    showsFilms: (shows: number, films: number) =>
      `${shows} ${shows === 1 ? "show" : "shows"} · ${films} ${films === 1 ? "film" : "films"}`,
    showsCompleted: (n: number) => `${n} ${n === 1 ? "show" : "shows"} completed`,
    approxDays: (n: number) => `≈ ${n} ${n === 1 ? "day" : "days"}`,
    ofCompleted: (done: number, total: number) => `${done} of ${total} completed`,
    best: (n: number) => `best · ${n} ${n === 1 ? "day" : "days"}`,
    titlesInYear: (year: number) => `titles in ${year}`,
  },
  sections: {
    continueWatching: "Continue watching",
    upNext: "Up next",
    recentActivity: "Recent activity",
    favoriteGenres: "Favorite genres",
    thisWeek: "This week",
  },
  links: {
    watchlist: "Watchlist",
    fullHistory: "Full history",
    calendar: "Calendar",
  },
  upNextKind: {
    nextEpisode: "Next episode",
    newSeason: "New season",
    fromWatchlist: "From watchlist",
  },
  activity: {
    untitled: "Untitled",
    verb: {
      watched: "Watched",
      finished: "Finished",
      paused: "Paused",
    },
    bucket: {
      today: "Today",
      thisWeek: "This week",
      earlier: "Earlier",
    },
    sub: {
      finished: "Marked finished",
      paused: "Paused",
      film: (year: number) => `Film · ${year}`,
      filmShort: "Film",
    },
    when: {
      now: "now",
      minsAgo: (n: number) => `${n}m ago`,
      hoursAgo: (n: number) => `${n}h ago`,
    },
  },
  upcoming: {
    today: "Today",
    streamingRelease: "Streaming release",
    tag: {
      newEpisode: "New episode",
      newSeason: "New season",
      premiere: "Premiere",
    },
  },
  empty: {
    activity: "No tracked activity yet.",
    genres: "Watch a few titles to see your top genres.",
    upcoming: "Nothing scheduled in the next week.",
    upNext: "You're all caught up — nothing queued.",
  },
};
