> Historical report. The current recovery-led implementation and test results are documented in [STUDIO_RECOVERY_V4.md](STUDIO_RECOVERY_V4.md).

# Idiomorph Studio — definitive refinement v3

Local implementation completed 19 October 2026. No commit, push, deploy, reset, branch change, backend change or paid service. Required cost: **€0**. Accepted previous film, master, source ZIP and documentation are preserved.

## Creative result

The established editorial hero, near-black plum atmosphere, self-hosted Instrument Serif/DM Sans typography and supplied violet/silver identity are preserved. New material passages soften the dark-to-lavender transitions. Middle sections have tighter relationships, more useful spacing and clearer process imagery; the contact finale is now an actual browser-only email composer.

The canonical logo is `C:\Users\giorg\Desktop\IdiomorphLogo.png` (1254×1254). The original copy at `studio-workspace/brand/IdiomorphLogo.png` matches SHA-256 `144191ebe85a63e422fe9eed12cd099cb52b5d638609ac28c42fc107cf434769`. Existing optimized derivatives remain unchanged. The canonical art remains the default hero and final film identity.

## 3D reconstruction and working controls

Two manually traced, curved ribbon meshes preserve the asymmetric leaf-like silhouettes, narrow central opening and silver/violet relationship. This is actual vertex geometry, not a textured rotating plane. Blender adds sheet thickness, bevels, original procedural surface grain, physically based metallic materials, area lights and camera depth of field. Front, side and perspective renders are retained in `studio-workspace/definitive-v3/output/emblem-*-v3.png` and the separate editable `emblem-model-v3.blend`.

The reconstruction interprets a 2D source; it does not recover an original mesh. Its reflections and folds differ from the approved image. The superior canonical image therefore remains the default, with the live interpretation honestly offered as a **sculptural study**.

- **Explore the symbol:** native accessible modal loads the existing Three.js engine on demand. Pointer response and bounded drag rotate the real object. Front, three-quarter and side controls change the camera. The construction slider unfolds the mesh into its underlying sheets and reveals topology. Reset restores the view, slider and selected preset.
- **Keyboard and touch:** arrow keys rotate, Home resets, Escape closes and focus returns. Horizontal touch rotates; vertical touch scrolls the dialog. No page-scroll hijack. Reduced motion makes manual state changes instant. Closing disposes GPU resources; unavailable 3D shows the original image with an explanation.
- **Chapter rail:** numbered meaningful sections, expandable labels, direct anchors and an active indicator driven by intersection observation. Tracking was corrected after a smooth-scroll test exposed a stale state.
- **Expertise:** existing functional desktop/mobile composition toggle, application workflow and system connection/reset interactions are retained and revalidated. Service enquiry links carry the selected interest into contact.
- **Process:** five selectable, keyboard-operable stages show different actual production frames, useful explanation and matching film chapter links. No scroll locking or required animation sequence.
- **Inquiry:** four interests change the subject, guiding question and visible email draft. Optional notes are correctly URL-encoded into a `mailto:` link; the visitor reviews/sends in their own client. Preview, direct email and copy success/failure feedback work. Nothing is submitted, stored or sent by the page.

## Film: From human intention to digital form

A new **42-second, 24 fps, 1920×1080** production; 1,008 real Blender frames. A complete rough animatic and full 12 fps preview were reviewed before the final render. Hand-joint continuity, camera framing, an empty material shot, texture transitions and typography alignment were corrected during those gates. The completed final render was reused after interruption; it was not unnecessarily rendered again.

| Time | Directed scene |
| --- | --- |
| 0–7 s | Pencil contact, warm textured paper, original stylized sculpted hand and “What if?” |
| 7–14 s | Sketch-to-surface transition; two ribbons rise and fold |
| 14–18 s | Website study; typography and spacing refinement |
| 18–21 s | Application request → review → ready |
| 21–24 s | Backend/system connections and a travelling signal |
| 24–35 s | Material macro, spatial camera movement and sculptural resolution |
| 35–42 s | Modeled emblem resolves to the exact supplied logo; IDIOMORPH STUDIO / From ideas to what’s next |

All interfaces are labelled illustrative studies. The deliberately stylized hand is original geometry, not stock/live footage or a representation of an employee. There are no fake clients, staff, claims or third-party media.

The new original stereo sound uses tactile graphite/paper textures, restrained tonal development and a closing resolution/silence. The user listened to the audition and found the opening harsh/repetitive while liking the remainder. Only the first seven seconds were softened and rephrased; the reviewed remainder is sample-identical. Final PCM mix: **−18.01 LUFS, −1.50 dBTP**. Encoded files measure approximately −18.02 LUFS, peak −1.50/−1.49/−1.40 dBTP (master/MP4/WebM), without clipping. The assistant could not hear the audio itself; the listening evidence is the user's audition feedback. A final human listening pass of the revised opening is recommended.

## Outputs and editable source

All paths below are relative to the project root. MB figures use decimal units.

