const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const MUA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36';
function parseDs(html) { const out = {}; for (const b of html.match(/AF_initDataCallback[\s\S]*?<\/script/g) || []) { const k = b.match(/(ds:\d+)'/); const v = b.match(/data:([\s\S]*?), sideChannel: \{\}\}\);<\//); if (k && v) try { out[k[1]] = JSON.parse(v[1]); } catch {} } return out; }
async function page1(q, ua) {
  const html = await (await fetch(`https://play.google.com/store/search?q=${encodeURIComponent(q)}&c=apps&hl=en&gl=US`, { headers: { 'User-Agent': ua } })).text();
  const s = parseDs(html)['ds:4'][0][1][0][22];
  return { ids: s[0].map(x => x[0][0][0]), token: s[1] && s[1][3] ? s[1][3][1] : null };
}
async function more(token) {
  const req = JSON.stringify([[['qnKhOb', JSON.stringify([[null, [[10, [10, 50]], true, null, [96, 27, 4, 8, 57, 30, 110, 79, 11, 16, 49, 1, 3, 9, 12, 104, 55, 56, 51, 10, 34, 77]], null, token]]), null, 'generic']]]);
  const r = await fetch('https://play.google.com/_/PlayStoreUi/data/batchexecute?rpcids=qnKhOb&hl=en&gl=us&authuser&soc-app=121&soc-platform=1&soc-device=1', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'User-Agent': MUA }, body: 'f.req=' + encodeURIComponent(req) });
  const t = await r.text();
  console.log('RAW', r.status, t.length, t.slice(0, 700)); const outer = JSON.parse(t.slice(t.indexOf('[')));
  const data = JSON.parse(outer[0][2]); console.log('DATA top', JSON.stringify(data).slice(0, 400)); const fp = (n, p=[], acc=[]) => { if (acc.length > 6) return acc; if (Array.isArray(n)) n.forEach((c,i)=>fp(c,p.concat(i),acc)); else if (typeof n === 'string' && /^[a-z]\w*(\.\w+){2,}$/.test(n)) acc.push(p.join(',')+' '+n); return acc; }; console.log(fp(data).join('\n'));
  return { ids: data[0][0][0].map(x => x[0][0]), token: data[0][0][7] ? data[0][0][7][1] : null };
}
(async () => {
  const q = 'cloud backup';
  const a = await page1(q, UA), b = await page1(q, UA), m = await page1(q, MUA);
  console.log('desktop#1', a.ids.length, a.ids.slice(0, 12).join(' '));
  console.log('desktop#2', b.ids.length, b.ids.slice(0, 12).join(' '));
  console.log('mobile  ', m.ids.length, m.ids.slice(0, 12).join(' '));
  const prefix = Math.min(a.ids.length, m.ids.length); let same = 0; for (let i = 0; i < prefix; i++) if (a.ids[i] === m.ids[i]) same++;
  console.log('desktop vs mobile same-position', same, '/', prefix);
  if (m.token) { try { const p2 = await more(m.token); console.log('page2', p2.ids.length, 'token?', !!p2.token, p2.ids.slice(0, 8).join(' ')); const dup = p2.ids.filter(x => m.ids.includes(x)).length; console.log('dups with page1', dup); } catch (e) { console.log('page2 ERR', e.message); } }
})();