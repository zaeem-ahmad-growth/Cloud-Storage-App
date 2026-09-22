// Final collection: keyword universe x 4 markets (SERP depth 30) + app details + autocomplete demand ladder.
const fs = require('fs');
const path = require('path');
const { search, details, suggest, pool, sleep } = require('./lib');

const MARKETS = ['US', 'PK', 'AE', 'NG'];
// [keyword, intent tier, source]  tier A core · B adjacent · C peripheral · D off-intent
// source: orig = 8 Sep report · comp = competitor metadata · ac = Play autocomplete · title = competitor title phrase
const K = [
  // original report
  ['cloud storage', 'A', 'orig'], ['cloud backup', 'A', 'orig'], ['cloud drive', 'A', 'orig'], ['cloud storage app', 'A', 'orig'],
  ['free cloud storage', 'A', 'orig'], ['cloud space', 'A', 'orig'], ['online storage', 'A', 'orig'], ['data backup', 'A', 'orig'],
  ['phone backup', 'A', 'orig'], ['photo backup', 'A', 'orig'], ['backup photos and videos', 'A', 'orig'], ['video backup', 'A', 'orig'],
  ['secure cloud storage', 'A', 'orig'], ['private cloud storage', 'A', 'orig'], ['cloud photos', 'A', 'orig'],
  ['secure cloud', 'B', 'orig'], ['private cloud', 'B', 'orig'], ['cloud vault', 'B', 'orig'], ['file storage', 'B', 'orig'],
  ['drive storage', 'B', 'orig'], ['photo storage', 'B', 'orig'], ['gallery backup', 'B', 'orig'], ['backup app', 'B', 'orig'],
  ['safe storage', 'B', 'orig'], ['document storage', 'B', 'orig'], ['unlimited storage', 'B', 'orig'],
  ['contacts backup', 'C', 'orig'], ['whatsapp backup', 'C', 'orig'], ['cloud file manager', 'C', 'orig'], ['free up space', 'C', 'orig'],
  ['free up phone storage', 'C', 'orig'], ['storage cleaner', 'C', 'orig'], ['my cloud', 'D', 'orig'], ['data drive', 'D', 'orig'],
  // competitor metadata
  ['cloud storage space', 'A', 'comp'], ['cloud storage drive', 'A', 'comp'], ['cloud storage backup', 'A', 'comp'], ['backup and restore', 'A', 'comp'],
  ['backup photos', 'A', 'comp'], ['drive backup', 'A', 'comp'], ['file backup', 'A', 'comp'], ['cloud storage free', 'A', 'comp'],
  ['1tb cloud storage', 'A', 'comp'], ['photo cloud', 'A', 'comp'], ['video storage', 'B', 'comp'], ['secure photo storage', 'B', 'comp'],
  ['cloud sync', 'B', 'comp'], ['free storage', 'B', 'comp'], ['extra storage', 'B', 'comp'], ['secure storage', 'B', 'comp'],
  ['data restore', 'B', 'comp'], ['storage space', 'B', 'comp'],
  // competitor title phrases
  ['cloud storage drive backup', 'A', 'title'], ['cloud storage backup drive', 'A', 'title'], ['cloud storage cloud drive', 'A', 'title'],
  ['cloud backup cloud storage', 'A', 'title'], ['cloud storage app drive backup', 'A', 'title'], ['100gb cloud storage', 'A', 'title'],
  ['drive backup app', 'A', 'title'], ['cloud storage sync', 'A', 'title'], ['secure cloud storage backup', 'A', 'title'],
  ['backup photos videos contacts', 'B', 'title'],
  // Play autocomplete (niche-relevant only)
  ['cloud storage for android', 'A', 'ac'], ['free cloud storage for android', 'A', 'ac'], ['cloud storage app free', 'A', 'ac'],
  ['cloud storage backup and restore', 'A', 'ac'], ['cloud storage and cloud drive', 'A', 'ac'], ['cloud storage drive app', 'A', 'ac'],
  ['cloud storage drive backup app', 'A', 'ac'], ['cloud storage data backup', 'A', 'ac'], ['cloud storage photos', 'A', 'ac'],
  ['cloud backup app', 'A', 'ac'], ['cloud backup and restore', 'A', 'ac'], ['cloud drive app', 'A', 'ac'], ['cloud drive storage', 'A', 'ac'],
  ['cloud photo storage', 'A', 'ac'], ['cloud photos backup', 'A', 'ac'], ['cloud space storage', 'A', 'ac'], ['online storage app', 'A', 'ac'],
  ['backup and restore app', 'A', 'ac'], ['phone backup and restore', 'A', 'ac'], ['data backup and restore', 'A', 'ac'],
  ['photo backup app', 'A', 'ac'], ['backup photos app', 'A', 'ac'], ['cloud storage service', 'A', 'ac'], ['cloud storage premium', 'A', 'ac'],
  ['file storage app', 'B', 'ac'], ['photo storage app', 'B', 'ac'], ['secure storage app', 'B', 'ac'], ['gallery backup app', 'B', 'ac'],
  ['video backup app', 'B', 'ac'], ['data backup app', 'B', 'ac'], ['cloud space free', 'B', 'ac'], ['storage space app', 'C', 'ac'],
];

