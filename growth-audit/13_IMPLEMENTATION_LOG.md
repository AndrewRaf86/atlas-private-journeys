# Implementation Log

Chronological record of what was actually changed in the codebase during this growth mission, on branch `growth/schema-and-tracking-foundation`.

## 2026-07-11

**Change:** Extended JSON-LD structured data on `lima-airport-transfer/index.html` and `lima-bachelor-party/index.html` to match the `@graph` pattern already used on `private-guide-lima/index.html`.

- Before: each page had a standalone `Service` block with its own inline `TravelAgency` provider object.
- After: all three service pages now share one consistent `#organization` entity (`TravelAgency` + `TourOperator`), plus `Service`, `BreadcrumbList`, and `FAQPage` (matching each page's real, already-visible on-page FAQ content — no new claims or questions invented).
- Verified: JSON-LD parses as valid JSON on both files (Python `json.loads`, confirmed no syntax errors).
- Verified: both pages return HTTP 200 on local static server after the change; no visual change (schema is not rendered).
- Closes issue #5 in `issue-register.csv`.

**Change:** Shortened `lima-bachelor-party/index.html` `<title>` from 82 to 52 characters ("Lima Bachelor Party | Private Group Planning | Atlas").
- Closes issue #6 in `issue-register.csv`.

**Not changed (deliberately):** page copy, testimonials, pricing language, visual design, navigation. This pass was scoped to safe, evidence-based technical fixes only — no content requiring owner input was touched.

## Deployment status

**Not deployed.** Committed to `growth/schema-and-tracking-foundation` only. Given the scale of this growth mission and that the prior session's "everything approved" covered a specific, already-reported set of changes (hero image fix + SEO rewrite), this new batch of changes has not been pushed or merged — awaiting a fresh explicit go-ahead before touching production again, consistent with this project's own instruction not to deploy without authorization.

## What's pending implementation (blocked on owner input, not on effort)

- GA4 tag (blocked on a real Measurement ID)
- Privacy policy page (blocked on policy content decisions)
- Homepage scope correction (blocked on Andrew's decision: narrow to Lima/Peru, or build real Rio content)
- Any certification/credential display (blocked on verification of what Fidel actually holds)
- GBP creation (blocked on owner identity verification — cannot be done by an agent)
