// Regenerates the Markdown docs that let anyone (or any Claude session) read this site without running it:
//   docs/tabs/<tab>.md       the full visible content of each tab, as it renders by default
//   docs/code-map.md         for every section: its id, where its markup and code live, and which data it reads
//   docs/data-dictionary.md  every field in assets/data.js, with types, sizes and examples
// Run after changing any tab, assets/app.js or assets/data.js:   node tools/export-docs.js
// Needs Node 18+ and Microsoft Edge or Google Chrome (set BROWSER=<path> if it is not found).
const fs = require('fs');
const path = require('path');
const os = require('os');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const rel = p => path.relative(ROOT, p).split(path.sep).join('/');
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8').replace(/\r\n/g, '\n');
const write = (p, s) => { fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true }); fs.writeFileSync(path.join(ROOT, p), s); };
const today = new Date().toISOString().slice(0, 10);

// ---------- site facts ----------
const nav = read('assets/nav.js');
const TABS = [...nav.matchAll(/\{ slug: '([^']+)', label: '([^']+)' \}/g)].map(m => ({ slug: m[1], label: m[2] }));
const origin = git(['remote', 'get-url', 'origin']).trim();
const repoName = (origin.match(/github\.com[/:]([^/]+)\/([^/.]+)/) || []).slice(1);
const SITE = repoName.length ? `https://${repoName[0].toLowerCase()}.github.io/${repoName[1]}/` : '';
const hasApp = fs.existsSync(path.join(ROOT, 'assets/app.js'));
const APP = hasApp ? read('assets/app.js') : '';
function git(args) { try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }); } catch (e) { return ''; } }

