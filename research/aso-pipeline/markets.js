// Probe which Play country catalogs the 11 competitors actually rank in.
const { search, pool } = require('./lib');
const comps = require('./competitors.json');
const COUNTRIES = ['US', 'IN', 'PK', 'ID', 'BR', 'PH', 'NG', 'GB', 'AE', 'BD', 'EG', 'MX'];
const KW = ['cloud storage', 'cloud backup', 'cloud storage space', 'backup and restore', 'cloud drive'];
(async () => {
  const jobs = [];
  for (const gl of COUNTRIES) for (const q of KW) jobs.push([gl, q]);
  const res = await pool(jobs, 4, async ([gl, q]) => ({ gl, q, ...(await search(q, 30, gl)) }));
  for (const gl of COUNTRIES) {
    const rows = res.filter(r => r.gl === gl);
    let compHits = 0, top10 = 0;
    const cells = rows.map(r => {
      if (r.error) return `${r.item[1]}: ERR`;
      const found = [];
      r.results.forEach((x, i) => { const c = comps.find(c => c.appId === x.appId); if (c) { compHits++; if (i < 10) top10++; found.push(`${c.label.split(' ')[0]}#${i + 1}`); } });
      return `${r.q} (${r.results.length}): ${found.join(',') || '-'}`;
    });
    console.log(`\n${gl}: competitor listings found=${compHits}, in top10=${top10}`);
    cells.forEach(c => console.log('   ' + c));
  }
})();
