# Search Visibility Baseline

Research date: 2026-07-11. Method: WebSearch queries (Google-backed) and direct platform checks. This is a baseline, not a guarantee of what Search Console would show — Atlas should connect Search Console (see Owner Decisions) to get first-party indexing data, which is more reliable than inferring from search results.

## Headline finding

**`site:atlasjourneys.world` returns zero results.** As of this date, there is no evidence the domain is indexed by Google at all. Every other check below returns the same pattern: nothing.

## What was searched and what came back

| Query | What I was checking | Result |
|---|---|---|
| `"Atlas Private Journeys" Peru Fidel` | Brand + operator name | No matches. Results were unrelated "Atlas"-branded travel companies (Atlas Cruises & Tours, Atlas Adventure Travel) |
| `atlasjourneys.world` | Bare domain recognition | No matches. Results were unrelated Atlas-branded insurance/cruise sites |
| `site:atlasjourneys.world` | Indexing check | Zero results — domain not indexed |
| `"Atlas Private Journeys" reviews OR reddit OR tripadvisor` | Third-party reputation | No matches (one irrelevant "Atlas Journey" Morocco tour result) |
| `Atlas Private Journeys Instagram Fidel Peru guide` | Social presence | No matches. Closest handle, `@atlasprivatetours`, verified by direct visit to be an unrelated Morocco-based company (different phone country code, different destinations) |
| `"private guide Lima" Peru google maps` | Local/Maps presence | No Atlas-specific result; generic Lima map/guide content only |
| `"Atlas" Lima Peru guide WhatsApp private tours` | Broader brand + service match | No Atlas match. Surfaced real direct competitors instead (see `03_COMPETITOR_GAP_ANALYSIS.md`) |

## What this means

1. **This is not a ranking problem, it's an indexing/existence problem.** Standard SEO advice (improve titles, add schema, build content) assumes a baseline of *some* visibility to improve. Atlas currently has none. The first priority is confirming and accelerating indexing, not optimizing rankings for pages Google may not have crawled yet.
2. **No third-party corroboration exists anywhere.** A prospective client who searches the business name before messaging on WhatsApp — which is a completely normal trust-check behavior for a "send a stranger my travel dates on WhatsApp" ask — currently finds nothing. This is a conversion risk, not just an SEO one.
3. **The domain age is a plausible partial explanation, not an excuse to wait.** Based on repository history, this site in its current form has been live only a matter of weeks. New domains can take time to be crawled, but zero indexing after several weeks usually means either (a) Search Console was never set up / sitemap never submitted, or (b) the domain was reconfigured/redeployed enough times (confirmed in this session — production was serving a stale deployment until earlier today) that Google's crawler may have hit inconsistent states.

## Immediate, free actions (detail in `09_FREE_AND_LOW_COST_GROWTH_PLAN.md`)

- Verify domain ownership in Google Search Console and submit `sitemap.xml` (this alone is likely the single highest-leverage free action available right now).
- Verify in Bing Webmaster Tools (feeds Bing and, via licensing, some AI answer engines).
- Set up a Google Business Profile as a service-area business (Atlas qualifies — see `08_LOCAL_AND_REPUTATION_PLAN.md`). A live GBP listing typically gets discovered and indexed faster than a standalone site and gives an immediate "this is a real business" signal.
- List on at least one established local-guide marketplace (ToursByLocals, Withlocals, or GoWithGuide — see `03_COMPETITOR_GAP_ANALYSIS.md`) to bootstrap reviews and a discoverable profile faster than organic SEO alone can deliver.

## Re-test plan

Re-run this exact baseline (same queries, same method, dated) 14 and 30 days after Search Console verification + sitemap submission to measure whether indexing has started. Record results in `18_WEEKLY_SCORECARD_TEMPLATE.md`.
