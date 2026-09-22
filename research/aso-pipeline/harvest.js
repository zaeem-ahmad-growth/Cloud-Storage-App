// Harvest Play autocomplete suggestions from niche seeds (US + PK) to find real queries missing from the universe.
const { suggest, pool } = require('./lib');
const SEEDS = ['cloud storage', 'cloud backup', 'cloud drive', 'backup', 'photo backup', 'secure cloud', 'private cloud', 'storage space',
  'cloud storage a', 'cloud storage b', 'cloud storage d', 'cloud storage f', 'cloud storage p', 'cloud storage s', 'cloud backup a',
  'backup and restore', 'phone backup', 'data backup', 'online storage', 'free cloud', 'drive backup', 'cloud space', 'photo storage',
  'video backup', 'file storage', 'cloud st', 'cloud ba', 'backup ph', 'storage', 'gallery backup', 'cloud photo', 'secure storage'];
(async () => {
  const jobs = [];
  for (const gl of ['US', 'PK']) for (const s of SEEDS) jobs.push([gl, s]);
  const res = await pool(jobs, 5, async ([gl, s]) => ({ gl, s, list: await suggest(s, gl) }));
  const all = {};
  for (const r of res) {
    if (r.error) { console.log('ERR', r.item, r.error); continue; }
    for (const x of r.list) (all[x] = all[x] || new Set()).add(r.gl);
  }
  console.log(Object.entries(all).map(([k, v]) => `${k}${v.size === 1 ? '[' + [...v][0] + ']' : ''}`).sort().join(' | '));
})();
