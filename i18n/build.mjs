// Static i18n build for Atlas Private Journeys.
//
// English pages (index.html, <route>/index.html) are the source of truth. This script:
//   1. syncs the language switcher, hreflang tags and saved-language redirect into the English pages,
//   2. generates /es/** and /pt/** pages by replacing every translatable string with the entry in
//      i18n/es.json or i18n/pt.json (keyed by a hash of the English text),
//   3. regenerates sitemap.xml with hreflang alternates.
//
//   node i18n/build.mjs            write everything
//   node i18n/build.mjs --check    exit 1 if any generated file is out of date
//   node i18n/build.mjs --extract  list English strings that still need a translation
//
// No dependencies. Visitors never hit a translation API: all output is plain static HTML.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://www.atlasjourneys.world';
const STORAGE_KEY = 'atlas-lang';

export const LANGS = {
  en: { htmlLang: 'en', hreflang: 'en', ogLocale: 'en_US', name: 'English', group: 'Language', flag: 'us' },
  es: { htmlLang: 'es', hreflang: 'es', ogLocale: 'es_LA', name: 'Español', group: 'Idioma', flag: 'es' },
  pt: { htmlLang: 'pt-BR', hreflang: 'pt-BR', ogLocale: 'pt_BR', name: 'Português', group: 'Idioma', flag: 'br' },
};
const TARGETS = ['es', 'pt'];

// ---------- small HTML parser (lossless round trip) ----------
const VOID = new Set(['meta', 'link', 'img', 'br', 'hr', 'input', 'source', 'area', 'base', 'col', 'embed', 'track', 'wbr']);
const WEAK_INLINE = new Set(['a', 'span', 'strong', 'em', 'b', 'i', 'small', 'u']);
const TOKEN = /<!--[\s\S]*?-->|<!doctype[^>]*>|<(script|style)\b((?:"[^"]*"|'[^']*'|[^'">])*)>([\s\S]*?)<\/\1\s*>|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/gi;

function parse(html) {
  const root = { type: 'root', children: [] };
  const stack = [root];
  const top = () => stack[stack.length - 1];
  let last = 0;
  for (const m of html.matchAll(TOKEN)) {
    if (m.index > last) top().children.push({ type: 'text', raw: html.slice(last, m.index) });
    last = m.index + m[0].length;
    if (m[0].startsWith('<!')) top().children.push({ type: 'raw', raw: m[0] });
    else if (m[1]) {
      top().children.push({ type: 'el', tag: m[1].toLowerCase(), open: `<${m[1]}${m[2]}>`,
        children: [{ type: 'raw', raw: m[3] }], close: `</${m[1]}>` });
    } else if (m[4]) {
      const tag = m[4].toLowerCase();
      let i = stack.length - 1;
      while (i > 0 && stack[i].tag !== tag) i--;
      if (i === 0) { top().children.push({ type: 'raw', raw: m[0] }); continue; }
      stack.length = i + 1;
      stack[i].close = m[0];
      stack.pop();
    } else {
      const el = { type: 'el', tag: m[5].toLowerCase(), open: m[0], children: [], close: '' };
      top().children.push(el);
      if (!VOID.has(el.tag) && !m[0].endsWith('/>')) stack.push(el);
    }
  }
  if (last < html.length) root.children.push({ type: 'text', raw: html.slice(last) });
  return root;
}
const serialize = (n) => n.type === 'el' ? n.open + n.children.map(serialize).join('') + n.close
  : n.type === 'root' ? n.children.map(serialize).join('') : n.raw;

// ---------- text helpers ----------
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };
const decode = (s) => s.replace(/&(?:#(\d+)|#x([\da-f]+)|(\w+));/gi, (all, d, h, n) =>
  d ? String.fromCodePoint(+d) : h ? String.fromCodePoint(parseInt(h, 16)) : (ENT[n] ?? all));
const encText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const encAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const squash = (s) => s.replace(/\s+/g, ' ').trim();
const hasLetters = (s) => /\p{L}/u.test(s);
const idOf = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 8);
const plain = (unit) => squash(unit.replace(/<br>/g, ' ').replace(/<\/?\d+>/g, ''));

