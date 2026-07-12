# Analytics and Lead Measurement

Full event-level detail is in `analytics-event-map.csv`. This file explains the gap and the minimum viable fix.

## Current state (verified by direct inspection, 2026-07-11)

| Tool | Status |
|---|---|
| Vercel Web Analytics | Script tag present on all 4 pages; `whatsapp_click` custom events are already coded on every WhatsApp CTA. **Cannot confirm from the repository whether the Vercel dashboard toggle to actually enable Web Analytics is on** — this is a project-settings check only Andrew can do. |
| Vercel Speed Insights | Not found in the codebase. |
| Google Analytics 4 | Not present. |
| Google Tag Manager | Not present. |
| Google Search Console | Not present in code (expected — verification is typically done via DNS/meta tag or GSC account, not a script tag; cannot confirm account-level status from the repo). |
| Meta Pixel / Conversions API | Not present. |
| Any CRM or lead-tracking system | Not present. Contact is 100% WhatsApp with no downstream record-keeping visible in the codebase. |

## The core problem this creates

Every strategic decision in this entire growth mission — which page to improve, which keyword to prioritize, whether an ad campaign is working, whether a partnership is producing leads — ultimately needs to answer "did this produce a qualified inquiry, and did that inquiry become a booking?" **Right now, nothing downstream of a WhatsApp button click is measured at all**, and even the click itself depends on an unconfirmed dashboard setting.

This is why the original mission brief's instruction to not launch paid ads until conversion tracking is verified is correct and non-negotiable — spending money to drive WhatsApp clicks that can't be tied to bookings would make it impossible to calculate the metrics the brief itself defines as the actual goal (cost per qualified inquiry, cost per booking).

## Minimum viable fix (recommended before anything else in this plan that involves spending money)

1. **Confirm Vercel Web Analytics is enabled** in the project dashboard (Andrew — 2 minute check).
2. **Add Google Analytics 4**, even at a basic level — free, standard, and the prerequisite for eventually connecting Google Ads conversion tracking if that channel is ever activated. Requires a GA4 property (Andrew's Google account) before I can wire up the tag.
3. **Start a simple manual lead log** (a spreadsheet is genuinely sufficient at current volume — no CRM needed yet). Fidel logs each real WhatsApp inquiry: date, source (which page/how they found Atlas, asked directly), dates requested, group size, service, and outcome (qualified / not qualified / booked / lost). This is a process change, not a code change, and it's the only way to ever calculate the metrics the mission brief defines as success (qualified inquiry rate, booking rate, cost per booking) since none of that exists in any analytics tool by default for a WhatsApp-first business.
4. Once (1)-(3) exist, revisit whether a lightweight CRM (e.g., a shared spreadsheet with structure, or a simple free-tier tool) is worth adopting — not before, since tooling without a process behind it doesn't produce data.

## What "lead quality" actually requires

Per-channel cost-per-click or cost-per-message-sent numbers (available from ad platforms directly, once any are activated) are **not** the same as cost-per-qualified-inquiry or cost-per-booking. The manual log in step 3 above is what closes that gap — it's the only way to connect "where did this person come from" (trackable via UTM parameters once GA4 exists) to "did this turn into real business" (only Fidel knows this, from the actual conversation).

## What I implemented vs. what requires owner input

**Already true, verified, no action needed:** WhatsApp click event code exists on every CTA.

**Requires Andrew:** confirming the Vercel Analytics dashboard toggle, creating a GA4 property, deciding on the manual lead-log format, and (later) any CRM adoption. I can wire up the GA4 tag and any additional event tracking code the moment a Measurement ID exists — that part is a fast, safe implementation task once unblocked.
