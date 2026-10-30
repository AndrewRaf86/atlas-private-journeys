document.addEventListener('DOMContentLoaded', () => {
  // Only fixed categories are retained. Never store a URL, message or traveler detail.
  const sources = new Set(['instagram', 'facebook', 'tiktok', 'google', 'bing', 'chatgpt', 'newsletter']);
  const campaigns = new Set(['atlas-lima', 'atlas-brazil', 'atlas-groups', 'atlas-nightlife']);
  const storageKey = 'atlas-attribution-v1';
  const trackingAllowed = !navigator.globalPrivacyControl && navigator.doNotTrack !== '1';
  const production = ['atlasjourneys.world', 'www.atlasjourneys.world'].includes(location.hostname);
  const testMode = new URLSearchParams(location.search).get('atlas_qa') === '1';
  let attribution = 'direct';

  if (trackingAllowed && production) {
    const params = new URLSearchParams(location.search);
    const source = params.get('utm_source')?.toLowerCase();
    const campaign = params.get('utm_campaign')?.toLowerCase();
    const allowedAttribution = /^(direct|instagram|facebook|tiktok|google|bing|chatgpt|newsletter|other-referral)(:(atlas-lima|atlas-brazil|atlas-groups|atlas-nightlife))?$/;
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved && allowedAttribution.test(saved)) attribution = saved;
    } catch { /* Storage can be unavailable in private browsing. */ }

    if (sources.has(source)) {
      attribution = source + (campaigns.has(campaign) ? ':' + campaign : '');
    } else if (attribution === 'direct' && document.referrer) {
      try {
        const host = new URL(document.referrer).hostname.toLowerCase();
        const from = (domain) => host === domain || host.endsWith('.' + domain);
        if (from('instagram.com')) attribution = 'instagram';
        else if (from('facebook.com') || from('fb.com')) attribution = 'facebook';
        else if (from('tiktok.com')) attribution = 'tiktok';
        else if (from('google.com')) attribution = 'google';
        else if (from('bing.com')) attribution = 'bing';
        else if (from('chatgpt.com') || from('chat.openai.com')) attribution = 'chatgpt';
        else if (!from('atlasjourneys.world')) attribution = 'other-referral';
      } catch { /* Invalid referrers do not affect contact links. */ }
    }
    try { sessionStorage.setItem(storageKey, attribution); } catch { /* Optional only. */ }
  }

  const trackContact = (event) => {
    if (!production || !trackingAllowed || event.defaultPrevented) return;
    if (event.type === 'auxclick' ? event.button !== 1 : event.button > 0) return;
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    let url;
    try { url = new URL(link.href); } catch { return; }
    if (url.hostname !== 'wa.me' || url.pathname !== '/51942299829') return;

    let placement = 'content';
    if (link.closest('.mobile-whatsapp')) placement = 'mobile_fixed';
    else if (link.closest('.site-menu')) placement = 'mobile_menu';
    else if (link.closest('header')) placement = 'header';
    else if (link.closest('.hero, .page-hero')) placement = 'hero';
    else if (link.closest('.final-cta')) placement = 'final';
    else if (link.closest('#fidel')) placement = 'meet_fidel';
    else if (link.closest('footer')) placement = 'footer';

    try {
      // Same queue protocol as Vercel's static-site SDK. Two properties fit Pro.
      window.va = window.va || function (...args) { (window.vaq = window.vaq || []).push(args); };
      window.va('event', { name: testMode ? 'atlas_tracking_check' : 'whatsapp_click', data: { placement, source: attribution } });
    } catch { /* Analytics must never interfere with opening WhatsApp. */ }
  };
  document.addEventListener('click', trackContact);
  document.addEventListener('auxclick', trackContact);

  document.querySelectorAll('details.site-menu').forEach((menu) => {
    const summary = menu.querySelector('summary');

    menu.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !menu.open) return;
      menu.open = false;
      summary?.focus();
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => { menu.open = false; });
    });
  });

  document.querySelectorAll('.skip-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      const main = document.querySelector(link.getAttribute('href'));
      if (!main) return;
      event.preventDefault();
      history.replaceState(null, '', link.getAttribute('href'));
      main.focus();
    });
  });
});
