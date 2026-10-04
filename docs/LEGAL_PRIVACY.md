# Public privacy and business information

The public locale routes expose `/lt/privacy`, `/en/privacy`, `/ru/privacy`, `/ka/privacy` and the corresponding `/legal` pages. Footer links and the language selector preserve the current locale/document. Hosting must serve `index.html` for these SPA deep links, as for the existing localized routes.

`src/features/public/legalText.ts` holds the four translations, owner-supplied business identity and official authority links. Lithuanian is the primary legal-facing text. The registered office is separate from the restaurant address. Restaurant address, phone and optional email come from `GET /api/public/restaurant?lang=…`. The notice remains available without that API; postal contact remains available through the registered office. No email is hardcoded.

## Evidence and scope

- The public API serves restaurant information, opening hours/status, menus, lunch and promotions. There is no customer account, contact form, reservation, checkout, payment or customer-order storage flow.
- Frontend event helpers are inert. No advertising or visitor-behaviour analytics is added.
- The Spring backend uses administrator HTTP sessions, `JSESSIONID`, session-backed CSRF, and an optional persistent remembered login. Administrator email and password hash are stored in PostgreSQL. Admin language and theme preferences use browser local storage; the public language is in the URL.
- Backend failure logging retains normalized routes, request methods, status and exception class. The notice describes infrastructure request data at a high level rather than claiming that application logs record every IP address or request.
- Cloudinary image storage/delivery is present in code. Hosting, DNS/CDN and database roles are described generically: Cloudflare, Koyeb and Neon were mentioned as expected infrastructure, but deployment configuration identifying them was not present in either repository.

Official sources checked on 2026-10-04:

- [VVTAT: submitting a consumer complaint](https://vvtat.lrv.lt/lt/kaip-pateikti-prasyma/) — written contact with the business first, then a competent out-of-court dispute authority; includes its published postal address.
- [VDAI: complaints](https://vdai.lrv.lt/lt/veiklos-sritys-1/skundu-nagrinejimas/) — privacy complaints to the Lithuanian supervisory authority.

## Owner review before publication

Confirm the live RestaurantProfile contacts and the actual production providers/configuration, including any infrastructure cookies or logging. Review applicable legal bases, retention criteria, provider agreements and any international transfers against actual operations; the code does not establish those facts, and the notice does not invent them. Review the Lithuanian wording and aligned translations with a qualified reviewer, including the authority competent for the particular type of consumer dispute. Keep this content current when processing or business details change.

The repository implementation supplies the public notices and business disclosure. It is not legal certification or a guarantee of regulatory compliance.
