# Public privacy and business information

The public locale routes expose `/lt/privacy`, `/en/privacy`, `/ru/privacy`, `/ka/privacy` and the corresponding `/legal` pages. Footer links and the language selector preserve the current locale/document. Hosting must serve `index.html` for these SPA deep links, as for the existing localized routes.

`src/features/public/legalText.ts` holds the four translations, business identity, contact fallbacks, revision date and existing authority links. Lithuanian is the primary editorial version. The registered office is separate from the restaurant address. The owner-confirmed email `Saucemeuplt@gmail.com` is always available as a mailto link in the footer and legal contact section, independently of the API. Restaurant address/phone prefer `GET /api/public/restaurant?lang=…` values and fall back to the supplied facts. A different API email is preserved; matching values are deduplicated after trimming and case normalization. Other business facts still require final owner confirmation.

## Evidence and scope

- The public API serves restaurant information, opening hours/status, menus, lunch and promotions. There is no customer account, contact form, reservation, checkout, payment or customer-order storage flow.
- Frontend event helpers are inert. No advertising or visitor-behaviour analytics is added.
- The Spring backend uses administrator HTTP sessions, `JSESSIONID`, session-backed CSRF, and optional persistent login. Administrator email/hash/status/timestamps are stored in the database; login-source IP/counters/times are held in the bounded memory limiter. Admin language/theme use application memory and reset on reload. Visiting administration removes only the two old localStorage preference entries. Public language is in the URL. React Router reads `remix-router-transitions` in sessionStorage; no application view transitions are enabled.
- Login reads the actual remembered-login duration from `GET /api/admin/auth/session-options`, which creates no session. Remember Me stays optional/unchecked and is unavailable if its duration cannot be obtained; ordinary login remains possible. The explanation includes persistence, duration, early session loss, logout and a privacy link. No consent evidence store was introduced; legal sufficiency of the session state/inline choice remains for final review.
- Backend failure logging retains normalized routes, request methods, status and exception class. The notice describes infrastructure request data at a high level rather than claiming that application logs record every IP address or request.
- Cloudinary image storage/delivery is present in code. Hosting, DNS/CDN and database roles are described generically: Cloudflare, Koyeb and Neon were mentioned as expected infrastructure, but deployment configuration identifying them was not present in either repository.

Official sources checked on 2026-10-04:

- [VVTAT: submitting a consumer complaint](https://vvtat.lrv.lt/lt/kaip-pateikti-prasyma/) — written contact with the business first, then a competent out-of-court dispute authority; includes its published postal address.
- [VDAI: complaints](https://vdai.lrv.lt/lt/veiklos-sritys-1/skundu-nagrinejimas/) — privacy complaints to the Lithuanian supervisory authority.

## Owner review before publication

The 2026-10-19 implementation adds lawful bases/interests, correspondence/admin categories, actual session/limiter retention behavior, a prominent right to object, conditional GDPR rights, response timing, VDAI complaints and the business's reasoned-response duty for consumer complaints. Platform wording preserves restaurant responsibilities. No banner, acceptance checkbox, analytics, ecommerce terms or allergen claim was added.

The notice remains incomplete for publication: actual log, account, correspondence/complaint and backup retention rules, provider entities/roles/agreements, international transfers/safeguards and platform-supplied customer data are unconfirmed. Only supported technical retention behavior is included. Resolve these items and approve business facts except the confirmed email, legitimate-interest assessments and LT/EN/RU/KA wording before launch. The displayed date is a text revision date, not approval or deployment. See the implementation report alongside the audit packet for validation and specific blockers.

The repository implementation supplies the public notices and business disclosure. It is not legal certification or a guarantee of regulatory compliance.
