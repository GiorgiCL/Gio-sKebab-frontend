# Idiomorph Studio — implementation report

Implemented locally on 19 October 2026. No commit, push, deployment, or backend change.

## Delivered

- Independent, lazy-loaded `/studio` route: original chrome identity, editorial hero, native film presentation, three illustrated service rows, five keyboard-operated process stages, contact finale, and studio footer.
- Original 32.000-second, 1920 × 1080 / 30 fps H.264/AAC master, plus 1280 × 720 MP4 and VP9/Opus WebM versions. Original synthesized stereo sound; no speech, stock music, watermarks, clients, or case studies.
- High-quality WebP poster, two responsive transparent sculpture sizes, simplified SVG mark/favicon, English descriptive captions, and a complete written film description.
- One discreet “Website by Idiomorph Studio ↗” restaurant footer link. Existing footer legal/contact links and restaurant styling are preserved.
- Editable source, preview timeline, rendering/encoding scripts, pinned development dependencies, original audio, master, and QA evidence in `../../studio-workspace/`. See its [README](../../studio-workspace/README.md).
- A compact editable-source archive, including local fonts and license notices, is retained in `docs/idiomorph-film-source.zip`; extract it to the root's `studio-workspace/` location to preserve the documented export paths.

## Files

| Location | Change |
| --- | --- |
| `src/app/router.tsx` | One lazy `/studio` route with a branded loading fallback |
| `src/features/public/PublicNavigation.tsx` | Footer credit link only |
| `src/features/public/public.css` | Three scoped footer-credit rules only |
| `src/features/studio/StudioPage.tsx` | Page, studio metadata/identity lifecycle, motion pause, contact copy |
| `src/features/studio/StudioFilm.tsx` | On-demand playback, sound/fullscreen, captions, error fallback, description |
| `src/features/studio/StudioMark.tsx` | Original vector identity and arrow |
| `src/features/studio/StudioServices.tsx` | Service copy and original SVG illustrations |
| `src/features/studio/StudioProcess.tsx` | Accessible five-stage transformation |
| `src/features/studio/config.ts` | Contact address, verification/publication flags, media paths |
| `src/features/studio/studio.css` | Isolated responsive identity and reduced-motion system |
| `public/studio/` | Finished video, poster, responsive identity, captions, OFL notices |
| `public/_redirects` | Exact `/studio` and `/studio/` SPA rewrites; media paths remain separate |
| `docs/STUDIO_IMPLEMENTATION.md` | This report |
| `docs/idiomorph-film-source.zip` | Portable film source, locked dependencies, fonts, and notices; no tool binaries or experimental media |
| `../studio-workspace/` | Isolated editable film source and generated/validation artifacts |

No frontend production dependency, lockfile, backend, menu, lunch, admin, authentication, legal content, or ordering implementation was changed. Both repository statuses were clean at initial inspection.

## Tools, licenses, and cost

Required cost: **€0**. No billing details, service account, paid API, subscription, stock library, or trial.

