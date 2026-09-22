const d = require(__dirname + '/data.json');
const raw = require(__dirname + '/final_raw.json');
const want = Object.values(d.apps).filter(a => /Ozone Team|Fazcon Apps|Brown Berry|Infinite Soft/.test(a.dev || ''));
for (const a of want) {
  const r = raw.apps.find(x => x.appId === a.id);
  console.log(`\n${a.t} | ${a.id} | ${a.dev} | ${r.installsLabel} | rel ${r.released} | upd ${r.updated} | ads ${r.containsAds} | iap ${r.iap}\n  short: ${r.summary}`);
  for (const gl of Object.keys(d.markets)) { const hits = d.markets[gl].map(k => [k.q, k.ids.indexOf(a.id) + 1]).filter(x => x[1] > 0).sort((x, y) => x[1] - y[1]); console.log(`  ${gl}: ${hits.map(h => h[0] + ' #' + h[1]).join(' · ') || '-'}`); }
}
// all apps also scanned: exact title match anywhere in serps titles
for (const s of raw.serps) for (const [id, t] of Object.entries(s.titles || {})) if (/^cloud storage - photo backup$/i.test(t)) { console.log('title hit', s.gl, s.q, id); break; }