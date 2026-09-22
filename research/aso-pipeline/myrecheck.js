// Re-check the user's app in fresh US SERPs (all 94 board keywords + vault phrases) and probe autocomplete for vault phrases.
const fs = require('fs');
const path = require('path');
const { search, suggest, pool } = require('./lib');
const APP = 'com.softwarealliance.cloudvault';
const data = require('./data.json');
const raw = fs.readFileSync(path.join(__dirname, 'mymeta_raw.html'), 'utf8');

(async () => {
  // Release / update text visible on the page
  const txt = raw.replace(/<[^>]+>/g, ' ');
  ['Updated on', 'Released on'].forEach(l => { const m = txt.match(new RegExp(l + '\\s*([A-Z][a-z]{2} \\d{1,2}, \\d{4})')); console.log(l + ':', m ? m[1] : 'not shown'); });
  const dates = [...new Set((raw.match(/"[A-Z][a-z]{2} \d{1,2}, 20\d\d"/g) || []))];
  console.log('date strings in page data:', dates.slice(0, 6).join(' '));

  const board = data.markets.US.map(r => r.q);
  const VAULT = ['cloud storage secure vault', 'secure vault', 'cloud storage vault', 'secure cloud vault', 'private vault', 'cloud vault app', 'secure storage vault', 'photo vault cloud', 'private cloud vault', 'online vault'];
  const all = [...new Set(board.concat(VAULT))];
  const res = await pool(all, 5, async q => ({ q, ...(await search(q, 30, 'US', 'recheck-0915b')) }));
  const out = res.map(r => r.error ? { q: r.item, error: r.error } : { q: r.q, depth: r.results.length, rank: r.results.findIndex(x => x.appId === APP) + 1 || null, top3: r.results.slice(0, 3).map(x => x.title || x.appId) });
  const found = out.filter(o => o.rank);
  console.log(`fresh US SERPs: ${out.length}, errors ${out.filter(o => o.error).length}, app found in ${found.length}`);
  found.forEach(o => console.log(`  ${o.q}: #${o.rank}/${o.depth}`));
  out.filter(o => VAULT.includes(o.q)).forEach(o => console.log(`  [vault] ${o.q}: depth ${o.depth} rank ${o.rank || '-'} | top: ${o.top3.join(' / ')}`));

  // Autocomplete demand for vault phrases (same ladder method as the board)
  const ladder = kw => { const w = kw.split(' '); const s = []; for (let i = 0; i < w.length; i++) { const lead = i ? w.slice(0, i).join(' ') + ' ' : ''; if (!i) { s.push(w[0].slice(0, 3)); if (w[0].length > 3) s.push(w[0]); } else { s.push(lead + w[i][0]); if (w[i].length > 1) s.push(lead + w[i].slice(0, Math.ceil(w[i].length / 2))); if (w[i].length > 2) s.push(lead + w[i]); } } return [...new Set(s)]; };
  const dem = await pool(VAULT, 5, async q => { const st = ladder(q); for (let i = 0; i < st.length; i++) { const l = await suggest(st[i], 'US'); const p = l.indexOf(q); if (p >= 0) return { q, score: Math.round(100 * (st.length - Math.min(i, st.length - 1)) / st.length * (1 - 0.06 * p)), at: st[i] }; } return { q, score: 0, at: null }; });
  dem.forEach(d => console.log(`  demand ${d.q}: ${d.score} ${d.at ? 'after "' + d.at + '"' : 'not suggested'}`));
  const sugg = await suggest('cloud storage s', 'US'); console.log('  suggest "cloud storage s":', sugg.join(' | '));
  const sugg2 = await suggest('secure v', 'US'); console.log('  suggest "secure v":', sugg2.join(' | '));
  const sugg3 = await suggest('cloud v', 'US'); console.log('  suggest "cloud v":', sugg3.join(' | '));

  fs.writeFileSync(path.join(__dirname, 'myrecheck.json'), JSON.stringify({ checkedAt: new Date().toISOString(), serps: out, vaultDemand: dem }, null, 1));
})();
