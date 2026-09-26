# Gio's Kebab frontend

React and TypeScript frontend for Gio's Kebab. The public homepage and owner CMS read the live backend.

## Requirements

- Node.js 22.22 or newer (Node.js 25.2.1 is also supported by the selected Vite and React Router versions)
- npm 11 or compatible npm bundled with Node.js

## Local setup

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

On macOS/Linux, use `cp .env.example .env.local` instead of `Copy-Item`. The development server prints its local address. `npm run build` creates the production bundle in `dist/`; `npm run preview` serves that bundle locally. `npm run lint` runs ESLint.

## Environment

Leave `VITE_API_BASE_URL` blank for same-origin `/api` calls. During local development, Vite proxies `/api` to `http://127.0.0.1:8080`; set `DEV_API_PROXY_TARGET` if your backend runs elsewhere. Production hosting needs a same-origin reverse proxy for `/api`, or an explicitly configured same-site backend origin. A direct cross-origin `VITE_API_BASE_URL` requires that exact frontend origin in the backend's `ADMIN_CORS_ALLOWED_ORIGINS` configuration. The frontend does not disable CORS or CSRF.

Vite exposes `VITE_` variables to browser code, so never put credentials, tokens, or other secrets in them. `.env.example` contains no secrets, and `.env*` files are ignored by Git except for that example.

The backend is the sibling project at `../backend`; it is a separately managed Spring Boot application. See its `docs/BACKEND_CURRENT_STATE.md` and linked API/security documents for the authoritative contracts. The homepage consumes `GET /api/public/restaurant`, `/opening-status`, `/opening-hours`, `/menu`, and `/promotions`. Restaurant, menu, and promotion requests send `lang=lt|en|ru|ka`; opening-hours routes remain language independent. The backend resolves missing translated fields to Lithuanian. The frontend has no embedded menu items, contact details, promotion copy, or delivery URLs.

All API requests use `credentials: 'include'`. Owner operations use the backend's HttpOnly session cookie, obtain its documented CSRF token, and send `X-CSRF-TOKEN` on state-changing requests. Keep admin hosting same-site with the backend so its `SameSite=Lax` cookie works. Only the KA/RU admin interface preference is stored locally; credentials and tokens are never persisted.

## Languages and routes

`/` redirects to `/lt`. The public homepage is available at `/lt`, `/en`, `/ru`, and `/ka`; the URL determines its language and survives refresh. The language switcher changes the route, while public content requests use the backend's separate `lang` query parameter. `/admin` and `/admin/login` stay outside the localized route tree. The owner interface supports KA and RU independently of the LT/EN/RU/KA tabs for editing public content. Lithuanian fields are canonical; saving an edit sends the complete desired translation map for the other languages.

## Source layout

- `src/app/` contains application routing and shared app setup.
- `src/features/public/` contains the public page, static translations, contract types, data loading, and its scoped components/styles. `src/features/admin/` contains the owner CMS and translation editor.
- `src/lib/i18n/` contains the supported locale types and harmless interface preference helpers.
- `src/lib/api/` contains the environment-based API origin and small shared request helper.
- `src/styles.css` contains global styles, self-hosted DM Sans/Instrument Serif faces, and the Tailwind entrypoint.

The supplied logo lives in `src/assets/brand/`. Food photography is intentionally absent until real assets are available. No structured restaurant data is emitted yet because the API exposes an unstructured address and no verified image or public site URL.