const COMP_IDS = require('./competitors.json').map(c => c.appId);

// Autocomplete ladder: prefixes at word boundaries + first letters, ending with the full keyword.
function ladder(kw) {
  const w = kw.split(' ');
  const out = [];
  for (let i = 0; i < w.length; i++) {
    const done = w.slice(0, i).join(' ');
    const lead = done ? done + ' ' : '';
    if (i === 0) { out.push(w[0].slice(0, Math.min(3, w[0].length))); if (w[0].length > 3) out.push(w[0]); }
    else { out.push(lead + w[i][0]); if (w[i].length > 1) out.push(lead + w[i].slice(0, Math.ceil(w[i].length / 2))); if (w[i].length > 2) out.push(lead + w[i]); }
  }
  return [...new Set(out)];
}

(async () => {
  const t0 = Date.now();
  const log = m => { process.stdout.write(`[${((Date.now() - t0) / 1000).toFixed(0)}s] ${m}\n`); };
  const jobs = [];
  for (const gl of MARKETS) for (const [q] of K) jobs.push([gl, q]);
  let done = 0;
  const serps = await pool(jobs, 5, async ([gl, q]) => {
    const r = await search(q, 30, gl);
    if (++done % 40 === 0) log(`serps ${done}/${jobs.length}`);
    return { gl, q, featured: r.featured || null, results: r.results.map(x => x.appId), titles: Object.fromEntries(r.results.filter(x => x.title).map(x => [x.appId, x.title])) };
  });
  const serpErr = serps.filter(s => s.error);
  log(`serps done, ${serpErr.length} errors`);

  const ids = new Set(COMP_IDS);
  serps.filter(s => !s.error).forEach(s => s.results.slice(0, 10).forEach(id => ids.add(id)));
  const apps = await pool([...ids], 5, id => details(id));
  log(`details done: ${apps.length}, errors ${apps.filter(a => a.error).length}`);

  const sjobs = [];
  for (const gl of MARKETS) for (const [q] of K) sjobs.push([gl, q]);
  let sd = 0;
  const demand = await pool(sjobs, 6, async ([gl, q]) => {
    const steps = ladder(q);
    for (let i = 0; i < steps.length; i++) {
      const list = await suggest(steps[i], gl);
      const pos = list.indexOf(q);
      if (pos >= 0) { if (++sd % 60 === 0) log(`demand ${sd}/${sjobs.length}`); return { gl, q, surfacedAt: steps[i], step: i, steps: steps.length, pos }; }
    }
    // fully typed and still not suggested
    const full = await suggest(q, gl);
    const pos = full.indexOf(q);
    if (++sd % 60 === 0) log(`demand ${sd}/${sjobs.length}`);
    return { gl, q, surfacedAt: pos >= 0 ? q : null, step: pos >= 0 ? steps.length : null, steps: steps.length, pos: pos >= 0 ? pos : null };
  });
  log(`demand done, errors ${demand.filter(d => d.error).length}`);

  fs.writeFileSync(path.join(__dirname, 'final_raw.json'), JSON.stringify({
    collectedAt: new Date().toISOString(), markets: MARKETS,
    keywords: K.map(([q, tier, src]) => ({ q, tier, src })),
    serps, apps, demand,
  }));
  if (serpErr.length) log('SERP errors: ' + serpErr.map(e => e.item.join(':') + ' ' + e.error).join(' | '));
  log('saved final_raw.json');
})();
