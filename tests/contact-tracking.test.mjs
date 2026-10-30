import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const script = fs.readFileSync(new URL('../assets/atlas-grid.js', import.meta.url), 'utf8');

function boot({ search = '', host = 'www.atlasjourneys.world', referrer = '', saved,
  dnt = false, gpc = false, brokenStorage = false, brokenAnalytics = false, queue = false } = {}) {
  const listeners = {};
  const store = new Map(saved ? [['atlas-attribution-v1', saved]] : []);
  const events = [];
  const document = {
    referrer, querySelectorAll: () => [],
    addEventListener: (name, callback) => { listeners[name] = callback; },
  };
  const window = queue ? {} : { va: (...args) => {
    if (brokenAnalytics) throw Error('blocked');
    events.push(args);
  } };
  const sessionStorage = {
    getItem: (key) => { if (brokenStorage) throw Error('blocked'); return store.get(key); },
    setItem: (key, value) => { if (brokenStorage) throw Error('blocked'); store.set(key, value); },
  };
  vm.runInNewContext(script, { document, window, sessionStorage, URL, URLSearchParams,
    location: { search, hostname: host },
    navigator: { doNotTrack: dnt ? '1' : '0', globalPrivacyControl: gpc } });
  listeners.DOMContentLoaded();
  function click({ area = 'hero', href = 'https://wa.me/51942299829?text=PRIVATE', button = 0,
    prevented = false, type = 'click' } = {}) {
    const link = { href, closest: (selector) => {
      const selectors = { hero: '.hero, .page-hero', final: '.final-cta', meet_fidel: '#fidel',
        header: 'header', footer: 'footer', mobile_fixed: '.mobile-whatsapp', mobile_menu: '.site-menu' };
      return selector === selectors[area] ? link : null;
    } };
    listeners[type]({ type, button, defaultPrevented: prevented,
      target: { closest: (selector) => selector === 'a[href]' ? link : null } });
  }
  return { click, events, store, window };
}

test('contact event uses only two fixed properties and never the message', () => {
  const app = boot({ search: '?utm_source=instagram&utm_campaign=atlas-lima&email=secret@example.com' });
  app.click();
  assert.equal(app.events[0][0], 'event');
  assert.equal(app.events[0][1].name, 'whatsapp_click');
  assert.deepEqual(JSON.parse(JSON.stringify(app.events[0][1].data)),
    { placement: 'hero', source: 'instagram:atlas-lima' });
  assert(!JSON.stringify(app.events).includes('PRIVATE'));
  assert(!JSON.stringify(app.events).includes('secret'));
});

test('all main CTA placements are classified', () => {
  for (const area of ['hero', 'final', 'meet_fidel', 'header', 'footer', 'mobile_fixed', 'mobile_menu', 'content']) {
    const app = boot(); app.click({ area });
    assert.equal(app.events[0][1].data.placement, area);
  }
});

test('explicit QA mode uses a separate event, not a traveler inquiry', () => {
  const app = boot({ search: '?atlas_qa=1' }); app.click();
  assert.equal(app.events[0][1].name, 'atlas_tracking_check');
});

test('known campaign attribution survives internal navigation', () => {
  const app = boot({ saved: 'facebook:atlas-groups', referrer: 'https://www.atlasjourneys.world/private-guide-lima' });
  app.click(); assert.equal(app.events[0][1].data.source, 'facebook:atlas-groups');
});

test('the nightlife campaign is measured and survives navigation', () => {
  for (const settings of [{ search: '?utm_source=instagram&utm_campaign=atlas-nightlife' },
    { saved: 'instagram:atlas-nightlife' }]) {
    const app = boot(settings); app.click();
    assert.equal(app.events[0][1].data.source, 'instagram:atlas-nightlife');
  }
});

test('arbitrary query values and tampered session values are discarded', () => {
  const app = boot({ search: '?utm_source=person@example.com&utm_campaign=private-trip', saved: 'private-name' });
  app.click(); assert.equal(app.events[0][1].data.source, 'direct');
  assert.equal(app.store.get('atlas-attribution-v1'), 'direct');
});

test('new valid campaign takes precedence without retaining arbitrary campaign names', () => {
  const app = boot({ search: '?utm_source=tiktok&utm_campaign=personal-info', saved: 'google' });
  app.click(); assert.equal(app.events[0][1].data.source, 'tiktok');
});

test('referral classification uses domains, not full URLs or lookalikes', () => {
  for (const [referrer, source] of [
    ['https://l.instagram.com/private?email=secret', 'instagram'],
    ['https://chatgpt.com/c/private-conversation', 'chatgpt'],
    ['https://www.bing.com/search?q=private', 'bing'],
    ['https://instagram.com.example.org/private', 'other-referral'],
    ['not a URL', 'direct'],
  ]) {
    const app = boot({ referrer }); app.click();
    assert.equal(app.events[0][1].data.source, source);
    assert(!JSON.stringify(app.events).includes('private'));
  }
});

test('privacy signals disable contact tracking and session writes', () => {
  for (const settings of [{ dnt: true }, { gpc: true }]) {
    const app = boot(settings); app.click();
    assert.equal(app.events.length, 0); assert.equal(app.store.size, 0);
  }
});

test('localhost and preview deployments never emit production events', () => {
  for (const host of ['127.0.0.1', 'localhost', 'atlas-preview.vercel.app']) {
    const app = boot({ host }); app.click(); assert.equal(app.events.length, 0);
  }
});

test('unrelated links, other numbers, prevented clicks and right clicks are ignored', () => {
  for (const options of [{ href: 'https://example.com' }, { href: 'https://wa.me/123' },
    { prevented: true }, { button: 2 }, { type: 'auxclick', button: 2 }]) {
    const app = boot(); app.click(options); assert.equal(app.events.length, 0);
  }
});

test('keyboard clicks and middle clicks are supported', () => {
  for (const options of [{ button: 0 }, { type: 'auxclick', button: 1 }]) {
    const app = boot(); app.click(options); assert.equal(app.events.length, 1);
  }
});

test('blocked analytics or storage never prevents the contact action', () => {
  for (const settings of [{ brokenStorage: true }, { brokenAnalytics: true }]) {
    const app = boot(settings); assert.doesNotThrow(() => app.click());
  }
});

test('Vercel initialization queue retains the event until analytics loads', () => {
  const app = boot({ queue: true }); app.click();
  assert.equal(app.window.vaq.length, 1);
  assert.equal(app.window.vaq[0][1].name, 'whatsapp_click');
});
