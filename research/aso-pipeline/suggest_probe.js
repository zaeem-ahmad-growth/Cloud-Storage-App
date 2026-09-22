const UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36';
async function suggest(term, gl = 'US') {
  const req = JSON.stringify([[['IJ4APc', JSON.stringify([[null, [term], [10], [2], 4]]), null, 'generic']]]);
  const r = await fetch(`https://play.google.com/_/PlayStoreUi/data/batchexecute?rpcids=IJ4APc&hl=en&gl=${gl.toLowerCase()}&authuser&soc-app=121&soc-platform=1&soc-device=1`, { method: 'POST', headers: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: 'f.req=' + encodeURIComponent(req) });
  const t = await r.text();
  try { const outer = JSON.parse(t.slice(t.indexOf('['))); const data = JSON.parse(outer[0][2]); return (data?.[0]?.[0] || []).map(x => x[0]); } catch (e) { return 'ERR ' + r.status + ' ' + t.slice(0, 200); }
}
(async () => {
  for (const q of ['cloud storage', 'cloud backup', 'cloud storage d', 'backup', 'cloud']) console.log(q, '=>', JSON.stringify(await suggest(q)));
})();