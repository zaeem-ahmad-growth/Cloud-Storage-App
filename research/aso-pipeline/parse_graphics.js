// Parse the competitor visual-memory index.html into structured JSON for the playbook's graphics tab.
const fs = require('fs');
const path = require('path');
const SRC = 'C:/Users/HP/Documents/Codex/2026-09-10/cre/outputs/cloud-competitor-memory/index.html';
const html = fs.readFileSync(SRC, 'utf8');

const decode = s => s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const strip = s => decode(s.replace(/<[^>]+>/g, '')).trim();
// Keep links, re-point in-page app anchors to the tab's ids.
const keepLinks = s => s.replace(/<a href="#([^"]+)">/g, '<a href="#g-$1">').replace(/<a href="(https?:[^"]+)"[^>]*>/g, '<a href="$1" target="_blank" rel="noopener">');

const out = {};
const ov = html.match(/<section id="overview">([\s\S]*?)<\/section>/)[1];
out.overview = [...ov.split('<table>')[0].matchAll(/<p>([\s\S]*?)<\/p>/g)].map(m => decode(m[1]));
out.captureNote = strip(ov.match(/<p class="meta">([\s\S]*?)<\/p>/)[1]);
out.table = [...ov.matchAll(/<tr><td><a href="#([^"]+)">([^<]+)<\/a><\/td><td>([^<]+)<\/td><td>([^<]+)<\/td><td>([^<]+)<\/td><td>([^<]+)<\/td><td>([^<]+)<\/td><\/tr>/g)]
  .map(m => ({ id: m[1], name: decode(m[2]), publisher: decode(m[3]), downloads: m[4], rating: m[5], portrait: +m[6], landscape: +m[7] }));
out.scope = [...ov.match(/<details>([\s\S]*?)<\/details>/)[1].matchAll(/<p>([\s\S]*?)<\/p>/g)].map(m => decode(m[1]));

out.apps = [...html.matchAll(/<section class="app" id="([^"]+)">([\s\S]*?)<\/section>/g)].map(([, id, body]) => {
  const h2 = strip(body.match(/<h2>([\s\S]*?)<\/h2>/)[1]);
  const meta = body.match(/<p class="meta">([\s\S]*?)<\/p>/)[1];
  const playUrl = decode(meta.match(/href="([^"]+)"/)[1]);
  const metaParts = strip(meta).split(' · ');
  const notes = Object.fromEntries([...body.matchAll(/<div><h3>([^<]+)<\/h3><p>([\s\S]*?)<\/p><\/div>/g)].map(m => [m[1], decode(m[2])]));
  const tags = strip(body.match(/<p class="tag">([\s\S]*?)<\/p>/)[1]).split(' · ');
  const noLandscape = /Landscape screenshots: not observed/.test(body);
  const assets = [...body.matchAll(/<figure class="asset" data-kind="([^"]+)" data-orient="([^"]+)"[\s\S]*?<img loading="lazy" src="([^"]+)" alt="([^"]*)"><\/a><figcaption><strong>([^<]+)<\/strong>(\d+) × (\d+) · [a-z]+<br>([\s\S]*?)<br><a href="([^"]+)"/g)]
    .map(m => ({ kind: m[1], orient: m[2], file: m[3], alt: decode(m[4]), label: m[5], w: +m[6], h: +m[7], caption: decode(m[8]), src: decode(m[9]) }));
  return { id, num: h2.split('.')[0], name: h2.replace(/^\d+\.\s*/, ''), title: metaParts[0], publisher: metaParts[1], downloads: metaParts[2].replace(' downloads', ''), playUrl, notes, tags, noLandscape, assets };
});

const guide = html.match(/<section id="guidance">([\s\S]*?)<\/section>/)[1];
const [patternsPart, restPart] = guide.split('<h2>Guidance for future graphics</h2>');
const [guidancePart, reqPart] = restPart.split('<h2>Play Store production requirements</h2>');
const pairs = s => [...s.matchAll(/<h3>([^<]+)<\/h3><p>([\s\S]*?)<\/p>/g)].map(m => ({ h: decode(m[1]), html: keepLinks(m[2]) }));
out.patterns = pairs(patternsPart);
out.guidance = pairs(guidancePart);
out.requirements = [...reqPart.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(m => keepLinks(m[1]));
out.sources = [...html.match(/<section class="sources">([\s\S]*?)<\/section>/)[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => keepLinks(m[1]));

fs.writeFileSync(path.join(__dirname, 'graphics.json'), JSON.stringify(out, null, 1));
const n = out.apps.reduce((s, a) => s + a.assets.length, 0);
console.log(`overview ${out.overview.length} · table ${out.table.length} · scope ${out.scope.length} · apps ${out.apps.length} · assets ${n} · patterns ${out.patterns.length} · guidance ${out.guidance.length} · reqs ${out.requirements.length} · sources ${out.sources.length}`);
out.apps.forEach(a => console.log(`  ${a.id}: ${a.name} | ${a.title} | ${a.publisher} | ${a.downloads} | notes ${Object.keys(a.notes).length} | tags ${a.tags.length} | assets ${a.assets.length} (${a.assets.filter(x => x.kind === 'screenshot').length} shots) | noLandscape ${a.noLandscape}`));
