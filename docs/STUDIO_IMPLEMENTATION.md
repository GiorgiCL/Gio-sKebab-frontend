> Historical report. The current recovery-led implementation and test results are documented in [STUDIO_RECOVERY_V4.md](STUDIO_RECOVERY_V4.md).

# Idiomorph Studio — refinement report

Implemented locally on **19 October 2026**. Frontend and isolated film workspace only. **No commit, push, deployment, backend edit, or installation.**

## Result

- Rebalanced the dark identity with lifted plum surfaces and pale paper/lilac expertise and contact sections. Shorter copy, clearer grouping, more breathing room, consistent editorial type, and revised desktop/tablet/mobile spacing give each section a distinct role.
- Replaced the former placeholder identity with the supplied silver/violet logo in the navigation, hero, chapter rail, footer, favicon, poster, and film. The symbol exploration preserves the original artwork.
- Replaced dense service rows with an accessible tabbed explorer: a responsive website composition, an advancing application workflow, and a connect/reset systems illustration. Every example is a conceptual study.
- Added section-aware chapter navigation with progressively revealed logo color, keyboard/focus hints, a hero symbol explanation, and linked process/film chapters.
- Process stages now show real frames from the new film with concise purpose/outcome copy. A stage can open its corresponding film moment.
- Contact choices carry service context into a useful prefilled email draft. Direct email and clipboard copy remain available, with clear unconfirmed-address disclosure.
- Preserved native video controls, explicit sound activation, fullscreen, captions, download/failure fallback, written description, reduced motion, visible focus, and touch targets. Video is requested only after interaction.
- Existing restaurant footer credit, routes, legal content, menu/lunch functionality, authentication, and backend were not edited in this pass.

## Logo used

**`C:/Users/giorg/Desktop/IdiomorphLogo.png`** was the only matching Desktop file: 1254 × 1254, 1,495,263 bytes.

Exact original retained in `../studio-workspace/brand/IdiomorphLogo.png`. SHA-256: `144191ebe85a63e422fe9eed12cd099cb52b5d638609ac28c42fc107cf434769`. Provenance is recorded alongside it. Responsive WebPs crop empty outer margins and resize; the artwork is unchanged. CSS screen blending integrates the existing black backdrop with plum surfaces.

## Film

**32.000 seconds, 30 fps.** The new film replaces mechanical geometry with an authored process: handwritten questions, paper wireframes, design exploration, responsive interface composition, a people-centered workflow and backend connections, typography refinement, thoughtful handover, and the supplied identity.

The scenes are original procedural illustrations. They do not represent filmed hands, actual client projects, or testimonials. Interface concepts are identified as illustrative.

| Output | Location | Size |
| --- | --- | --- |
| 1920 × 1080 H.264 / AAC stereo master | `../../studio-workspace/output/idiomorph-master-1080p.mp4` | 8,572,594 bytes |
| 1280 × 720 H.264 / AAC, progressive faststart | `../public/studio/idiomorph-film-720p.mp4` | 1,772,151 bytes |
| 1280 × 720 VP9 / Opus | `../public/studio/idiomorph-film-720p.webm` | 1,468,707 bytes |
| WebP poster, large / small | `../public/studio/film-poster{,-small}.webp` | 51,702 / 10,206 bytes |
| Five process illustrations, two sizes each | `../public/studio/process-{stage}{,-small}.webp` | 960 × 540 / 480 × 270 |
| Editable source archive | `idiomorph-film-source.zip` | Source, original logo, fonts, notices, lockfile |

Original sound is synthesized locally: pencil-like friction, soft taps, quiet warm tones, and a restrained signature ending in silence. No voiceover, recordings, stock music, watermark, or paid API. The final master peaks at −15.9 dBFS, with no clipping.

See the [editable source README](../../studio-workspace/README.md) for rendering commands, exact timeline, and output locations. Source is `film-scenes.mjs`; sound is `sound-design.mjs`. Baseline film/source/screenshots were preserved under `../../studio-workspace/refinement/before/`.

