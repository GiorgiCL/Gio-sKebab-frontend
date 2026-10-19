# Owner-managed allergens and lunch layout

Menu and lunch item editors include a shared **Allergens** section, translated into the existing Russian and Georgian admin interface languages. Choose the verification state and select from 14 predefined EU categories; there is no free-text or per-dish translation work. Selections and verification state participate in the existing dirty/discard guards and save with the normal item form. Controls are disabled while saving.

- **Not verified** is the default for existing and new items. It publishes no allergen statement.
- **Verified — identified allergens** exposes the checkboxes. Zero selections are allowed while editing; saving requires at least one. Choose another state if no categories have been identified.
- **Verified — none identified** is an explicit owner choice and clears selected categories. Public wording says no EU-listed allergens were identified following verification; it does not say “allergen-free”.

Check recipes and supplier information against [Regulation (EU) No 1169/2011, Annex II](https://eur-lex.europa.eu/eli/reg/2011/1169/oj), including its exemptions and sulphite threshold. Recheck after recipe/supplier changes. The implementation does not guess from names, ingredients or descriptions, and does not manage cross-contact statements or individual cereal/nut subtypes.

`src/lib/allergens.ts` contains stable IDs matching the backend and LT/EN/RU/KA labels. Both public menu and lunch cards show verified information beside their descriptions; their existing detail dialogs show the same information. A missing field from an older backend response is treated as unverified. Use the V14 backend/API before publishing the new editor.

The lunch panel previously had `max-width:980px`, leaving unused container space on large displays. It now uses a single full-width grid column with consistent 16px row gaps; cards retain the existing image/content layout and responsive styles. The day tabs and header are unchanged. Sidebar SVG icons and accepted overview/hours styling were already present in the main frontend and were preserved.

Validation uses an isolated disposable Spring/H2 backend and owner account with the production frontend build. Playwright exercises real login/CSRF, both create/edit flows, saved state after reload, validation, public cards/dialogs, keyboard tab navigation and responsive geometry. axe-core checks the new editor sections in RU/KA and public lunch. Lighthouse provides local performance/accessibility/best-practices/SEO observations. These tools are installed outside the frontend repository; no application dependencies or package scripts were added. See the workspace `.verification/allergen-results` and implementation report for results and screenshots.