function getAttr(open, name) {
  const m = open.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i'));
  return m ? decode(m[1] ?? m[2]) : null;
}
function setAttr(open, name, value) {
  return open.replace(new RegExp(`(\\s${name}\\s*=\\s*)(?:"[^"]*"|'[^']*')`, 'i'), (_, pre) => `${pre}"${encAttr(value)}"`);
}

// ---------- routes and URLs ----------
export function loadRoutes() {
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => {
    const loc = m[1].match(/<loc>(.*?)<\/loc>/)[1];
    const extra = [...m[1].matchAll(/<(lastmod|changefreq|priority)>(.*?)<\/\1>/g)].map((x) => x.slice(1, 3));
    return { loc, route: loc.slice(BASE.length + 1), extra };
  }).filter((e) => !/^(es|pt)(\/|$)/.test(e.route));
  return entries;
}
const pathFor = (lang, route) => lang === 'en' ? '/' + route : route ? `/${lang}/${route}` : `/${lang}/`;
const urlFor = (lang, route) => BASE + pathFor(lang, route);
const fileFor = (lang, route) => path.join(lang === 'en' ? '' : lang, route, 'index.html');

function localizeHref(href, lang, routes) {
  if (lang === 'en' || !href.startsWith('/') || href.startsWith('//')) return href;
  const m = href.match(/^([^?#]*)([?#].*)?$/);
  const route = m[1].replace(/^\/|\/$/g, '');
  if (!routes.includes(route)) return href;
  return pathFor(lang, route) + (m[2] || '');
}

// ---------- translation context ----------
class Translator {
  constructor(lang, catalog) {
    this.lang = lang; this.catalog = catalog;
    this.used = new Map();        // id -> English (all pages)
    this.missing = new Map();
    this.visible = new Map();     // plain English -> plain translation (for JSON-LD parity)
    this.visibleEn = new Set();
  }
  tr(en) {
    const id = idOf(en);
    this.used.set(id, en);
    if (!this.lang) return en;
    const t = this.catalog[id];
    if (t === undefined || t === '') { this.missing.set(id, en); return en; }
    return t === '=' ? en : t;
  }
}

// Build the numbered-tag form of a run: text with <1>…</1> for inline elements and <br>.
function runToUnit(nodes) {
  const inline = [];
  const walk = (list) => list.map((n) => {
    if (n.type === 'text') return encodeUnitText(n.raw);
    if (n.type === 'raw') return n.raw.startsWith('<!--') ? '' : n.raw;
    if (n.tag === 'br') return '<br>';
    if (!WEAK_INLINE.has(n.tag)) throw new Error(`Unsupported element <${n.tag}> inside translatable text: ${serialize(n).slice(0, 80)}`);
    const index = inline.length + 1;
    inline.push(n);
    return `<${index}>${walk(n.children)}</${index}>`;
  }).join('');
  const unit = squash(walk(nodes));
  return { unit, inline };
}
const encodeUnitText = (raw) => decode(raw);

function unitToHtml(unit, inline) {
  const opens = new Set(); const closes = new Set();
  const html = unit.replace(/<br>|<(\/?)(\d+)>|[^<]+|</g, (tok, slash, n) => {
    if (tok === '<br>') return '<br>';
    if (n) {
      const el = inline[+n - 1];
      if (!el) throw new Error(`Translation uses unknown tag <${n}>: ${unit}`);
      (slash ? closes : opens).add(+n);
      return slash ? el.close : el.open;
    }
    return encText(tok);
  });
  const sig = (set) => [...set].sort().join(',');
  if (sig(opens) !== inline.map((_, i) => i + 1).join(',') || sig(opens) !== sig(closes)) {
    throw new Error(`Translation changed inline tags: ${unit}`);
  }
  return html;
}

function translateRuns(el, T) {
  const kids = el.children;
  const out = [];
  let i = 0;
  while (i < kids.length) {
    const n = kids[i];
    const inRun = (x) => x.type === 'text' || (x.type === 'el' && (WEAK_INLINE.has(x.tag) || x.tag === 'br'));
    if (!inRun(n)) {
      if (n.type === 'el') translateElement(n, T);
      out.push(n); i++; continue;
    }
    let j = i;
    while (j < kids.length && inRun(kids[j])) j++;
    const run = kids.slice(i, j);
    const letters = run.some((x) => x.type === 'text' && hasLetters(decode(x.raw)));
    if (!letters) {
      for (const x of run) if (x.type === 'el') translateElement(x, T);
      out.push(...run);
    } else {
      // Keep surrounding whitespace out of the unit.
      const lead = run[0].type === 'text' ? run[0].raw.match(/^\s*/)[0] : '';
      const tail = run[run.length - 1].type === 'text' ? run[run.length - 1].raw.match(/\s*$/)[0] : '';
      for (const x of run) if (x.type === 'el') attrPass(x, T);
      const { unit, inline } = runToUnit(run);
      const translated = T.tr(unit);
      T.visibleEn.add(plain(unit)); T.visible.set(plain(unit), plain(translated));
      let html;
      try { html = unitToHtml(translated, inline); } catch (e) { throw new Error(`[${T.lang}] ${e.message}\n  EN: ${unit}`); }
      out.push({ type: 'raw', raw: lead + html + tail });
    }
    i = j;
  }
  el.children = out;
}

const ATTRS = ['alt', 'aria-label', 'title', 'placeholder'];
const META_KEYS = new Set(['description', 'og:title', 'og:description', 'twitter:title', 'twitter:description']);

function attrPass(el, T, routes = T.routes) {
  let open = el.open;
  for (const name of ATTRS) {
    const v = getAttr(open, name);
    if (v && hasLetters(v)) open = setAttr(open, name, T.tr(squash(v)));
  }
  if (el.tag === 'meta') {
    const key = getAttr(open, 'name') ?? getAttr(open, 'property');
    const v = getAttr(open, 'content');
    if (META_KEYS.has(key) && v) open = setAttr(open, 'content', T.tr(squash(v)));
  }
  const href = getAttr(open, 'href');
  if (href && el.tag === 'a') {
    const wa = href.match(/^(https:\/\/wa\.me\/\d+\?text=)([^&#]*)(.*)$/);
    if (wa) {
      const text = decodeURIComponent(wa[2]);
      const t = T.tr(text);
      open = setAttr(open, 'href', wa[1] + encodeURIComponent(t).replace(/'/g, '%27') + wa[3]);
    } else {
      const local = localizeHref(href, T.lang || 'en', routes);
      if (local !== href) open = setAttr(open, 'href', local);
    }
  }
  el.open = open;
}

function translateElement(el, T) {
  attrPass(el, T);
  if (el.tag === 'script' || el.tag === 'style') return;
  translateRuns(el, T);
}

// ---------- JSON-LD ----------
const LD_TRANSLATE = new Set(['name', 'description', 'serviceType', 'text', 'headline', 'jobTitle', 'alternativeHeadline']);
const LD_SKIP = new Set(['areaServed', 'about', 'provider', 'employee', 'worksFor', 'publisher', 'author', 'logo', 'image', 'sameAs']);
const LD_ENTITY = new Set(['TravelAgency', 'Organization', 'LocalBusiness', 'Person', 'Country', 'City', 'Place']);

function ldString(s, T) {
  const key = squash(s);
  if (T.visibleEn.has(key)) return T.lang ? (T.visible.get(key) ?? s) : s;
  return T.tr(key);
}

function transformLd(node, T, routes) {
  if (Array.isArray(node)) return node.map((x) => transformLd(x, T, routes));
  if (!node || typeof node !== 'object') return node;
  const type = node['@type'];
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    // Page-level @id values (…/route#page) are per-language entities; shared ones (…/#organization) stay stable.
    if (k === '@id' && typeof v === 'string' && v.startsWith(BASE + '/') && !v.startsWith(BASE + '/#')) {
      out[k] = BASE + localizeHref(v.slice(BASE.length), T.lang || 'en', routes);
    } else if (LD_SKIP.has(k) || ['@id', '@type', '@context'].includes(k)) out[k] = v;
    else if (['url', 'item', 'mainEntityOfPage'].includes(k) && typeof v === 'string') {
      const u = v.startsWith(BASE) ? v.slice(BASE.length) : null;
      out[k] = u && !LD_ENTITY.has(type) ? BASE + localizeHref(u || '/', T.lang || 'en', routes) : v;
    } else if (LD_TRANSLATE.has(k) && typeof v === 'string') {
      out[k] = k === 'name' && LD_ENTITY.has(type) ? v : ldString(v, T);
    } else out[k] = transformLd(v, T, routes);
  }
  if (T.lang && 'inLanguage' in out) out.inLanguage = LANGS[T.lang].htmlLang;
  return out;
}

function ldPass(root, T, routes) {
  const walk = (n) => {
    if (n.type !== 'el') return n.children?.forEach(walk);
    if (n.tag === 'script' && /application\/ld\+json/.test(n.open)) {
      const raw = n.children[0].raw;
      const data = transformLd(JSON.parse(raw), T, routes);
      const indent = (raw.match(/\n([ \t]*)\S/) || [])[1] ?? '';
      n.children[0].raw = raw.includes('\n')
        ? '\n' + JSON.stringify(data, null, 2).replace(/^/gm, indent).replace(/<\//g, '<\\/') + '\n' + indent.slice(2)
        : JSON.stringify(data).replace(/<\//g, '<\\/');
      return;
    }
    n.children.forEach(walk);
  };
  walk(root);
}

// ---------- injected blocks (idempotent via markers) ----------
const BLOCK = (name, html) => `<!--i18n:${name}-->${html}<!--/i18n:${name}-->`;
const BLOCK_RE = /<!--i18n:([\w-]+)-->[\s\S]*?<!--\/i18n:\1-->/g;
const stripBlocks = (html) => html.replace(BLOCK_RE, '');

function flag(code) {
  return `<img src="/assets/flags/${code}.svg" alt="" width="24" height="16" decoding="async">`;
}

function switcher(lang, route, variant) {
  const links = Object.entries(LANGS).map(([code, L]) => {
    const current = code === lang;
    return `<a href="${pathFor(code, route)}" lang="${L.htmlLang}" hreflang="${L.hreflang}" data-lang="${code}" title="${L.name}"${current ? ' aria-current="true"' : ''}>${flag(L.flag)}<span class="lang-name">${L.name}</span></a>`;
  }).join('');
  return BLOCK(`switch-${variant}`, `<div class="lang-switch lang-switch--${variant}" role="group" aria-label="${LANGS[lang].group}">${links}</div>`);
}

function headBlock(lang, route) {
  const tags = [
    ...Object.entries(LANGS).map(([code, L]) => `<link rel="alternate" hreflang="${L.hreflang}" href="${urlFor(code, route)}">`),
    `<link rel="alternate" hreflang="x-default" href="${urlFor('en', route)}">`,
    `<meta property="og:locale" content="${LANGS[lang].ogLocale}">`,
    ...Object.entries(LANGS).filter(([c]) => c !== lang).map(([, L]) => `<meta property="og:locale:alternate" content="${L.ogLocale}">`),
  ];
  // Visitors who explicitly picked Spanish or Portuguese are sent to that version of the English URL they open.
  // Only an explicit saved choice is used; the browser language is never consulted.
  const redirect = lang === 'en'
    ? `<script>try{var l=localStorage.getItem('${STORAGE_KEY}');if(l==='es'||l==='pt')location.replace('/'+l+location.pathname+location.search+location.hash)}catch(e){}</script>`
    : '';
  return BLOCK('head', redirect + tags.join(''));
}

function inject(html, lang, route) {
  let out = html
    .replace(/(<meta name="viewport"[^>]*>)/, (m) => m + headBlock(lang, route))
    .replace(/<html lang="[^"]*"/, `<html lang="${LANGS[lang].htmlLang}"`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${urlFor(lang, route)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${urlFor(lang, route)}$2`);
  const navCta = out.indexOf('<a class="nav-cta"');
  if (navCta < 0) throw new Error(`${route || 'home'}: no .nav-cta to anchor the language switcher`);
  out = out.slice(0, navCta) + switcher(lang, route, 'bar') + out.slice(navCta);
  return out;
}

// ---------- build ----------
function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8')); } catch { return fallback; }
}

export function build({ strict = true } = {}) {
  const entries = loadRoutes();
  const routes = entries.map((e) => e.route);
  const outputs = new Map();
  const catalogs = { es: readJson('i18n/es.json', {}), pt: readJson('i18n/pt.json', {}) };
  const used = new Map();
  const missing = { es: new Map(), pt: new Map() };
  const sources = new Map();

  for (const route of routes) {
    const file = fileFor('en', route);
    const base = stripBlocks(fs.readFileSync(path.join(ROOT, file), 'utf8'));
    sources.set(route, base);
    outputs.set(file, inject(base, 'en', route));

    // Extraction pass (English), then one translation pass per language.
    for (const lang of [null, ...TARGETS]) {
      const T = new Translator(lang, lang ? catalogs[lang] : {});
      T.routes = routes;
      const root = parse(base);
      root.children.forEach((n) => n.type === 'el' && translateElement(n, T));
      ldPass(root, T, routes);
      for (const [id, en] of T.used) used.set(id, en);
      if (!lang) continue;
      for (const [id, en] of T.missing) missing[lang].set(id, en);
      outputs.set(fileFor(lang, route), inject(serialize(root), lang, route));
    }
  }

  // Sitemap with hreflang alternates.
  const alt = (route) => Object.entries(LANGS).map(([c, L]) =>
    `<xhtml:link rel="alternate" hreflang="${L.hreflang}" href="${urlFor(c, route)}"/>`).join('')
    + `<xhtml:link rel="alternate" hreflang="x-default" href="${urlFor('en', route)}"/>`;
  const urls = entries.flatMap((e) => Object.keys(LANGS).map((lang) => {
    const extra = e.extra.map(([k, v]) => `<${k}>${v}</${k}>`).join('');
    return `  <url><loc>${urlFor(lang, e.route)}</loc>${extra}${alt(e.route)}</url>`;
  }));
  outputs.set('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);

  const en = Object.fromEntries([...used].sort((a, b) => a[1].localeCompare(b[1])));
  outputs.set('i18n/en.json', JSON.stringify(en, null, 1) + '\n');

  const stale = { es: [], pt: [] };
  for (const lang of TARGETS) for (const id of Object.keys(catalogs[lang])) if (!used.has(id)) stale[lang].push(id);

  if (strict) {
    const problems = TARGETS.flatMap((l) => [...missing[l]].map(([id, t]) => `[${l}] ${id} ${t}`));
    if (problems.length) throw new Error(`${problems.length} missing translation(s):\n${problems.slice(0, 40).join('\n')}`);
  }
  return { outputs, missing, stale, used: en, routes };
}

// ---------- CLI ----------
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const arg = process.argv[2];
  const result = build({ strict: arg !== '--extract' });
  if (arg === '--extract') {
    for (const lang of TARGETS) {
      console.log(`## ${lang}: ${result.missing[lang].size} missing, ${result.stale[lang].length} stale`);
      for (const [id, en] of result.missing[lang]) console.log(`${id}\t${en}`);
    }
    fs.writeFileSync(path.join(ROOT, 'i18n/en.json'), result.outputs.get('i18n/en.json'));
  } else {
    let changed = 0;
    for (const [file, content] of result.outputs) {
      const full = path.join(ROOT, file);
      const current = fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : null;
      if (current === content) continue;
      changed++;
      if (arg === '--check') { console.error('out of date: ' + file); continue; }
      fs.mkdirSync(path.dirname(full), { recursive: true });
      fs.writeFileSync(full, content);
    }
    if (arg === '--check' && changed) process.exit(1);
    console.log(arg === '--check' ? 'i18n output is up to date' : `i18n build wrote ${changed} file(s)`);
    for (const l of TARGETS) if (result.stale[l].length) console.warn(`${l}: ${result.stale[l].length} unused catalog entries`);
  }
}
