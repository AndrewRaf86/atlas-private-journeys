import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { build, LANGS, loadRoutes } from '../i18n/build.mjs';

const root = new URL('../', import.meta.url);
const BASE = 'https://www.atlasjourneys.world';
const routes = loadRoutes().map((e) => e.route);
const langs = Object.keys(LANGS);
const localized = ['es', 'pt'];
const pathFor = (lang, route) => lang === 'en' ? '/' + route : route ? `/${lang}/${route}` : `/${lang}/`;
const file = (lang, route) => (lang === 'en' ? '' : lang + '/') + (route ? route + '/' : '') + 'index.html';
const read = (f) => fs.readFileSync(new URL(f, root), 'utf8');
const pages = Object.fromEntries(langs.flatMap((lang) => routes.map((route) => [`${lang}:${route}`, read(file(lang, route))])));
const text = (html) => html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&')
  .replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const visible = (html) => text(html.replace(/<(script|style)[\s\S]*?<\/\1>|<head>[\s\S]*?<\/head>/g, ' '));

test('generated files are up to date and every English string has a translation', () => {
  const { outputs, stale } = build();
  for (const [name, content] of outputs) assert.equal(read(name), content, `${name} is out of date: run node i18n/build.mjs`);
  assert.deepEqual(stale, { es: [], pt: [] }, 'unused catalog entries');
});

test('every route exists in all three languages with correct lang, canonical and hreflang set', () => {
  assert(routes.length >= 10);
  for (const lang of langs) for (const route of routes) {
    const html = pages[`${lang}:${route}`];
    const id = `${lang}:${route || 'home'}`;
    assert(html.includes(`<html lang="${LANGS[lang].htmlLang}"`), id + ' html lang');
    assert(html.includes(`<link rel="canonical" href="${BASE}${pathFor(lang, route)}">`), id + ' canonical');
    for (const alt of langs) {
      assert(html.includes(`<link rel="alternate" hreflang="${LANGS[alt].hreflang}" href="${BASE}${pathFor(alt, route)}">`), `${id} hreflang ${alt}`);
    }
    assert(html.includes(`<link rel="alternate" hreflang="x-default" href="${BASE}${pathFor('en', route)}">`), id + ' x-default');
    assert(html.includes(`<meta property="og:locale" content="${LANGS[lang].ogLocale}">`), id + ' og:locale');
    if (html.includes('property="og:url"')) assert(html.includes(`property="og:url" content="${BASE}${pathFor(lang, route)}"`), id + ' og:url');
    assert(!/noindex/.test(html), id + ' must be indexable');
    assert.equal((html.match(/<h1\b/g) || []).length, 1, id + ' h1');
  }
});

test('each localized page has its own title and description, different from English', () => {
  for (const lang of langs) {
    const titles = new Set(), descriptions = new Set();
    for (const route of routes) {
      const html = pages[`${lang}:${route}`];
      const title = html.match(/<title>(.*?)<\/title>/s)[1];
      const description = html.match(/<meta name="description" content="([^"]*)"/)[1];
      assert(!titles.has(title) && !descriptions.has(description), `${lang}:${route} duplicate metadata`);
      titles.add(title); descriptions.add(description);
      if (lang !== 'en') {
        assert.notEqual(title, pages[`en:${route}`].match(/<title>(.*?)<\/title>/s)[1], `${lang}:${route} title`);
        assert.notEqual(description, pages[`en:${route}`].match(/<meta name="description" content="([^"]*)"/)[1], `${lang}:${route} description`);
      }
    }
  }
});

