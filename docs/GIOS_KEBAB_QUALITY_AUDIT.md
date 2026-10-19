# Gio's Kebab — current quality audit and implementation plan

Audited **20 October 2026, Europe/Vilnius**. This is a measurement baseline and a plan for a separate implementation session. No restaurant optimization, studio redesign, commit, push, or deployment was performed.

## 1. Executive summary

The restaurant works with the existing local backend, and its desktop experience measures well. The Lithuanian homepage's repeated Lighthouse median is **65 Performance / 100 Accessibility / 100 Best Practices / 100 SEO on mobile**, and **98 / 100 / 100 / 100 on desktop**. Mobile homepage loading and stability need attention: median LCP is approximately **5.11 s**, CLS **0.230**, and FCP **2.71 s**. Median TBT is only **32 ms**; heavy interaction blocking is not the primary measured problem.

The evidence points to late-discovered, oversized imagery, an eager shared restaurant/admin bundle, and changing hero geometry while API content and fonts arrive. The legal pages perform substantially better. Lighthouse's Accessibility 100 does **not** mean there are no issues: its failing label/name audit has weight zero in this Lighthouse version. axe independently finds the same speech-input issue, plus a landmark issue.

No P0 restaurant blocker was reproduced in the tested local public flows. P1 fixes should target mobile LCP/CLS, accessible names, and the shared startup payload. Production hosting, field Core Web Vitals, external destination availability, and a complete manual assistive-technology audit remain outside what localhost can establish.

The approved studio was preserved, including its static original emblem. Its repeated results are **88 / 100 / 100 / 69 mobile** and **100 / 100 / 100 / 69 desktop**. `publicationReady: false` intentionally produces `noindex, nofollow`, accounting for SEO 69. This flag was preserved; make the publication decision deliberately at release. No motion or image treatment was added: the supplied raster has baked-in lighting, and the available alternatives would alter its appearance or imply flat-card depth.

## 2. Exact Lighthouse scores by public route

Scores below are actual Lighthouse 0–100 category scores, ordered **Performance / Accessibility / Best Practices / SEO**. Three-run rows show the median of each category; other rows are explicitly single-run observations, not equally robust estimates.

| Route | Mobile P / A / BP / SEO | Desktop P / A / BP / SEO | Runs per device |
| --- | --- | --- | --- |
| `/studio` | 88 / 100 / 100 / 69 | 100 / 100 / 100 / 69 | 3 |
| `/lt` | 65 / 100 / 100 / 100 | 98 / 100 / 100 / 100 | 3 |
| `/lt/privacy` | 90 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 3 |
| `/lt/legal` | 91 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 3 |
| `/en` | 69 / 100 / 100 / 100 | 99 / 100 / 100 / 100 | 1 |
| `/en/privacy` | 93 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 1 |
| `/en/legal` | 92 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 1 |
| `/ru` | 74 / 100 / 100 / 100 | 98 / 100 / 100 / 100 | 1 |
| `/ru/privacy` | 93 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 1 |
| `/ru/legal` | 92 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 1 |
| `/ka` | 72 / 100 / 100 / 100 | 98 / 100 / 100 / 100 | 1 |
| `/ka/privacy` | 95 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 1 |
| `/ka/legal` | 94 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 1 |

`/` redirects in the browser to `/lt`; it is not an additional content page. Public menu and lunch information live inside each localized homepage as `#menu` and `#lunch`, not separate `/menu` or `/lunch` routes. These sections are covered by homepage measurements and separate interaction/deep-link checks. Fragment navigation is not presented as an independent cold-page score. All four localized homepages and all eight localized privacy/business pages were audited.

### Repeated measurements

| Route/device | Performance, runs 1 / 2 / 3 | Median | Range |
| --- | --- | --- | --- |
| `/studio` mobile | 88 / 88 / 88 | 88 | 88–88 |
| `/studio` desktop | 100 / 100 / 100 | 100 | 100–100 |
| `/lt` mobile | 65 / 63 / 65 | 65 | 63–65 |
| `/lt` desktop | 98 / 98 / 98 | 98 | 98–98 |
| `/lt/privacy` mobile | 90 / 90 / 90 | 90 | 90–90 |
| `/lt/privacy` desktop | 100 / 100 / 100 | 100 | 100–100 |
| `/lt/legal` mobile | 91 / 91 / 90 | 91 | 90–91 |
| `/lt/legal` desktop | 100 / 100 / 100 | 100 | 100–100 |

All individual measurements, including the slower samples, are retained. Aggregate metric tables use per-metric medians, rather than selecting one favorable run. The single-run translated routes should receive three-run verification when a future change affects them directly.

