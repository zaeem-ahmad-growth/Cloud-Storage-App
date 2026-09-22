const fs = require('fs');
const path = require('path');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';

function parseDs(html) {
  const out = {};
  const blocks = html.match(/AF_initDataCallback[\s\S]*?<\/script/g) || [];
  for (const b of blocks) {
    const k = b.match(/(ds:\d+)'/);
    const v = b.match(/data:([\s\S]*?), sideChannel: \{\}\}\);<\//);
    if (k && v) { try { out[k[1]] = JSON.parse(v[1]); } catch (e) { out[k[1]] = 'PARSE_ERR'; } }
  }
  return out;
}

// print paths to leaves matching a predicate
function findPaths(node, pred, p = [], acc = []) {
  if (acc.length > 40) return acc;
  if (Array.isArray(node)) node.forEach((c, i) => findPaths(c, pred, p.concat(i), acc));
  else if (pred(node)) acc.push([p.join(','), typeof node === 'string' ? node.slice(0, 80) : node]);
  return acc;
}

(async () => {
  const dir = __dirname;
  const s = await (await fetch('https://play.google.com/store/search?q=cloud%20storage&c=apps&hl=en&gl=US', { headers: { 'User-Agent': UA } })).text();
  const ds = parseDs(s);
  console.log('SEARCH keys:', Object.keys(ds).map(k => k + ':' + JSON.stringify(ds[k]).length).join(' '));
  const big = Object.keys(ds).sort((a, b) => JSON.stringify(ds[b]).length - JSON.stringify(ds[a]).length)[0];
  console.log('largest', big);
  const ids = findPaths(ds[big], x => typeof x === 'string' && /^[a-z][\w]*(\.[\w]+)+$/i.test(x) && x.split('.').length >= 2 && !x.includes('http'));
  ids.slice(0, 40).forEach(r => console.log('  ', r[0], r[1]));
  fs.writeFileSync(path.join(dir, 'search_sample.json'), JSON.stringify(ds, null, 1));

  const d = await (await fetch('https://play.google.com/store/apps/details?id=com.cloudgate.cloudstorage&hl=en&gl=US', { headers: { 'User-Agent': UA } })).text();
  const dd = parseDs(d);
  console.log('DETAILS keys:', Object.keys(dd).map(k => k + ':' + JSON.stringify(dd[k]).length).join(' '));
  fs.writeFileSync(path.join(dir, 'details_sample.json'), JSON.stringify(dd, null, 1));
  const ds5 = dd['ds:5'];
  const probe = { title: [1,2,0,0], installs: [1,2,13], score: [1,2,51,0,1], ratings: [1,2,51,2,1], dev: [1,2,68,0], genre: [1,2,79,0,0,0], released: [1,2,10,0], updated: [1,2,145,0,1,0], ads: [1,2,48], iap: [1,2,19,0], summary: [1,2,73,0,1], descLen: [1,2,72,0,1] };
  for (const [k, p] of Object.entries(probe)) {
    let n = ds5; for (const i of p) n = n == null ? n : n[i];
    console.log('  ', k, JSON.stringify(k === 'descLen' && typeof n === 'string' ? n.length : n)?.slice(0, 160));
  }
})().catch(e => { console.error(e); process.exit(1); });