## Files changed in this pass

| Files | Change |
| --- | --- |
| `src/features/studio/StudioPage.tsx` | Identity lifecycle, cleaner hero/contact, contextual drafts, film cue state |
| `src/features/studio/StudioMark.tsx` | Supplied responsive logo |
| `src/features/studio/StudioProgress.tsx` — new | Section-aware navigation and logo progression |
| `src/features/studio/StudioServices.tsx` | Accessible service explorer and three functional studies |
| `src/features/studio/StudioProcess.tsx` | Structured stages, film-derived artwork, chapter links |
| `src/features/studio/StudioFilm.tsx` | Chapter seeking, human narrative, responsive poster |
| `src/features/studio/config.ts` | Logo/media paths, process data, project options; existing contact/publication flags preserved |
| `src/features/studio/studio.css` | Scoped visual, spacing, interaction, responsive and motion refinements |
| `public/studio/film-captions.vtt` | Descriptions matched to the new film |
| `public/studio/idiomorph-film-720p.{mp4,webm}`, `film-poster.webp` | Finished replacement film and poster |
| `public/studio/brand-*.{webp,png}` — new | Four responsive logo/favicon assets |
| `public/studio/film-poster-small.webp`, `process-*.webp` — new | Responsive poster and ten process stills |
| `docs/STUDIO_IMPLEMENTATION.md`, `docs/idiomorph-film-source.zip` | Updated report and portable editable source |
| `../studio-workspace/` | Active film/sound source, source preview, rendering/asset scripts, QA scripts, original logo/provenance, evidence |

No frontend dependency or lockfile changed. Router, restaurant footer source, hosting rewrites, and all non-studio application files remain identical to the starting frontend HEAD. The previous unused emblem assets remain available but are absent from the current studio page.

## Free tools and commercial use

Required tooling cost: **€0**. Reused existing local installations; no paid tool, service, account, trial, billing details, new dependency, or installation.