## 3. Environment, build and reproduction

| Condition | Recorded value |
| --- | --- |
| Build | `npm run build`: TypeScript project build, then Vite 8.3.1 production build into `frontend/dist` |
| Serving | `npm run preview -- --host 127.0.0.1 --port 4187 --strictPort`; serves built assets, not Vite development/HMR |
| Origin | `http://127.0.0.1:4187`; each path in the score table is appended to this origin |
| Backend | Existing service at `http://127.0.0.1:8080`; public requests successfully proxied through the preview origin |
| Data | Actual existing local public data: 9 categories, 51 menu items, 7 lunch days with 2 items, zero current promotions |
| Backend intervention | Already running; no credentials supplied or invented, database writes, provisioning, or database manipulation |
| Lighthouse | 13.5.0; headless installed Chrome 155.0.8059.80; four categories; `throttlingMethod: simulate` |
| Mobile | 390 × 844 CSS px, DPR 1.75, mobile emulation; default Lighthouse mobile UA; 150 ms RTT, 1,638.4 Kbps, CPU slowdown 4× |
| Mobile throttle details | request latency 562.5 ms, download 1,474.56 Kbps, upload 675 Kbps, as recorded by Lighthouse's mobile defaults |
| Desktop | 1440 × 1000 CSS px, DPR 1, desktop Chrome UA; 40 ms RTT, 10,240 Kbps, CPU slowdown 1× |
| Browser checks | Playwright Core 1.64.1; axe-core 4.14.0; 390 × 844 and 1440 × 1000; responsive samples at 320, 390, 768, 1100, 1440 px |
| Host | Windows 11 Home; AMD Ryzen 7 7435HS; 16 logical CPUs; approximately 15.82 GiB RAM; Node 25.2.1, npm 11.6.2, Java 21.0.11 |
| Samples | 42 sequential cold Lighthouse navigations: three/device for `/studio`, `/lt`, `/lt/privacy`, `/lt/legal`; one/device for the other 9 restaurant routes |
| Cache and concurrency | Fresh Chrome context/process per Lighthouse sample, normal Lighthouse storage reset; no concurrent audit browsers or test/build workload during Lighthouse |
| Frontend baseline | `development`, commit `eeb94e1599edadbfb9d9ca45dde0eeeb26db5f7d` |
| Backend baseline | `development`, commit `bcab789a6c6278cd60985293929c745b67b9d310` |
| Timestamp interval | 2026-10-19T21:48:47.618Z to 2026-10-19T21:53:49.564Z (UTC; local date 20 October 2026, UTC+03:00) |

This mobile profile intentionally uses DPR 1.75. Older studio reports used DPR 1, so their image selection and performance score are not a controlled before/after comparison with this audit.

Run the build and preview in separate PowerShell terminals:

```powershell
Set-Location C:\Users\giorg\Desktop\kebab-shop\frontend
npm run build
npm run lint
npm run preview -- --host 127.0.0.1 --port 4187 --strictPort
```

Before auditing, confirm all six GETs through the **preview origin**, not only direct backend connectivity:

```powershell
$paths = 'restaurant?lang=lt', 'opening-status', 'opening-hours',
         'menu?lang=lt', 'lunch-menu?lang=lt', 'promotions?lang=lt'
foreach ($path in $paths) {
  (Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:4187/api/public/$path").StatusCode
}
```

If unavailable in a later session, follow `backend/docs/BACKEND_FOUNDATION.md` and the existing local Spring profile with the operator's already-configured local PostgreSQL credentials. The repository does not load `.env` automatically into Spring. Do not substitute production data, fabricate credentials, or treat an error/empty page as a valid full restaurant audit. Record the outage separately and repeat after all six endpoints respond normally.

The retained audit harnesses use the already-installed workspace tools; no package manifests or lockfiles were changed. From `backend`, rerun sequentially:

```powershell
node target/quality-audit-2026-10-20/environment.mjs
node target/quality-audit-2026-10-20/browser.mjs
node target/quality-audit-2026-10-20/supplement.mjs
node target/quality-audit-2026-10-20/lighthouse.mjs
```

The Lighthouse runner imports the existing `.verification/frontend-tools/node_modules/lighthouse/core/index.js`, launches installed Chrome through `studio-workspace/node_modules/playwright-core`, and specifies both device profiles explicitly. Each JSON includes the complete `configSettings`, `fetchTime`, Lighthouse version, URL, environment benchmark, warnings, category audits and findings. Browser checks finish and close Chrome before Lighthouse starts. The supplemental 503 test intercepts only its own Playwright requests; it never changes backend availability and is excluded from all Lighthouse scores.