| Tool | Commercial-use assessment |
| --- | --- |
| Three.js 0.180.0 | MIT; no headcount restriction. Offline rendering only; absent from the production browser bundle. [License](https://github.com/mrdoob/three.js/blob/dev/LICENSE) |
| FFmpeg 6.0 / ffmpeg-static 5.2.0 | Local unmodified GPL v3 enabled tooling; no headcount restriction. Tool binaries are excluded from production. [License information](https://ffmpeg.org/legal.html) |
| Existing React, Vite, browser SVG/CSS | Existing architecture; no added animation framework or runtime dependency |
| Existing DM Sans / Instrument Serif | SIL OFL 1.1 permits commercial embedding. Self-hosted; full notices supplied in `public/studio/licenses/`. |
| Playwright / Lighthouse | Apache 2.0, local QA; no headcount restriction |
| axe-core | MPL 2.0, local QA; no headcount restriction |
| Artwork, geometry, lighting, and sound | Original to this implementation; no external media license required |

Remotion's [free eligibility](https://www.remotion.dev/docs/license/faq) depends on individual/organization headcount. That eligibility is unconfirmed here, so it was evaluated and replaced with the unrestricted-headcount local renderer. Full source/tool details and license references are in the source README.

## Validation

- Frontend ESLint: pass. TypeScript project validation and production Vite build: pass. `git diff --check`: pass.
- Direct development-mode navigation also passes without React Router hydration-fallback warnings.
- **23 Playwright browser checks pass**, Chrome 155.0.8059.80 on Windows, against the production build on localhost. Includes direct navigation; 320/360/390/768/1024/1440/1920 px layouts; no overflow or missing images; real WebM and MP4 playback; muted start; sound controls; fullscreen; seeking and HTTP 206 ranges; film failure/download/description; keyboard skip link, process arrows/Home/End; clipboard copy; unconfirmed-address disclosure; motion pause and reduced motion.
- axe WCAG 2.1 A/AA: **zero detected violations**, desktop, mobile, and active film controls. Background-image contrast cases still require human judgment; the dark control backing and editorial contrast were visually reviewed. Automated accessibility is not a complete assistive-technology audit.
- Four restaurant locales, all eight legal routes, menu/lunch landmarks, footer SPA navigation, favicon/language restoration, and admin/menu/lunch sign-in gates pass read-only fixture checks. A source comparison confirms that removing the exact route/footer additions restores the existing tracked frontend files to HEAD. No backend writes or live authentication tests were performed.
- All three final video files decode completely with FFmpeg error checking. Six actual encoded master frames were reviewed. See `../../studio-workspace/validation/film-contact-sheet.png` and `media-results.json`.
- The older standalone CDP SEO harness stalled in this environment, including an isolated-port retry. It is recorded as a timeout, not a passing test. The independent Playwright checks above supply regression coverage. No frontend unit-test script exists in the repository.

## Performance

Lighthouse **13.5.0**, production Vite preview, cold local navigation, simulated throttling, no extensions or film playback. Reports and exact settings: `../../studio-workspace/validation/lighthouse-{mobile,desktop}.{html,json}`.

| Measurement | Mobile | Desktop |
| --- | --- | --- |
| Viewport | 390 × 844, DPR 1 | 1440 × 1000, DPR 1 |
| Network / CPU | 150 ms RTT, 1.6 Mbps, 4× slowdown | 40 ms RTT, 10 Mbps, 1× |
| Performance | **93** | **100** |
| Accessibility / best practices | **100 / 100** | **100 / 100** |
| Largest contentful paint | 3.0 s | 0.7 s |
| Total blocking time | 0 ms | 0 ms |
| Layout shift | 0 | 0 |
| Initial transfer | 355 KiB | 377 KiB |

The film is not mounted or requested until interaction. Its browser derivatives are under 2 MB each. The studio adds about 6.8 kB gzipped JavaScript and 5.8 kB gzipped CSS. The inherited application entry still includes restaurant/admin code and produces Vite's existing shared-bundle size warning; broad router refactoring was outside this isolated change. Local Lighthouse results are not live-host guarantees.

## Before publication and known limits

1. **Confirm the email address is owned and operational**, or replace it in `src/features/studio/config.ts`; then set `emailConfirmed`. The current proposed address is visibly marked unconfirmed beside both the address and contact actions. The copy and draft actions already work; email delivery is not claimed.
2. Set `publicationReady` deliberately when the studio is ready to be indexed. Until then, studio runtime metadata uses `noindex, nofollow`; Lighthouse SEO is **69** for that intentional reason. The shared SPA's static HTML/social fallback remains the restaurant's until JavaScript runs. Dedicated prerendered social metadata is not implemented.
3. `_redirects` provides exact studio rewrites for compatible static hosts. Local direct opening and byte-range playback pass. Live host rewrites, headers, and cache behavior still need publication-time verification; nothing was deployed.
4. Browser QA used real desktop Chrome with responsive and reduced-motion emulation. Safari, Firefox, physical phones, and screen readers were not available for this run.

## Git state

Frontend branch: `development`. Modified tracked files: `src/app/router.tsx`, `src/features/public/PublicNavigation.tsx`, `src/features/public/public.css`. New studio source, assets, `_redirects`, and this report are untracked. Backend branch: `development`, clean and untouched. The root is not itself a Git repository; `studio-workspace/` is a separate local deliverable. No staging, commits, branch changes, push, or deployment occurred.
