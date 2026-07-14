# Test and Deployment Report

## Tests run this session

| Test | Method | Result |
|---|---|---|
| JSON-LD syntax validity (both modified pages) | Python `json.loads` parse | Pass — both valid |
| HTTP status for all 4 live routes | `urllib.request` against local static server | Pass — all 200, unknown route correctly 404s |
| Title length check | Character count | Pass — all titles now under or near the 50-60 char target |
| Visual regression check | Local static server, manual load of both edited pages | Pass — no visual change (schema is non-rendering) |
| Internal link resolution (from prior session, still valid) | File-existence check against every `href` | Pass |
| Image reference resolution (from prior session, still valid) | File-existence check against every `src` | Pass |

## Not run this session (and why)

- **Google Rich Results Test** — requires either a live indexed URL or manual paste into Google's tool; recommended as a follow-up once the domain is indexed (see `05_TECHNICAL_SEO_AUDIT.md` finding #6).
- **Lighthouse/Core Web Vitals** — not re-run this session; the site is static HTML with no heavy JS or webfonts, so performance risk is low, but a real Lighthouse pass is recommended once analytics are live (so performance data has real traffic to correlate against).
- **Accessibility scan (axe or equivalent)** — not run this session. Recommended as a discrete follow-up pass given it wasn't part of what changed this session (schema and title only).
- **npm install / build** — not applicable; this is a static site with no `package.json` and no build step.

## Deployment status

**Nothing deployed to production this session.** All changes are committed to `growth/schema-and-tracking-foundation`, one commit (`f5e3f0ba` at time of writing), not pushed to origin.

## Exact commands to push and preview (not run — awaiting approval)

```
git push -u origin growth/schema-and-tracking-foundation
```

This will generate a Vercel preview deployment automatically (same pattern observed for the previous branch in this project). Production (`main`) is untouched and will remain untouched unless explicitly approved and merged, following the same process used for the previous hero-fix work.
