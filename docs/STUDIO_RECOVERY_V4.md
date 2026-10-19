# Idiomorph Studio — recovery-led refinement, v4

Local implementation completed 20 October 2026 (Europe/Vilnius). Resumed the surviving interrupted changes, coordinated the still-running earlier task to stop competing edits, and completed the work on development at frontend HEAD 355d5d2. No commit, push, deploy, backend edits, or production-data operations.

## Delivered behavior

The established split hero, headline, serif/sans typography, plum palette and approved folded silver/violet artwork are preserved. Screen compositing removes the rectangular black image boundary. The broken 3D explorer is deliberately replaced by the official static artwork with a brief entrance respecting reduced motion; there is no flat-image rotation or hidden model-loading claim. Captions, chapter labels and hero boundaries have been repaired.

The page explains business websites, custom web applications, and backend systems/integrations. Website Desktop/Mobile changes the actual layout; application filters show real matching tasks; integration steps explain an enquiry's route without claiming a live integration. All examples are expressly conceptual. Discover → Design → Engineer → Refine → Deliver advances one illustrative brief through structure, implementation, review and handover, with a distinct explanation and output at every stage. Smoother tonal transitions connect the pale expertise/contact sections to the same plum identity; mobile body text is 16 px.

The questionnaire and draft composer are removed. One prominent native mailto CTA opens a conversation; the configurable, owner-confirmed final address is idiomorph.studio@gmail.com. Clipboard success and failure feedback are real. Publication remains false/noindex. No mock message delivery is implemented.

The restaurant footer has the canonical emblem, a clear studio signature, a short website invitation and a visible link affordance. Restaurant branding, contacts, legal links and functionality remain primary and intact.

## What was actually recovered

- Earliest successful film: studio-workspace/refinement/before/idiomorph-master-1080p.mp4, 5,190,408 bytes; SHA-256 50b3e0380ff5dd0ebc1384f3757a5ac0e7c100bf67667ffd4563f0d7997f0e7e. Original scene.mjs and sound.mjs survive, with identical original scene copies.
- The historical root output/idiomorph-master-1080p.mp4 exists, but is the later 32-second illustration iteration (8,572,594 bytes). Do not mistake it for the original.
- Git b9c2b50 retains the initial implementation report and 130,969-byte original editable-source ZIP. Recovered copies are in recovery-v4/recovered/. Current historical ZIP/report names had been updated by later iterations.
- Rejected 42-second Blender film, packed .blend, renders and source survive under definitive-v3/. Neither its picture nor its soundtrack is used.
- Exact original pipeline: Three.js 0.180.0 for sectional geometry, physical metal and authored PMREM lighting; Canvas 2D for interfaces/type; Playwright/installed Chrome frame capture; ffmpeg-static 5.2.0 / FFmpeg 6.0 for encoding; original stereo JavaScript synthesis; local OFL fonts. Remotion was considered but not used. No actual video-shotcraft use was found. The preferred original workflow therefore remains technically suitable without changing frameworks.

The original's reflective surfaces, controlled violet, scale changes and connected four-act progression informed this version. Original obsolete double-return logo geometry is not reused. Current approved artwork is used exactly at the reveal. Inventory hashes and before/after contact sheets document the distinction. No historical master or source archive was overwritten. The first interrupted v4 render was also archived under output/reviewed-first-pass/ before the corrected final pass.

## Film and editable source

32 seconds, 30 fps, 1920 × 1080, four acts: Spark 0–5; Structure 5–12; Transformation 12–23; Reveal 23–32. Newly authored, curved silver/violet panels expand into architectural spans, become original website/application/backend studies, then converge around the official emblem. Wireframe-to-design, application filtering and enquiry flow are represented coherently. Exact closing signature: IDIOMORPH / STUDIO / From ideas to what’s next.

An 8 fps animatic and transition sequences were inspected before final rendering. Full encoded master frames and transition contact sheets were reviewed again; the inherited render's outdated convergence was rejected, archived and rendered afresh. A clean emblem poster prevents its typography competing with the player's own text on small screens. This is an authored motion graphic, not a photorealistic human production or a reconstructed logo mesh.

| Artifact | Location | Bytes |
| --- | --- | ---: |
| H.264/AAC stereo master | ../../studio-workspace/recovery-v4/output/idiomorph-continuum-v4-master-1080p.mp4 | 12,277,671 |
| Optimized H.264/AAC MP4 | ../public/studio/recovery/idiomorph-continuum-v4-720p.mp4 | 3,000,770 |
| Optimized VP9/Opus WebM | ../public/studio/recovery/idiomorph-continuum-v4-720p.webm | 2,765,296 |
| Original 48 kHz stereo score | ../../studio-workspace/recovery-v4/output/idiomorph-continuum-v4-sound.wav | 6,144,078 |
| Portable editable film source | idiomorph-continuum-v4-source.zip | See archive manifest |
| Source/editor and reproducible commands | ../../studio-workspace/recovery-v4/README.md | — |
| Responsive poster and English captions | ../public/studio/recovery/ | — |

