# Ultimate Habit Tracker Dashboard

Premium dark-mode SaaS frontend built with React + Vite + Tailwind + Recharts.

## Stack

- React 19 + Vite 8
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Recharts
- Lucide Icons
- Mock JSON data only (no backend required)

## Local Development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production Build

```bash
npm run lint
npm run build
npm run preview
```

## Production Readiness Included

- Route/component lazy loading for heavier analytics sections
- Manual vendor chunking in `vite.config.js` (`react`, `recharts`, `lucide-react`)
- Runtime safety via `ErrorBoundary`
- SEO-ready `index.html` metadata (`description`, `theme-color`, `robots`)
- Fully responsive dark UI with accessible labels and keyboard-friendly controls

## Deploy

This project outputs static files and can be deployed to:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages (with proper base path config if needed)

Deploy the `dist/` folder from `npm run build`.