Raw HTML/JSON reports, screenshots, harnesses and coverage remain in **`backend/target/quality-audit-2026-10-20/`**, an existing ignored build-output area. They are local evidence, not application dependencies or a durable checked-in artifact. Preserve/copy this directory before cleaning `target`; a fresh clone will need the same audit tooling installed separately. Main evidence:

- `environment.json`: build asset sizes and successful backend prerequisites.
- `lighthouse/<route>-<device>-<run>.{json,html}` and `lighthouse/summary.json`: every sample, e.g. `lt-mobile-1.json`.
- `browser/summary.json`: 26 route/device scans, axe results, metadata, resource timings and console/network observations.
- `browser/summary-interactions.json`: corrected final 17/17 interaction checks. The initial scan's three harness failures were superseded here: use DOM readiness for the login gate, normalized chapter accessible names, and respect the intentionally hidden motion toggle under OS reduced motion.
- `browser/supplement.json`: coverage, six supplemental checks, and eight expanded-control axe scans.
- `browser/axe-*.json`: full axe passes, violations and incomplete/manual checks.
- `compact-summary.json`: calculated scores/medians and final verification totals.

## 4. Core Web Vitals and lab diagnostics

Seconds are reported to three decimals; CLS is unitless; TBT is milliseconds. These are simulated **lab** measurements, not deployed field percentiles. Values are per-metric medians where there are three samples.

| Route | Device | FCP (s) | LCP (s) | CLS | TBT (ms) | Speed index (s) | Transfer (KiB) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/studio` | mobile | 2.031 | 3.607 | 0.003 | 8 | 2.031 | 445.9 |
| `/studio` | desktop | 0.465 | 0.746 | 0.004 | 0 | 0.465 | 451.3 |
| `/lt` | mobile | 2.709 | 5.113 | 0.230 | 32 | 2.709 | 778.2 |
| `/lt` | desktop | 0.567 | 1.012 | 0.053 | 0 | 0.567 | 778.2 |
| `/lt/privacy` | mobile | 2.555 | 3.007 | 0.046 | 0 | 2.555 | 315.9 |
| `/lt/privacy` | desktop | 0.524 | 0.646 | 0.001 | 0 | 0.524 | 315.9 |
| `/lt/legal` | mobile | 2.554 | 3.006 | 0.000 | 0 | 2.554 | 318.2 |
| `/lt/legal` | desktop | 0.525 | 0.667 | 0.001 | 0 | 0.525 | 318.2 |
| `/en` | mobile | 2.405 | 4.808 | 0.217 | 5 | 2.405 | 777.8 |
| `/en` | desktop | 0.527 | 0.970 | 0.050 | 0 | 0.527 | 777.8 |
| `/en/privacy` | mobile | 2.254 | 2.856 | 0.008 | 0 | 2.254 | 304.3 |
| `/en/privacy` | desktop | 0.524 | 0.647 | 0.001 | 0 | 0.524 | 306.5 |
| `/en/legal` | mobile | 2.254 | 2.931 | 0.045 | 0 | 2.254 | 306.5 |
| `/en/legal` | desktop | 0.523 | 0.645 | 0.001 | 0 | 0.523 | 306.5 |
| `/ru` | mobile | 2.407 | 4.810 | 0.140 | 37 | 2.407 | 761.4 |
| `/ru` | desktop | 0.566 | 0.989 | 0.051 | 0 | 0.566 | 761.4 |
| `/ru/privacy` | mobile | 2.254 | 2.856 | 0.001 | 0 | 2.254 | 304.4 |
| `/ru/privacy` | desktop | 0.524 | 0.646 | 0.001 | 0 | 0.524 | 304.4 |
| `/ru/legal` | mobile | 2.404 | 2.931 | 0.000 | 0 | 2.404 | 306.6 |
| `/ru/legal` | desktop | 0.524 | 0.647 | 0.001 | 0 | 0.524 | 306.6 |
| `/ka` | mobile | 2.556 | 5.034 | 0.148 | 5 | 2.556 | 779.4 |
| `/ka` | desktop | 0.566 | 0.989 | 0.054 | 0 | 0.566 | 779.4 |
| `/ka/privacy` | mobile | 2.104 | 2.556 | 0.018 | 3 | 2.104 | 262.4 |
| `/ka/privacy` | desktop | 0.484 | 0.566 | 0.037 | 0 | 0.484 | 262.4 |
| `/ka/legal` | mobile | 2.104 | 2.706 | 0.020 | 0 | 2.104 | 264.6 |
| `/ka/legal` | desktop | 0.484 | 0.625 | 0.026 | 0 | 0.484 | 264.6 |

For the Lithuanian mobile homepage, LCP >4 s is poor and CLS 0.230 needs improvement relative to the usual good thresholds of 2.5 s and 0.1. FCP is 2.71 s. These observations justify P1 work even though desktop is fast. The legal routes demonstrate that the entire restaurant application is not uniformly slow.

**INP:** no real-user INP/CrUX/RUM dataset was available. Current analytics hooks in `src/lib/analytics.ts` are deliberately no-ops. Do not label TBT as INP or infer a field CWV pass. TBT and keyboard/interaction checks are the available lab responsiveness evidence. Low TBT shows that network/rendering/stability deserve priority over speculative event-handler rewrites. The recorded Lighthouse LCP subpart tables describe the observed local trace, while headline metrics are simulated; their raw millisecond subparts must not be summed and called the simulated 5.11 s LCP.

## 5. Diagnoses, causes and supporting evidence

### A. Mobile layout changes during initial data/font loading — P1

In `lt-mobile-1.json`, `cls-culprits-insight` attributes **0.228620** of the **0.229653** total shift to movement of `section#lunch`, with web fonts listed as associated culprits. The hero heading contributes another **0.001033**. Browser observer geometry independently records the lunch section moving from approximately **y=521 to y=738** while `.hero-ordering` expands from **54 to 159 px** high. These geometry observations support diagnosis, but their observer entries have `hadRecentInput: true`; they are not substituted for Lighthouse CLS.

