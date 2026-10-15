# Waymark

An accessible React and TypeScript product prototype for a daily devotional companion: a daily reading with streak tracking, a filterable resource library, and a concept shop with a persistent cart and demo checkout.

**[Live site](https://waymark-steel.vercel.app/)**

## What I built

- Multi-route React 19 + TypeScript app (React Router, Vite) with a documented component library and design tokens, shown on a living style guide at `/style-guide`.
- **Devotional** with date-based streak tracking stored in the browser.
- **Resources** library with category filtering and detail pages.
- **Store** with product pages, a cart drawer and a checkout demonstration. No payment is collected and form data is never sent or stored.

## Accessibility

- Focus-trapped cart drawer that returns focus to the button that opened it.
- Focus moves to the main content on every route change, with page titles updated per route.
- A live region (`LiveAnnouncer`) announces cart and progress changes to screen readers.
- Skip link, visible focus states and reduced-motion handling for scroll effects.

## Quality checks

```sh
npm test        # Vitest + Testing Library: 121 tests across 16 files
npm run lint    # oxlint
npm run build   # TypeScript strict check + production build
```

## Run locally

```sh
npm install
npm run dev
```

## Scope

A front-end prototype. Cart contents and devotional progress live only in the visitor's browser. Resource articles and product artwork are original sample content for this concept.

---

Designed and built by **Michael L. Lawson**, design engineer and creative developer · [mll-creativeeng.com](https://www.mll-creativeeng.com) · [LinkedIn](https://www.linkedin.com/in/michael-lawson-a7707924)
