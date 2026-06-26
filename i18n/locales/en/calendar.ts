// Calendar page (agenda, month grid, empty states, desktop/mobile).
export const calendar = {
  hero: {
    eyebrow: "Coming up",
    title: "On the calendar",
    titleMobile: "Calendar",
    description:
      "Premieres and new episodes from your watchlist, by the date they land.",
    upcoming: "upcoming",
    upcomingCount: (n: number) => `${n} upcoming`,
    fromWatchlist: "from your watchlist",
  },
  toolbar: {
    prevMonth: "Previous month",
    nextMonth: "Next month",
    today: "Today",
    sync: "Sync from watchlist",
    upcomingHeading: "Upcoming",
    from: (label: string) => `from ${label}`,
  },
  filters: {
    all: "All",
    episodes: "Episodes",
    movies: "Movies",
  },
  views: {
    month: "Month grid",
    agenda: "Agenda",
  },
  agenda: {
    today: "Today",
  },
  day: {
    nothing: "Nothing lands on this day.",
    more: (n: number) => `+${n} more`,
  },
  releaseCount: (n: number) => `${n} release${n === 1 ? "" : "s"}`,
  release: {
    newEpisode: "New episode",
    premiere: "Premiere",
    seasonEpisode: (season: number, episode: number) =>
      `S${season} · E${episode}`,
    series: "Series",
    movie: "Movie",
    remindMe: "Remind me",
    reminderSet: "Reminder set",
  },
  empty: {
    nothingThisMonthTitle: "Nothing this month",
    nothingThisMonthHint:
      "No releases from your watchlist land in this month. Jump to another month or switch to the agenda.",
    nothingThisMonthHintMobile:
      "No releases from your watchlist land in this month. Try another month or the agenda.",
    nothingUpcomingTitle: "Nothing upcoming",
    nothingUpcomingHint:
      "Nothing from your watchlist has an announced date yet. Hit sync to check for newly scheduled releases.",
  },
  weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  weekdaysNarrow: ["S", "M", "T", "W", "T", "F", "S"],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthsShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
};