`PublicHome.tsx` initially has no profile/delivery links/opening status, then adds the profile description, provider instructions/actions and opening indicator as six independent API requests resolve. `public.css` gives the mobile `.hero-inner` no minimum height. That is a concrete content-driven expansion path. `styles.css` uses `font-display: swap`, while restaurant headings/body use unadjusted fallback families; font substitution can also change wrapping. Lighthouse identifies font association, but this audit does **not** causally isolate how much of the total comes from API rendering versus each font. Do not assume a font-only fix will solve it.

Proposed fix: first capture cold-load screenshots/trace with deliberately staggered responses. Give the hero's real loading and success states stable responsive geometry, using an appropriate loading treatment and consistent text metrics without hardcoded business data. Then evaluate narrowly scoped metric-compatible font fallbacks and only demonstrably critical preloads. This should reduce movement because content arrives into allocated space and fallback-to-webfont line boxes change less. Avoid a single fixed height that clips translated/owner-edited text or leaves excessive whitespace.

Likely files: `src/features/public/PublicHome.tsx`, `src/features/public/public.css`, `src/styles.css`; inspect `LunchSection.tsx` and `usePublicResource.ts` as data transitions, not automatic candidates for rewrites.

### B. Oversized and late-discovered LCP/illustrative images — P1

The homepage LCP node is `.hero-media img`. It already has `fetchPriority="high"` and is not lazy, but Lighthouse explicitly reports **requestDiscoverable=false**: it appears after the shared JavaScript mounts React, rather than in the initial HTML. The existing hero is **243,472 bytes**, naturally **1672 × 941**, displayed at approximately **390 × 242 CSS px** in the mobile snapshot, without `srcSet`. The menu illustration is **177,978 bytes**, **980 × 735**. Both are downloaded in the cold mobile trace even though the latter has `loading="lazy"`; native lazy loading is a proximity heuristic and does not promise exclusion from initial traffic.

`image-delivery-insight` in `lt-mobile-1.json` estimates **386 KiB** of aggregate image savings: approximately **190,449 bytes hero**, **144,361 bytes menu illustration**, **47,881 bytes logo**, and **12,323 bytes Wolt wordmark**. These are Lighthouse's opportunity estimates, not measured savings or additive score gains. Its dimensions account for DPR/cropping and differ from the CSS-box dimensions above.

Proposed fix: produce visually reviewed WebP size variants from the existing master images, use truthful `srcSet`/`sizes` for mobile and desktop crops, and retain the original assets and approved branding. Correct intrinsic dimensions alongside variant work: current hero attributes say 1680 × 938 versus the actual 1672 × 941, and the menu illustration says 980 × 694 versus 980 × 735. Their current fixed/object-fit boxes mean these mismatches are **not established as the main CLS cause**. Smaller appropriate files should reduce transfer on the constrained network. Review whether the decorative cutout should be requested so early. Evaluate route-aware LCP discovery only after measuring image/bundle changes; a global preload must not force restaurant photos onto `/studio`, legal or admin pages.

Likely files: `src/assets/restaurant/demo/hero-grill.webp`, `kebab-cutout.webp`, `PublicHome.tsx`, `components/MenuSection.tsx`, `public.css`; a route-aware build/head step only if later justified. Do not replace owner `imageUrl` data or provider links. Existing Cloudinary thumbnail transformation logic in `MenuThumbnail.tsx` already handles its documented pattern; do not apply speculative transformations to unrelated HTTPS URLs.

