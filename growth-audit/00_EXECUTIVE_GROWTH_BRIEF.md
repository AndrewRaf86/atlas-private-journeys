# Executive Growth Brief — Atlas Private Journeys

Prepared 2026-07-11. This is the summary document — every claim here is backed by a detailed file in this directory; read those for evidence, sources, and full detail.

## What Atlas should do first (the five actions most likely to increase qualified clients)

1. **Verify Google Search Console and submit the sitemap.** The site is currently not indexed by Google at all (`site:atlasjourneys.world` returns zero results). Nothing else in this plan matters until this is fixed. Free, ~15 minutes, requires your Google account.
2. **Create and verify a Google Business Profile.** Confirmed eligible as a service-area business. This is likely the fastest path to any third-party discoverability, and it's free. Requires your identity verification — I can't do this step for you.
3. **Confirm consent from your 3 existing clients (Jay, Ram B., Sam) to leave public Google reviews**, then request them once the GBP is live. Right now Atlas has zero reviews anywhere a nervous first-time client would look.
4. **Start a simple manual log of every real WhatsApp inquiry** (date, source, dates requested, group size, outcome). Without this, none of the metrics that actually matter — qualified inquiry rate, booking rate, cost per booking — can ever be calculated, no matter what else is built.
5. **Decide the Peru vs. Brazil scope question.** The homepage claims "Peru & Brazil" but only Lima services actually exist. Either narrow the homepage to match reality, or tell me to build real Rio content — but the mismatch as it stands risks both search-engine confusion and inquiries you can't actually serve.

## What Atlas currently sells

A single local fixer (Fidel) providing private, WhatsApp-coordinated travel logistics in Lima, Peru — airport transfers, private guide days, and bachelor-party group coordination. Not a tour operator with packages, not a multi-region agency. The honest, evidence-backed positioning is **"private local fixer / travel concierge in Lima,"** not "luxury Peru tour company." Full detail: `01_BUSINESS_AND_OFFER_AUDIT.md`.

## Best target segment

Bachelor/friend groups and couples/small groups booking a single guide day — both directly evidenced by your existing testimonials, both already have dedicated pages, both face thinner competition than broad "Peru travel" searches. Full detail: `02_CUSTOMER_AND_MARKET_RESEARCH.md`.

## Strongest positioning

"Private local fixer" — a real person, not a listing, not a package. This already matches your homepage's actual tone; the main fix needed is narrowing the claimed geography to match what's real.

## Biggest discoverability problem

Zero Google indexing. Not a ranking problem — an existence problem. See `04_SEARCH_VISIBILITY_BASELINE.md`.

## Biggest conversion problem

No measurement past a WhatsApp button click, so no way to know what's actually working. The WhatsApp click tracking code is already there (good news, verified this session) — what's missing is everything downstream. See `07_WEBSITE_CONVERSION_AUDIT.md` and `12_ANALYTICS_AND_LEAD_MEASUREMENT.md`.

## Biggest trust problem

No third-party proof anywhere — no Google reviews, no TripAdvisor, no verified social account, no displayed credentials. Your closest real competitor at a similar scale (Tour Guides Peru) wins primarily on 15 years of accumulated TripAdvisor reviews and a displayed government tourism credential, not on offer quality. See `03_COMPETITOR_GAP_ANALYSIS.md`.

## Biggest technical problem

Schema inconsistency across pages (now fixed, pending your approval to deploy) and a sitemap/indexing gap (needs your action, not more code). See `05_TECHNICAL_SEO_AUDIT.md`.

## Best free growth opportunity

Google Business Profile + Search Console, in that order. Combined cost: $0. See `09_FREE_AND_LOW_COST_GROWTH_PLAN.md`.

## Best partnership opportunity

Listing on an established local-guide marketplace (ToursByLocals or similar) to borrow their existing search authority and bootstrap real reviews faster than organic growth alone — with the real tradeoff of operating under their commission and terms. Your call. See `09_FREE_AND_LOW_COST_GROWTH_PLAN.md`.

## Best organic-content opportunity

Real, specific content from actual trips Fidel runs — not generic Peru travel content, which you cannot win against established agencies. See `10_SOCIAL_CONTENT_SYSTEM.md`.

## Best paid opportunity

None yet. Paid ads should not be activated until conversion tracking exists and a privacy policy is published — both currently missing. See `11_PAID_ADVERTISING_PLAN.md` for the full prerequisite checklist and the architecture to use once they're met.

## What should not be done

- Don't build content or spend money targeting broad "Peru travel" or "luxury Peru" terms — owned by 15+ established agencies you can't out-rank right now.
- Don't build Rio/Brazil pages without real content, testimonials, or licensed photography to back them.
- Don't activate any paid campaign before analytics and a privacy policy exist.
- Don't display any certification, years-in-business claim, or star rating that hasn't been verified with you first.
- Don't gate reviews (asking only happy clients publicly, routing unhappy ones privately) — against platform policy and against the honesty standard this whole plan is built on.

## What was implemented this session

- Extended structured-data (JSON-LD) consistency across all 3 service pages (schema fix, safe, no content change).
- Shortened an over-length page title.
- Full audit suite in this directory: 16 markdown files, 3 CSVs, 1 JSON schema inventory — all evidence-based, dated, sourced.

**Nothing was deployed to production.** Everything above is committed to `growth/schema-and-tracking-foundation` and awaiting your review — see `16_TEST_AND_DEPLOYMENT_REPORT.md` for exact status and the push command.

## What remains

The technical/research side of this plan is in good shape for a first pass. What's left mostly requires you or Fidel directly — Google account verification, consent confirmations, pricing/scope decisions, response-capacity reality-check. Full list: `15_OWNER_DECISIONS_REQUIRED.md`.

## Expected measurement window

Give the 30-day foundation phase (`14_30_60_90_DAY_ACTION_PLAN.md`) its full 30 days before judging whether indexing and GBP are working — search indexing in particular is not instant. Re-run the search visibility baseline at day 14 and day 30 to check real progress rather than guessing.

## Exact next action

Read `15_OWNER_DECISIONS_REQUIRED.md`, work through the items that only take you a few minutes each (Search Console, GBP, confirming testimonial consent), and tell me when you're ready to review and approve pushing the `growth/schema-and-tracking-foundation` branch.
