// Download the user's listing graphics and assemble the metadata-tab payload (live listing + recheck + 8 Sep draft text).
const fs = require('fs');
const path = require('path');
const meta = require('./mymeta.json');
const recheck = require('./myrecheck.json');
const OUT = path.join(__dirname, '..', 'mylisting');
fs.mkdirSync(OUT, { recursive: true });

const decode = s => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();

async function grab(url, name, size) {
  const r = await fetch(url + size, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0 Safari/537.36' } });
  if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + name);
  const type = r.headers.get('content-type') || '';
  const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : type.includes('gif') ? 'gif' : 'jpg';
  const file = `${name}.${ext}`;
  fs.writeFileSync(path.join(OUT, file), Buffer.from(await r.arrayBuffer()));
  return { file: 'mylisting/' + file, src: url, bytes: fs.statSync(path.join(OUT, file)).size, type };
}

(async () => {
  const assets = { icon: await grab(meta.icon, 'icon', '=s512'), feature: meta.featureGraphic ? await grab(meta.featureGraphic, 'feature-graphic', '=w1024') : null, screenshots: [] };
  for (let i = 0; i < meta.screenshots.length; i++) assets.screenshots.push(await grab(meta.screenshots[i], `screenshot-0${i + 1}`, '=h1400'));

  // 8 Sep draft package, from the saved original report
  const src = fs.readFileSync('C:/Users/HP/Downloads/Cloud Storage ASO Playbook_files/saved_resource.html', 'utf8');
  const longHtml = src.match(/<div class="longdesc">([\s\S]*?)<\/div>\s*<\/div>/)[1];
  const longText = [...longHtml.matchAll(/<(p|h4|li)>([\s\S]*?)<\/\1>/g)].map(m => (m[1] === 'li' ? '• ' : m[1] === 'h4' ? '## ' : '') + decode(m[2])).join('\n');
  const titles = [...src.matchAll(/<div class="titleopt">([^<]+)<\/div>/g)].map(m => decode(m[1]));
  const shortMain = decode(src.match(/Short description · 78\/80<\/strong><br>([^<]+)<\/div>/)[1]);
  const shortAlt = decode(src.match(/Alternate short description \(80\/80\): <em>“([^”]+)”<\/em>/)[1]);
  const ladder = [...src.matchAll(/<div class="ph">(Phase \d)<small>([^<]+)<\/small><\/div><div><div class="kws kw">([^<]+)<\/div><div class="ev">([^<]+)<\/div>/g)].map(m => ({ phase: m[1], range: decode(m[2]), keywords: decode(m[3]).split(' · '), proof: decode(m[4]) }));

  const payload = {
    appId: meta.appId, url: meta.url, fetchedAt: meta.fetchedAt, title: meta.title, summary: meta.summary, description: meta.description,
    installsLabel: meta.installsLabel, realInstalls: meta.realInstalls, score: meta.score || null, ratings: meta.ratings || null,
    developer: meta.developer, developerSite: meta.developerSite, privacyPolicy: meta.privacyPolicy, genre: meta.genre,
    containsAds: meta.containsAds, iap: meta.iap, contentRating: meta.contentRating, updated: 'Sep 8, 2026', released: null,
    video: meta.video, assets,
    recheck: { checkedAt: recheck.checkedAt, serps: recheck.serps.map(s => ({ q: s.q, depth: s.depth, rank: s.rank })), vaultDemand: recheck.vaultDemand },
    sep8: { titles, shortMain, shortAlt, longText, ladder },
  };
  fs.writeFileSync(path.join(__dirname, 'mymeta_payload.json'), JSON.stringify(payload));
  console.log('assets:', JSON.stringify(assets, null, 1));
  console.log('8 Sep titles:', titles.join(' | '));
  console.log('8 Sep shorts:', shortMain, '||', shortAlt);
  console.log('8 Sep ladder:', ladder.map(l => `${l.phase} ${l.range}: ${l.keywords.join(', ')}`).join(' || '));
  console.log('8 Sep long chars', longText.replace(/^## |^• /gm, '').length);
  // sentence reuse
  const sents = t => t.replace(/^## |^• /gm, '').split(/(?<=[.!?])\s+|\n+/).map(s => s.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '')).filter(s => s.split(' ').length >= 5);
  const a = sents(longText), b = new Set(sents(meta.description));
  const reused = a.filter(s => b.has(s)).length;
  console.log(`8 Sep long-description sentences reused verbatim in live listing: ${reused}/${a.length}`);
})();
