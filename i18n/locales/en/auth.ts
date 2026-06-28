// Login, auth callback, poster wall, breadcrumbs.
export const auth = {
  login: {
    eyebrow: "Sign in",
    headingLine1: "Your watchlist,",
    headingLine2: "properly kept.",
    subheadingMobile: "Continue with Discord to access your library.",
    subheading:
      "Continue with Discord to access your library and pick up exactly where you left off.",
    continueWith: (provider: string) => `Continue with ${provider}`,
    wordmarkHomeLabel: "awatch.fun home",
    legal: {
      prefix: "By continuing you agree to our ",
      terms: "terms",
      conjunction: " and ",
      privacy: "privacy notice",
    },
  },
  breadcrumbs: {
    home: "Home",
    discover: "Discover",
    watchlist: "Watchlist",
    calendar: "Calendar",
    activity: "Activity",
    search: "Search",
    movies: "Movies",
    shows: "Shows",
    label: "Breadcrumb",
  },
};