New original audio uses developing pad voicings, restrained pitched notes, filtered air, transitional blooms and a three-note closing motif. No stock samples or rejected v3 audio. The finished master measures -18.01 LUFS integrated and -7.06 dBTP; the score fades into silence. Full decoding, loudness and playback have been checked. **Subjective listening remains a genuine limitation:** audio input was explicitly rejected by this assistant environment. Neither an audio stream nor these measurements prove artistic quality. A finished WAV and compact sound-listening.mp3 are supplied for human audition. No claim that the assistant heard the score.

## Guidance actually consulted and applied

- [UI/UX Pro Max SKILL.md](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/.claude/skills/ui-ux-pro-max/SKILL.md) and [quick reference](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/.claude/skills/ui-ux-pro-max/references/quick-reference.md): mobile legibility, target sizes, reliable feedback, responsive images, focus/keyboard access, reduced motion and performance. MIT LICENSE consulted. No installer or database search was run or claimed.
- [Anthropic frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md): preserve the distinct approved emblem and type; clarify commercial content; use hierarchy, consistent spacing and purposeful motion; critique screenshots and remove failed decoration. Skill-specific Apache-2.0 LICENSE.txt consulted.
- [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md): semantic links/actions, unobscured anchors/focus, visible controls, captions/description, clipboard error recovery and motion preferences. MIT LICENSE consulted.

All three were read directly; no unreviewed installation scripts or new runtime dependencies. Existing Three.js MIT, Playwright/Lighthouse Apache-2.0, axe-core MPL-2.0, FFmpeg GPL tooling and OFL fonts were reused. Full runtime/rendering notices are bundled with source. Required tooling cost €0. [Remotion license FAQ](https://www.remotion.dev/docs/license/faq) and [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) were inspected as historical references, not claimed as production tools.

## Verification

- Frontend lint, TypeScript through tsc -b, production Vite build, and git diff --check: pass. No frontend unit-test script exists.
- 37 successful Playwright assertions/groups in Chrome 155.0.8059.80, Windows, production preview at http://127.0.0.1:4186. Includes eight responsive widths (320–1920), all service controls, all five process stages, keyboard navigation, mailto/clipboard success/failure, sticky-header offsets, chapter rail, real WebM and H.264 playback, four timestamps, sound/mute/fullscreen, seven caption cues, byte ranges, unavailable-media download/description/successful retry, skip navigation and reduced motion.
- Seven axe WCAG A/AA state checks: zero detected violations. Desktop default/application/systems, active film controls, and mobile website/application/systems. Visible chapter numbers were added to accessible names after axe identified a mismatch. This is not a full assistive-technology audit; image/background contrast needs human judgment.
- Four restaurant locale homes and eight legal routes, footer navigation, restaurant favicon/metadata restoration, admin gate, and 17-route existing SEO harness pass with read-only fixtures. No production requests or writes required. Historical hashes, branch, HEAD and empty staging index verified.
- All three final movie files and original WAV strictly decode in full with FFmpeg. Master/MP4 32.000 s; WebM has normal Opus container padding (~32.008 s). No browser page exceptions or unexpected console errors in final normal-operation tests.

## Performance

Lighthouse 13.5.0, one cold local production navigation per device, simulated network/CPU, no extensions or playback. Mobile 390 × 844, DPR 1, 150 ms RTT/1.6 Mbps/4× CPU; desktop 1440 × 1000, DPR 1, 40 ms RTT/10 Mbps/1× CPU. Raw settings/results and HTML under recovery-v4/evidence/lighthouse/.

| Measurement | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 90 | 100 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| Largest contentful paint | 3.3 s | 0.8 s |
| Total blocking time | 20 ms | 0 ms |
| Layout shift | 0.003 | 0.004 |
| Initial transfer | Total size was 369 KiB | Total size was 501 KiB |

Local lab measurements are not live-host guarantees. SEO is deliberately limited by noindex. The existing shared app entry retains Vite's >500 kB warning; studio adds ~8.72 kB gzipped JS and ~9.2 kB gzipped CSS with no WebGL runtime in the page. Movie data loads only after explicit interaction.

## Review and genuine limits

Open http://127.0.0.1:4186/studio while the local preview is running. Before/after index: ../../studio-workspace/recovery-v4/evidence/comparison.html. Full-page and section images cover desktop, laptop, tablet and mobile. Encoded movie/transition sheets and restaurant footer captures are included. Reproduce the editor and all checks using recovery-v4/README.md; source archive has a CRC-verified inventory.

Subjective soundtrack audition, physical-device/Safari/Firefox testing and full screen-reader testing are outstanding. Final logo reveal preserves the supplied image rather than claiming a reconstructed three-dimensional mesh. These limits are explicit, not disguised as working functionality. Hosting rewrites, caches, range support and social previews require checking on the eventual host; this task did not publish. Email ownership is now confirmed; publication remains deliberately disabled. Artistic quality still requires the owner's judgment.
