# Website Conversion Audit

Audit date: 2026-07-11. Based on direct inspection and browser testing of all 4 live pages (this session and the immediately preceding one).

## The lead journey today

1. Visitor arrives (search, direct, or referral).
2. Reads hero + trust strip.
3. Scrolls through service explanation, cards, testimonials, FAQ.
4. Clicks a WhatsApp button (pre-filled message, service-specific).
5. WhatsApp opens with a drafted message the visitor edits and sends.
6. **Everything past this point is untracked and undocumented** — see below.

## What's working

- **CTA consistency**: every page uses the same green WhatsApp button pattern, pre-filled with a service-specific message template (`[dates]`, `[group size]`, etc. as fill-in prompts). This is a genuinely good pattern — it lowers the activation energy of the first message and primes the visitor with exactly the information Fidel needs.
- **No dead ends**: every internal link resolves (verified by direct link-resolution testing), every service page cross-links to the other two.
- **Mobile hero rendering**: verified in-browser at 375px width — no horizontal overflow, CTAs are thumb-reachable, text contrast is good.
- **No forms to abandon**: zero-friction WhatsApp-first contact avoids the #1 typical conversion killer (long forms) entirely. This is a real strength, not just an absence of a feature.
- **FAQ sections address real pre-purchase objections** (what's included, how booking works, response expectations) rather than generic filler.

## Where the funnel actually breaks down

### 1. WhatsApp click events are instrumented in code, but full-funnel measurement is still missing (Critical — P0)
Correction after direct verification: every WhatsApp CTA already calls `va('event', {name:'whatsapp_click', ...})` on click — this is real, already-shipped Vercel Analytics custom-event instrumentation, not a gap. What's still missing: (a) confirmation that Vercel Web Analytics is actually **enabled** in the project's Vercel dashboard settings (the code alone doesn't guarantee the toggle is on — this needs an owner-side check, since I don't have visibility into that dashboard setting from the repository), (b) any measurement of what happens *after* the click — whether the visitor actually sends the message, whether it becomes a real conversation, whether it converts. Vercel Analytics can tell you a button was clicked; it cannot tell you a lead was qualified or booked. See `12_ANALYTICS_AND_LEAD_MEASUREMENT.md` for the full gap and what to add.

### 2. No qualification happens before the WhatsApp handoff (P1)
The pre-filled WhatsApp message is good, but it's optional for the visitor to actually fill in the bracketed fields before sending — nothing requires dates or group size before the message goes to Fidel. This means some fraction of inbound messages will be low-intent or missing basic info, adding back-and-forth before Fidel can even evaluate the lead. Not a website defect exactly (WhatsApp-first is a deliberate, reasonable choice), but worth Fidel's awareness for his own response process (see `19_LEAD_FOLLOWUP` recommendations, pending file).

### 3. No visible response-time expectation anywhere (P1)
None of the four pages tell a visitor when to expect a reply. This is a real trust and conversion lever — "Fidel typically replies within a few hours" (if true) reduces the anxiety of messaging a stranger on WhatsApp. Cannot be added until a real, honest response-time figure is confirmed (Owner Decision).

### 4. No proof beyond three testimonials, and they're not externally verifiable (P1, ties to Local/Reputation plan)
A skeptical visitor has no way to confirm the testimonials are real (no links to a review platform, no photos tied to specific trips beyond what's already used as page imagery). This is the same trust gap identified in the Search Visibility and Competitor analyses, showing up again at the conversion layer — it's one root cause with three symptoms.

### 5. Homepage scope claim (Peru & Brazil) may set the wrong expectation before the visitor even reaches a real page (P1, cross-referenced from Technical SEO Audit)
A visitor arriving expecting Brazil-inclusive planning will hit three Lima-only service pages. This is a real conversion risk, not just an SEO one — it can produce inquiries Fidel can't actually serve.

### 6. Pricing opacity may cost more qualified inquiries than it filters unqualified ones (P2, needs owner data to confirm)
Fully private pricing is defensible for a concierge model, but the honest tradeoff is that a meaningful fraction of visitors bounce rather than start a WhatsApp conversation with zero price anchor. Cannot be resolved without Andrew's input on whether he's open to a "starting from" range (Owner Decision) — once analytics exist, this can also be tested directly (does adding a rough range increase or decrease qualified-inquiry rate?).

## Minimum viable qualification fields (per the original brief's request)

If Atlas ever adds a lightweight pre-WhatsApp step (not currently recommended as urgent, but worth having specified), the minimum useful fields are:

- Name
- Travel dates (or date range/flexibility)
- Number of travelers
- Which service (already implicit in which page they're on)
- One free-text field for "what you need"

Nothing beyond this — no email required (WhatsApp is already the channel), no budget field unless pricing strategy changes, no phone number field (redundant with WhatsApp itself).

## What I'm not changing without more information

Visual design, copy tone, and page structure are functioning reasonably well and were built deliberately in the prior session against real constraints (no prices, real photos only, verified testimonials only). I'm not recommending a redesign — the conversion gaps above are about **missing measurement and missing trust infrastructure**, not broken UX.
