const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const MUA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36';
function parseDs(html) { const out = {}; for (const b of html.match(/AF_initDataCallback[\s\S]*?<\/script/g) || []) { const k = b.match(/(ds:\d+)'/); const v = b.match(/data:([\s\S]*?), sideChannel: \{\}\}\);<\//); if (k && v) try { out[k[1]] = JSON.parse(v[1]); } catch {} } return out; }
async function run(label, url, ua) {
  const html = await (await fetch(url, { headers: { 'User-Agent': ua, 'Accept-Language': 'en-US,en;q=0.9' } })).text();
  const ds = parseDs(html)['ds:4']; if (!ds) return console.log(label, 'no ds:4');
  const secs = ds[0][1];
  const desc = secs.map((s, i) => { const keys = s ? Object.keys(s).filter(k => s[k] != null).join('/') : ''; const n22 = s && s[22] && s[22][0] ? s[22][0].length : 0; const tok = s && s[22] && s[22][1] ? JSON.stringify(s[22][1]) : ''; const f23 = s && s[23] ? 'FEATURED:' + (JSON.stringify(s[23]).match(/details\?id=([\w.]+)/) || [])[1] : ''; return `sec${i}[${keys}] items=${n22} tok=${tok} ${f23}`; });
  console.log(label, '|', desc.join(' || '));
}
(async () => {
  const q = encodeURIComponent('cloud backup');
  await run('desktop', `https://play.google.com/store/search?q=${q}&c=apps&hl=en&gl=US`, UA);
  await run('mobile ', `https://play.google.com/store/search?q=${q}&c=apps&hl=en&gl=US`, MUA);
  await run('no-c   ', `https://play.google.com/store/search?q=${q}&hl=en&gl=US`, UA);
  await run('phone backup', `https://play.google.com/store/search?q=${encodeURIComponent('phone backup')}&c=apps&hl=en&gl=US`, UA);
})();