test('the language switcher is visible in the header of every page, links to the same page, and marks the current language', () => {
  for (const lang of langs) for (const route of routes) {
    const html = pages[`${lang}:${route}`];
    for (const variant of ['bar']) {
      const block = html.match(new RegExp(`<div class="lang-switch lang-switch--${variant}"[^>]*>([\\s\\S]*?)</div>`))?.[1];
      assert(block, `${lang}:${route} ${variant} switcher`);
      const links = [...block.matchAll(/<a href="([^"]+)" lang="([^"]+)" hreflang="[^"]+" data-lang="(\w+)" title="([^"]+)"( aria-current="true")?>/g)];
      assert.deepEqual(links.map((m) => m[3]), langs);
      assert.deepEqual(links.map((m) => m[1]), langs.map((l) => pathFor(l, route)));
      assert.deepEqual(links.filter((m) => m[5]).map((m) => m[3]), [lang]);
      assert.deepEqual(links.map((m) => m[4]), langs.map((l) => LANGS[l].name));
      assert(block.includes('alt=""'), 'flag images are decorative; the link text names the language');
    }
  }
});

test('localized pages link only to localized pages and every internal link resolves', () => {
  for (const lang of localized) for (const route of routes) {
    const html = pages[`${lang}:${route}`];
    for (const [, raw] of html.matchAll(/<a [^>]*href="([^"]+)"/g)) {
      if (!raw.startsWith('/') || raw.startsWith('/#')) continue;
      const url = new URL(raw, BASE);
      const key = url.pathname.replace(/^\/|\/$/g, '');
      const inLang = key === lang || key.startsWith(lang + '/');
      const isSwitcher = /hreflang=/.test(html.match(new RegExp(`<a [^>]*href="${raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`))?.[0] || '');
      assert(inLang || isSwitcher, `${lang}:${route} links to a non-localized page ${raw}`);
      const target = new URL('.' + url.pathname + (url.pathname.endsWith('/') ? '' : '/') + 'index.html', root);
      assert(fs.existsSync(target), `${lang}:${route} missing ${raw}`);
      if (url.hash) assert(fs.readFileSync(target, 'utf8').includes(`id="${url.hash.slice(1)}"`), `${lang}:${route} missing anchor ${raw}`);
    }
    for (const [, raw] of html.matchAll(/(?:src|href)="(\/(?:assets|public)\/[^"?]+)/g)) {
      assert(fs.existsSync(new URL('.' + raw, root)), `${lang}:${route} missing asset ${raw}`);
    }
  }
});