// ---------- browser ----------
function findBrowser() {
  if (process.env.BROWSER && fs.existsSync(process.env.BROWSER)) return process.env.BROWSER;
  const c = [
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe', path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge',
  ];
  const hit = c.find(p => p && fs.existsSync(p));
  if (!hit) { console.error('No Edge or Chrome found. Set BROWSER to its path.'); process.exit(1); }
  return hit;
}
const BROWSER = findBrowser();
const PROFILE = path.join(os.tmpdir(), 'export-docs-profile');
function renderMarkdown(pageFile) {
  const html = fs.readFileSync(pageFile, 'utf8');
  const probe = path.join(path.dirname(pageFile), '__md.html');
  const toolUrl = path.relative(path.dirname(pageFile), path.join(ROOT, 'tools/dom-to-md.js')).split(path.sep).join('/');
  fs.writeFileSync(probe, html.replace(/<\/body>/i, `<script src="${toolUrl}"></script>\n</body>`));
  try {
    const dom = execFileSync(BROWSER, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', `--user-data-dir=${PROFILE}`,
      '--virtual-time-budget=10000', '--dump-dom', 'file:///' + probe.split(path.sep).join('/')], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
    const m = dom.match(/<pre id="__md"[^>]*>([\s\S]*?)<\/pre>/);
    if (!m) throw new Error('no Markdown produced for ' + rel(pageFile));
    return m[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
  } finally { fs.rmSync(probe, { force: true }); }
}
// Links and images are relative to the tab page; make them relative to docs/tabs/.
function relink(md, slug) {
  return md.replace(/(!?\[[^\]]*\]\()([^)\s]+)\)/g, (all, pre, url) => {
    if (/^([a-z]+:|#|\/)/i.test(url)) return all;
    const target = path.posix.normalize(path.posix.join('tabs', slug, url));
    return pre + path.posix.relative('docs/tabs', target) + ')';
  });
}

// ---------- 1. tab snapshots ----------
const pages = TABS.map(t => ({ ...t, file: path.join(ROOT, 'tabs', t.slug, 'index.html') })).filter(t => fs.existsSync(t.file));
for (const t of pages) {
  const html = fs.readFileSync(t.file, 'utf8');
  const usesApp = /assets\/app\.js/.test(html);
  const md = relink(renderMarkdown(t.file), t.slug);
  write(`docs/tabs/${t.slug}.md`, `# ${t.label}

> **Generated file: do not edit by hand.** Full visible text of the tab as it renders by default, produced by \`node tools/export-docs.js\` on ${today}.
> Live page: ${SITE ? SITE + 'tabs/' + t.slug + '/' : 'tabs/' + t.slug + '/'} · Source: [tabs/${t.slug}/index.html](../../tabs/${t.slug}/index.html)${usesApp ? ' · Drawn by [assets/app.js](../../assets/app.js) from [assets/data.js](../../assets/data.js)' : ''} · Where each section comes from: [code map](../code-map.md#${t.slug})
> Controls on the page (market pickers, version switches, filters, "show more") change the view; this snapshot shows their default state. The data behind every state is in [assets/data.js](../../assets/data.js), described in the [data dictionary](../data-dictionary.md).

${md}`);
  console.log('docs/tabs/' + t.slug + '.md', (md.length / 1024).toFixed(0) + ' KB');
}

// ---------- 2. code map ----------
const appLines = APP.split('\n');
const fnAt = []; // [start line, name]
appLines.forEach((l, i) => { const m = l.match(/^\s{2}(?:async )?function (\w+)\(/) || l.match(/^\s{2}const (\w+) = (?:\([^)]*\)|\w+) =>/); if (m) fnAt.push([i, m[1]]); });
const enclosing = i => { let f = null; for (const x of fnAt) if (x[0] <= i) f = x; return f; };
const fnEnd = start => { const next = fnAt.find(x => x[0] > start); return next ? next[0] - 1 : appLines.length - 1; };
// Aliases such as `const D = PAYLOAD.data, L = PAYLOAD.listing` or `const US = D.board.US`.
const alias = { PAYLOAD: '', NEWMETA: 'NEWMETA' };
for (let pass = 0; pass < 3; pass++) {
  for (const m of APP.matchAll(/\b([A-Z]\w*) = (PAYLOAD|NEWMETA|[A-Z][A-Z0-9_]*)((?:\.\w+)+)(?=[\s,;)])/g)) {
    if (m[1] in alias || !(m[2] in alias)) continue;
    alias[m[1]] = (alias[m[2]] ? alias[m[2]] + '.' : '') + m[3].slice(1);
  }
  // Derived lists such as `PROF = D.profiles.filter(...)` or `A = D.apps.map(...)` read the same data.
  for (const m of APP.matchAll(/\b([A-Z]\w*) = (PAYLOAD|NEWMETA|[A-Z][A-Z0-9_]*)((?:\.[a-zA-Z_]\w*)+?)\.(?:filter|find|map|slice|sort|concat|flatMap)\(/g)) {
    if (m[1] in alias || !(m[2] in alias)) continue;
    alias[m[1]] = (alias[m[2]] ? alias[m[2]] + '.' : '') + m[3].slice(1);
  }
}
function dataUsed(body) {
  const found = new Set();
  for (const [a, p] of Object.entries(alias)) {
    for (const m of body.matchAll(new RegExp('(?<![\\w.$\'"`])' + a + '(?![\\w$\'"`])((?:\\.[a-zA-Z_]\\w*)*)', 'g'))) {
      const full = ((p ? p : '') + m[1]).replace(/\.(map|filter|find|findIndex|slice|some|every|reduce|forEach|length|includes|indexOf|join|sort|concat|flatMap|keys|values|entries|toFixed|replace|split|trim|toLowerCase|test|match)$/, '').replace(/^\./, '');
      if (full) found.add(full.split('.').slice(0, 3).join('.'));
    }
  }
  const all = [...found];
  return all.filter(x => !all.some(y => y !== x && y.startsWith(x + '.'))).sort();
}
function sectionsOf(html) {
  const out = [];
  const jump = {};
  for (const m of html.matchAll(/<a href="#([\w-]+)"[^>]*>([^<]+)<\/a>/g)) if (!jump[m[1]]) jump[m[1]] = m[2].replace(/&amp;/g, '&');
  for (const m of html.matchAll(/<(section|header|footer|main)\b[^>]*\bid="([\w-]+)"[^>]*>/g)) {
    const tag = m[1], id = m[2], start = m.index;
    const end = html.indexOf(`</${tag}>`, start);
    const chunk = html.slice(start, end < 0 ? start + 4000 : end);
    const h = chunk.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/);
    const heading = h ? h[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim() : '';
    const ids = [...chunk.matchAll(/\bid="([\w-]+)"/g)].map(x => x[1]);
    const line = html.slice(0, start).split('\n').length;
    out.push({ id, tag, heading, jump: jump[id] || '', ids, line });
  }
  return out;
}
let map = `# Code map

> **Generated file: do not edit by hand.** Produced by \`node tools/export-docs.js\` on ${today}.
> For every section of every tab: the anchor id, where its markup is (file and line), which function in [assets/app.js](../assets/app.js) fills it, and which fields of [assets/data.js](../assets/data.js) that function reads (paths as in the [data dictionary](data-dictionary.md)). To change a section's wording, edit the markup for static text or the named function for text built from data; to change numbers, edit the data.

`;
for (const t of pages) {
  const html = fs.readFileSync(t.file, 'utf8').replace(/\r\n/g, '\n');
  const usesApp = /assets\/app\.js/.test(html);
  const page = (html.match(/<body data-page="([\w-]+)"/) || [])[1] || '';
  map += `<a id="${t.slug}"></a>\n\n## ${t.label}\n\nMarkup: [tabs/${t.slug}/index.html](../tabs/${t.slug}/index.html) · \`<body data-page="${page}">\` · ${usesApp ? 'content drawn by assets/app.js' : 'self-contained page (static HTML plus the inline script at the bottom of the file)'} · [text snapshot](tabs/${t.slug}.md)\n\n`;
  map += '| Section | Menu label | Heading in the markup | Markup line | Filled by (assets/app.js) | Data read |\n| --- | --- | --- | --- | --- | --- |\n';
  for (const s of sectionsOf(html)) {
    const fns = new Map();
    if (usesApp) for (const id of s.ids) {
      appLines.forEach((l, i) => {
        if (l.includes(`getElementById('${id}')`) || l.includes(`on('${id}'`) || l.includes(`'#${id}`)) {
          const f = enclosing(i);
          if (f) fns.set(f[1], f[0]);
        }
      });
    }
    const fnCells = [...fns].map(([n, s0]) => `\`${n}()\` [L${s0 + 1}-${fnEnd(s0) + 1}](../assets/app.js#L${s0 + 1})`).join('<br>') || (usesApp ? 'static markup' : 'static markup / inline script');
    const data = usesApp ? [...new Set([...fns].flatMap(([, s0]) => dataUsed(appLines.slice(s0, fnEnd(s0) + 1).join('\n'))))].slice(0, 14).map(p => '`' + p + '`').join(', ') : '';
    map += `| [#${s.id}](tabs/${t.slug}.md#${s.id}) | ${s.jump.replace(/\|/g, '\\|')} | ${s.heading.replace(/\|/g, '\\|') || '(built by script)'} | [L${s.line}](../tabs/${t.slug}/index.html#L${s.line}) | ${fnCells} | ${data} |\n`;
  }
  map += '\n';
}
if (hasApp) {
  map += `## All functions in assets/app.js\n\n| Function | Lines | Data read |\n| --- | --- | --- |\n`;
  for (const [s0, n] of fnAt) map += `| \`${n}\` | [L${s0 + 1}-${fnEnd(s0) + 1}](../assets/app.js#L${s0 + 1}) | ${dataUsed(appLines.slice(s0, fnEnd(s0) + 1).join('\n')).slice(0, 12).map(p => '`' + p + '`').join(', ')} |\n`;
}
write('docs/code-map.md', map);
console.log('docs/code-map.md');

// ---------- 3. data dictionary ----------
if (fs.existsSync(path.join(ROOT, 'assets/data.js'))) {
  const ctx = {};
  vm.runInNewContext(read('assets/data.js') + '\n;this.__D = { PAYLOAD: typeof PAYLOAD !== "undefined" ? PAYLOAD : undefined, NEWMETA: typeof NEWMETA !== "undefined" ? NEWMETA : undefined };', ctx);
  // Tuple labels from app.js, e.g. `D.apps.map(a => ({ id: a[0], t: a[1] }))`.
  const tuples = {};
  for (const m of APP.matchAll(/\b(\w+(?:\.\w+)*)\.map\((\w) => \(\{ ([^}]*)\}\)\)/g)) {
    const [head, ...rest] = m[1].split('.');
    if (!(head in alias)) continue;
    const p = [alias[head], ...rest].filter(Boolean).join('.');
    const labels = {};
    for (const x of m[3].matchAll(new RegExp('(\\w+): ' + m[2] + '\\[(\\d+)\\]', 'g'))) labels[x[2]] = x[1];
    if (Object.keys(labels).length) tuples[p] = labels;
  }
  const ex = v => { const s = typeof v === 'string' ? JSON.stringify(v.length > 70 ? v.slice(0, 70) + '…' : v) : JSON.stringify(v); return '`' + s.replace(/`/g, "'").replace(/\|/g, '\\|') + '`'; };
  const kind = v => v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v;
  const lines = [];
  const isMap = o => { const k = Object.keys(o); if (k.length < 4) return false; const shapes = new Set(Object.values(o).map(v => kind(v) + (v && typeof v === 'object' ? ':' + Object.keys(v).slice(0, 5).join(',') : ''))); return shapes.size === 1 && k.every(x => /^[A-Z]{2}$|^\d+$|^[a-z0-9]+(\.[a-z0-9_]+){2,}$|^ds:/.test(x)); };
  function describe(p, v, depth, full) {
    const ind = '  '.repeat(depth);
    const k = kind(v);
    if (k === 'array') {
      if (!v.length) { lines.push(`${ind}- \`${p}\` · empty array`); return; }
      const kinds = [...new Set(v.map(kind))];
      if (kinds.length === 1 && kinds[0] === 'array' && tuples[full] ||kinds.length === 1 && kinds[0] === 'array' && v.every(x => x.length === v[0].length) && v[0].length > 2 && v[0].some(y => typeof y !== typeof v[0][0])) {
        const lab = tuples[full] || {};
        lines.push(`${ind}- \`${p}[]\` · array of ${v.length} records, each an array of ${v[0].length} values:`);
        v[0].forEach((y, i) => {
          const col = v.slice(0, 400).map(r => r[i]);
          const types = [...new Set(col.map(kind))].join(' or ');
          const sample = col.find(z => z !== null && z !== undefined && z !== '' && z !== 0);
          lines.push(`${ind}  - \`[${i}]\`${lab[i] ? ' (`' + lab[i] + '`)' : ''} · ${types} · e.g. ${ex(sample === undefined ? y : sample)}`);
        });
        return;
      }
      if (kinds.every(x => x !== 'object' && x !== 'array')) { lines.push(`${ind}- \`${p}[]\` · array of ${v.length} ${kinds.join('/')} · e.g. ${ex(v.slice(0, 4))}`); return; }
      if (kinds.length === 1 && kinds[0] === 'array') { lines.push(`${ind}- \`${p}[][]\` · array of ${v.length} arrays · e.g. ${ex(v[0].slice ? v[0].slice(0, 6) : v[0])}`); return; }
      const merged = {};
      v.slice(0, 400).forEach(o => { if (o && typeof o === 'object' && !Array.isArray(o)) for (const [kk, vv] of Object.entries(o)) if (!(kk in merged) || merged[kk] == null) merged[kk] = vv; });
      lines.push(`${ind}- \`${p}[]\` · array of ${v.length} objects:`);
      if (depth < 5) for (const [kk, vv] of Object.entries(merged)) describe(kk, vv, depth + 1, full + '[].' + kk);
      return;
    }
    if (k === 'object') {
      const keys = Object.keys(v);
      if (isMap(v)) {
        lines.push(`${ind}- \`${p}{}\` · object keyed by ${keys.length} keys (${keys.slice(0, 12).join(', ')}${keys.length > 12 ? ', …' : ''}); each value:`);
        describe('<key>', v[keys[0]], depth + 1, full + '.<key>');
        return;
      }
      lines.push(`${ind}- \`${p}\` · object with ${keys.length} keys:`);
      if (depth < 6) for (const kk of keys) describe(kk, v[kk], depth + 1, full + '.' + kk);
      return;
    }
    lines.push(`${ind}- \`${p}\` · ${k} · e.g. ${ex(v)}`);
  }
  let dict = `# Data dictionary

> **Generated file: do not edit by hand.** Produced by \`node tools/export-docs.js\` on ${today} from [assets/data.js](../assets/data.js), which holds every number and text the data-driven tabs show.
> Paths are written from the top-level constant (\`PAYLOAD\`${ctx.__D.NEWMETA ? ' or `NEWMETA`' : ''}); \`[]\` marks an array, \`{}\` an object whose keys are values such as market codes. Array records that the site reads by position are labelled with the names [assets/app.js](../assets/app.js) gives them. To find which function reads a field, search app.js for its last path segment or see the [code map](code-map.md).

## Top level

| Constant · key | Type | Size |
| --- | --- | --- |
`;
  for (const [name, obj] of Object.entries(ctx.__D)) {
    if (!obj) continue;
    for (const [kk, vv] of Object.entries(obj)) dict += `| \`${name}.${kk}\` | ${kind(vv)} | ${Array.isArray(vv) ? vv.length + ' items' : vv && typeof vv === 'object' ? Object.keys(vv).length + ' keys' : ex(vv)} |\n`;
  }
  for (const [name, obj] of Object.entries(ctx.__D)) {
    if (!obj) continue;
    lines.length = 0;
    for (const [kk, vv] of Object.entries(obj)) describe(kk, vv, 0, kk);
    dict += `\n## ${name}\n\n` + lines.join('\n') + '\n';
  }
  write('docs/data-dictionary.md', dict);
  console.log('docs/data-dictionary.md', (dict.length / 1024).toFixed(0) + ' KB');
}
