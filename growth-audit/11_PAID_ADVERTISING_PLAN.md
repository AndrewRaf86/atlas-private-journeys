# Paid Advertising Plan

**Status: specification only. Nothing in this file is activated, and nothing should be activated yet.** Per this project's own rule and standard practice, paid campaigns should not launch until conversion tracking and landing-page prerequisites are verified.

## Prerequisite checklist (must all be true before any campaign goes live)

| Prerequisite | Status |
|---|---|
| Reliable conversion tracking | **Not met** — see `12_ANALYTICS_AND_LEAD_MEASUREMENT.md`. No GA4, no confirmed-enabled Vercel Analytics, no lead log yet |
| Privacy policy published | **Not met** — required by both Google Ads and Meta for lead-focused campaigns |
| Qualified-lead feedback loop | **Not met** — no lead log exists to know what "qualified" means for this business yet |
| Realistic response capacity known | **Not met** — Owner Decision, unresolved |
| Landing pages verified | **Met** — all 3 service pages are live, mobile-tested, fast (static HTML), and match search intent |
| Clear geographic targeting | **Met** — Lima, Peru is unambiguous |
| Search demand confirmed | **Partially met** — real competitor presence confirms demand exists for "Lima private guide"-type terms (`03_COMPETITOR_GAP_ANALYSIS.md`); exact volume not measured (would require Google Keyword Planner access, not available in this session) |

**Bottom line: do not activate Google Ads or Meta Ads yet.** The free/low-cost and analytics-foundation work in this plan should come first — both because it's cheaper and because it's the only way to make paid spend measurable at all.

## Google Ads — proposed architecture (for when prerequisites are met)

Scoped to Lima-only, matching real service coverage (see `06_CONTENT_AND_KEYWORD_MAP.md` for why broad Peru-wide terms are excluded).

**Campaign groups:**
1. **Brand protection** — "Atlas Private Journeys," "atlasjourneys.world" (low cost, defends against nothing right now since there's no competing brand bidding, but cheap insurance once the brand has any visibility)
2. **Private guide Lima** — targets `private guide Lima`, `Lima private tour guide`, `Miraflores private guide`, `Barranco private guide` → lands on `/private-guide-lima`
3. **Lima airport transfer** — targets `Lima airport transfer`, `private airport pickup Lima`, `Lima airport to Miraflores` → lands on `/lima-airport-transfer`
4. **Lima bachelor party** — targets `Lima bachelor party`, `bachelor party Lima Peru` → lands on `/lima-bachelor-party`
5. **Remarketing** — once traffic volume exists, retarget visitors who didn't click WhatsApp

**Negative keywords (apply across all campaigns):** free, cheap, jobs, backpacker, bus tickets, public tour, hostel, DIY, self-guided, definition, wikipedia, visa, job, hiring, wholesale, agency partnership, group tour (Atlas is private-only), Cusco, Machu Picchu, Sacred Valley, Amazon (until/unless Atlas builds real pages for these — see `06_CONTENT_AND_KEYWORD_MAP.md` scoping), Rio, Brazil (same reason).

**Match-type strategy:** phrase and exact match only at launch — broad match risks wasting budget on irrelevant queries before there's a negative-keyword history to clean it up, and Atlas has no budget cushion for that kind of learning-phase waste yet.

## Meta Ads — proposed architecture (for when prerequisites are met)

**Recommended format: Click-to-WhatsApp campaigns**, not website-lead or instant-form campaigns — this matches Atlas's actual conversion channel exactly rather than adding a form step the business doesn't otherwise use.

**Offers to test (once creative exists):**
- "Message Fidel for a private Lima day" (maps to `/private-guide-lima`)
- "Planning a Lima bachelor weekend? Message Fidel" (maps to `/lima-bachelor-party`)
- Airport-transfer variant

**Creative prerequisite:** real vertical video of Fidel and/or a real trip — none currently exists in a ready-to-use ad format (existing photos are landscape/portrait stills, good for the website, not optimized as ad creative). This is a production gap, not a strategy gap.

**Audience approach:** broad geographic + interest targeting (Peru travel, South America travel interest) rather than narrow demographic targeting — Meta's delivery system generally performs better with broad targeting plus strong creative than with over-narrowed audiences, and Atlas has no data yet to justify narrowing further.

## Budget scenarios (specification only)

**Scenario A — Nearly free (recommended starting point):** $0 ad spend. Full focus on Search Console, GBP, marketplace listing, and content — all detailed elsewhere in this plan. This is the correct scenario until the prerequisite checklist above is fully met.

**Scenario B — Small test budget:** Once prerequisites are met, a single Google Search campaign (Lima private guide terms only), tightly geo-targeted to Lima-relevant source countries (US, Canada, UK — matching the likely traveler origin based on testimonial names/context), with a modest daily budget Andrew is comfortable treating as a learning cost, not a guaranteed-return spend. Success threshold and exact figure should be set by Andrew based on what he can afford to spend purely to learn, not what I estimate — I have no basis to promise a return.

**Scenario C — Growth budget:** Only after Scenario B produces real cost-per-qualified-inquiry data (from the manual lead log) showing the channel works. Not proposed further here — premature to plan specifics for a scenario with no supporting data yet.

## What I will not do

Activate any campaign, connect any ad account, spend any money, or promise a lead volume or ROI figure without real data behind it.