test('localized structured data parses, keeps entity ids, and every FAQ answer matches the visible text', () => {
  for (const lang of localized) for (const route of routes) {
    const html = pages[`${lang}:${route}`];
    const english = pages[`en:${route}`];
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const source = [...english.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    assert.equal(blocks.length, source.length);
    const ids = (value) => JSON.stringify(value).match(/"@id":"[^"]+"/g) || [];
    const shared = (list) => list.filter((id) => id.includes(`${BASE}/#`));
    assert.deepEqual(shared(ids(blocks)), shared(ids(source)), `${lang}:${route} organization/person ids stay stable across languages`);
    for (const id of ids(blocks).filter((x) => !shared([x]).length)) assert(id.includes(`${BASE}/${lang}/`), `${lang}:${route} page id ${id} is per language`);
    const faq = visibleFaq(html);
    for (const schema of blocks) for (const entity of schema['@graph'] || [schema]) {
      assert(!/aggregateRating|ratingValue|reviewCount/.test(JSON.stringify(entity)), 'no invented ratings');
      if (entity['@type'] !== 'FAQPage') continue;
      for (const question of entity.mainEntity) {
        assert.equal(faq.get(question.name), question.acceptedAnswer.text, `${lang}:${route} FAQ ${question.name}`);
      }
    }
    const urls = JSON.stringify(blocks).match(/"https:\/\/www\.atlasjourneys\.world[^"]*"/g) || [];
    for (const quoted of urls) {
      const u = JSON.parse(quoted).slice(BASE.length);
      if (u.startsWith('/#') || u === '/' || /\.(jpe?g|webp|png)$/.test(u)) continue;
      assert(u.startsWith(`/${lang}/`), `${lang}:${route} schema URL ${u} should be localized`);
    }
  }
});
function visibleFaq(html) {
  return new Map([...html.matchAll(/<details><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)].map(([, q, a]) => [text(q), text(a)]));
}

test('WhatsApp links keep the approved number and carry a message in the page language', () => {
  for (const lang of localized) for (const route of routes) {
    const html = pages[`${lang}:${route}`];
    const links = [...html.matchAll(/https:\/\/wa\.me\/(\d+)(?:\?text=([^"&]*))?/g)];
    assert(links.length > 0, `${lang}:${route} has a WhatsApp link`);
    for (const [, number, message] of links) {
      assert.equal(number, '51942299829');
      if (message) assert(!/^Hi%20Fidel/.test(message), `${lang}:${route} WhatsApp message is still English`);
      if (message) assert.doesNotThrow(() => decodeURIComponent(message));
    }
    assert(html.includes('/assets/atlas-grid.js') && html.includes('/_vercel/insights/script.js'), 'shared scripts');
  }
});

test('no English sentences leak into Spanish or Portuguese pages', () => {
  const english = /\b(the|and|your|with|you|are|our|before|please)\b/i;
  for (const lang of localized) for (const route of routes) {
    const body = visible(pages[`${lang}:${route}`]).replace(/Atlas Private Journeys|Dreamglade Retreat|passport bros|Do Not Track|Global Privacy Control|Vercel Web Analytics|Airbnb/g, '');
    assert(!english.test(body), `${lang}:${route} contains English: ${body.match(new RegExp(`.{0,40}${english.source}.{0,40}`, 'i'))?.[0]}`);
  }
});

test('Spanish and Portuguese pages are not copies of each other or of English', () => {
  for (const route of routes) {
    const [en, es, pt] = langs.map((l) => visible(pages[`${l}:${route}`]));
    assert(new Set([en, es, pt]).size === 3, route);
    assert(es.length > en.length * 0.7 && pt.length > en.length * 0.7, `${route} translation looks truncated`);
  }
});

test('sitemap lists every language of every page with reciprocal hreflang alternates', () => {
  const sitemap = read('sitemap.xml');
  for (const route of routes) for (const lang of langs) {
    const entry = sitemap.match(new RegExp(`<url><loc>${BASE}${pathFor(lang, route)}</loc>.*?</url>`))?.[0];
    assert(entry, `${lang}:${route} in sitemap`);
    for (const alt of langs) assert(entry.includes(`hreflang="${LANGS[alt].hreflang}" href="${BASE}${pathFor(alt, route)}"`));
    assert(entry.includes(`hreflang="x-default" href="${BASE}${pathFor('en', route)}"`));
  }
  assert(sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'));
});

test('English visitors with a saved Spanish or Portuguese choice are redirected; everyone else stays on English', () => {
  const script = pages['en:lima-airport-transfer'].match(/<!--i18n:head--><script>([\s\S]*?)<\/script>/)[1];
  const run = (stored, { broken = false } = {}) => {
    const calls = [];
    vm.runInNewContext(script, {
      localStorage: { getItem: (key) => { assert.equal(key, 'atlas-lang'); if (broken) throw Error('blocked'); return stored; } },
      location: { pathname: '/lima-airport-transfer', search: '?utm_source=instagram', hash: '#faq', replace: (url) => calls.push(url) },
    });
    return calls;
  };
  assert.deepEqual(run('es'), ['/es/lima-airport-transfer?utm_source=instagram#faq']);
  assert.deepEqual(run('pt'), ['/pt/lima-airport-transfer?utm_source=instagram#faq']);
  assert.deepEqual(run(null), [], 'new visitors see English');
  assert.deepEqual(run('en'), []);
  assert.deepEqual(run('fr'), [], 'unknown values are ignored');
  assert.deepEqual(run('es', { broken: true }), [], 'blocked storage never breaks the page');
  assert(!pages['es:'].includes('localStorage.getItem'), 'localized pages never redirect');
  assert(!/navigator\.language/.test(read('assets/atlas-grid.js') + script), 'browser language is never consulted');
});

test('flag assets exist and the privacy policy discloses the language preference', () => {
  for (const code of ['us', 'es', 'br']) assert(read(`assets/flags/${code}.svg`).startsWith('<svg'));
  assert(/Language preference/.test(pages['en:privacy-policy']) && /local storage/.test(pages['en:privacy-policy']));
  assert(/Preferencia de idioma/.test(pages['es:privacy-policy']) && /Preferência de idioma/.test(pages['pt:privacy-policy']));
});
