# Technical SEO Audit

Audit date: 2026-07-11. Method: direct source inspection of the live production repository (all 4 indexable pages) plus `robots.txt`/`sitemap.xml` review.

## Site-wide facts

- Static HTML, no framework, no server-rendering concerns — everything is crawlable by default, no JavaScript-dependent content risk.
- `robots.txt`: `User-agent: * / Allow: / / Sitemap: https://atlasjourneys.world/sitemap.xml` — correct, permissive, present.
- `sitemap.xml`: 4 URLs (homepage + 3 Lima service pages), no `lastmod` dates, no image sitemap entries.
- `404.html` exists and is a real page (not a generic host error).
- No hreflang — correct, since the site is single-language (English) with no alternate-language versions. Revisit only if a Spanish version is ever built.
- No security headers configured in `vercel.json` (currently just `{"outputDirectory": "."}`) — no `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, or `Strict-Transport-Security`. Low urgency for a static brochure site with no forms, but cheap to add.
- Fonts: system/web-safe stack (Georgia/Times New Roman serif, Arial/Helvetica sans) — no webfont loading at all, so no font-loading performance risk, but also no distinctive typography (see `07_WEBSITE_CONVERSION_AUDIT.md` for the design-system note).

## Page-by-page table

| URL | Title | Meta description | H1 | Word count | Schema | Indexable | Primary CTA |
|---|---|---|---|---|---|---|---|
| `/` | "Atlas Private Journeys \| Private Travel Support in Peru & Brazil" | "Private travel support in Peru and Brazil. Airport transfers, private guide days, group trip planning, nightlife coordination, and custom itineraries. One local contact, WhatsApp direct." | "Your Trusted Local in Peru & Brazil" | 1,369 | `TravelAgency` only | Yes | WhatsApp |
| `/private-guide-lima` | "Private Guide Lima, Peru \| Custom Tours, Food & Nightlife" (57 chars) | 154 chars | "Explore Lima with a Private Local Guide" | 796 | Full `@graph`: TravelAgency+TourOperator, Service, BreadcrumbList, FAQPage (5 Q&As) | Yes | WhatsApp (dual CTA: anchor-scroll primary + direct WA secondary) |
| `/lima-airport-transfer` | "Lima Airport Transfer \| Private Pickup to Miraflores" (52 chars) | ~150 chars | "Private Lima Airport Transfer" | 765 | `Service` + `TravelAgency` only — **no FAQPage, no BreadcrumbList** | Yes | WhatsApp |
| `/lima-bachelor-party` | "Lima Bachelor Party \| Private Group Planning with Fidel \| Atlas Private Journeys" (82 chars — over target) | present | (not re-audited this pass) | 899 | `Service` + `TravelAgency` only — **no FAQPage, no BreadcrumbList** | Yes | WhatsApp |

## Findings

### 1. Schema is inconsistent across pages (Medium priority)
Only `/private-guide-lima` has the full `@graph` structure (Organization + Service + Breadcrumb + FAQPage) built in the most recent work. The other two service pages still have visible on-page FAQs (6 questions each, in `<details>` accordions) that are **not** marked up as `FAQPage` schema — meaning Google can see the FAQ content but isn't told it's structured FAQ data. Same gap for breadcrumbs. Recommendation: bring `lima-airport-transfer` and `lima-bachelor-party` up to the same `@graph` pattern used on `private-guide-lima`, reusing the same `#organization` `@id` so all three pages reference one consistent entity rather than three separate `TravelAgency` blocks with slightly different shapes.

### 2. Homepage title/meta claims broader scope than the site delivers (Medium priority, ties to Business Audit)
"Private Travel Support in Peru & Brazil" — but zero Rio/Brazil pages exist. This isn't strictly a technical SEO defect (title is well-formed, under length), but it sets an expectation the site doesn't fulfill, which risks both user bounce and a mismatch signal if Atlas ever builds Rio content later with different messaging. Recommend narrowing to "Peru" (or "Lima, Peru") until Brazil content is real — see `15_OWNER_DECISIONS_REQUIRED.md`.

### 3. `lima-bachelor-party` title is over length (Low priority)
82 characters — Google will truncate this in search results. Recommend shortening to match the ~50-60 character pattern used on the other two service pages, e.g. "Lima Bachelor Party \| Private Group Planning | Atlas."

### 4. No `lastmod` in sitemap (Low priority)
Adding `lastmod` dates helps crawlers prioritize re-crawling changed pages. Cheap to add given how infrequently this site currently changes.

### 5. Orphaned/unused images increase repo size without SEO benefit (Low priority, cleanup)
`public/images/dest-lima.jpg` (watermarked, already flagged as unusable in `OWNER_INPUT_REQUIRED.md`) and `public/images/dest-rio.jpg` are not referenced by any current page. Not a ranking issue, but worth removing or replacing once real Rio content exists, so they don't get discovered and indexed via image search showing content the site doesn't actually offer.

### 6. No structured data validation has been run against Google's actual Rich Results Test (Owner action)
I validated the JSON-LD as syntactically correct JSON in this session, but have not run it through Google's Rich Results Test tool (requires a live, indexed URL or manual paste — can be done by Andrew or in a follow-up pass now that the URL is live). Recommend doing this once the homepage title/scope question above is resolved, so schema and title are corrected together rather than twice.

### 7. No canonical duplication, no redirect chains, no soft-404s found
Every page has exactly one canonical tag, self-referencing, matching the live URL. No redirects are configured (none needed — no legacy URLs to preserve yet). Clean.

## What's already correct and shouldn't be touched

- One H1 per page, confirmed on all 4 pages.
- No JavaScript-dependent content — full crawlability by default.
- OG + Twitter card tags present and unique per page.
- No duplicate titles, no duplicate meta descriptions across pages.
- Internal linking between the 3 service pages and homepage is complete (confirmed by link-resolution testing in the prior session and this one).
- Images use descriptive alt text tied to real content (no "image1.jpg"-style filenames or generic alt text).
