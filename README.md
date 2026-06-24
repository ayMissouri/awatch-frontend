# aWatch

A web app for tracking the movies and TV shows you're watching, plan to watch, or have finished. Browse and discover titles, manage your personal watchlist with per-show statuses and episode progress, and keep an eye on upcoming releases with a built-in calendar.

This is the frontend. It talks to a separate backend API for data and authentication.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [TanStack Query](https://tanstack.com/query) for server state and caching
- [Zustand](https://zustand-demo.pmnd.rs) for client state
- [Tailwind CSS v4](https://tailwindcss.com)
- TypeScript

## Getting Started

You must first setup the [backend](https://github.com/ayMissouri/watchlist-go)

Install dependencies and set up your environment:

```bash
npm install
cp .env.example .env.local
```

Set the backend API URL in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Then run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