| Tool / asset | License and use |
| --- | --- |
| Canvas 2D, SVG, CSS, React | Original authored UI and motion using existing frontend architecture; no added animation library |
| FFmpeg 6.0 / ffmpeg-static 5.2.0 | GPL-3.0-or-later local encoding tool; commercial use permitted, no organization-size restriction. Binaries excluded from production and source archive. [License information](https://ffmpeg.org/legal.html) |
| Playwright 1.64.1 | Apache 2.0, local browser verification; no organization-size restriction |
| axe-core 4.14.0 | MPL 2.0, local accessibility checks; no organization-size restriction |
| Lighthouse 13.5.0 | Apache 2.0, local performance/accessibility review; no organization-size restriction |
| Existing DM Sans / Instrument Serif | SIL OFL 1.1; commercial self-hosted embedding. Full notices remain in `public/studio/licenses/` and source `fonts/` |
| Logo | Exact user-supplied asset, used as explicitly requested |
| Other artwork and audio | Original procedural compositions/synthesis; no external stock media |

The new film uses Canvas rather than Remotion or Three.js. The source workspace's existing MIT Three.js dependency is unused by this new renderer and absent from the production studio bundle. Full upstream tool links are in the source README.

## Verification

**All applicable checks pass:**

- ESLint; TypeScript project validation through `tsc -b`; production Vite build; `git diff --check`.
- **36 Playwright browser checks** in installed Chrome **155.0.8059.80**, production preview on localhost. Direct `/studio` entry, exact logo provenance, no initial video/API/tracker request, six responsive widths (320, 390, 768, 1024, 1440, 1920), all service studies, contextual email drafts, clipboard, process tabs and keyboard controls, chapter progress, seeking, WebM playback and independent H.264/AAC fallback, sound, fullscreen, HTTP byte ranges, unavailable-media fallback, reduced motion, motion preference, skip navigation, and console checks.
- **Zero detected axe WCAG A/AA violations** in seven interactive states and four screenshot viewports. Background-image contrast remains a manual-review case; final desktop/tablet/mobile visuals and focus/hover states were reviewed. Automated testing is not a full screen-reader audit.
- Five additional checks pass for hero hover, keyboard chapter hints, poster hover, and actual small-screen poster/process selection.
- No browser console errors in the four viewport checks; no JavaScript exceptions or hydration warnings in the main suite. No horizontal overflow or broken selected-stage images.
- All four restaurant locale homes, menu/lunch landmarks, eight legal routes, existing footer navigation, metadata/favicon restoration, and signed-out admin gate pass read-only fixture checks. No backend writes or live authentication operations.
- FFmpeg strictly decoded all three final movies in full. Eight actual encoded master frames were reviewed at 2.8, 6.9, 11.8, 17.9, 21.8, 25.6, 28.5, 31.2 seconds. Duration and 1280 × 720 playback verified in browser.
- No frontend unit-test script exists. Legacy initial-implementation QA helpers/reports are retained separately; current verification uses `refinement-verify.mjs`.

Evidence in `../../studio-workspace/refinement/`: `before/`, `after/`, `details/`, `reports/`. Includes before/after screenshots, axe results, browser report, encoded-film contact sheet, media results, and Lighthouse HTML/JSON.

## Performance

Lighthouse **13.5.0**, cold local production-preview navigation, simulated network/CPU, DPR 1, no extensions or film playback. Exact settings and reports: `../../studio-workspace/refinement/reports/lighthouse-*`.

| Measurement | Mobile | Desktop |
| --- | --- | --- |
| Viewport | 390 × 844 | 1440 × 1000 |
| Network / CPU | 150 ms RTT, 1.6 Mbps, 4× | 40 ms RTT, 10 Mbps, 1× |
| Performance | **91** | **100** |
| Accessibility | **100** | **100** |
| Best practices | **100** | **100** |
| Largest contentful paint | 3.2 s | 0.8 s |
| Total blocking time | 0 ms | 0 ms |
| Layout shift | 0.003 | 0.002 |
| Initial transfer | 378 KiB | 515 KiB |

Responsive poster/process assets reduced the first audited mobile load by about **52 KiB**. Studio code is about **8.44 kB gzipped JS / 6.82 kB gzipped CSS**. Both website movie files remain below 2 MB and are downloaded on request. No third-party runtime or tracking is introduced.

The inherited shared application JS is about 547 kB minified / 161 kB gzipped and retains the existing Vite bundle warning. Splitting unrelated restaurant/admin code is outside this isolated refinement. Local scores do not guarantee live-host performance.

## Preview and publication considerations

```powershell
cd C:\Users\giorg\Desktop\kebab-shop\frontend
npm run dev
```

Open **http://localhost:5173/studio** (use the port Vite prints if occupied).

Film source: run `npm run preview` in `studio-workspace/`, then open **http://127.0.0.1:4192**. Rendering instructions are in that workspace's README.

1. Confirm or replace `idiomorph.studio@gmail.com` in `src/features/studio/config.ts`. It remains visibly unconfirmed; ownership/delivery is not claimed.
2. Set `emailConfirmed` and `publicationReady` only when ready. Existing intentional noindex makes Lighthouse SEO **69**. The shared SPA's static/social fallback is still the restaurant's before JavaScript runs.
3. Verify production hosting rewrites, cache headers, and media byte ranges when publishing. This task did not deploy.
4. Current browser evidence uses Chrome with responsive/reduced-motion emulation. Physical phones, Safari, Firefox, and screen-reader testing remain useful follow-up checks.

## Git state

Both repositories were clean when this refinement began. Branches and HEADs are unchanged:

- Frontend `development`: `b9c2b500db895b792a6c9cc5ae5551e109c318bb`.
- Backend `development`: `bcab789a6c6278cd60985293929c745b67b9d310` — clean and untouched.

Frontend changes are unstaged studio source/media/docs plus new studio assets and `StudioProgress.tsx`, as listed above. No index updates, branch changes, reset, stash, commit, push, or deployment. The root and isolated `studio-workspace/` are outside either repository.
