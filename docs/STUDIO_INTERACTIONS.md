# Idiomorph Studio interaction study

Implemented on development, limited to the /studio service demonstrations and their stylesheet import. No commit, push or deployment.

The result is a restrained refinement. The systems demonstration is the strongest improvement: its architecture is now connected visually, and an enquiry can be followed deliberately. Website resizing and application filtering receive smaller refinements. The hero is unchanged.

## Emblem investigation and decision

The exact hero source is studioConfig.brand.logo: public/studio/brand-logo.webp, with brand-logo-small.webp for responsive delivery. StudioEmblem.tsx uses the original image, object-fit containment and screen blending.

Inspected the approved WebP, the original studio-workspace/brand/IdiomorphLogo.png and its provenance, the simplified emblem.svg, v3 JSON geometry, the local Three.js viewer, Blender model sources and the existing front render.

Pixel inspection confirmed:
- Original PNG: 1254 x 1254, fully opaque; no transparent pixels.
- Hero WebP: 800 x 1000, fully opaque with black background; no transparent pixels.
- Existing screen compositing, rather than transparency, integrates the artwork with the hero.

The approved image has two offset, twisted metallic sheets, a narrow central gap, fine surface relief, sharply defined folded edges and asymmetric silver/violet illumination. The PNG and WebP are raster artwork. The SVG is a simplified icon, not a faithful source for this geometry. The existing 3D files explicitly identify themselves as a manual interpretation rather than a recovered original mesh.

The isolated existing 3D front render was compared with the approved artwork. Its broad polished highlights, smoother surface and different folds fail the fidelity gate. No new reconstruction was forced and no 3D was integrated. Its hidden surfaces and true material response remain unknown.

The exact artwork, silhouette, texture, lighting, color, compositing, size and existing entrance are preserved. Desktop and mobile hero screenshots are byte-identical before and after; the approved WebP SHA-256 remains 2a5a59b107a40d5a545c8b2552194db154bb6c69c449d96e6a15474d4ce650a3.

Rejected: a default approximate mesh, image-plane rotation, silhouette deformation, added glow, particles and continuous movement. These would weaken the identity. WebGL context-loss handling is unnecessary for this implementation because no WebGL renderer is mounted or loaded.

## Implemented interactions

- Business websites: a finite 560 ms width transition and coordinated grid/typography changes between desktop and mobile. Illustration space collapses and fades for the smaller layout. The original resting illustration is preserved. Pressed states and a polite status explain the selected format.
- Custom applications: real All / Design / Engineering filtering remains. Task entries receive a short 300 ms transition with 40 ms staggering. Reserved task-list space prevents the demonstration from collapsing as results change. Filter color feedback and keyboard focus remain clear.
- Systems: original descriptions and three-stage architecture remain. Local inline SVG icons and fine connecting lines establish the relationship. Selecting nodes changes emphasis and explanation. The trace action advances Website -> Backend API -> Your tools, then resets. Each forward hop receives one 650 ms transfer; there is no timer-driven journey or continuous animation. The example stays explicitly illustrative.

Native buttons, aria-pressed, status announcements, the existing service tab keyboard model, touch support and visible focus styles are retained. Both prefers-reduced-motion and the existing page motion toggle disable animation. No autoplay audio, backend, external scene, API key or service was added.

## Tools and licenses

No runtime dependencies were added or installed.

- Existing React: MIT; component state and markup.
- Native CSS and SVG: transitions, finite animations, icons and lines; no third-party asset package.
- Existing Three.js 0.180.0: MIT; its local license and prototype source were inspected, but it is not imported by this implementation.
- Existing Playwright: Apache-2.0; installed Chrome automation, screenshots and functional checks.
- Existing axe-core: MPL-2.0; development-only accessibility auditing.
- Existing Lighthouse: Apache-2.0; local production performance audits.

Actual local license files were checked. All testing runs locally. No new proprietary artwork or hosted assets were introduced.

