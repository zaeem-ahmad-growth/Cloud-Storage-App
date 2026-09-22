const raw = require(__dirname + '/final_raw.json');
const d = require(__dirname + '/data.json');
const tiny = Object.values(d.apps).filter(a => a.i < 5000 && !a.comp);
const rawById = Object.fromEntries(raw.apps.map(a => [a.appId, a]));
tiny.forEach(a => { const r = rawById[a.id] || {}; let top = 0; for (const gl of Object.keys(d.markets)) d.markets[gl].forEach(k => { const p = k.ids.indexOf(a.id); if (p >= 0 && p < 10) top++; }); console.log(`${a.t.slice(0,40).padEnd(40)} | label=${r.installsLabel} min=${r.minInstalls} real=${r.realInstalls} | rel=${r.released} | dev=${a.dev} | cat=${a.c} | top10 placements=${top}`); });
const ev = d.evidence; const within1 = ev.filter(e => e.now && Math.abs(e.now - e.was) <= 1).length; const exact = ev.filter(e => e.now === e.was).length; const out = ev.filter(e => !e.now).length;
console.log(`evidence pairs ${ev.length}: exact ${exact}, within±1 ${within1}, dropped out ${out}`);