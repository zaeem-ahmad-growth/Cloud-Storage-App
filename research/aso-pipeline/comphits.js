const serps = require(__dirname + '/serps.json');
const comps = require(__dirname + '/competitors.json');
const hits = {};
for (const s of serps) s.results.forEach((r, i) => { const c = comps.find(c => c.appId === r.appId); if (c) (hits[c.label] = hits[c.label] || []).push(`${s.q} #${i + 1}/${s.results.length}`); });
for (const c of comps) console.log(c.label.padEnd(30), '|', (hits[c.label] || ['— not in any US result list']).join(' · '));