| Deliverable | Location | Size |
| --- | --- | --- |
| 1080p H.264/AAC master, 42.000 s | `studio-workspace/definitive-v3/output/idiomorph-intention-v3-master-1080p.mp4` | 25,766,305 bytes / 25.77 MB |
| 720p H.264/AAC web film | `frontend/public/studio/v3/idiomorph-intention-v3-720p.mp4` | 3,689,381 bytes / 3.69 MB |
| 720p VP9/Opus web film | `frontend/public/studio/v3/idiomorph-intention-v3-720p.webm` | 2,298,684 bytes / 2.30 MB |
| Poster, 1600×900 / 640×360 | `frontend/public/studio/v3/intention-v3-poster{,-small}.webp` | 29,524 / 9,512 bytes |
| Five responsive process images | `frontend/public/studio/v3/process-*{,-small}.webp` | 480×270 / 960×540 |
| Descriptive captions | `frontend/public/studio/v3/intention-v3-captions.vtt` | 9 cues |
| Packed editable Blender timeline | `studio-workspace/definitive-v3/output/idiomorph-intention-v3.blend` | 6,842,899 bytes |
| Editable model project | `studio-workspace/definitive-v3/output/emblem-model-v3.blend` | 1,310,678 bytes |
| Composition, geometry, scene and sound source | `studio-workspace/definitive-v3/source/` | Original editable scripts/HTML |
| Every-second final contact sheet | `studio-workspace/definitive-v3/qa/final-contact-sheet.png` | 42 encoded-film frames |
| Versioned source package | `frontend/docs/idiomorph-definitive-v3-source.zip` | Packed models, sources, fonts/licenses, plates, web assets and evidence |

Web containers have approximately 13 ms of codec/audio padding; picture is exactly 1,008 frames. Video is mounted only after a visitor requests it, starts muted, has native controls, chapter seek, explicit sound, fullscreen, MP4 fallback, descriptive text, retry/download fallback and HTTP byte-range support. No full master is served by the page.

## Tools, licensing and cost

Blender **4.5.9 LTS** (`8bf95cbd38d1`), Three.js **0.180.0**, FFmpeg **6.0** / ffmpeg-static **5.2.0**, Playwright Core **1.64.1**, axe-core **4.14.0**, Lighthouse **13.5.0**, Chrome **155.0.8059.80**, Node **25.2.1**, host Python **3.14.0**. Existing React/TypeScript/Vite and font dependencies remain unchanged. No additional React animation library or second rendering engine.

Portable Blender was the only new tool download, explicitly approved by the user, obtained from the official server and checksum-verified. Blender is GPL, Three MIT, Playwright/Lighthouse Apache-2.0, axe MPL-2.0, local FFmpeg distribution GPL-3.0-or-later and fonts OFL-1.1. All permit the intended commercial use without organization-size restrictions. Exact retained notices, official URLs, archive checksum, asset provenance and exclusions are in `studio-workspace/definitive-v3/LICENSES.md` and `licenses/`.

Remotion's special source-available license has personnel restrictions; free eligibility was not established, so it is not used. Theatre.js, PlayCanvas, React Three Fiber and Motion were considered unnecessary. No downloaded third-party scripts were executed. All visuals/audio are original except the owner-supplied canonical logo and existing licensed fonts. Commercial rights to that supplied logo remain an owner confirmation, not an independently verified license claim.

## Validation

- **ESLint:** pass, no warnings. **TypeScript + Vite production build:** pass. Existing shared app chunk warning remains (547.02 kB raw / 160.89 kB gzip); unrelated application architecture was preserved. No unit-test runner/script exists in the frontend package.
- **Functional Playwright suite:** **50 passing checks**, including six widths 320–1920 px, actual WebGL rendering/camera/drag/mesh morph/reset/disposal, fallback, native emulated touch, keyboard/skip navigation, reduced motion, all expertise/process/inquiry controls, clipboard success/denial, full media controls and byte ranges. `qa/browser/results.json` records each assertion.
- **axe-core:** zero WCAG A/AA violations across default desktop/mobile, 3D desktop/mobile dialogs, application/systems previews, desktop/mobile inquiry and active video. Automated checks do not replace human accessibility review.
- **Visual review:** desktop 1440×1000, tablet 768×1024, mobile 390×844 and small 320×740 screenshots inspected. No horizontal overflow, missing media, JS exception or initial movie request. Baseline and after screenshots retained separately.
- **Video:** all three final files fully decoded with FFmpeg `-xerror`; complete final web playback reached the end, decoded all 1,008 frames, loaded all nine caption cues, and reported two dropped frames during screenshot capture (about 0.2%). MP4 and WebM both played. Poster and stage imagery load correctly.
- **Restaurant regression:** all four locale homes, menu/lunch landmarks, eight legal routes, footer → studio → restaurant identity restoration and signed-out admin redirect passed using read-only fixtures. Backend was not running or modified. The expected signed-out `/api/admin/auth/me` 401 is recorded separately; studio positive flows have zero console errors/exceptions.
- **Existing SEO regression:** **17 route states pass**, including query/hash canonical handling, SPA metadata transitions, missing profile, optional email, no unsafe image requests and zero JS exceptions. Existing raw-WebSocket transport stalled at `Page.enable`; the same assertions passed through Playwright CDP, with original tests untouched.
- **Git diff --check:** pass; branch, HEAD, index and unrelated-source checks pass. Accepted movie/poster/captions remain byte-identical to their snapshots.

