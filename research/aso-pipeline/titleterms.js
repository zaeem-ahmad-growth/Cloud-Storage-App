// Competitor presence + demand for the title's own phrases (no own-app ranks). Uses today's cached US results.
const fs = require('fs');
const path = require('path');
const { search } = require('./lib');
const comps = require('./competitors.json');
const recheck = require('./myrecheck.json');
const apps = require('./final_raw.json').apps;
const BRAND = ['google llc', 'microsoft corporation', 'dropbox', 'flextech', 'mega networks', 'amazon mobile', 'samsung electronics', 'pcloud', 'proton ag', 'keepsafe', 'avast', 'avg mobile', 'norton'];
const byId = Object.fromEntries(apps.filter(a => a && a.appId).map(a => [a.appId, a]));
const TERMS = ['secure vault', 'cloud vault app', 'private vault', 'cloud storage secure vault'];
(async () => {
  const out = [];
  for (const q of TERMS) {
    const r = await search(q, 30, 'US', 'recheck-0915b');
    const res = r.results.filter(x => x.appId !== 'com.softwarealliance.cloudvault');
    const compRanks = comps.map(c => ({ label: c.label, rank: r.results.findIndex(x => x.appId === c.appId) + 1 })).filter(x => x.rank > 0);
    const top10 = r.results.slice(0, 10).filter(x => x.appId !== 'com.softwarealliance.cloudvault');
    const brandTop10 = top10.filter(x => { const a = byId[x.appId]; const dev = ((a && a.developer) || x.developer || '').toLowerCase(); return BRAND.some(b => dev.startsWith(b)); }).length;
    const d = recheck.vaultDemand.find(v => v.q === q) || { score: 0, at: null };
    out.push({ q, depth: r.results.length, compRanks, brandTop10, top3: res.slice(0, 3).map(x => x.title || x.appId), demand: d.score, demandAt: d.at });
  }
  fs.writeFileSync(path.join(__dirname, 'titleterms.json'), JSON.stringify(out, null, 1));
  out.forEach(o => console.log(`${o.q}: depth ${o.depth} · competitors ${o.compRanks.length ? o.compRanks.map(c => c.label + ' #' + c.rank).join(', ') : 'none'} · brands top10 ${o.brandTop10} · demand ${o.demand} ${o.demandAt || ''} · top3 ${o.top3.join(' / ')}`));
})();
