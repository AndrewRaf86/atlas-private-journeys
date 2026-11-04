# Translations (English · Español · Português)

English pages (`index.html`, `<route>/index.html`) are the source of truth. `/es/**` and `/pt/**` are generated static pages — do not edit them by hand.

```bash
node i18n/build.mjs            # regenerate /es, /pt, sitemap.xml, i18n/en.json
node i18n/build.mjs --check    # fail if generated files are stale (also run by tests/i18n.test.mjs)
node i18n/build.mjs --extract  # list English strings that still need a translation
node --test tests/*.test.mjs
```

**Editing English copy:** change the English HTML, run `--extract`, add the new `id → translation` pairs to `es.json` and `pt.json`, then run the build. The id is a hash of the English text, so changed copy can never silently show an outdated translation — the build fails until it is translated. `i18n/en.json` (generated) maps each id to its English source for review.

**Catalog rules**
- Inline links/emphasis appear as numbered tags (`<1>text</1>`) and `<br>`; keep the same tags. The real `href` values come from the English page.
- `"="` means "keep the English text" (brand names).
- WhatsApp prefilled messages are catalog entries too, so visitors message Fidel in their own language.
- JSON-LD (FAQ, Service, breadcrumbs) is translated from the same strings as the visible text, so schema and page always match.

**New page:** add it to `sitemap.xml` (English URL) and create `<route>/index.html`; the build creates the `es`/`pt` versions and adds the switcher, hreflang and sitemap entries.

**How the switcher works:** the header flags are plain links to the same page in each language (works without JavaScript and is crawlable). `assets/atlas-grid.js` stores an explicit click in `localStorage` (`atlas-lang`). A tiny inline script on English pages sends visitors with a saved `es`/`pt` choice to the matching localized URL. Browser language is never used.