### Lighthouse conditions and measured results

Local production build at `http://localhost:4173/studio`, installed Chrome headless, Lighthouse 13.5 simulated network/CPU, no rendering/encoding workload. Initial page only; video and 3D have not been requested. DPR 1. Local results are not deployed field measurements.

| Metric | Mobile 390×844, RTT 150 ms, 1.6 Mbps, CPU ×4 | Desktop 1440×1000, RTT 40 ms, 10 Mbps, CPU ×1 |
| --- | --- | --- |
| Performance | **93** | **100** |
| Accessibility | **100** | **100** |
| Best practices | **100** | **100** |
| LCP | 3.01 s | ~0.8 s |
| TBT | 0 ms | 0 ms |
| CLS | ~0.003 | ~0.003 |
| Initial transfer | 381 KiB | 497 KiB |

SEO is **69** because `publicationReady:false` intentionally applies noindex. This was not changed to inflate the score. Remaining performance opportunities include the inherited shared app bundle, image sizing and the route/stylesheet/font discovery chain. The studio route chunk is approximately **10.39 kB gzip JS / 8.81 kB gzip CSS**. The Three engine and mesh are fetched only when the visitor opens the study.

Reports and exact timing/conditions: `studio-workspace/definitive-v3/qa/lighthouse/lighthouse-{mobile,desktop}.{html,json}` and `lighthouse-summary.json`.

## Files changed

Modified:

- `frontend/src/features/studio/StudioPage.tsx` — existing composition retained, three new scoped components/passages, current film metadata and inquiry context.
- `StudioProgress.tsx` — useful chapter rail and reliable section tracking.
- `StudioFilm.tsx` — 42-second presentation, new poster and accurate full film description.
- `StudioProcess.tsx` — actual v3 shots with meaningful alternatives.
- `config.ts` — versioned media paths and new matching chapter timings; contact/publication flags unchanged.

Added:

- `frontend/src/features/studio/StudioEmblem.tsx`, `StudioInquiry.tsx`, `StudioPassage.tsx`, `studio-v3.css`.
- `frontend/public/studio/v3/` — original live renderer/mesh, two vendored Three modules plus MIT notice, two movies, two posters, ten stage images and captions.
- This report and the separately named source ZIP under `frontend/docs/`.
- `studio-workspace/definitive-v3/` — isolated accepted baselines, authored production, editable Blender files, generated assets, render gates, license notices and validation evidence.
- Root `.verification/blender-portable/` — approved isolated tool/archive/checksum; no system install, not part of the frontend or source ZIP.

The pre-existing footer entry, router, hosting redirect, services implementation, old film/master, old source archive/report, frontend dependency/lock files and restaurant/admin/legal code were retained. No backend edits.

## Git state and preview

Frontend remains on `development`, HEAD **17df6433748bc6eecee3e3a9774420c3e5f44fdf**. Five existing studio source files are modified; new studio components, v3 assets and report/archive are untracked. Nothing is staged. Backend remains clean on `development`, HEAD **bcab789a6c6278cd60985293929c745b67b9d310**. Project root itself is not a Git repository; production workspace/tool artifacts live outside both repositories. Initial inspection found both repos clean; `baseline/git.json` explains an early staging-directory entry captured after that first inspection and moved before editing.

```powershell
cd C:\Users\giorg\Desktop\kebab-shop\frontend
npm run dev
# Open the printed local URL with /studio appended.
```

For production preview: `npm run build`, then `npm run preview`, usually `http://localhost:4173/studio`. The task-owned preview server is stopped after validation; no background production service or deployment is left running.

## Genuine limitations and publication confirmations

1. Confirm `idiomorph.studio@gmail.com` is operational and confirm commercial rights to the supplied logo. Keep both contact/publication flags false until reviewed. No mail was sent and no page deployed.
2. The 3D mesh is a manual interpretation with a different finish; the approved art remains default. The stylized clay hand is intentionally illustrative, not photoreal footage. Creative approval of the new film remains the owner's judgment.
3. The user reviewed the earlier sound audition; the revised opening still deserves a final human listening pass. The assistant does not claim to have heard it.
4. Browser testing used installed Chrome and emulated touch/viewports. Physical iOS/Android, Safari, Firefox and actual production hosting/CDN behavior have not been certified. No paid/device service was used.
5. Source ZIP excludes expensive rendered frame sequences and tools. The packed `.blend` is independently editable; complete re-rendering requires the documented free local tooling. QA harnesses additionally require the original repository/baselines and existing isolated verification packages.
6. Native mailto behavior depends on the visitor's configured email client; copy/direct-address alternatives remain available. No backend submission or private-data collection is added.
