# Public PostHog analytics

Analytics is optional and isolated to the public LT/EN/RU/KA routes. A missing token, host, or `VITE_POSTHOG_ENABLED=true` leaves it off. Vite embeds these values at **build time**, so configure the production build environment and rebuild. Ordinary local builds do not include the PostHog SDK chunk. The browser project token is client-visible; never use a personal API key here.

## Connect an EU project

1. Create a free PostHog Cloud project in the **EU region** at `https://eu.posthog.com` and find its **project token** under Project settings. A credit card is not required to start.
2. In **Project settings → Web Analytics**, turn **Enable cookieless tracking** **ON**. This is required for the SDK's `cookieless_mode: 'always'`: PostHog can return HTTP 200 for capture requests while dropping the events when the project-side setting is off. Keep this setting on in production.
3. Set `VITE_POSTHOG_ENABLED=true`, `VITE_POSTHOG_KEY=<EU project token>`, and `VITE_POSTHOG_HOST=https://eu.i.posthog.com` for the production frontend build. Session Replay remains disabled.
4. Enable Web Analytics and Error Tracking in the project. The SDK captures pageviews on history changes, pageleaves, safe click autocapture, Web Vitals, and unexpected browser exceptions. It does not identify visitors or create person profiles.
5. If the deployment adds a Content Security Policy, allow the **EU** ingest host in `connect-src`. PostHog's current SDK guidance also calls for `script-src https://*.posthog.com` for lazy bundles, and `worker-src blob: data:` if Replay is later enabled. This repository currently defines no CSP; configure the actual hosting proxy rather than adding an ineffective HTML meta policy. Recheck the official CSP guidance when setting a deployment policy.

The SDK initializes once, from the public layout. It does not initialize on a direct `/admin` load. A `before_send` guard drops every event if the current route is outside the four public locales, and replay stops when that layout unmounts. Input/form values, element attributes and text are masked from autocapture. URL query strings and fragments are removed from automatically captured URL fields; PostHog's separate UTM/referrer fields remain available. The API failure event only carries a fixed endpoint category, status, method, public route, locale and failure class.

PostHog's current cookieless guide says Session Replay is disabled without cookie consent. An environment switch alone would be misleading, so Replay stays explicitly disabled. If Replay becomes necessary, first decide on consent and a non-cookieless mode for consenting public visitors, then keep `/admin` excluded and retain the input, text, and network masking settings already present in the SDK configuration.

## Dashboard plan: Gio's Overview

Use PostHog's built-in **Web Analytics** dashboard for visitors, pageviews, sessions, average session duration, bounce rate, top/entry/exit paths, referrers/channels/UTMs, outbound clicks, device mix, and Web Vitals. Do not duplicate these as custom events. Add a separate `Gio's Overview` dashboard with Trends insights:

- `product_opened` count by `product_name` (top items), and by `category_name` / `source`.
- `delivery_provider_clicked` count filtered by `provider=wolt`, by `provider=bolt`, then a provider breakdown and a `placement` breakdown.
- Single-number counts for `call_clicked`, `directions_clicked`, and `google_review_clicked`.
- `social_clicked` count broken down by `provider`.
- `$pageview` count broken down by public path for language split; `language_changed` count by `from_locale` and `to_locale`.
- `lunch_day_selected` count by `weekday` and `product_opened` filtered to `source=lunch`.
- `menu_category_selected` count by `category_name`; `menu_explore_clicked` count.
- `api_request_failed` count by `endpoint` and `failure_category`; Error Tracking issues/recent exceptions.
- A Recent logs widget filtered to `service.name=gios-kebab-backend` and WARN/ERROR, after backend Logs export is enabled.

## One local smoke test

Create an untracked `.env.local` with the three public `VITE_POSTHOG_*` values and leave Replay off. Run `npm run dev`, open `/lt`, use a private browser window and click a product and a configured Wolt/Bolt link. Check PostHog Activity for `$pageview`, `product_opened`, and `delivery_provider_clicked`. Open `/admin` separately and confirm no admin events appear. Delete or disable `.env.local` after the test. Do not run automated tests with live telemetry enabled.

## Deferred source maps

Basic Error Tracking works without source maps, but minified production frames will be less readable. Later, add this release-only sequence to the deployment build, before assets are published:

```text
npm run build -- --sourcemap hidden
posthog-cli sourcemap process --directory ./dist
```

Install a pinned stable `@posthog/cli` in CI and set `POSTHOG_CLI_HOST=https://eu.posthog.com`, `POSTHOG_CLI_PROJECT_ID=<EU project ID>`, and `POSTHOG_CLI_API_KEY=<personal API key with error_tracking:write>` from CI variables/secrets. Remove `.map` files from the deployment artifact after upload; deploy the processed JS chunks. The personal API key must never appear in `VITE_*`, app code, or committed files. Keep uploads off pull-request/test jobs. Recheck the [PostHog CLI guide](https://github.com/PostHog/posthog/blob/master/cli/README.md) when adding the step to the chosen hosting pipeline.
