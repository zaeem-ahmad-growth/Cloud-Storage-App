const apps = require(__dirname + '/apps.json');
const serps = require(__dirname + '/serps.json');
const appear = {};
serps.forEach(s => s.results.slice(0, 10).forEach((r, i) => { (appear[r.appId] = appear[r.appId] || []).push(i + 1); }));
const fmt = n => n >= 1e9 ? (n / 1e9).toFixed(2) + 'B' : n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? Math.round(n / 1e3) + 'K' : String(n);
apps.sort((a, b) => (b.realInstalls || 0) - (a.realInstalls || 0)).forEach(a => {
  console.log([fmt(a.realInstalls || 0).padStart(6), (a.developer || '').slice(0, 26).padEnd(26), (a.title || '').slice(0, 44).padEnd(44), (a.genre || '').slice(0, 12).padEnd(12), 'top10x' + (appear[a.appId] || []).length, a.appId].join(' | '));
});