// Analysis: turn final_raw.json into a compact data.json for the playbook page.
const fs = require('fs');
const path = require('path');
const { search } = require('./lib');
const raw = require('./final_raw.json');
const compMeta = require('./competitors.json');

const decode = s => (s || '').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
const median = a => { const s = a.filter(x => x != null).sort((x, y) => x - y); if (!s.length) return null; const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const r2 = x => Math.round(x * 100) / 100;

// ---------- brands & niche categories ----------
const BRAND_DEVS = ['google llc', 'microsoft corporation', 'dropbox', 'flextech', 'mega networks', 'mega ltd', 'amazon mobile', 'samsung electronics',
  'xiaomi', 'whatsapp llc', 'verizon', 'vkl', 'pcloud', 'proton ag', 'synology', 'western digital', 'sync.com', 'idrive', 'owncloud', 'nord security',
  'piriform', 'avg mobile', 'avast software', 'nortonmobile', 'shenzhen wondershare', 'easeus', 'keepsafe', 'box, inc', 'apple', 'yandex', 'huawei',
  'internxt', 'tenorshare', 'degoo', 'motorola', 'oneplus', 'meta platforms', 'telegram', 'truecaller', 'transsion', 'oppo', 'realme', 'infinix', 'tecno'];
const isBrand = a => BRAND_DEVS.some(b => (a.developer || '').toLowerCase().startsWith(b));

const CAT_OVERRIDE = {
  'com.google.android.apps.photos': 'cloud', 'com.amazon.clouddrive.photos': 'cloud', 'com.synology.projectkailash': 'cloud',
  'com.google.android.apps.cloudconsole': 'other', 'com.safeincloud': 'other', 'com.catchingnow.clipsync': 'other', 'com.onnet.vsaas': 'other',
  'us.mitene': 'gallery', 'DHQ.FileManagerForAndroid': 'filemanager', 'org.swiftapps.swiftbackup': 'device', 'jrbeetroots.phonebackup': 'device',
  'com.google.android.apps.subscriptions.red': 'cloud', 'com.microsoft.skydrive': 'cloud', 'com.dropbox.android': 'cloud', 'mega.privacy.android.app': 'cloud',
  'com.infopriks.doc_vault': 'vault', 'work.opale.mydocs': 'other', 'com.onlyoffice.documents': 'other', 'com.kii.safe': 'vault',
};
function category(a) {
  if (CAT_OVERRIDE[a.appId]) return CAT_OVERRIDE[a.appId];
  const t = (a.title || '').toLowerCase();
  if (/recover|undelete|dumpster|restore deleted/.test(t)) return 'recovery';
  if (/clean|junk|booster|analy[sz]er|disk usage|partition/.test(t)) return 'cleaner';
  if (/self storage|storage unit|extra space|public storage|storage genie|smart entry|storage treasures|storage hunter|auction/.test(t)) return 'other';
  if (/(file manager|file explorer|explorer|files by google|x-plore|owlfiles|file commander)/.test(t) && !/cloud storage/.test(t)) return 'filemanager';
  if (/transfer|smart switch|copy my data|mobiletrans|clone|mutsapper/.test(t)) return 'transfer';
  if (/vault|hide|lock|privary|calculator/.test(t) && !/cloud|backup|drive/.test(t)) return 'vault';
  if (/game|gaming|camera|cam\b|stream|browser|vpn/.test(t)) return 'other';
  if (/cloud|drive|online storage|onedrive|terabox|sync|photos? backup|encrypted backup|storage & backup|storage: /.test(t)) return 'cloud';
  if (/backup|back up|restore/.test(t)) return /sms|contact|whatsapp|chat|message|call log|apps? backup|otg|phone backup/.test(t) ? 'device' : 'cloud';
  if (/gallery|album|photo/.test(t)) return 'gallery';
  return 'other';
}
const NICHE_W = { cloud: 1, device: 0.5, vault: 0.25, filemanager: 0.25, gallery: 0.25, transfer: 0.25, recovery: 0, cleaner: 0, other: 0 };
const TIER_W = { A: 1, B: 0.7, C: 0.3, D: 0 };

// ---------- apps ----------
const COMP_IDS = compMeta.map(c => c.appId);
const COMP_LABEL = Object.fromEntries(compMeta.map(c => [c.appId, c.label]));
const apps = {};
for (const a of raw.apps) {
  if (!a || a.error || a.missing) continue;
  apps[a.appId] = {
    id: a.appId, t: decode(a.title), dev: a.developer, i: a.realInstalls || a.minInstalls || 0, il: a.installsLabel,
    s: a.score ? r2(a.score) : null, n: a.ratings || null, rel: a.released || null, g: a.genre,
    b: isBrand(a) ? 1 : 0, c: category(a), comp: COMP_IDS.includes(a.appId) ? 1 : 0,
  };
}

// ---------- demand (autocomplete) ----------
const demandOf = {};
for (const d of raw.demand) {
  if (!d || d.error) continue;
  let score = 0;
  if (d.step != null) score = Math.round(100 * (d.steps - Math.min(d.step, d.steps - 1)) / d.steps * (1 - 0.06 * (d.pos || 0)));
  demandOf[d.gl + '|' + d.q] = { score, at: d.surfacedAt };
}

// ---------- keyword x market ----------
const kwMeta = {};
raw.keywords.forEach(k => { if (!kwMeta[k.q]) kwMeta[k.q] = k; });
const KW = Object.values(kwMeta);
const markets = {};
for (const gl of raw.markets) {
  const rows = [];
  for (const k of KW) {
    const s = raw.serps.find(x => x.gl === gl && x.q === k.q);
    if (!s || s.error) continue;
    const ids = s.results;
    const top = ids.slice(0, 10).map(id => apps[id]).filter(Boolean);
    const nonBrand = top.filter(a => !a.b).length;
    const niche = top.reduce((acc, a) => acc + NICHE_W[a.c], 0) / Math.max(1, top.length);
    const vol = median(top.map(a => a.i));
    const entryApp = top.filter(a => !a.b).sort((x, y) => x.i - y.i)[0] || top.slice().sort((x, y) => x.i - y.i)[0];
    const entry = entryApp ? entryApp.i : null;
    const compRanks = {};
    ids.forEach((id, i) => { if (COMP_IDS.includes(id)) compRanks[id] = i + 1; });
    const c10 = Object.values(compRanks).filter(r => r <= 10).length;
    const c30 = Object.values(compRanks).length;
    const dem = demandOf[gl + '|' + k.q] || { score: 0, at: null };
    const R = clamp(0.55 * TIER_W[k.tier] + 0.35 * niche + 0.10 * Math.min(1, c30 / 3));
    const volN = vol ? clamp((Math.log10(vol) - 3) / 7.2) : 0;
    const entryN = entry ? clamp(1 - (Math.log10(Math.max(entry, 1000)) - 3) / 5) : 0;
    const O = clamp(0.35 * nonBrand / 10 + 0.30 * dem.score / 100 + 0.15 * volN + 0.20 * entryN);
    const P = Math.round(100 * R * R * O);
    // unknown ids beyond top-10 (not detailed) still need a title for the strip tooltip
    const extraTitles = {};
    ids.forEach(id => { if (!apps[id] && s.titles && s.titles[id]) extraTitles[id] = decode(s.titles[id]); });
    rows.push({
      q: k.q, tier: k.tier, src: k.src, depth: ids.length, ids, featured: s.featured || null, extraTitles,
      nb: nonBrand, niche: r2(niche), vol, entry, entryId: entryApp ? entryApp.id : null,
      entryRank: entryApp ? ids.indexOf(entryApp.id) + 1 : null,
      demand: dem.score, demandAt: dem.at, comps: compRanks, c10, c30,
      R: r2(R), O: r2(O), P,
    });
  }
  rows.sort((a, b) => b.P - a.P);
  markets[gl] = rows;
}

// ---------- competitor profiles ----------
const words = s => (s.toLowerCase().match(/[a-z0-9']+/g) || []);
function phraseCount(text, phrase) { const re = new RegExp('\\b' + phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi'); return (text.match(re) || []).length; }
const profiles = compMeta.map(c => {
  const title = decode(c.title), summary = decode(c.summary), desc = decode(c.description);
  const wc = words(desc).length;
  const titleKw = KW.filter(k => k.tier !== 'D' && title.toLowerCase().includes(k.q)).map(k => k.q);
  const shortKw = KW.filter(k => k.tier !== 'D' && summary.toLowerCase().includes(k.q)).map(k => k.q);
  const cs = phraseCount(desc, 'cloud storage');
  const relDate = c.released ? new Date(c.released) : null;
  const ageMonths = relDate ? Math.max(1, Math.round((new Date('2026-09-15') - relDate) / (30.44 * 864e5))) : null;
  const perMarket = {};
  for (const gl of raw.markets) {
    const hits = markets[gl].filter(r => r.comps[c.appId]).map(r => ({ q: r.q, rank: r.comps[c.appId], R: r.R }));
    const vis = hits.reduce((acc, h) => acc + h.R * (31 - h.rank) / 30, 0);
    perMarket[gl] = { top10: hits.filter(h => h.rank <= 10).length, top30: hits.length, vis: r2(vis), best: hits.sort((a, b) => a.rank - b.rank).slice(0, 4) };
  }
  return {
    id: c.appId, label: c.label, title, titleLen: title.length, summary, summaryLen: summary.length,
    descLen: desc.length, csCount: cs, csDensity: wc ? r2(100 * cs * 2 / wc) : 0,
    installs: c.realInstalls, installsLabel: c.installsLabel, score: c.score ? r2(c.score) : null, ratings: c.ratings || null,
    released: c.released || null, ageMonths, perMonth: ageMonths ? Math.round(c.realInstalls / ageMonths) : null,
    updated: c.updated || null, ads: c.containsAds, iap: c.iap, genre: c.genre, developer: c.developer,
    titleKw, shortKw, perMarket,
  };
});

// ---------- 8 Sep evidence tracker (US) ----------
const EVID = [
  ['com.s3.drive.file.explorer.storage.cloud.manager', 'S3Drive', [['private cloud', 2], ['cloud space', 5], ['cloud storage', 6], ['file storage', 6], ['video backup', 6], ['cloud drive', 7], ['drive storage', 9]]],
  ['com.totaldrive.my.ts', 'Total Drive', [['data drive', 1], ['drive storage', 6], ['online storage', 9], ['cloud storage', 10]]],
  ['com.icedrive.app', 'Icedrive', [['safe storage', 4], ['secure cloud', 5], ['free cloud storage', 10]]],
  ['com.mobisystems.mobidrive', 'MobiDrive', [['cloud drive', 5], ['cloud space', 7], ['unlimited storage', 8]]],
  ['io.ente.photos', 'Ente Photos', [['photo backup', 4], ['gallery backup', 5], ['backup photos and videos', 5], ['cloud photos', 8]]],
  ['org.swiftapps.swiftbackup', 'Swift Backup', [['backup app', 2], ['data backup', 4], ['whatsapp backup', 6], ['phone backup', 10]]],
  ['com.cloud.backup.restore.data', 'Cloud Backup and Data Restore', [['data backup', 5], ['backup app', 7], ['cloud backup', 10]]],
  ['cloud.storage.backup.restore', 'Cloud Backup and Restore', [['cloud backup', 1]]],
  ['cloud.secure', 'Cloud Secure', [['secure cloud', 2]]],
  ['com.cloudspacehub.my', 'CloudSpace', [['cloud space', 4]]],
  ['jrbeetroots.phonebackup', 'Phone Backup (JR Beetroots)', [['phone backup', 3], ['contacts backup', 10]]],
  ['com.riteshsahu.SMSBackupRestore', 'SMS Backup & Restore', [['phone backup', 6], ['contacts backup', 7]]],
  ['com.ttxapps.autosync', 'Autosync', [['data backup', 6], ['backup app', 8]]],
  ['com.genie9.gcloudbackup', 'G Cloud Backup', [['cloud vault', 7]]],
  ['com.kratosle.unlim', 'UnLim', [['unlimited storage', 1]]],
  ['pl.solidexplorer2', 'Solid Explorer', [['cloud file manager', 2], ['file storage', 9]]],
  ['com.cxinventor.file.explorer', 'Cx File Explorer', [['file storage', 7], ['document storage', 8], ['cloud file manager', 8]]],
  ['com.simpler.backup', 'Easy Contacts Backup', [['contacts backup', 2]]],
  ['com.storage.androidcleaner', 'Cleanup: Phone Storage Cleaner', [['free up space', 2], ['storage cleaner', 5]]],
  ['app.quiet.storagecleaner', 'Storage Cleaner: Cleanup Phone', [['storage cleaner', 3], ['free up space', 5], ['free up phone storage', 3]]],
];
const evidence = [];
for (const [id, name, pairs] of EVID) for (const [q, was] of pairs) {
  const row = markets.US.find(r => r.q === q);
  const now = row ? (row.ids.indexOf(id) + 1 || null) : null;
  evidence.push({ id, name, q, was, now, depth: row ? row.depth : null, cat: apps[id] ? apps[id].c : null });
}

// ---------- 12-market probe (cached) ----------
(async () => {
  const PROBE_GL = ['US', 'IN', 'PK', 'ID', 'BR', 'PH', 'NG', 'GB', 'AE', 'BD', 'EG', 'MX'];
  const PROBE_KW = ['cloud storage', 'cloud backup', 'cloud storage space', 'backup and restore', 'cloud drive'];
  const probe = [];
  for (const gl of PROBE_GL) {
    const cells = [];
    for (const q of PROBE_KW) {
      const r = await search(q, 30, gl);
      const hits = [];
      r.results.forEach((x, i) => { if (COMP_IDS.includes(x.appId)) hits.push([x.appId, i + 1]); });
      cells.push({ q, depth: r.results.length, hits });
    }
    probe.push({ gl, cells });
  }

  // Apps below the detailed top-10 only carry a SERP title: classify them from it.
  const BRAND_TITLE = /\b(google|microsoft|onedrive|dropbox|terabox|mega\b|amazon|samsung|pcloud|proton|icloud|box\b|avast|avg|norton|ccleaner|wondershare|keepsafe)/i;
  for (const rows of Object.values(markets)) for (const r of rows) for (const [id, t] of Object.entries(r.extraTitles)) {
    if (!apps[id]) apps[id] = { id, t, dev: null, i: null, il: null, s: null, n: null, rel: null, g: null, b: BRAND_TITLE.test(t) ? 1 : 0, c: category({ appId: id, title: t }), comp: 0 };
  }

  // Compact: apps as an array, SERP ids as indices into it.
  const usedIds = new Set(COMP_IDS);
  Object.values(markets).forEach(rows => rows.forEach(r => { r.ids.forEach(id => usedIds.add(id)); }));
  evidence.forEach(e => usedIds.add(e.id));
  const appList = [...usedIds].filter(id => apps[id]).map(id => apps[id]);
  const idx = Object.fromEntries(appList.map((a, i) => [a.id, i]));
  const RAW_BY_ID = Object.fromEntries(raw.apps.map(a => [a.appId, a]));
  const appsOut = appList.map(a => [a.id, a.t, a.dev, a.i, a.s, a.n, (RAW_BY_ID[a.id] || {}).released || null, a.g, a.b, a.c, a.comp]);
  const marketsOut = {};
  for (const [gl, rows] of Object.entries(markets)) {
    marketsOut[gl] = rows.map(r => ({
      q: r.q, tier: r.tier, src: r.src, depth: r.depth, ids: r.ids.map(id => idx[id] ?? -1),
      nb: r.nb, niche: r.niche, vol: r.vol, entry: r.entry, entryIdx: r.entryId != null ? idx[r.entryId] : null, entryRank: r.entryRank,
      demand: r.demand, demandAt: r.demandAt, c10: r.c10, c30: r.c30, R: r.R, O: r.O, P: r.P,
    }));
  }
  const out = {
    collectedAt: raw.collectedAt, apps: appsOut, markets: marketsOut, profiles,
    evidence: evidence.map(e => ({ ...e, idx: idx[e.id] })),
    probe: probe.map(p => ({ gl: p.gl, cells: p.cells.map(c => ({ q: c.q, depth: c.depth, hits: c.hits.map(([id, rank]) => [idx[id], rank]) })) })),
    compIdx: COMP_IDS.map(id => idx[id]),
  };
  fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(out));
  console.log('data.json bytes', fs.statSync(path.join(__dirname, 'data.json')).size, 'apps', appList.length);

  // ---------- console digest ----------
  const catCount = {}; Object.values(apps).forEach(a => { catCount[a.c] = (catCount[a.c] || 0) + 1; });
  console.log('categories', JSON.stringify(catCount), 'brands', Object.values(apps).filter(a => a.b).length, '/', Object.keys(apps).length);
  console.log('OTHER:', Object.values(apps).filter(a => a.c === 'other').map(a => a.t).join(' | '));
  console.log('BRANDS:', [...new Set(Object.values(apps).filter(a => a.b).map(a => a.dev))].join(' | '));
  const fmt = n => n == null ? '—' : n >= 1e9 ? (n / 1e9).toFixed(2) + 'B' : n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? Math.round(n / 1e3) + 'K' : String(n);
  for (const gl of raw.markets) {
    console.log(`\n=== ${gl} top 30 by priority ===`);
    markets[gl].slice(0, 30).forEach((r, i) => console.log(`${String(i + 1).padStart(2)} P${String(r.P).padStart(3)} R${r.R.toFixed(2)} O${r.O.toFixed(2)} ${r.tier} ${r.q.padEnd(34)} nb${r.nb} niche${r.niche.toFixed(2)} dem${String(r.demand).padStart(3)} vol${fmt(r.vol).padStart(6)} entry${fmt(r.entry).padStart(6)}@#${r.entryRank} ${apps[r.entryId] ? apps[r.entryId].t.slice(0, 26) : ''} d${r.depth} comps10=${r.c10} comps30=${r.c30}`));
  }
  console.log('\n=== competitors ===');
  profiles.forEach(p => console.log(`${p.label.padEnd(28)} ${fmt(p.installs).padStart(5)} ${p.perMonth ? fmt(p.perMonth) + '/mo' : ''} age${p.ageMonths}m desc${p.descLen} cs×${p.csCount} ${p.csDensity}% | ` + raw.markets.map(gl => `${gl} t10=${p.perMarket[gl].top10} t30=${p.perMarket[gl].top30} vis=${p.perMarket[gl].vis}`).join(' · ') + ` | title kw: ${p.titleKw.join(', ')}`));
  console.log('\n=== evidence (US) ===');
  console.log(evidence.map(e => `${e.name}: ${e.q} #${e.was}→${e.now ? '#' + e.now : 'out/' + e.depth}`).join(' | '));
})();
