# Final repository audit cleanup

## F08 — manual image compatibility

Manual `imageUrl` references still enter through authenticated menu/lunch JSON create/update endpoints. The owner UI offers file upload, replacement and removal rather than a remote URL input. Removing the API field would break existing clients and stored references, so HTTPS compatibility remains.

The shared backend validator now requires HTTPS, a valid host, no URL user information and a valid port range. It rejects HTTP, protocol-relative URLs, non-web schemes and malformed URIs. No backend code downloads manual references: multipart upload passes validated bytes to Cloudinary; deletion uses managed public IDs, never arbitrary URLs. This path does not introduce server-side request forgery.

The frontend also rejects unsafe legacy references before rendering, uses the existing empty-image fallback, and sends no referrer on product image requests. Browser-generated blob previews remain available solely for locally selected upload files. An unsafe legacy reference is cleared when its item is next saved, allowing upload/replacement/removal without a rejected preliminary content save. Existing HTTPS Cloudinary references remain unchanged. No database migration rewrites existing content.

Arbitrary HTTPS hosts can still receive the visitor's request/IP and can fail or change their content; HTTPS does not make an external host trustworthy. Use managed uploads for production images. Review old manually supplied references through the existing owner workflow.

## F09 — SPA indexing baseline

- `src/lib/pageMetadata.ts` sets each public route's own canonical, LT/EN/RU/KA alternatives and a Lithuanian x-default for the equivalent document. Query strings and fragments are excluded from canonical URLs.
- Homepage, privacy and legal pages have localized title/description, Open Graph and Twitter summary-card tags. Social previews use the existing restaurant logo at a stable public URL, not temporary food illustrations.
- Homepage-only `Restaurant` JSON-LD uses API-provided name, free-text restaurant address, description, phone and optional email, plus the canonical site/menu URL and supplied logo. It is omitted without a usable profile. It contains no inferred postal components, opening hours, cuisine, ratings, price ranges, geographic coordinates or social accounts.
- `public/sitemap.xml` lists the 12 public homepage/privacy/legal URLs with reciprocal language alternatives. There are no admin or API entries and no invented modification dates.
- `public/robots.txt` allows crawling and declares the production sitemap. Admin crawling is intentionally allowed so crawlers can see `noindex`; robots exclusion alone is not a reliable indexing prohibition.
- Admin/login and error/missing routes set runtime `noindex, nofollow`, with no canonical, language alternatives, JSON-LD or stale public social metadata. Cloudflare Pages `_headers` also applies `X-Robots-Tag: noindex, nofollow` to `/admin` and `/admin/*` before JavaScript runs.

This remains a client-rendered SPA. Crawlers that render JavaScript can see per-route metadata and API-backed structured data. Social crawlers that do not execute JavaScript see the generic Lithuanian brand fallback in `index.html`, not localized runtime metadata. No SSR/prerendering or rich-result eligibility is promised. The structured address is intentionally text, not an invented `PostalAddress`.

Verify the canonical domain, redirects, all deep links, content types for robots/sitemap, and admin response headers on the deployed site. Cloudflare `_headers` applies to static responses, not Pages Functions responses; other hosts or proxies need equivalent response headers. Keep preview/staging sites out of indexing through their deployment configuration.

References checked 2026-10-04: [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Schema.org address](https://schema.org/address), [Cloudflare Pages headers](https://developers.cloudflare.com/pages/configuration/headers/).

## F10 — unused assets

Removed 30 unreferenced files (32,289,651 bytes): all 11 drink PNGs and 11 thumbnails; all five demo PNG originals; and the unused chicken-kebab, kebab-plate and liulia-kebab WebP files. There were no TS/JS/CSS/HTML imports, runtime asset maps or test references. They were already absent from the post-F06 build, so this saves repository/checkout space rather than another 32 MB of deployed traffic.

Retained `hero-grill.webp` and `kebab-cutout.webp`, which are still used as hero/menu artwork. Retained the existing logo (moved byte-for-byte to `public/`) and Wolt wordmark. No lossy conversion was performed. Owner replacement of the temporary illustrations remains separate from product uploads.

## Remaining non-code work

- Deployment: verify edge login limiting, proxy/DNS/TLS/CORS/session cookies, cache behavior, SPA fallbacks, live indexing headers and canonical redirects. Repository configuration does not establish that these work in production.
- Owner/data: supply verified item-level allergen information; no allergen fields or values were invented. Check live business contacts and replace temporary images as planned. Asset authorization has been confirmed by the owner; this change makes no further rights determination.
- Provider: configure and test database/media backup and recovery, retention and other provider controls. Review production privacy facts against actual provider arrangements.
