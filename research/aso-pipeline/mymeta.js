// Fetch the user's own listing (US/en) fresh, with icon + graphics URLs, and check where it ranks in today's US SERPs.
const fs = require('fs');
const path = require('path');
const { g } = require('./lib');
const APP = 'com.softwarealliance.cloudvault';
const UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36';
function parseDs(html) { const out = {}; for (const b of html.match(/AF_initDataCallback[\s\S]*?<\/script/g) || []) { const k = b.match(/(ds:\d+)'/); const v = b.match(/data:([\s\S]*?), sideChannel: \{\}\}\);<\//); if (k && v) try { out[k[1]] = JSON.parse(v[1]); } catch {} } return out; }
const decode = s => (s || '').replace(/<br\s*\/?>/gi, '\n').replace(/<\/?(b|i|u|strong|em)>/gi, '').replace(/<[^>]+>/g, '')
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

(async () => {
  const r = await fetch(`https://play.google.com/store/apps/details?id=${APP}&hl=en&gl=US`, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' } });
  console.log('HTTP', r.status);
  const html = await r.text();
  fs.writeFileSync(path.join(__dirname, 'mymeta_raw.html'), html);
  const d = parseDs(html)['ds:5'];
  if (!d) { console.log('no ds:5'); return; }
  const q = p => g(d, [1, 2].concat(p));
  const findUrls = (node, acc = []) => { if (Array.isArray(node)) node.forEach(n => findUrls(n, acc)); else if (typeof node === 'string' && node.startsWith('https://play-lh.googleusercontent.com/')) acc.push(node); return acc; };
  const shots = (q([78, 0]) || []).map(s => g(s, [3, 2])).filter(Boolean);
  const meta = {
    appId: APP, fetchedAt: new Date().toISOString(), url: `https://play.google.com/store/apps/details?id=${APP}&hl=en&gl=US`,
    title: q([0, 0]), summaryRaw: q([73, 0, 1]), descriptionRaw: q([72, 0, 1]),
    installsLabel: q([13, 0]), minInstalls: q([13, 1]), realInstalls: q([13, 2]),
    score: q([51, 0, 1]), ratings: q([51, 2, 1]), reviews: q([51, 3, 1]),
    developer: q([68, 0]), developerEmail: q([69, 1, 0]), developerSite: q([69, 0, 5, 2]) || null,
    genre: q([79, 0, 0, 0]), released: q([10, 0]), updatedTs: q([145, 0, 1, 0]),
    containsAds: !!q([48]), iap: q([19, 0]) || null, contentRating: q([9, 0]) || null,
    version: q([140, 0, 0, 0]) || null, recentChanges: q([144, 1, 1]) || null,
    icon: q([95, 0, 3, 2]) || null, featureGraphic: q([96, 0, 3, 2]) || null, video: q([100, 0, 0, 3, 2]) || null,
    screenshots: shots, privacyPolicy: q([99, 0, 5, 2]) || null,
  };
  meta.summary = decode(meta.summaryRaw);
  meta.description = decode(meta.descriptionRaw);
  meta.updated = meta.updatedTs ? new Date(meta.updatedTs * 1000).toISOString().slice(0, 10) : null;
  fs.writeFileSync(path.join(__dirname, 'mymeta.json'), JSON.stringify(meta, null, 1));
  const show = { ...meta }; delete show.descriptionRaw; delete show.summaryRaw; delete show.description;
  console.log(JSON.stringify(show, null, 1));
  console.log('\n--- TITLE (' + (meta.title || '').length + '):', meta.title);
  console.log('--- SHORT (' + meta.summary.length + '):', meta.summary);
  console.log('--- LONG (' + meta.description.length + ' chars):\n' + meta.description);
  if (!meta.icon) console.log('\nplay-lh urls found:', findUrls(d).slice(0, 6).join('\n'));

  // Where does the app sit in this morning's SERPs?
  const raw = require('./final_raw.json');
  const hits = raw.serps.filter(s => s.results.includes(APP)).map(s => `${s.gl} ${s.q} #${s.results.indexOf(APP) + 1}/${s.results.length}`);
  console.log('\nIn 15 Sep SERPs:', hits.length ? hits.join(' | ') : 'none of 376');
})();
