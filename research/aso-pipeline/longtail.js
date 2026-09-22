// Long-tail phrases lifted from the competitors' own titles / short descriptions, checked in US + the markets where they surfaced.
const fs = require('fs');
const path = require('path');
const { search, pool } = require('./lib');
const comps = require('./competitors.json');
const LONG = [
  'cloud drive app', 'cloud storage drive backup', 'cloud storage backup drive', 'cloud storage cloud drive', 'cloud backup cloud storage',
  'cloud storage sync', 'cloud storage data backup', 'cloud storage app drive backup', '100gb cloud storage', 'cloud storage for photos',
  'backup photos videos contacts', 'secure cloud storage backup', 'photo storage app', 'cloud storage and backup', 'drive backup app',
  'free cloud storage app', 'online cloud storage', 'data storage app', 'contacts storage', 'restore data',
];
const MARKETS = ['US', 'PK', 'NG', 'AE'];
(async () => {
  const jobs = [];
  for (const gl of MARKETS) for (const q of LONG) jobs.push([gl, q]);
  const res = await pool(jobs, 4, async ([gl, q]) => ({ gl, q, ...(await search(q, 30, gl)) }));
  fs.writeFileSync(path.join(__dirname, 'longtail.json'), JSON.stringify(res, null, 1));
  for (const q of LONG) {
    const cells = MARKETS.map(gl => {
      const r = res.find(x => x.gl === gl && x.q === q);
      if (!r || r.error) return `${gl}:ERR`;
      const f = [];
      r.results.forEach((x, i) => { const c = comps.find(c => c.appId === x.appId); if (c) f.push(`${c.label}#${i + 1}`); });
      return `${gl}(${r.results.length}) ${f.join(', ') || '-'}`;
    });
    console.log(q.padEnd(32), '|', cells.join(' | '));
  }
})();
