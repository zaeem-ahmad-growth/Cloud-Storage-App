// Stage 2: live SERPs (depth 30) for the keyword universe + details for every top-10 app and all competitors.
const fs = require('fs');
const path = require('path');
const { search, details, pool, sleep } = require('./lib');

// tier: A core cloud-storage/backup intent · B adjacent (fits the product) · C peripheral (other feature/intent) · D off-intent
// src: orig = in the 8 Sep report · comp = mined from the 11 competitors' metadata
const KEYWORDS = [
  ['cloud storage', 'A', 'orig'], ['cloud backup', 'A', 'orig'], ['cloud drive', 'A', 'orig'], ['cloud storage app', 'A', 'orig'],
  ['free cloud storage', 'A', 'orig'], ['cloud storage space', 'A', 'comp'], ['cloud space', 'A', 'orig'], ['online storage', 'A', 'orig'],
  ['cloud storage drive', 'A', 'comp'], ['cloud storage backup', 'A', 'comp'], ['backup and restore', 'A', 'comp'], ['data backup', 'A', 'orig'],
  ['phone backup', 'A', 'orig'], ['photo backup', 'A', 'orig'], ['backup photos', 'A', 'comp'], ['backup photos and videos', 'A', 'orig'],
  ['video backup', 'A', 'orig'], ['drive backup', 'A', 'comp'], ['file backup', 'A', 'comp'], ['secure cloud storage', 'A', 'orig'],
  ['private cloud storage', 'A', 'orig'], ['cloud storage free', 'A', 'comp'], ['1tb cloud storage', 'A', 'comp'], ['cloud photos', 'A', 'orig'],
  ['photo cloud', 'A', 'comp'],
  ['secure cloud', 'B', 'orig'], ['private cloud', 'B', 'orig'], ['cloud vault', 'B', 'orig'], ['file storage', 'B', 'orig'],
  ['drive storage', 'B', 'orig'], ['photo storage', 'B', 'orig'], ['video storage', 'B', 'comp'], ['secure photo storage', 'B', 'comp'],
  ['gallery backup', 'B', 'orig'], ['backup app', 'B', 'orig'], ['cloud sync', 'B', 'comp'], ['free storage', 'B', 'comp'],
  ['extra storage', 'B', 'comp'], ['safe storage', 'B', 'orig'], ['secure storage', 'B', 'comp'], ['document storage', 'B', 'orig'],
  ['data restore', 'B', 'comp'], ['storage space', 'B', 'comp'], ['unlimited storage', 'B', 'orig'],
  ['contacts backup', 'C', 'orig'], ['whatsapp backup', 'C', 'orig'], ['cloud file manager', 'C', 'orig'], ['free up space', 'C', 'orig'],
  ['free up phone storage', 'C', 'orig'], ['storage cleaner', 'C', 'orig'],
  ['my cloud', 'D', 'orig'], ['data drive', 'D', 'orig'],
];

(async () => {
  const t0 = Date.now();
  const serps = await pool(KEYWORDS, 3, async ([q, tier, src], i) => {
    const r = await search(q, 30);
    await sleep(250);
    process.stdout.write(`[${i + 1}/${KEYWORDS.length}] ${q}: ${r.results.length}\n`);
    return { q, tier, src, fetchedAt: r.fetchedAt, featured: r.featured, paged: r.paged, results: r.results };
  });
  const failed = serps.filter(s => s.error);
  fs.writeFileSync(path.join(__dirname, 'serps.json'), JSON.stringify(serps, null, 1));

  const comps = JSON.parse(fs.readFileSync(path.join(__dirname, 'competitors.json'), 'utf8')).map(c => c.appId);
  const ids = new Set(comps);
  for (const s of serps) if (!s.error) s.results.slice(0, 10).forEach(r => ids.add(r.appId));
  const list = [...ids];
  console.log(`\nSERPs done (${failed.length} failed). Fetching details for ${list.length} apps...`);
  const apps = await pool(list, 5, async (id, i) => { const d = await details(id); if (i % 25 === 0) process.stdout.write(`  details ${i}/${list.length}\n`); return d; });
  const appFail = apps.filter(a => a.error);
  fs.writeFileSync(path.join(__dirname, 'apps.json'), JSON.stringify(apps, null, 1));
  console.log(`Details done: ${apps.length} apps, ${appFail.length} failed, ${apps.filter(a => a.missing).length} missing. ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  if (failed.length) console.log('Failed SERPs:', failed.map(f => f.item[0] + ': ' + f.error).join(' | '));
  if (appFail.length) console.log('Failed apps:', appFail.map(f => f.item + ': ' + f.error).join(' | '));
  const depths = serps.filter(s => !s.error).map(s => s.results.length);
  console.log('Depth min/max:', Math.min(...depths), Math.max(...depths), 'shallow:', serps.filter(s => !s.error && s.results.length < 30).map(s => s.q + '=' + s.results.length).join(', '));
})();
