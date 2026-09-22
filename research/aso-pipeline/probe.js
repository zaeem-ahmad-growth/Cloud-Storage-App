const ds = require(__dirname + '/search_sample.json')['ds:4'];
const sec = ds[0][1];
console.log('sections in ds4[0][1]:', sec.length);
sec.forEach((s, i) => { const r = s && s[22]; console.log(' sec', i, 'has22', !!r, r ? 'items=' + (r[0] ? r[0].length : '?') : JSON.stringify(s).slice(0, 120)); });
const r = sec[0][22];
console.log('r keys len', r.length, 'r[1]=', JSON.stringify(r[1]).slice(0, 300));
const it = r[0][9][0];
it.forEach((f, i) => { const s = JSON.stringify(f); if (s && s !== 'null') console.log('  item9[' + i + ']', s.slice(0, 140)); });