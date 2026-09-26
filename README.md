# Gio's Kebab frontend

React and TypeScript frontend foundation for Gio's Kebab. The public site and owner CMS will be built in later slices.

## Requirements

- Node.js 22.22 or newer (Node.js 25.2.1 is also supported by the selected Vite and React Router versions)
- npm 11 or compatible npm bundled with Node.js

## Local setup

```sh
npm install
Copy-Item .env.example .env.local # PowerShell; on macOS/Linux use: cp .env.example .env.local
npm run dev
```

The development server prints its local address. `npm run build` creates the production bundle in `dist/`; `npm run preview` serves that bundle locally. `npm run lint` runs ESLint.

## Environment

Set `VITE_API_BASE_URL` in `.env.local` to the backend origin, such as `http://localhost:8080`. Leave it blank when a same-origin reverse proxy routes `/api` to the backend. Vite exposes `VITE_` variables to browser code, so never put credentials, tokens, or other secrets in them. `.env.example` contains no secrets, and `.env*` files are ignored by Git except for that example.

The backend is the sibling project at `../backend`; it is a separately managed Spring Boot application. See its `docs/BACKEND_CURRENT_STATE.md` and linked API/security documents for the authoritative contracts. The frontend must not guess endpoints or response shapes. For owner operations, preserve the backend's HttpOnly session cookie: requests include credentials, the UI must obtain the documented session CSRF token, and state-changing requests must send `X-CSRF-TOKEN`. Keep admin hosting same-site with the backend so its `SameSite=Lax` cookie works. CSRF protection must remain enabled.

## Source layout

- `src/app/` contains application routing and shared app setup.
- `src/features/public/` and `src/features/admin/` hold their route entry components and future product features.
- `src/lib/api/` contains the environment-based API origin and small shared request helper.
- `src/styles.css` contains global styles and the Tailwind entrypoint.

Routes currently provide placeholders at `/` and `/admin`. They are only a routing foundation, not the public site or CMS.
