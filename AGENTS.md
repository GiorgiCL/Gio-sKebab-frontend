# Frontend coding rules

- Do not modify `../backend` unless the user explicitly instructs you to.
- Treat the backend API and security documentation as authoritative. Do not invent endpoints, fields, or response behavior.
- Preserve the backend's session-cookie and CSRF model: include credentials, obtain the documented CSRF token, and send it on state-changing requests. Never disable or bypass CSRF.
- Build the public experience mobile-first and make every interactive feature accessible by keyboard and assistive technology.
- Avoid unnecessary dependencies, global state libraries, and speculative abstractions.
- Run the relevant lint, type-check/build, and verification commands for changes; do not add tests for behavior that does not exist yet.
- Never commit secrets. Do not commit or push unless explicitly requested.
