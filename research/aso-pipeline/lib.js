const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36';
const CACHE = path.join(__dirname, 'cache');
fs.mkdirSync(CACHE, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function cachedFetch(key, fn) {
  const f = path.join(CACHE, crypto.createHash('md5').update(key).digest('hex') + '.json');
  if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
  let lastErr;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const v = await fn();
      fs.writeFileSync(f, JSON.stringify(v));
      return v;
    } catch (e) { lastErr = e; await sleep(1500 * (attempt + 1)); }
  }
  throw lastErr;
}

function parseDs(html) {
  const out = {};
  for (const b of html.match(/AF_initDataCallback[\s\S]*?<\/script/g) || []) {
    const k = b.match(/(ds:\d+)'/);
    const v = b.match(/data:([\s\S]*?), sideChannel: \{\}\}\);<\//);
    if (k && v) try { out[k[1]] = JSON.parse(v[1]); } catch {}
  }
  return out;
}

const g = (o, p) => p.reduce((n, i) => (n == null ? undefined : n[i]), o);

function firstAppId(node) {
  const m = JSON.stringify(node).match(/details\?id=([\w.]+)/);
  return m ? m[1] : null;
}

async function fetchText(url, opts = {}) {
  const r = await fetch(url, { ...opts, headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9', ...(opts.headers || {}) } });
  if (r.status === 404) return { status: 404, text: '' };
  if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + url);
  return { status: r.status, text: await r.text() };
}

// Search: page 1 (HTML) + batchexecute pages until depth reached.
async function search(q, depth = 30, gl = 'US', tag = '') {
  return cachedFetch('search3|' + q + '|' + depth + (gl === 'US' ? '' : '|' + gl) + (tag ? '|' + tag : ''), async () => {
    const { text } = await fetchText(`https://play.google.com/store/search?q=${encodeURIComponent(q)}&c=apps&hl=en&gl=${gl}`);
    const ds4 = parseDs(text)['ds:4'];
    const sections = g(ds4, [0, 1]) || [];
    const results = [];
    let block = null, featured = null;
    // Sections render in order: an optional featured card ([23]) is the #1 result, then the list ([22]).
    for (const s of sections) {
      if (!s) continue;
      if (s[23] && !block) {
        const id = firstAppId(s[23]);
        if (id) { featured = id; results.push({ appId: id, featured: true }); }
      }
      if (s[22] && !block) {
        block = s[22];
        for (const x of block[0] || []) {
          const it = x[0];
          const id = g(it, [0, 0]);
          if (!id || results.some(r => r.appId === id)) continue;
          results.push({
            appId: id, title: g(it, [3]), developer: g(it, [14]), installsLabel: g(it, [15]),
            score: g(it, [4, 1]), genre: g(it, [5]), snippet: g(it, [13, 1]),
          });
        }
      }
    }
    if (!block && !featured) throw new Error('no results block for ' + q);
    let token = block ? g(block, [1, 3, 1]) : null;
    let pages = 0;
    while (results.length < depth && token && pages < 4) {
      pages++;
      const req = JSON.stringify([[['qnKhOb', JSON.stringify([[null, [[10, [10, 50]], true, null, [96, 27, 4, 8, 57, 30, 110, 79, 11, 16, 49, 1, 3, 9, 12, 104, 55, 56, 51, 10, 34, 77]], null, token]]), null, 'generic']]]);
      await sleep(400);
      const { text: t } = await fetchText('https://play.google.com/_/PlayStoreUi/data/batchexecute?rpcids=qnKhOb&hl=en&gl=' + gl.toLowerCase() + '&authuser&soc-app=121&soc-platform=1&soc-device=1', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: 'f.req=' + encodeURIComponent(req),
      });
      const outer = JSON.parse(t.slice(t.indexOf('[')));
      const data = JSON.parse(outer[0][2]);
      const items = g(data, [0, 0, 0]) || [];
      for (const it of items) {
        const id = g(it, [12, 0]) || firstAppId(it);
        if (id && !results.some(r => r.appId === id)) results.push({ appId: id, title: typeof g(it, [2]) === 'string' ? g(it, [2]) : null });
      }
      token = g(data, [0, 0, 7, 1]);
      if (!items.length) break;
    }
    return { q, fetchedAt: new Date().toISOString(), featured, paged: pages, results: results.slice(0, depth) };
  });
}

async function details(appId) {
  return cachedFetch('details2|' + appId, async () => {
    const { status, text } = await fetchText(`https://play.google.com/store/apps/details?id=${encodeURIComponent(appId)}&hl=en&gl=US`);
    if (status === 404) return { appId, missing: true };
    const d = parseDs(text)['ds:5'];
    if (!d) throw new Error('no ds:5 for ' + appId);
    const b = [1, 2];
    const q = p => g(d, b.concat(p));
    const updated = q([145, 0, 1, 0]);
    return {
      appId,
      title: q([0, 0]),
      summary: q([73, 0, 1]),
      description: q([72, 0, 1]),
      installsLabel: q([13, 0]), minInstalls: q([13, 1]), realInstalls: q([13, 2]),
      score: q([51, 0, 1]), ratings: q([51, 2, 1]), reviews: q([51, 3, 1]),
      developer: q([68, 0]), developerEmail: q([69, 1, 0]), genre: q([79, 0, 0, 0]),
      released: q([10, 0]), updated: updated ? new Date(updated * 1000).toISOString().slice(0, 10) : null,
      containsAds: !!q([48]), iap: q([19, 0]) || null,
      version: q([140, 0, 0, 0]) || null, recentChanges: q([144, 1, 1]) || null,
      contentRating: q([9, 0]) || null,
    };
  });
}

async function suggest(term, gl = 'US') {
  return cachedFetch('suggest|' + term + '|' + gl, async () => {
    const req = JSON.stringify([[['IJ4APc', JSON.stringify([[null, [term], [10], [2], 4]]), null, 'generic']]]);
    const { text: t } = await fetchText(`https://play.google.com/_/PlayStoreUi/data/batchexecute?rpcids=IJ4APc&hl=en&gl=${gl.toLowerCase()}&authuser&soc-app=121&soc-platform=1&soc-device=1`, {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: 'f.req=' + encodeURIComponent(req),
    });
    const outer = JSON.parse(t.slice(t.indexOf('[')));
    const data = outer[0][2] ? JSON.parse(outer[0][2]) : null;
    return (g(data, [0, 0]) || []).map(x => x[0]);
  });
}

async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) {
      const idx = i++;
      try { out[idx] = await fn(items[idx], idx); } catch (e) { out[idx] = { error: e.message, item: items[idx] }; }
    }
  }));
  return out;
}

module.exports = { search, details, suggest, pool, sleep, g };
