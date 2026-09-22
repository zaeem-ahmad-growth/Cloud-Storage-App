const { g } = require('./lib');
const UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36';
function parseDs(html) { const out = {}; for (const b of html.match(/AF_initDataCallback[\s\S]*?<\/script/g) || []) { const k = b.match(/(ds:\d+)'/); const v = b.match(/data:([\s\S]*?), sideChannel: \{\}\}\);<\//); if (k && v) try { out[k[1]] = JSON.parse(v[1]); } catch {} } return out; }
const ids = n => [...new Set((JSON.stringify(n).match(/details\?id=([\w.]+)/g) || []).map(s => s.slice(11)))];
function tokens(n, p = [], acc = []) { if (Array.isArray(n)) n.forEach((c, i) => tokens(c, p.concat(i), acc)); else if (typeof n === 'string' && n.length > 60 && /^[A-Za-z0-9_-]+$/.test(n)) acc.push(p.join(',') + ' len=' + n.length); return acc; }
(async () => {
  for (const q of ['cloud storage', 'cloud vault', 'storage space']) {
    for (const ua of [UA, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36']) {
      const html = await (await fetch(`https://play.google.com/store/search?q=${encodeURIComponent(q)}&c=apps&hl=en&gl=US`, { headers: { 'User-Agent': ua, 'Accept-Language': 'en-US,en;q=0.9' } })).text();
      const ds = parseDs(html);
      const ds4 = ds['ds:4'];
      console.log(`\n== ${q} | ${ua.includes('Android') ? 'mobile' : 'desktop'} | ds keys ${Object.keys(ds).join(',')} | html ${html.length}`);
      if (!ds4) { console.log('  no ds:4'); continue; }
      const secs = g(ds4, [0, 1]) || [];
      secs.forEach((s, i) => {
        const keys = s ? Object.keys(s).filter(k => s[k] != null) : [];
        console.log(`  sec${i} keys=[${keys}] ids=${ids(s).length} first=${ids(s).slice(0, 3).join(' ')}`);
      });
      console.log('  token-like strings:', tokens(ds4).slice(0, 5).join(' | '));
      console.log('  all ids in ds4:', ids(ds4).length);
    }
  }
})();
