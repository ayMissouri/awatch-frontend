// Discover page and its filters.
export const discover = {
  eyebrow: "Browse the catalogue",
  title: "Discover",
  intro:
    "Browse one lens at a time — by genre, by year, or by network. Pick a lane and dig in.",
  clear: "Clear",
  titlesLabel: (n: number) => (n === 1 ? "title" : "titles"),

  types: {
    all: "All",
    movies: "Movies",
    shows: "Shows",
  },

  modes: {
    genre: "Genre",
    year: "Year",
    network: "Network",
  },

  curations: {
    popular: "Popular",
    featured: "Featured",
  },

  filters: {
    show: "Show",
    allGenres: "All genres",
    allNetworks: "All networks",
    scrollLeft: "Scroll left",
    scrollRight: "Scroll right",
    yearPlaceholder: "Any year — e.g. 2024",
    clearYear: "Clear year",
  },

  heading: {
    allYears: "All years",
    allNetworks: "All networks",
  },

  empty: {
    title: "Nothing here yet",
    hint: "Try a different selection or switch the type back to All.",
  },

  error: {
    title: "Couldn’t load titles",
    hint: "Something went wrong fetching this catalogue.",
    retry: "Try again",
  },
};