## Validation and measurements

Production build and lint pass. The existing shared bundle size warning was present in the baseline; shared application JavaScript remains approximately 547.36 kB.

| Measurement | Before | After |
| --- | --- | --- |
| Desktop Performance | 100 | 100 on both runs |
| Mobile Performance | 88 | 87, 89, 89; median 89 |
| Accessibility | 100 | 100 on all Lighthouse runs |
| Best Practices | 100 | 100 on all Lighthouse runs |
| Studio JavaScript, gzip | 8.72 kB | 9.16 kB |
| Studio CSS, gzip | 9.21 kB | 9.82 kB |

Additional compressed studio code is approximately 1.05 kB. It stays in the existing lazy-loaded studio route. There is no render loop, frame callback loop, observer or animation scheduler added. Only deliberate interactions produce finite motion; task entry also occurs when opening that service.

Measurements use the same local production preview, installed Chrome 155.0.8059.80 and Lighthouse configuration. The variation is too small to claim a performance improvement. Final mobile LCP measurements were about 3.53-3.61 seconds; the earlier after run measured 3.83 seconds. Baseline mobile LCP was 3.61 seconds. Final desktop LCP was approximately 0.75 seconds. Recorded mobile CLS ranged 0.003-0.025, remaining below 0.1.

Browser checks pass:
- Screenshots at 1440 and 390 px, including both website layouts and a traced systems state.
- Eight viewport widths: 320, 360, 390, 768, 1024, 1280, 1440 and 1920; all three demos checked for horizontal overflow and clipped controls.
- Actual intermediate width interpolation, endpoint restoration and desktop/mobile pressed states.
- Exact task sets for all filters, task count announcements and stable task-list height.
- All selectable system stages, ordered trace progression, reset and keyboard activation.
- Service tab arrow, Home and End navigation.
- Touch activation, OS reduced motion and the existing page motion toggle.
- Seven final axe audits: zero reported violations. The inherited gradient/background contrast checks outside these demos remain marked incomplete and are not a blanket WCAG certification.
- Zero browser JavaScript exceptions, external runtime requests, 3D runtime requests or backend requests.
- Exact approved asset hash and byte-identical desktop/mobile hero screenshots.

## Review evidence and reproduction

Local evidence is in ../../.verification/studio-interactions/:
- before/ and after/: hero and service screenshots, raw axe reports and results.json.
- before/lighthouse-*.json: original production measurements.
- after/lighthouse-*.json: every recorded after measurement, including the lower first mobile score.
- asset-inspection.json: original PNG and hero WebP dimensions and alpha inspection.

Examples: [systems desktop](../../.verification/studio-interactions/after/systems-1440.png), [systems mobile](../../.verification/studio-interactions/after/systems-390.png), [mobile website layout](../../.verification/studio-interactions/after/website-mobile-form.png).

From frontend:
1. npm run build
2. npm run preview -- --host 127.0.0.1 --port 4187
3. node scripts/studio-interactions.verify.mjs
4. npm run lint

The verification script uses the existing sibling .verification/frontend-tools Playwright and axe-core installation. STUDIO_TEST_ORIGIN and STUDIO_CHROME_PATH can override the local preview and Chrome executable. --baseline captures visual/audit evidence for the currently running build; the original baseline was captured before implementation. Screenshots and raw audit output remain local evidence outside the frontend Git repository.

## Limitations and visual assessment

The hero deliberately remains static after its existing entrance. Genuine interactive 3D was not achieved; the available approximation does not meet the approved artwork's quality. The change adds clarity and tactile feedback to the service studies without claiming a new sculptural experience.

The transfer is a conceptual one-way enquiry example, not a representation of delivery guarantees, actual validation execution, authentication or production integration status. Desktop/mobile browser emulation does not replace testing physical devices or assistive technology. No manual screen-reader or physical low-end GPU testing was performed.