### C. Shared eager public/admin JavaScript — P1

The production build warns about **547,366 bytes** of shared minified JS (**159,989 bytes gzip**, measured with Node gzip; Vite's gzip estimate is about 161 KB). `src/app/router.tsx` eagerly imports the owner shell, overview, restaurant, hours, menu, lunch and promotions pages, plus public/legal pages; only the studio route is lazy. Owner UI and translation strings therefore ship on a customer visit even though no admin API request is needed. Lighthouse estimates **72,005 wasted compressed bytes / 49.36%** for the shared file on the first mobile homepage run, with **70 KiB** displayed savings. That is initial-navigation coverage, not permission to delete code used elsewhere.

Proposed fix: use the existing router's supported lazy route boundaries for owner modules, with an accessible loading/error experience and unchanged auth/CSRF/API behavior. Consider legal-page separation next if measurements warrant it. The expected mechanism is less initial transfer/parse work and earlier rendering on a constrained connection. TBT is already low, so do not promise a large responsiveness or score gain and do not add a manual vendor-chunk scheme without evidence.

Likely files: `src/app/router.tsx`, owner page imports and their CSS boundaries, `PublicLocaleLayout.tsx` as needed. Preserve direct admin deep links, locale context and the current lazy studio import/identity cleanup.

### D. CSS and fonts contribute to the critical path — P2, with font-related CLS covered by P1

Shared CSS is **96,069 bytes raw / 19,887 gzip**. The first mobile homepage report flags it as render blocking, with a modeled **1,200 ms** opportunity; the table's observed request duration is a different quantity. Playwright initial-state CSS coverage is approximately **65.05% unused on `/lt`**, **85.48% on `/lt/privacy`**, and **95.21% of the shared stylesheet on `/studio`**. However, Lighthouse itself reports **no actionable unused-CSS savings** on `/lt` in that sample. Do not delete CSS based on one viewport's coverage: hidden menus, dialogs, admin and other breakpoints legitimately need it.

The mobile LT trace loads five WOFF2 subsets totaling **109,924 bytes**: DM Sans Latin/Latin-ext and Instrument Serif regular Latin/Latin-ext plus Latin italic. Fonts are self-hosted, use `swap`, and have Unicode ranges; there is no external font-provider handshake. Georgian needs its real Noto Georgian glyphs/weights; Russian also uses system fallback for unsupported glyphs. Loading every face/subset eagerly would increase contention.

Proposed fix: separate admin-only and legal-only CSS naturally when lazy routes are introduced, retaining shared tokens/reset/public rules. Validate demand for each face and use metric-compatible fallbacks before adding a small route/locale-specific preload. This should shorten discovery/render dependencies without sacrificing multilingual coverage. Keep global/studio typography unchanged unless a separate measured regression requires intervention.

Likely files: `src/styles.css`, `src/features/admin/admin.css`, `src/features/public/public.css`, `legal.css`, `src/app/router.tsx`. Font files are not missing; do not replace them or remove the Georgian subset to improve a Latin-only score.

### E. Accessible names fail visible-label matching — P1

axe reports **`label-content-name-mismatch`**, serious, corresponding to WCAG 2.5.3. `LanguageSelector` displays `LT`/`EN`/`RU`/`KA`, but its summary's `aria-label` uses the long language name without the visible code. Its expanded links show both code and long name, while overriding their accessible names with just the long name. The mobile LT and KA menu toggles also have a visible word that is not included in their action-oriented accessible label. A person using speech input may be unable to activate a control by its displayed label.

Proposed fix: let visible link text supply its accessible name, or explicitly include the complete visible code/name; ensure mobile button names include their visible label in both open and closed states. Retain useful localized action information, `aria-expanded`, `aria-controls`, language attributes and Escape/focus behavior. This directly fixes the measured name/label discrepancy without changing layout.

Affected files: `src/features/public/PublicNavigation.tsx` (`LanguageSelector`), `PublicHome.tsx` (`SiteHeader`), and localized values in `text.ts` if needed. The language selector is also shared by both legal pages.

### F. Non-landmark footer artwork and manual accessibility checks — P2

axe reports **`region`**, moderate/best-practice: `.closing-signature`, an image with meaningful alt text, sits between `main` and `footer` in `PublicHome.tsx`. It is not a critical WCAG blocker by itself. Move it into the appropriate existing landmark without changing the visual arrangement, or decide whether this duplicated logo is decorative and give it the correct semantics. Do not add an arbitrary region solely to silence a tool.

The product-dialog check has **zero violations** but three incomplete contrast checks: decorative placeholder `G`, its branding over a gradient (both under `aria-hidden`), and `#product-dialog-title` where axe could not determine overlap/background. Studio checks have zero violations and 24 mobile / 26 desktop incomplete contrast nodes, largely because of gradients and background effects. Incomplete is neither a proven violation nor a pass. Manually inspect essential text/focus contrast over actual backgrounds, zoom, and screen-reader announcements before declaring full accessibility conformance. Preserve approved studio composition; no defect was established here that justified editing it.

## 6. Accessibility evidence by state

| State | Confirmed axe findings |
| --- | --- |
| Restaurant homepage, closed controls, mobile LT/KA | 2 label/name elements + 1 non-landmark logo |
| Restaurant homepage, closed controls, mobile EN/RU | 1 label/name element + 1 non-landmark logo |
| Restaurant homepage, desktop, all locales | 1 label/name element + 1 non-landmark logo |
| Privacy/business page, both devices, all locales | 1 label/name element in language selector |
| Open language picker, mobile LT/KA | 6 label/name elements total: summary, 4 language links, closed menu toggle; plus landmark issue |
| Open language picker, mobile EN/RU | 5 label/name elements; plus landmark issue |
| Open mobile navigation, all locales | Language summary still fails; landmark issue remains |
| Product dialog | 0 violations; 3 incomplete contrast checks requiring interpretation/manual review |
| Studio, both devices | 0 violations; gradient-related incomplete contrast checks remain |

Lighthouse itself records `label-content-name-mismatch` with **score 0**, but `categories.accessibility.auditRefs` gives it **weight 0, group hidden** in 13.5.0. That is why Accessibility 100 can coexist with a real finding; the score has not been replaced with an invented lower number.

Keyboard/interaction evidence includes skip links; mobile menu Escape and focus return; category links and focused sections; product-dialog focus containment, Escape and trigger restoration; lunch Arrow/Home/End navigation and a populated day's dialog; localized menus; language switching that preserves legal path/query/hash; safe external delivery links; studio tabs, email copy, deferred film playback and chapter seek; reduced motion; and SPA metadata/identity cleanup. These pass, but do not replace NVDA/VoiceOver or physical-device testing.

## 7. SEO, Best Practices, caching and asset/link checks

All twelve restaurant routes have Lighthouse Accessibility, Best Practices and SEO **100** on both devices, including every repeated LT sample. Browser inspection confirms one H1, localized document language, descriptions, route-specific canonical URLs, reciprocal four-language/x-default alternatives, Open Graph/Twitter metadata, and homepage Restaurant structured data derived from the live profile. `robots.txt`, `sitemap.xml`, the public route paths and checked static assets respond successfully. No broken same-page fragment targets were found in the route snapshots.

Public pages made **zero unexpected console warnings/errors, uncaught exceptions, failed requests, or HTTP errors** across the 26 studio/restaurant route/device scans. The interaction suite's unauthenticated `/api/admin/auth/me` 401 is expected; deliberately intercepted 503 responses belong only to the separate resilience test. Initial audited public navigation requested only localhost resources; no third-party analytics payload was loaded. The film is absent until requested, then plays and seeks correctly; its duration is 32.008 s. Old unused public studio film/Three assets are not loaded on initial navigation and should not be treated as transferred page weight.

The actual static response is still a shared SPA shell with generic restaurant head metadata and an empty React root; full route/locale metadata is inserted by JavaScript. Search renderers and social scrapers do not all execute the same JavaScript. **P2:** verify production search/social previews first; if this is a demonstrated problem, consider minimal route-aware static head generation/prerendering within the existing deployment. Do not introduce SSR infrastructure just to chase SEO 100, which is already achieved in the rendered audit. An unknown localized page shows a 404 heading and `noindex`, but Vite preview's SPA fallback returns HTTP 200; deployed status handling is an unverified hosting concern.

Local preview serves gzip HTML/JS/CSS and `Cache-Control: no-cache` static responses; API responses carry `no-cache, no-store` and the backend security headers. This does **not** establish that the future production host has bad caching. **P2 deployment verification:** serve fingerprinted build assets with suitable immutable long caching and correct compression/MIME types; revalidate HTML and preserve deliberate dynamic/public freshness. Never broadly cache `/api/admin/**`, authentication or personalized responses. Do not blindly make API data immutable or cache it across language queries. HTTPS, CDN behavior, origin headers, robots/canonical host and back/forward-cache behavior need a deployed check; localhost Best Practices 100 is not a security certification.

Wolt/Bolt links were verified as external HTTPS links with `_blank` and `noopener noreferrer`, and no ordering/payment flow was added. External destinations were not visited to place orders, nor comprehensively availability-tested. Link structure is verified; destination uptime, redirects and current provider ownership/branding remain a manual release check. Legal text and company details were preserved, not legally reinterpreted or externally verified by this technical audit.

## 8. Backend/API findings separated from frontend defects

The backend was already listening on 8080. `/api/public/restaurant?lang=lt`, `/opening-status`, `/opening-hours`, `/menu?lang=lt`, `/lunch-menu?lang=lt`, and `/promotions?lang=lt` all returned JSON 200 through the production preview. In `lt-mobile-1.json`, observed local request durations were approximately 10–20 ms, and total public response bodies about 13 KB. These are local observed timings, not simulated mobile timings or a production capacity test. No ECONNREFUSED occurred during these measurements. The restaurant LCP/CLS findings are therefore valid frontend observations with the service present, not a backend-outage score.

Six requests are currently independent; changing backend contracts or adding a new aggregation service is not justified by these observations. The frontend's geometry changing when valid content arrives is a frontend loading-state issue. Keep current public/admin separation, credentials inclusion, owner session/CSRF controls, language query parameters, opening-status refresh and owner-editable content. The unavailable-backend scenario was tested only with browser interception: useful retry controls and legal fallbacks rendered, and retry recovered all 51 actual menu items.

## 9. Prioritized work and expected mechanism

Effort is relative; expected improvement describes direction/mechanism, **not an unmeasured score increase**.

| Priority / fix | Impact | Effort | Risk | Why it should help / proof required |
| --- | --- | --- | --- | --- |
| P0 | No blocker reproduced in audited local public flows | — | Deployment remains unverified | Escalate only a reproduced launch blocker; do not classify missing field data as a defect |
| P1: stable API-loaded hero and font geometry | Large measured mobile CLS problem | Medium | Medium | Reserve sensible responsive space and reduce font-metric differences; prove lower repeated CLS under staggered API/font arrivals without clipping any locale |
| P1: responsive hero/cutout variants | Large measured mobile image transfer and LCP problem | Medium | Low–medium | Deliver correct dimensions at each DPR while preserving composition; verify resource bytes, actual chosen source, sharpness and repeated LCP |
| P1: visible labels in accessible names | Confirmed serious voice-control issue across routes | Small | Low | Make actual names include visible labels; rerun axe with all expanded/collapsed states and verify keyboard focus unchanged |
| P1: lazy owner route modules | Shared 547 KB startup bundle, approximately 70 KiB estimated unused compressed JS | Medium | Medium | Exclude unused owner UI from public startup; compare production bundle/network/coverage and rerun owner deep links/auth/session/CSRF checks |
| P2: route CSS and critical-font discovery | Shared CSS and late fonts affect rendering; extra font loads need care | Medium | Medium | Follow route boundaries and measured font demand; compare critical path/FCP/CLS and multilingual screenshots, without deleting coverage-only rules |
| P2: footer logo landmark semantics | Moderate axe best-practice issue | Small | Low | Place meaningful logo in existing semantic landmark or correctly treat duplication as decorative; verify identical visual position and axe result |
| P2: smaller brand derivatives and correct image dimensions | Logo 51 KB, unnecessary pixel dimensions | Small | Low | Use reviewed derivatives for small UI while keeping master/social assets; compare actual downloads and retina screenshots |
| P2: deployed caching, metadata, HTTP status and contrast verification | Localhost cannot establish full deployment/manual quality | Small to investigate; conditional implementation | Low for inspection; potentially medium for changes | Verify first; only fix demonstrated production behavior or actual essential-text contrast problems |
| P3: Wolt bitmap recompression, tiny CSS cleanup, reflow micro-tuning | Small compared with confirmed image/CLS/startup issues | Small–medium | Low–medium | Wolt is only 12.8 KB once per page; reflow trace is about 39 ms and TBT low. Preserve brand fidelity; defer unless post-P1 measurements justify it |

The forced-reflow insight identifies the minified bundle, not a proven source-level bottleneck. `MenuSection.tsx` reads section rectangles in a passive scroll handler already coalesced with `requestAnimationFrame`, and `LunchSection.tsx` reads offsets to center its selected tab. Do not rewrite these working interactions without a profile proving material user impact.

## 10. Incremental implementation sequence, regressions and tests

1. **Freeze baseline.** Preserve reports/screenshots/source commits and record current public data. Rebuild and check the backend prerequisites. Confirm no unintended environment or host change; archive results outside `target` before cleaning build outputs.
2. **Fix accessible names and logo semantics in an isolated change.** Keep geometry/styles intact. Rerun axe on all four locales, both legal pages, open/closed language lists, and open/closed mobile navigation. Test visible-label speech matching, screen-reader names, Tab/Shift+Tab, Escape, focus return, `aria-expanded` and language-path/query/hash preservation. No backend change is needed.
3. **Isolate and fix layout movement.** Record loading states with delayed restaurant, opening-status and lunch responses individually, then delay fonts separately. Cover cold/warm cache and fonts blocked. Verify full/empty lunch, long/missing profile description, zero/one/two delivery providers, error/retry and translations at 320–1440 px. Use responsive skeleton/min-size/fallback changes only where evidence points. Rerun three mobile homepage audits before combining with image work; ensure no clipping, excess blank space, focus shift or broken `#menu`/`#lunch`/category navigation.
4. **Add responsive image derivatives.** Keep originals, crop intent, alt/decorative roles and provider branding. Inspect 1×/1.75×/2× screens at narrow/wide breakpoints; verify selected `currentSrc`, network byte reduction, intrinsic dimensions and LCP priority/discovery. Test missing/failed owner product images and detail dialogs. Rerun affected homepage measurements and screenshots; do not claim that an opportunity estimate is a measured saving.
5. **Split owner route imports, then CSS only where naturally separated.** Preserve the owner login gate, expired-session redirect, remember-me behavior, credentials, CSRF acquisition/header, public read-only calls and translation context. Test direct refresh on every admin route, actual authorized owner login/edit/save only against an isolated permitted test backend, 401/403/session expiry, public-to-studio-to-public navigation, loading/error fallbacks, and all locale/legal metadata. This audit checked the unauthenticated gate only; authenticated editing was not exercised against existing local data. Run existing backend tests only if later work changes backend behavior.
6. **Evaluate font/preload and conditional hosting improvements.** Measure after the higher-impact steps. Keep Georgian/Cyrillic fallback coverage, text sharpness and studio fonts intact. A route-specific preload must not request restaurant images/fonts unnecessarily on studio/legal/admin. Check real HTTPS cache/compression/security headers, search/social previews and true 404s in the actual deployment process; publishing is a separate authorized action.
7. **Release regression pass.** Repeat the same production build, lint, complete browser/axe routes and cold Lighthouse matrix. Inspect console/network errors, price/allergen/availability rendering, populated/empty lunch days, opening hours, external links, retry states, modal keyboard behavior, metadata and mobile geometry. Manually check screen-reader announcements, focus visibility, 200% zoom and essential-text contrast. Do not modify approved studio sections merely because an inherited shared bundle changed.

Primary regression risks: translated text wrapping, hiding valid owner content to reduce shifts, stale language/API caches, preloading the wrong hero on `/studio`, over-splitting into extra network waterfalls, accidentally loading admin APIs from public routes, altered owner auth/CSRF behavior, removing CSS needed only in dialogs/breakpoints, and downsampling brand/product images below adequate DPR resolution. Keep changes incremental so measured effects remain attributable and reversible.

## 11. Before/after procedure and limits

For each isolated fix, rebuild production and serve the same origin/port with the same local public data and healthy API. Use the same Lighthouse/Chrome versions, viewports/DPR, throttling, cold profile and no competing workload. Run at least three samples for each affected route/device; extend three-run coverage to translated pages affected by the change. Report every sample, median, range, actual byte sizes and browser/axe results. Compare FCP, LCP, CLS and TBT individually, not just the weighted score. Keep the desktop and studio checks as regression controls. Use a new output directory per baseline/change; the retained runner otherwise overwrites the previous files.

No restaurant optimization was implemented, so there is **no after result or measured improvement claim** in this document. Browser coverage and Lighthouse opportunity estimates indicate investigation targets; they do not establish safe deletions, exact future byte savings or score gains. Translated-route measurements are single samples. Physical mobile hardware, field p75 INP/LCP/CLS, deployed caching/TLS, search engine indexing, external provider uptime, a full authenticated owner mutation suite and complete manual accessibility conformance were not established. Initial-navigation Lighthouse also does not measure every later product image, long-session interaction or admin workflow.

Final automated verification: **production build and lint passed; 42/42 Lighthouse runs completed without runtime errors/warnings; 26 route/device browser + axe scans; final 17/17 interaction checks and 6/6 supplemental checks passed; 21 static/route URLs checked; zero unexpected console/network/runtime errors in the route scans**. The current audit is valid for the tested local production frontend with the existing backend available; deployment and manual/field limitations remain as stated. Recommended next action: use the P1/P2 sequence above in a separate controlled restaurant-optimization session, beginning with accessible names and the measured mobile CLS/LCP causes.
