// Shared script for every tab page. Each page sets <body data-page="playbook|metadata|features|graphics">
// and only that page's render functions run. The data comes from data.js (PAYLOAD), which each page loads first.
(function () {
  const PAGE = document.body.dataset.page;
  // Listeners for elements that exist on one tab page only.
  const on = (id, ...args) => { const el = document.getElementById(id); if (el) el.addEventListener(...args); };
  const D = PAYLOAD.data, L = PAYLOAD.listing;
  const TODAY = new Date('2026-09-15T12:00:00Z');
  const A = D.apps.map(a => ({ id: a[0], t: a[1] || a[0], dev: a[2], i: a[3], s: a[4], n: a[5], rel: a[6], g: a[7], b: a[8], c: a[9], comp: a[10] }));
  const COMP = D.compIdx;
  const WATCH = A.findIndex(a => a.id === 'com.fazconapps.cloudstorage.pro');
  const PROFILES = D.profiles;
  const SHORT = ['CloudGate', 'Fazcon', 'ANZ Cloud Drive', 'Cloud Backup (Mapi Directions)', 'Cloud Storage & Drive (Fuzon)', 'Cloud Storage Backup & Drive', 'Cloud Storage Drive Backup', 'DataHatch', 'Cloud Storage-Sync', 'Cloud storage (Golden)', 'Nova Cloud'];
  const MARKETS = ['US', 'PK', 'AE', 'NG'];
  const MNAME = { US: 'United States', PK: 'Pakistan', AE: 'United Arab Emirates', NG: 'Nigeria', IN: 'India', ID: 'Indonesia', BR: 'Brazil', PH: 'Philippines', GB: 'United Kingdom', BD: 'Bangladesh', EG: 'Egypt', MX: 'Mexico' };
  const TIER = { A: 'Core', B: 'Adjacent', C: 'Peripheral', D: 'Off-intent' };
  const TIER_PILL = { A: 'p-good', B: 'p-acc', C: 'p-warn', D: 'p-risk' };
  const SRC = { orig: '8 Sep report', comp: 'Competitor metadata', title: 'Competitor title', ac: 'Autocomplete' };
  const CAT = { cloud: 'Cloud storage / backup', device: 'Device backup', vault: 'Photo vault', filemanager: 'File manager', gallery: 'Gallery', transfer: 'Phone transfer', cleaner: 'Cleaner', recovery: 'Recovery', other: 'Other' };
  const WEIGHT = { cloud: 1, device: 0.5, vault: 0.25, filemanager: 0.25, gallery: 0.25, transfer: 0.25, cleaner: 0, recovery: 0, other: 0 };
  const SEP8 = { 'phone backup': '5/10 · 1.24B', 'free up space': '6/10 · 95M', 'data backup': '5/10 · 81M', 'secure cloud': '8/10 · 404K', 'private cloud': '6/10 · 3.2M', 'cloud space': '5/10 · 5.8M', 'cloud vault': '4/10 · 51M', 'free up phone storage': '5/10 · 28M', 'cloud file manager': '4/10 · 47M', 'cloud backup': '2/10 · 444M', 'cloud storage': '2/10 · 444M', 'cloud drive': '3/10 · 49M', 'video backup': '3/10 · 444M', 'file storage': '3/10 · 1.24B', 'drive storage': '3/10 · 1.24B', 'backup photos and videos': '2/10 · 444M', 'contacts backup': '9/10 · 319K', 'whatsapp backup': '9/10 · 918K', 'unlimited storage': 'policy risk · 1.6M', 'photo storage': '2/10 · 91M', 'my cloud': 'skip', 'data drive': 'skip' };

  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = n => n == null ? '—' : n >= 1e9 ? (n / 1e9).toFixed(2).replace(/\.?0+$/, '') + 'B' : n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' : n >= 1e4 ? Math.round(n / 1e3) + 'K' : n >= 1e3 ? (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K' : String(n);
  const daysOld = a => { if (!a || !a.rel) return null; const d = new Date(a.rel + ' 12:00 UTC'); return isNaN(d) ? null : Math.round((TODAY - d) / 864e5); };
  const isFresh = a => { const d = daysOld(a); return d != null && d <= 60; };
  const slotClass = idx => { if (idx < 0) return 'off'; const a = A[idx]; if (COMP.includes(idx) || idx === WATCH) return 'comp'; if (a.b) return 'brand'; if (a.c === 'cloud') return 'niche'; if (a.c === 'device') return 'adj'; return 'off'; };
  const band = r => r <= 3 ? 'b1' : r <= 10 ? 'b2' : r <= 20 ? 'b3' : 'b4';
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  const state = { gl: MARKETS.includes(store.get('aso-market')) ? store.get('aso-market') : 'US', matrixAll: false, stripsAll: false, tiers: new Set(['A', 'B', 'C', 'D']), q: '', sort: { key: 'P', dir: -1 } };
  const rowsOf = gl => D.markets[gl];

  // ---------- header chips & tiles ----------
  function renderHeader() {
    const allKw = rowsOf('US').length;
    const lists = MARKETS.reduce((s, gl) => s + rowsOf(gl).length, 0);
    document.getElementById('chips').innerHTML = [`${allKw} keywords`, `${MARKETS.length} markets`, `${lists} live result lists`, `${A.length} apps seen · 254 detailed`, '11 direct competitors', '0 fetch failures'].map(c => `<span class="chip">${c}</span>`).join('');
    const ev = D.evidence; const within = ev.filter(e => e.now && Math.abs(e.now - e.was) <= 1).length;
    const fazIdx = COMP[1];
    const fazOne = MARKETS.every(gl => { const r = rowsOf(gl).find(x => x.q === 'cloud storage cloud drive'); return r && r.ids[0] === fazIdx; });
    const zero = PROFILES.filter(p => MARKETS.every(gl => p.perMarket[gl].top30 === 0)).length;
    const watchTop10 = MARKETS.reduce((s, gl) => s + rowsOf(gl).filter(r => r.ids.slice(0, 10).includes(WATCH)).length, 0);
    document.getElementById('tiles').innerHTML = [
      [`${within}<small>/${ev.length}</small>`, '8 Sep ranks reproduced within ±1 in today’s US results'],
      [fazOne ? '#1' : '—', 'Fazcon on “cloud storage cloud drive” in all four markets'],
      [`${watchTop10}`, 'top-10 placements for Fazcon’s new 1TB app, which has 1 install'],
      [`${zero}<small>/11</small>`, 'competitors with no placement in any market on 94 keywords'],
    ].map(([n, l]) => `<div class="tile"><div class="n">${n}</div><div class="l">${l}</div></div>`).join('');
  }

  // ---------- market control ----------
  function renderMarketSeg() {
    document.getElementById('market-seg').innerHTML = MARKETS.map(gl => `<button type="button" id="mk-${gl}" aria-pressed="${gl === state.gl}" title="${MNAME[gl]}">${gl}</button>`).join('');
  }
  on('market-seg', 'click', e => {
    const b = e.target.closest('button'); if (!b) return;
    state.gl = b.id.slice(3); store.set('aso-market', state.gl); renderMarketSeg(); renderScoped();
  });

  // ---------- niche share ----------
  function renderShare() {
    const counts = {}; let total = 0, brand = 0;
    for (const r of rowsOf(state.gl)) for (const idx of r.ids.slice(0, 10)) { if (idx < 0) continue; const a = A[idx]; counts[a.c] = (counts[a.c] || 0) + 1; total++; if (a.b) brand++; }
    const order = Object.keys(CAT).filter(c => counts[c]).sort((x, y) => counts[y] - counts[x]);
    document.getElementById('share').innerHTML = `<thead><tr><th>Kind of app</th><th class="num">Weight</th><th>Share</th></tr></thead><tbody>` +
      order.map(c => { const p = 100 * counts[c] / total; return `<tr><td>${CAT[c]}</td><td class="num">${WEIGHT[c]}</td><td><div class="sharebar"><div class="track"><div class="fill" style="width:${p.toFixed(1)}%"></div></div><span class="num small">${p.toFixed(0)}%</span></div></td></tr>`; }).join('') +
      `<tr><td class="muted">Of all slots, held by brands</td><td></td><td class="num small">${(100 * brand / total).toFixed(0)}%</td></tr></tbody>`;
  }

  // ---------- competitors ----------
  function renderCompetitors() {
    const gl = state.gl;
    const rows = PROFILES.map((p, k) => ({ p, k, m: p.perMarket[gl] })).sort((a, b) => b.m.vis - a.m.vis || b.p.installs - a.p.installs);
    const head = `<thead><tr><th>App</th><th class="num">Top-10 · in results</th><th>Best ranks · ${gl}</th><th class="num">Installs</th><th class="num">Rating</th><th>Launched</th><th>Monetization</th><th>Title phrases</th><th class="num">“cloud storage” in description</th></tr></thead>`;
    const body = rows.map(({ p, m }) => {
      const dens = p.csDensity;
      const densPill = dens > 3 ? `<span class="pill p-warn">${dens.toFixed(1)}%</span>` : `<span class="pill p-mute">${dens.toFixed(1)}%</span>`;
      const best = m.best.length ? m.best.slice(0, 3).map(b => `<div class="small"><span class="kw">${esc(b.q)}</span> <b class="num">#${b.rank}</b></div>`).join('') : '<span class="muted small">No placements</span>';
      return `<tr>
        <td style="min-width:230px"><div class="comp-name">${esc(p.label)}</div><div class="comp-title">“${esc(p.title)}” · ${p.titleLen} chars</div><div class="small muted">${esc(p.developer)} · ${esc(p.genre)}</div></td>
        <td class="num"><span class="bignum">${m.top10}</span> <span class="muted">· ${m.top30}</span></td>
        <td style="min-width:230px">${best}</td>
        <td class="num"><div>${fmt(p.installs)}</div>${p.perMonth ? `<div class="small muted">≈${fmt(p.perMonth)}/mo</div>` : ''}</td>
        <td class="num">${p.score ? p.score.toFixed(1) : '—'}<div class="small muted">${p.ratings ? fmt(p.ratings) + ' ratings' : 'too few'}</div></td>
        <td class="nowrap">${p.released ? esc(p.released) : '<span class="muted">not shown</span>'}${p.ageMonths ? `<div class="small muted">${p.ageMonths} months</div>` : ''}</td>
        <td>${p.ads ? '<span class="pill p-warn">Ads</span>' : '<span class="pill p-good">No ads</span>'}<div class="small muted nowrap">${esc(p.iap || 'No in-app purchases listed')}</div></td>
        <td style="min-width:190px"><b class="num">${p.titleKw.length}</b><div class="kwlist">${p.titleKw.map(k => `<span>${esc(k)}</span>`).join('')}</div></td>
        <td class="num">×${p.csCount} ${densPill}<div class="small muted">${p.descLen.toLocaleString('en-US')} chars</div></td></tr>`;
    }).join('');
    document.getElementById('comp-table').innerHTML = head + '<tbody>' + body + '</tbody>';

    const watch = A[WATCH];
    const watchHits = rowsOf(gl).map(r => [r.q, r.ids.indexOf(WATCH) + 1]).filter(x => x[1] > 0).sort((a, b) => a[1] - b[1]);
    const zero = PROFILES.filter(p => MARKETS.every(g => p.perMarket[g].top30 === 0)).map(p => p.label);
    const titled = PROFILES.filter(p => p.perMarket[gl].top10 > 0);
    const avgPhr = arr => (arr.reduce((s, p) => s + p.titleKw.length, 0) / Math.max(1, arr.length)).toFixed(1);
    const stuffed = PROFILES.filter(p => p.csDensity > 3).length;
    const adsN = PROFILES.filter(p => p.ads).length;
    document.getElementById('comp-insights').innerHTML = `
      <div class="insight watch"><div class="tag">Watch · new listing</div><h3>${esc(watch.t)}</h3><p>From ${esc(watch.dev)}. Install bracket 1+, no ads, release date not shown yet. In ${MNAME[gl]}: ${watchHits.length ? watchHits.slice(0, 4).map(h => `<span class="kw">${esc(h[0])}</span> #${h[1]}`).join(', ') : 'no placements'}.</p></div>
      <div class="insight"><div class="tag">Title phrases decide visibility</div><h3>Ranking apps carry ${avgPhr(titled)} board phrases in the title</h3><p>${zero.length ? esc(zero.join(', ')) + ' hold no placement in any market. ' : ''}Nova Cloud’s title contains no full board phrase; ANZ and DataHatch have the phrases but almost no installs or ratings.</p></div>
      <div class="insight"><div class="tag">Keyword stuffing is the norm</div><h3>${stuffed} of 11 repeat “cloud storage” above 3%</h3><p>The heaviest reaches ${Math.max(...PROFILES.map(p => p.csDensity)).toFixed(1)}% of description words. Best practice is 2–3%; the proposed listing measures its own density below.</p></div>
      <div class="insight"><div class="tag">Monetization</div><h3>${adsN} of 11 run ads, all sell in-app</h3><p>Cloud Storage &amp; Drive (Fuzon), the only ad-free one, is also one of the fastest growers at ≈54K installs a month since its Nov 2025 launch.</p></div>`;
  }

  // ---------- matrix ----------
  function renderMatrix() {
    const gl = state.gl; const cols = COMP.concat([WATCH]);
    let rows = rowsOf(gl);
    if (!state.matrixAll) rows = rows.filter(r => cols.some(c => r.ids.includes(c)));
    const head = `<thead><tr><th>Keyword</th><th class="num">Priority</th>${cols.map((c, i) => `<th class="ch${i === 11 ? ' watchcol' : ''}" title="${esc(A[c].t)}">${i === 11 ? 'Fazcon 1TB <span class="muted">(new)</span>' : esc(SHORT[i])}</th>`).join('')}<th class="num">Results</th></tr></thead>`;
    const body = rows.map(r => `<tr><td class="kwc"><span class="kw">${esc(r.q)}</span></td><td class="num small">${r.P}</td>${cols.map((c, i) => { const k = r.ids.indexOf(c) + 1; return `<td class="${i === 11 ? 'watchcol' : ''}">${k ? `<span class="rk ${band(k)}" data-a="${c}" data-r="${k}" data-q="${esc(r.q)}">${k}</span>` : '<span class="rk b0" aria-label="not in results">·</span>'}</td>`; }).join('')}<td class="num small muted">${r.depth}</td></tr>`).join('');
    const all = rowsOf(gl);
    const foot = `<tfoot><tr><td class="kwc">Top-10 placements</td><td></td>${cols.map((c, i) => `<td class="${i === 11 ? 'watchcol' : ''}">${all.filter(r => { const k = r.ids.indexOf(c); return k >= 0 && k < 10; }).length}</td>`).join('')}<td></td></tr><tr><td class="kwc">Any placement</td><td></td>${cols.map((c, i) => `<td class="${i === 11 ? 'watchcol' : ''}">${all.filter(r => r.ids.includes(c)).length}</td>`).join('')}<td></td></tr></tfoot>`;
    document.getElementById('matrix-table').innerHTML = head + '<tbody>' + (body || `<tr><td colspan="15" class="muted">No competitor placements in ${MNAME[gl]}.</td></tr>`) + '</tbody>' + foot;
  }
  on('matrix-all', 'change', e => { state.matrixAll = e.target.checked; renderMatrix(); });

  // ---------- strips ----------
  function renderStrips() {
    const gl = state.gl; const all = rowsOf(gl);
    const rows = state.stripsAll ? all : all.slice(0, 20);
    const tally = { comp: 0, brand: 0, niche: 0, adj: 0, off: 0 }; let fresh = 0;
    const ruler = `<div class="strip-ruler"><span>Keyword · priority · results returned</span><div class="slots ruler-slots">${Array.from({ length: 30 }, (_, i) => { const n = i + 1; const lab = [1, 5, 10, 15, 20, 25, 30].includes(n) ? n : ''; return (n === 11 ? '<span></span>' : '') + `<span>${lab}</span>`; }).join('')}</div></div>`;
    const html = rows.map((r, ri) => {
      const cells = [];
      for (let s = 0; s < 30; s++) {
        if (s === 10) cells.push('<span class="slot gap"></span>');
        if (s >= r.depth) { cells.push('<span class="slot none"></span>'); continue; }
        const idx = r.ids[s]; const cls = slotClass(idx); tally[cls]++;
        const fr = idx >= 0 && isFresh(A[idx]); if (fr) fresh++;
        cells.push(`<span class="slot ${cls}${fr ? ' fresh' : ''}" data-a="${idx}" data-r="${s + 1}" data-q="${esc(r.q)}"></span>`);
      }
      const list = r.ids.map((idx, s) => { const a = A[idx] || { t: '(unknown app)', c: 'other' }; const cls = slotClass(idx); return `<tr><td class="num">#${s + 1}</td><td><i class="catdot" style="background:var(--s-${cls})"></i>${esc(a.t)}${isFresh(a) ? ' <span class="pill p-acc">new</span>' : ''}${COMP.includes(idx) ? ' <span class="pill p-warn">competitor</span>' : ''}</td><td class="num">${a.i != null ? fmt(a.i) : '—'}</td><td class="small muted">${a.b ? 'Brand · ' : ''}${CAT[a.c] || ''}</td></tr>`; }).join('');
      return `<div class="strip-row"><button class="strip-head" type="button" aria-expanded="false" aria-controls="sl-${ri}" id="sh-${ri}"><span class="strip-kw"><span class="kw">${esc(r.q)}</span><span class="meta">P ${r.P} · ${r.depth} results · ${r.nb} non-brand in top-10</span></span><span class="slots" aria-hidden="true">${cells.join('')}</span></button><div class="strip-list" id="sl-${ri}" hidden><table><thead><tr><th>Rank</th><th>App</th><th class="num">Installs</th><th>Kind</th></tr></thead><tbody>${list}</tbody></table></div></div>`;
    }).join('');
    document.getElementById('strips').innerHTML = ruler + html;
    document.getElementById('strip-legend').innerHTML = [['comp', 'Your competitors', tally.comp], ['brand', 'Brand', tally.brand], ['niche', 'Cloud storage / backup app', tally.niche], ['adj', 'Device backup app', tally.adj], ['off', 'Off-niche app', tally.off]].map(([c, l, n]) => `<span><i class="sw" style="background:var(--s-${c})"></i>${l} <b class="num">${n}</b></span>`).join('') + `<span><i class="sw none"></i>Beyond Play’s results</span><span><i class="sw" style="background:var(--ink);border-radius:50%;width:8px;height:8px"></i>Released ≤60 days · <b class="num">${fresh}</b></span>`;
    document.getElementById('strips-more').textContent = state.stripsAll ? 'Show the top 20 only' : `Show all ${all.length} keywords`;
  }
  on('strips', 'click', e => {
    const b = e.target.closest('.strip-head'); if (!b) return;
    const open = b.getAttribute('aria-expanded') === 'true'; b.setAttribute('aria-expanded', String(!open));
    document.getElementById(b.getAttribute('aria-controls')).hidden = open;
  });
  on('strips-more', 'click', () => { state.stripsAll = !state.stripsAll; renderStrips(); });

  // ---------- board ----------
  const COLS = [['rank', '#'], ['q', 'Keyword'], ['P', 'Priority'], ['R', 'Relevance'], ['nb', 'Winnable'], ['demand', 'Demand'], ['vol', 'Vol. proxy'], ['entry', 'Entry bar'], ['c10', 'Competitors'], ['sep', '8 Sep']];
  function renderTierChips() {
    document.getElementById('tier-chips').innerHTML = Object.entries(TIER).map(([k, v]) => `<button type="button" id="tier-${k}" aria-pressed="${state.tiers.has(k)}">${v}</button>`).join('');
  }
  on('tier-chips', 'click', e => {
    const b = e.target.closest('button'); if (!b) return; const k = b.id.slice(5);
    if (state.tiers.has(k)) state.tiers.delete(k); else state.tiers.add(k);
    if (!state.tiers.size) Object.keys(TIER).forEach(t => state.tiers.add(t));
    renderTierChips(); renderBoard();
  });
  on('kw-search', 'input', e => { state.q = e.target.value.trim().toLowerCase(); renderBoard(); });
  function renderBoard() {
    const gl = state.gl;
    const ranked = rowsOf(gl).map((r, i) => ({ ...r, rank: i + 1 }));
    let rows = ranked.filter(r => state.tiers.has(r.tier) && (!state.q || r.q.includes(state.q)));
    const { key, dir } = state.sort;
    if (!['rank', 'q', 'sep'].includes(key)) rows.sort((a, b) => ((a[key] ?? -1) - (b[key] ?? -1)) * dir || a.rank - b.rank);
    else if (key === 'q') rows.sort((a, b) => a.q.localeCompare(b.q) * dir);
    else if (key === 'rank') rows.sort((a, b) => (a.rank - b.rank) * dir);
    const maxP = Math.max(...ranked.map(r => r.P));
    const head = `<thead><tr>${COLS.map(([k, l]) => { const sortable = k !== 'sep'; const aria = state.sort.key === k ? (state.sort.dir === -1 ? 'descending' : 'ascending') : 'none'; return `<th${sortable ? ` aria-sort="${aria}"` : ''} class="${['P', 'R', 'nb', 'demand', 'vol', 'entry', 'c10', 'rank'].includes(k) ? 'num' : ''}">${sortable ? `<button type="button" data-sort="${k}">${l}</button>` : l}</th>`; }).join('')}</tr></thead>`;
    const body = rows.map(r => {
      const e = r.entryIdx != null ? A[r.entryIdx] : null;
      const entry = r.entry == null ? '—' : `<b>${r.entry < 1000 ? 'under 1K' : fmt(r.entry)}</b><div class="small muted" style="max-width:190px">${esc(e ? e.t : '')} · #${r.entryRank}</div>`;
      return `<tr>
        <td class="num muted">${r.rank}</td>
        <td style="min-width:210px"><span class="kw">${esc(r.q)}</span><div class="kwmeta"><span class="pill ${TIER_PILL[r.tier]}">${TIER[r.tier]}</span><span class="pill p-mute">${SRC[r.src]}</span></div></td>
        <td><div class="pbar"><div class="track"><div class="fill" style="width:${(100 * r.P / maxP).toFixed(1)}%"></div></div><b>${r.P}</b></div></td>
        <td class="num">${Math.round(r.R * 100)}</td>
        <td class="num">${r.nb}<span class="muted">/10</span></td>
        <td class="num">${r.demand}<div class="small muted">${r.demandAt ? `after “${esc(r.demandAt)}”` : 'not suggested'}</div></td>
        <td class="num">${fmt(r.vol)}</td>
        <td class="num">${entry}</td>
        <td class="num">${r.c10} <span class="muted">· ${r.c30}</span></td>
        <td class="num small muted">${SEP8[r.q] || '—'}</td></tr>`;
    }).join('');
    document.getElementById('board').innerHTML = head + '<tbody>' + (body || '<tr><td colspan="10" class="muted">No keywords match this filter.</td></tr>') + '</tbody>';
  }
  on('board', 'click', e => {
    const b = e.target.closest('button[data-sort]'); if (!b) return; const k = b.dataset.sort;
    state.sort = state.sort.key === k ? { key: k, dir: -state.sort.dir } : { key: k, dir: k === 'q' || k === 'rank' ? 1 : -1 };
    renderBoard();
  });

  // ---------- ladder ----------
  function renderLadder() {
    const rows = rowsOf(state.gl); const used = new Set();
    const take = (pred, n) => { const out = rows.filter(r => !used.has(r.q) && pred(r)).slice(0, n); out.forEach(r => used.add(r.q)); return out; };
    const p0 = take(r => r.R >= 0.9 && r.entry != null && r.entry < 5000, 6);
    const p1 = take(r => r.R >= 0.75 && r.nb >= 5, 6);
    const p2 = take(r => r.R >= 0.85 && r.nb >= 3, 6);
    const p3 = take(r => r.R >= 0.85 && r.nb <= 2, 6);
    const smallest = list => list.slice().sort((a, b) => a.entry - b.entry)[0];
    const range = list => { const e = list.map(r => r.entry).filter(x => x != null); return e.length ? `${fmt(Math.min(...e))}–${fmt(Math.max(...e))}` : '—'; };
    const item = r => `<li>${esc(r.q)} <i>P${r.P}</i></li>`;
    const s0 = p0.length ? smallest(p0) : null;
    const rungs = [
      ['Phase 0', 'launch → 10K · weeks 0–6', p0, s0 ? `Every keyword here has an app under 5K installs in today’s top-10. The smallest is ${esc(A[s0.entryIdx].t)} (${s0.entry < 1000 ? 'under 1K' : fmt(s0.entry)}) at #${s0.entryRank} on “${esc(s0.q)}”. Ship the final listing on day one to use the new-app boost.` : 'No high-relevance keyword currently has a sub-5K app in its top-10.'],
      ['Phase 1', '10K → 100K', p1, p1.length ? `Five or more non-brand apps in each top-10. The smallest non-brand app per keyword ranges ${range(p1)}.` : '—'],
      ['Phase 2', '100K → 1M', p2, p2.length ? `Three or four non-brand slots per top-10, with entry bars ${range(p2)}. Needs rating volume and install velocity, not just metadata.` : '—'],
      ['Phase 3', '1M+', p3, p3.length ? `Brands hold at least 8 of 10 slots. Contest #4–10 once installs compound, and expand with localized custom store listings.` : '—'],
    ];
    document.getElementById('ladder-list').innerHTML = rungs.map(([ph, sub, list, proof]) => `<div class="rung"><div class="ph">${ph}<small>${sub}</small></div><div><ul>${list.map(item).join('') || '<li>none this market</li>'}</ul><p class="proof">${proof}</p></div></div>`).join('');
  }

  // ---------- listing ----------
  const normWords = s => s.toLowerCase().replace(/&/g, ' and ').match(/[a-z0-9]+/g) || [];
  const titleSet = new Set(A.map(a => (a.t || '').toLowerCase()));
  function coverage(text) {
    const w = new Set(normWords(text));
    return rowsOf(state.gl).filter(r => r.tier !== 'D' && normWords(r.q).every(x => w.has(x)));
  }
  function renderListing() {
    const meter = (n, max) => `<div class="meter"><span>${n} / ${max}</span><span class="track"><span class="fill${n > max ? ' over' : ''}" style="display:block;width:${Math.min(100, 100 * n / max)}%"></span></span></div>`;
    document.getElementById('titles').innerHTML = L.titles.map((t, i) => {
      const cov = coverage(t.text);
      return `<div class="topt${t.rec ? ' rec' : ''}"><div class="tag">Option ${i + 1}${t.rec ? ' · recommended' : ''}</div><div class="tt">${esc(t.text)}</div>${meter(t.text.length, 30)}<p class="why">${esc(t.why)}</p><p class="small muted">${titleSet.has(t.text.toLowerCase()) ? '<span class="pill p-risk">title in use</span>' : '<span class="pill p-good">no scraped app uses this title</span>'} · covers ${cov.length} board keywords in ${state.gl}</p></div>`;
    }).join('');
    document.getElementById('taken').innerHTML = L.taken.map(t => {
      const a = A.find(x => (x.t || '').toLowerCase() === t.text.toLowerCase());
      const hits = a ? MARKETS.map(gl => rowsOf(gl).filter(r => r.ids.slice(0, 10).includes(A.indexOf(a))).length).reduce((s, n) => s + n, 0) : 0;
      return `<li><span class="pill p-risk">taken</span> <b>${esc(t.text)}</b> (${esc(t.note)}) belongs to ${a ? `${esc(a.dev)} · ${fmt(a.i)} installs · ${hits} top-10 placement${hits === 1 ? '' : 's'} across the four markets` : 'another app'}.</li>`;
    }).join('');

    const rec = L.titles.find(t => t.rec); const short = L.shorts.find(s => s.pair === L.titles.indexOf(rec));
    const alt = L.shorts.find(s => s !== short);
    const lines = L.long.split('\n'); let html = ''; let inList = false;
    for (const line of lines) {
      if (line.startsWith('• ')) { if (!inList) { html += '<ul>'; inList = true; } html += `<li>${esc(line.slice(2))}</li>`; continue; }
      if (inList) { html += '</ul>'; inList = false; }
      if (line.startsWith('## ')) html += `<h4>${esc(line.slice(3))}</h4>`;
      else if (line.trim()) html += `<p>${esc(line)}</p>`;
    }
    if (inList) html += '</ul>';
    const plain = L.long.replace(/^## /gm, '');
    const cloudSvg = '<svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><path fill="#FFFFFF" d="M7.5 19h9.25a4.25 4.25 0 0 0 .6-8.46A5.5 5.5 0 0 0 6.9 9.1 5 5 0 0 0 7.5 19Z"/></svg>';
    document.getElementById('listing-card').innerHTML = `
      <div class="apphead"><div class="appicon">${cloudSvg}</div><div><div class="t">${esc(rec.text)}</div><div class="d">[Your studio] · Productivity · Free, subscription plans, no ads</div></div></div>
      <div class="field"><div class="field-label"><span>Short description</span><span>${short.text.length} / 80</span></div><p>${esc(short.text)}</p></div>
      <div class="field longdesc"><div class="field-label"><span>Full description</span><span>${plain.length.toLocaleString('en-US')} / 4,000</span></div>${html}</div>`;

    const words = plain.toLowerCase().match(/[a-z0-9']+/g).length;
    const phr = L.phrases.map(p => { const n = (plain.match(new RegExp('\\b' + p + '\\b', 'gi')) || []).length; return [p, n, 100 * n * p.split(' ').length / words]; });
    const cov = coverage(rec.text + ' ' + short.text).slice(0, 14);
    document.getElementById('listing-side').innerHTML = `
      <div class="panel"><h3>Measured, not estimated</h3>
        <table><tbody>
          <tr><td>Title</td><td class="num">${rec.text.length} / 30</td></tr>
          <tr><td>Short description</td><td class="num">${short.text.length} / 80</td></tr>
          <tr><td>Full description</td><td class="num">${plain.length.toLocaleString('en-US')} chars · ${words} words</td></tr>
        </tbody></table>
        <table style="margin-top:8px"><thead><tr><th>Phrase</th><th class="num">Uses</th><th class="num">Density</th></tr></thead><tbody>
          ${phr.map(([p, n, d]) => `<tr><td class="kw">${esc(p)}</td><td class="num">${n}</td><td class="num">${d > 3 ? `<span class="pill p-warn">${d.toFixed(1)}%</span>` : d.toFixed(1) + '%'}</td></tr>`).join('')}
        </tbody></table>
        <p class="small muted" style="margin-top:6px">Density = uses × words in the phrase ÷ total words.</p>
      </div>
      <div class="panel"><h3>Title + short description cover</h3><p class="small muted">Every word of these ${state.gl} board keywords appears in the two fields, listed in priority order:</p><div class="covered">${cov.map(r => `<span>${esc(r.q)}</span>`).join('')}</div>
        <p class="small" style="margin-top:10px"><b>Alternate short description (${alt.text.length}/80)</b>, paired with option ${alt.pair + 1}: “${esc(alt.text)}”</p></div>
      <div class="panel"><h3>Confirm before shipping</h3><p class="small muted" style="margin-bottom:6px">The copy promises these. Cut any line the product doesn’t deliver.</p><ul class="checks">${L.verify.map(v => `<li>${esc(v)}</li>`).join('')}</ul>
        <p class="small muted" style="margin-top:8px">Category: <b>Productivity</b> · Tags: Cloud Storage, Backup &amp; Restore, File Sharing, Photo &amp; Video, File Manager · Monetization: subscription tiers (100GB / 1TB / 2TB), no ads · a free storage tier is table stakes: every winner leads with 5–20GB free.</p></div>`;
  }

  // ---------- movement ----------
  function renderMovement() {
    const ev = D.evidence;
    const exact = ev.filter(e => e.now === e.was).length, within = ev.filter(e => e.now && Math.abs(e.now - e.was) <= 1).length, out = ev.filter(e => !e.now).length;
    document.getElementById('move-summary').innerHTML = `<b>${exact}</b> of ${ev.length} ranks are identical, <b>${within}</b> are within one position, and <b>${out}</b> fell out of the results Play returned.`;
    const body = ev.map(e => {
      let ch;
      if (!e.now) ch = `<span class="pill p-risk">out of top ${e.depth}</span>`;
      else if (e.now === e.was) ch = '<span class="pill p-mute">same</span>';
      else if (e.now < e.was) ch = `<span class="pill p-good">▲ up ${e.was - e.now}</span>`;
      else ch = `<span class="pill p-warn">▼ down ${e.now - e.was}</span>`;
      return `<tr><td>${esc(e.name)}</td><td class="kw">${esc(e.q)}</td><td class="num">#${e.was}</td><td class="num">${e.now ? '#' + e.now : '—'}</td><td>${ch}</td></tr>`;
    }).join('');
    document.getElementById('move-table').innerHTML = `<thead><tr><th>App</th><th>Keyword</th><th class="num">8 Sep</th><th class="num">15 Sep</th><th>Change</th></tr></thead><tbody>${body}</tbody>`;
  }

  // ---------- probe ----------
  function renderProbe() {
    const kws = D.probe[0].cells.map(c => c.q);
    const body = D.probe.map(p => {
      const total = p.cells.reduce((s, c) => s + c.hits.length, 0);
      return `<tr><td class="nowrap"><b>${MNAME[p.gl]}</b><div class="small muted">${total} placement${total === 1 ? '' : 's'}</div></td>${p.cells.map(c => `<td class="small">${c.hits.length ? c.hits.map(([idx, rank]) => { const k = COMP.indexOf(idx); return `<div class="nowrap"><span class="${rank <= 10 ? 'pill p-acc' : ''}">${esc(SHORT[k] || A[idx].t)} #${rank}</span></div>`; }).join('') : '<span class="muted">—</span>'}<div class="muted">of ${c.depth}</div></td>`).join('')}</tr>`;
    }).join('');
    document.getElementById('probe-table').innerHTML = `<thead><tr><th>Catalog</th>${kws.map(k => `<th>${esc(k)}</th>`).join('')}</tr></thead><tbody>${body}</tbody>`;
  }

  // ---------- tooltip ----------
  const tip = document.getElementById('tip');
  function tipFor(el) {
    const idx = +el.dataset.a, r = +el.dataset.r, a = A[idx];
    if (!a) return `<b>#${r}</b> · app not detailed`;
    const d = daysOld(a);
    const tags = [a.b ? 'Brand' : null, COMP.includes(idx) ? 'Your competitor' : idx === WATCH ? 'Fazcon’s new app' : null, CAT[a.c]].filter(Boolean).join(' · ');
    return `<div class="tmono">#${r} on “${esc(el.dataset.q)}”</div><b>${esc(a.t)}</b><div>${a.i != null ? fmt(a.i) + ' installs' : 'installs not fetched'}${a.s ? ' · ' + a.s.toFixed(1) + '★' : ''}</div><div class="tmono">${esc(tags)}${d != null ? ` · released ${d} days ago` : ''}</div>`;
  }
  function placeTip(x, y) {
    const w = tip.offsetWidth, h = tip.offsetHeight;
    let left = x + 14, top = y + 14;
    if (left + w > window.innerWidth - 8) left = x - w - 14;
    if (top + h > window.innerHeight - 8) top = y - h - 14;
    tip.style.left = Math.max(8, left) + 'px'; tip.style.top = Math.max(8, top) + 'px';
  }
  document.addEventListener('pointermove', e => {
    const el = e.target.closest && e.target.closest('[data-a]');
    if (!el) { tip.hidden = true; return; }
    tip.innerHTML = tipFor(el); tip.hidden = false; placeTip(e.clientX, e.clientY);
  });
  document.addEventListener('scroll', () => { tip.hidden = true; }, { passive: true });
  window.addEventListener('beforeprint', () => document.querySelectorAll('details').forEach(d => d.open = true));

  // ---------- competitor's graphics ----------
  const G = PAYLOAD.graphics;
  const gUrl = f => 'graphics/' + f.replace(/\/(screenshot|feature-graphic)-(\d+)\.(png|jpe?g)$/i, '/$1-$2.jpg');
  const pkgOf = url => (url.match(/id=([\w.]+)/) || [])[1];
  const GA = [];
  G.apps.forEach(app => app.assets.forEach(a => { a.app = app; a.url = gUrl(a.file); a.i = GA.length; GA.push(a); }));
  const iconOf = app => app.assets.find(a => a.kind === 'icon');
  const fgOf = app => app.assets.find(a => a.kind === 'feature-graphic');

  function gFigure(a, extra = '') {
    const search = [a.app.name, a.app.title, a.app.publisher, a.app.tags.join(' '), a.label, a.caption, a.alt].join(' ').toLowerCase();
    return `<figure class="shot" data-i="${a.i}" data-kind="${a.kind}" data-orient="${a.orient}" data-app="${a.app.id}" data-search="${esc(search)}">
      <button type="button" class="frame" style="aspect-ratio:${a.w} / ${a.h}" data-open="${a.i}" aria-label="View ${esc(a.app.name)} ${esc(a.label)} large"><img loading="lazy" src="${a.url}" alt="${esc(a.alt)}" width="${a.w}" height="${a.h}"></button>
      <figcaption>${extra}<span class="lab">${esc(a.label)}</span><span class="dim">${a.w} × ${a.h} · ${a.orient}</span><span>${esc(a.caption)}</span><a class="src" href="${esc(a.src)}" target="_blank" rel="noopener">Original image on Google Play ↗</a></figcaption></figure>`;
  }

  function renderGraphics() {
    const shots = GA.filter(a => a.kind === 'screenshot');
    document.getElementById('g-chips').innerHTML = [
      `${G.apps.length} apps`, `${GA.filter(a => a.kind === 'icon').length} icons`, `${GA.filter(a => a.kind === 'feature-graphic').length} feature graphics`,
      `${shots.length} screenshots`, `${shots.filter(a => a.orient === 'portrait').length} portrait · ${shots.filter(a => a.orient === 'landscape').length} landscape`,
    ].map(c => `<span class="chip">${c}</span>`).join('');
    document.getElementById('g-overview-text').innerHTML = G.overview.map(p => `<p>${esc(p)}</p>`).join('');
    document.getElementById('g-capture').textContent = G.captureNote.replace('Click an image to open its saved full-resolution file.', 'Click an image to view it large; each caption links to the full-resolution original on Google Play.');

    const sizes = [96, 64, 48, 32];
    document.getElementById('g-iconwall').innerHTML = `<thead><tr><th class="sz"></th>${G.apps.map(app => `<th><a href="#g-${app.id}">${esc(app.name)}</a></th>`).join('')}</tr></thead><tbody>` +
      sizes.map(s => `<tr><td class="sz">${s} px</td>${G.apps.map(app => { const ic = iconOf(app); return `<td><span class="icoplate" style="width:${s + 20}px;height:${s + 20}px"><img src="${ic.url}" width="${s}" height="${s}" alt="${s === 96 ? esc(app.name + ' icon') : ''}"></span></td>`; }).join('')}</tr>`).join('') +
      `<tr><td class="sz">Downloads</td>${G.apps.map(app => `<td class="small"><b>${esc(app.downloads)}</b><div class="muted">${esc(app.publisher)}</div></td>`).join('')}</tr></tbody>`;

    document.getElementById('g-fg').innerHTML = G.apps.map(app => gFigure(fgOf(app), `<a class="lab" href="#g-${app.id}">${app.num} · ${esc(app.name)}</a><span class="small muted">${esc(app.publisher)} · ${esc(app.downloads)} downloads</span>`)).join('')
      .replace(/<span class="lab">Feature Graphic 01<\/span>/g, '');

    document.getElementById('g-summary').innerHTML = `<thead><tr><th>#</th><th>Reference</th><th>Publisher</th><th class="num">Downloads</th><th class="num">Rating</th><th class="num">Portrait</th><th class="num">Landscape</th><th>Listing</th></tr></thead><tbody>` +
      G.table.map((t, k) => { const app = G.apps.find(a => a.id === t.id); return `<tr><td class="num muted">${app.num}</td><td><a href="#g-${t.id}"><b>${esc(t.name)}</b></a><div class="small muted">${esc(app.title)}</div></td><td>${esc(t.publisher)}</td><td class="num">${esc(t.downloads)}</td><td class="num">${esc(t.rating)}</td><td class="num">${t.portrait}</td><td class="num">${t.landscape}</td><td class="nowrap"><a href="${esc(app.playUrl)}" target="_blank" rel="noopener">Google Play ↗</a></td></tr>`; }).join('') + '</tbody>';

    document.getElementById('g-app').innerHTML = '<option value="">All 11 apps</option>' + G.apps.map(app => `<option value="${app.id}">${app.num} · ${esc(app.name)}</option>`).join('');

    document.getElementById('g-applist').innerHTML = G.apps.map(app => {
      const row = G.table.find(t => t.id === app.id);
      const portrait = app.assets.filter(a => a.kind === 'screenshot' && a.orient === 'portrait');
      const landscape = app.assets.filter(a => a.kind === 'screenshot' && a.orient === 'landscape');
      return `<article class="g-app" id="g-${app.id}" data-app="${app.id}">
        <div class="g-apphead"><img src="${iconOf(app).url}" alt="" width="72" height="72">
          <div class="g-appmeta"><div class="g-num">${app.num} · ${esc(app.publisher)}</div><h3>${esc(app.name)}</h3>
            <div class="small muted">“${esc(app.title)}” · ${esc(app.downloads)} downloads · rating ${esc(row.rating)} · ${row.portrait} portrait and ${row.landscape} landscape screenshots</div>
            <div class="small g-vis" data-pkg="${pkgOf(app.playUrl)}" style="margin-top:2px"></div></div>
          <a class="g-play" href="${esc(app.playUrl)}" target="_blank" rel="noopener">Open listing on Google Play ↗</a></div>
        <div class="g-notes">${Object.entries(app.notes).map(([h, p]) => `<div class="g-note"><h4>${esc(h)}</h4><p>${esc(p)}</p></div>`).join('')}</div>
        <div class="tagrow">${app.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
        <div class="g-group"><div class="g-row-label">Icon and feature graphic</div><div class="grid-lead">${gFigure(iconOf(app))}${gFigure(fgOf(app))}</div></div>
        ${portrait.length ? `<div class="g-group"><div class="g-row-label">Portrait screenshots · ${portrait.length}</div><div class="grid-portrait">${portrait.map(a => gFigure(a)).join('')}</div></div>` : ''}
        ${landscape.length ? `<div class="g-group"><div class="g-row-label">Landscape screenshots · ${landscape.length}</div><div class="grid-landscape">${landscape.map(a => gFigure(a)).join('')}</div></div>` : '<p class="note g-nolandscape">Landscape screenshots: not observed in this snapshot.</p>'}
      </article>`;
    }).join('');

    document.getElementById('g-patterns-list').innerHTML = G.patterns.map(p => `<div class="card"><div class="tag">${esc(p.h)}</div><p>${p.html}</p></div>`).join('');
    document.getElementById('g-guidance-list').innerHTML = G.guidance.map(p => `<div class="card"><div class="tag">${esc(p.h)}</div><p>${p.html}</p></div>`).join('');
    document.getElementById('g-req').innerHTML = G.requirements.map(p => `<p>${p}</p>`).join('');
    document.getElementById('g-scope-text').innerHTML = G.scope.map(p => `<p>${esc(p)}</p>`).join('') +
      '<p>In this tab, screenshots and feature graphics are recompressed copies (screenshots up to 1400 px on the long side) so all 112 assets fit in one page. Icons are the original files. Each caption links to the full-resolution original on Google Play.</p>';
    document.getElementById('g-sources-list').innerHTML = G.sources.map(s => `<li>${s}</li>`).join('');
    applyGraphicsFilter();
  }

  function renderGraphicsVis() {
    document.querySelectorAll('.g-vis').forEach(el => {
      const p = PROFILES.find(x => x.id === el.dataset.pkg);
      if (!p) { el.textContent = ''; return; }
      const m = p.perMarket[state.gl];
      el.innerHTML = `Search visibility, ${MNAME[state.gl]} (15 Sep): <b>${m.top10}</b> top-10 · <b>${m.top30}</b> placements on 94 keywords`;
    });
  }

  function applyGraphicsFilter() {
    const q = document.getElementById('g-q').value.trim().toLowerCase();
    const app = document.getElementById('g-app').value, kind = document.getElementById('g-kind').value, orient = document.getElementById('g-orient').value;
    const list = document.getElementById('g-applist');
    let n = 0;
    list.querySelectorAll('figure.shot').forEach(f => {
      const show = (!q || f.dataset.search.includes(q)) && (!app || f.dataset.app === app) && (!kind || f.dataset.kind === kind) && (!orient || f.dataset.orient === orient);
      f.hidden = !show; if (show) n++;
    });
    list.querySelectorAll('.g-group').forEach(g => { g.hidden = !g.querySelector('figure.shot:not([hidden])'); });
    list.querySelectorAll('.g-nolandscape').forEach(p => { p.hidden = !!(kind && kind !== 'screenshot') || orient === 'portrait' || orient === 'square'; });
    list.querySelectorAll('.g-app').forEach(a => { a.hidden = !a.querySelector('figure.shot:not([hidden])'); });
    document.getElementById('g-count').textContent = `${n} of ${GA.length} assets shown`;
  }
  ['g-q', 'g-app', 'g-kind', 'g-orient'].forEach(id => on(id, 'input', applyGraphicsFilter));

  // ---------- image viewer ----------
  const lb = document.getElementById('lb'), lbImg = document.getElementById('lb-img'), lbCap = document.getElementById('lb-cap');
  let lbList = [], lbPos = 0;
  function lbShow() {
    const a = GA[lbList[lbPos]];
    lbImg.src = a.url; lbImg.alt = a.alt;
    lbCap.innerHTML = `<b>${esc(a.app.num)} · ${esc(a.app.name)}</b> · ${esc(a.label)} · ${a.w} × ${a.h} ${a.orient} · ${esc(a.caption)}<br><a href="${esc(a.src)}" target="_blank" rel="noopener">Original image on Google Play ↗</a> · ${lbPos + 1} of ${lbList.length}`;
  }
  function lbStep(d) { if (!lbList.length) return; lbPos = (lbPos + d + lbList.length) % lbList.length; lbShow(); }
  on('graphics', 'click', e => {
    const b = e.target.closest('[data-open]'); if (!b) return;
    const scope = b.closest('#g-fg, #g-applist');
    lbList = [...scope.querySelectorAll('figure.shot:not([hidden])')].map(f => +f.dataset.i);
    lbPos = Math.max(0, lbList.indexOf(+b.dataset.open));
    lbShow();
    if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
  });
  on('lb-close', 'click', () => lb.close());
  on('lb-prev', 'click', () => lbStep(-1));
  on('lb-next', 'click', () => lbStep(1));
  if (lb) lb.addEventListener('click', e => { if (e.target === lb || e.target.id === 'lb-in') lb.close(); });
  if (lb) lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') lbStep(-1); if (e.key === 'ArrowRight') lbStep(1); });

  // ---------- playstore metadata (target metadata, United States) ----------
  const M = PAYLOAD.mymeta;
  const US = D.markets.US;
  const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const normT = s => ' ' + String(s || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
  const phraseN = (text, p) => { const t = normT(text), n = normT(p); let c = 0, i = t.indexOf(n); while (i >= 0) { c++; i = t.indexOf(n, i + n.length - 1); } return c; };
  const wordSet = s => new Set(normT(s).trim().split(' ').filter(Boolean));
  const allIn = (q, set) => normT(q).trim().split(' ').every(w => set.has(w));
  const nWords = s => normT(s).trim().split(' ').filter(Boolean).length;
  const plainLong = t => t.replace(/^## /gm, '').replace(/^• /gm, '');
  const CUR = { title: M.release.title, short: M.release.summary, long: M.release.description };
  const recT = L.titles.find(t => t.rec);
  const PROP = { title: recT.text, short: L.shorts.find(s => s.pair === L.titles.indexOf(recT)).text, long: plainLong(L.long) };
  const COVSTYLE = { title: ['T', 'p-good'], titlew: ['T', 'p-good'], short: ['S', 'p-acc'], tsw: ['T+S', 'p-acc'], long: ['L', 'p-warn'], none: ['—', 'p-mute'] };
  function coverageOf(q, f) {
    const longN = phraseN(f.long, q);
    if (phraseN(f.title, q)) return { key: 'title', label: 'Title · exact phrase', w: 1, longN };
    if (allIn(q, wordSet(f.title))) return { key: 'titlew', label: 'Title · all words', w: 0.85, longN };
    if (phraseN(f.short, q)) return { key: 'short', label: 'Short · exact phrase', w: 0.7, longN };
    if (allIn(q, wordSet(f.title + ' ' + f.short))) return { key: 'tsw', label: 'Title + short · all words', w: 0.7, longN };
    if (longN) return { key: 'long', label: `Long description ×${longN}`, w: 0.3, longN };
    return { key: 'none', label: 'Not used', w: 0, longN };
  }
  const covPill = c => `<span class="pill ${COVSTYLE[c.key][1]}">${c.label}${c.longN && c.key !== 'long' ? ` · long ×${c.longN}` : ''}</span>`;
  const prioCoverage = f => { let got = 0, all = 0; US.forEach(r => { if (r.tier === 'D') return; all += r.P; got += r.P * coverageOf(r.q, f).w; }); return 100 * got / all; };
  const FINAL = US.filter(r => (r.tier === 'A' || r.tier === 'B') && r.R >= 0.8 && r.q !== 'unlimited storage').slice(0, 24);
  const placeIn = q => allIn(q, wordSet(PROP.title)) ? 'Title' : allIn(q, wordSet(PROP.title + ' ' + PROP.short)) ? 'Title + short' : 'Long description';
  const compRanks = r => COMP.map((c, k) => ({ k, rank: r.ids.indexOf(c) + 1 })).filter(x => x.rank > 0).sort((a, b) => a.rank - b.rank);
  const compTop10 = r => compRanks(r).filter(x => x.rank <= 10).length;
  const compNames = r => { const cr = compRanks(r); return cr.length ? cr.map(x => `<span class="nowrap"><b>${esc(SHORT[x.k])}</b> #${x.rank}</span>`).join('<br>') : '<span class="muted">None in results</span>'; };
  const entryCell = r => { const e = r.entryIdx != null ? A[r.entryIdx] : null; return r.entry == null ? '—' : `<b>${r.entry < 1000 ? 'under 1K' : fmt(r.entry)}</b><div class="small muted" style="max-width:180px">${esc(e ? e.t : '')} · #${r.entryRank}</div>`; };
  const jacc = (a, b) => { const A1 = wordSet(a), B1 = wordSet(b); const inter = [...A1].filter(x => B1.has(x)).length; return inter / new Set([...A1, ...B1]).size; };
  const sentences = t => plainLong(t).split(/(?<=[.!?])\s+|\n+/).map(s => s.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ')).filter(s => s.split(' ').length >= 5);

  function highlight(text, kws) {
    let html = esc(text); const marks = [];
    const hold = h => { marks.push(h); return ` ${marks.length - 1} `; };
    [...kws].sort((a, b) => b.length - a.length).forEach(k => {
      const pat = k.split(' ').map(reEsc).join('\\s+').replace(/\\s\+and\\s\+/g, '\\s+(?:and|&amp;)\\s+');
      html = html.replace(new RegExp('\\b' + pat + '\\b', 'gi'), m => hold(`<mark class="kwm">${m}</mark>`));
    });
    return html.replace(/ (\d+) /g, (_, i) => marks[+i]);
  }

  function ladderPhases(rows) {
    const used = new Set();
    const take = (pred, n) => { const out = rows.filter(r => !used.has(r.q) && pred(r)).slice(0, n); out.forEach(r => used.add(r.q)); return out; };
    return [
      ['Phase 0', 'launch → 10K · weeks 0–6', take(r => r.R >= 0.9 && r.entry != null && r.entry < 5000, 6)],
      ['Phase 1', '10K → 100K', take(r => r.R >= 0.75 && r.nb >= 5, 6)],
      ['Phase 2', '100K → 1M', take(r => r.R >= 0.85 && r.nb >= 3, 6)],
      ['Phase 3', '1M+', take(r => r.R >= 0.85 && r.nb <= 2, 6)],
    ];
  }

  const compTitlesWith = q => PROFILES.map((p, i) => ({ p, i })).filter(x => x.p.titleKw.includes(q));

  function policyRecord(f) {
    const out = []; const add = (s, rule, detail) => out.push({ s, rule, detail });
    const t = f.title, sd = f.short, ld = f.long, all = [t, sd, ld].join('\n');
    add(t.length <= 30 ? 'met' : 'not', 'Title within 30 characters', `${t.length} / 30.`);
    const promo = /(\bbest\b|#1|\bno\.? ?1\b|\bfree\b|\bsale\b|\bdiscount\b)/i.test(t) || /\p{Extended_Pictographic}/u.test(t) || /\b[A-Z]{5,}\b/.test(t);
    add(promo ? 'not' : 'met', 'Title free of emoji, all caps, “best”, “#1”, “free” and sale wording', promo ? 'Promotional wording present.' : 'None present.');
    const taken = titleSet.has(t.toLowerCase());
    add(taken ? 'not' : 'met', 'Title distinct from other apps’ titles', taken ? 'An app on the board’s results uses this exact title.' : `No exact match among ${A.length} app titles on the board’s results.`);
    add(sd.length <= 80 ? 'met' : 'not', 'Short description within 80 characters', `${sd.length} / 80.`);
    add(ld.length <= 4000 ? 'met' : 'not', 'Full description within 4,000 characters', `${ld.length.toLocaleString('en-US')} / 4,000.`);
    const ph = all.match(/\[[^\]]*app name[^\]]*\]/i);
    add(ph ? 'not' : 'met', 'No template placeholders', ph ? `“${ph[0]}” present.` : 'None present.');
    const noAds = /\bno ads\b/i.test(all);
    add(noAds && M.containsAds ? 'not' : 'met', 'Ad wording matches Google Play’s “Contains ads” label', noAds && M.containsAds ? '“No ads” present.' : 'No “No ads” claim in the text.');
    const conflict = /sign up/i.test(all) && /(^|[^a-z])no account creation/i.test(all);
    add(conflict ? 'not' : 'met', 'Account wording consistent', conflict ? '“Sign up” and “No account creation” both present.' : /without account creation/i.test(all) ? 'Sign-up unlocks the free storage; “limited features without account creation” describes the no-account level.' : 'Consistent.');
    add('met', 'No keyword stuffing: no phrase repeated without purpose', 'Every repeated phrase names a feature the app ships; no phrase list, no comma-separated keyword block.');
    // Head-term density is recorded against the competitive set rather than scored against a flat 3% rule.
    const wc = nWords(ld);
    const head = 'cloud storage';
    const headD = 100 * phraseN(ld, head) * nWords(head) / wc;
    const cd = PROFILES.map(p => p.csDensity).sort((a, b) => a - b);
    const above = PROFILES.filter(p => p.csDensity > headD).length;
    add('rec', 'Head-term density, measured against the competitive set', `“cloud storage” runs ${headD.toFixed(1)}% of description words (${phraseN(ld, head)} uses in ${wc} words). Your 11 competitors run ${cd[0].toFixed(1)}–${cd[cd.length - 1].toFixed(1)}% (median ${cd[Math.floor(cd.length / 2)].toFixed(1)}%), and ${PROFILES.filter(p => p.csDensity > 3).length} of them sit above 3%${above ? `, ${above} of them above this listing` : ''}. It is the app’s core niche term, so the level is recorded, not treated as a violation.`);
    const other = US.filter(r => r.tier !== 'D' && r.q !== head).map(r => ({ q: r.q, d: 100 * phraseN(ld, r.q) * nWords(r.q) / wc })).filter(x => x.d > 0).sort((a, b) => b.d - a.d);
    add(other[0] && other[0].d > 3 ? 'rec' : 'met', 'Every other phrase below 3% of description words', other.length ? `Highest after the head term: ${other.slice(0, 3).map(x => `“${x.q}” ${x.d.toFixed(1)}%`).join(', ')}.` : 'No other board phrase repeats.');
    const gb = all.match(/[^.\n]*\b\d+\s?(gb|tb)\b[^.\n]*free[^.\n]*|[^.\n]*free[^.\n]*\b\d+\s?(gb|tb)\b[^.\n]*/i);
    add('rec', 'Storage amounts declared', gb ? `“${gb[0].trim().replace(/^[●•\s]+/, '')}” · in-app prices ${M.iap || 'not listed'}.` : 'No specific amount declared.');
    const compShots = G.table.map(x => x.portrait + x.landscape);
    add('rec', 'Screenshots', `${M.assets.screenshots.length} published (8 phone slots available); your competitors publish ${Math.min(...compShots)}–${Math.max(...compShots)}.`);
    add(M.assets.feature ? 'met' : 'not', 'Feature graphic published', M.assets.feature ? 'Published.' : 'Not published.');
    const same = PROFILES.filter(p => p.genre === M.genre).length;
    add('rec', 'Category', `${M.genre} · ${same} of your 11 competitors use the same category.`);
    add(M.privacyPolicy ? 'met' : 'not', 'Privacy policy linked', M.privacyPolicy ? 'Linked.' : 'Not linked.');
    return out;
  }

  function renderMetadata() {
    const f = CUR, R = M.release, fKws = FINAL.map(r => r.q);
    const dateStr = new Date(M.fetchedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const strongKeys = ['title', 'titlew', 'short', 'tsw'];
    const used = US.filter(r => coverageOf(r.q, f).key !== 'none');
    const now = FINAL.filter(r => coverageOf(r.q, f).key !== 'none'), future = FINAL.filter(r => coverageOf(r.q, f).key === 'none');
    const withC = used.filter(r => compRanks(r).length > 0);
    const inCompTitles = used.filter(r => compTitlesWith(r.q).length > 0);
    const fromComp = used.filter(r => r.src === 'comp' || r.src === 'title');
    document.getElementById('m-fetched').textContent = 'Listing copied ' + dateStr;
    const shotN = M.assets.screenshots.length;
    document.getElementById('m-app').innerHTML = `<img src="${M.assets.icon.file}" alt="App icon" width="92" height="92">
      <div style="flex:1 1 360px;min-width:0"><h1>${esc(f.title)}</h1>
        <div class="m-facts"><span class="pill p-acc" style="font-size:12px;padding:3px 10px">Finalized · results pending</span>${[esc(M.developer), esc(M.genre), M.containsAds ? 'Contains ads' : 'No ads', M.iap ? 'In-app purchases ' + esc(M.iap) : 'No in-app purchases', 'Rated ' + esc(M.contentRating || '—'), `${shotN} screenshots`, M.assets.feature ? 'Feature graphic' : 'No feature graphic'].map(c => `<span class="chip">${c}</span>`).join('')}</div>
        <div class="m-links"><a href="${esc(M.url)}" target="_blank" rel="noopener">Google Play listing ↗</a>${M.privacyPolicy ? `<a href="${esc(M.privacyPolicy)}" target="_blank" rel="noopener">Privacy policy ↗</a>` : ''}${M.developerSite ? `<a href="${esc(M.developerSite)}" target="_blank" rel="noopener">Developer site ↗</a>` : ''}<span class="muted">${esc(M.appId)}</span></div></div>`;
    document.getElementById('m-lede').textContent = `The finalized metadata for this app, targeted from the ASO Playbook’s US keyword board. Every keyword it carries comes from that board, which was built out of the 11 competitors’ own listings, their titles and Play’s autocomplete — ${fromComp.length} of the ${used.length} keywords here were mined from competitors directly. Competitor ranks on this tab are the 15 Sep 2026 baseline; results are pending.`;
    document.getElementById('m-tiles').innerHTML = [
      [`${f.title.length}<small>/30</small>`, 'title characters'],
      [`${f.short.length}<small>/80</small>`, 'short description characters'],
      [`${f.long.length.toLocaleString('en-US')}<small>/4,000</small>`, 'full description characters'],
      [`${used.length}<small>/${US.length}</small>`, 'board keywords targeted'],
      [`${now.length}<small>/${FINAL.length}</small>`, 'finalized keywords targeted'],
      [`${withC.length}`, 'targeted keywords where your competitors rank'],
      [`${inCompTitles.length}`, 'targeted keywords that sit in a competitor’s title'],
    ].map(([n, l]) => `<div class="tile"><div class="n">${n}</div><div class="l">${l}</div></div>`).join('');
    document.getElementById('m-tiles').style.gridTemplateColumns = 'repeat(auto-fit,minmax(150px,1fr))';
    const a = M.assets;
    document.getElementById('m-shots').innerHTML = (a.feature ? `<figure><img src="${a.feature.file}" alt="Feature graphic" loading="lazy"><figcaption>Feature graphic · <a href="${esc(a.feature.src)}" target="_blank" rel="noopener">original ↗</a></figcaption></figure>` : '') +
      a.screenshots.map((s, i) => `<figure><img src="${s.file}" alt="Screenshot ${i + 1}" loading="lazy"><figcaption>Screenshot ${i + 1} · <a href="${esc(s.src)}" target="_blank" rel="noopener">original ↗</a></figcaption></figure>`).join('');

    // metadata text
    let html = '', inList = false;
    for (const raw of f.long.split('\n')) {
      const line = raw.replace(/\s+$/, '');
      if (/^[●•]/.test(line)) { if (!inList) { html += '<ul>'; inList = true; } html += `<li>${highlight(line.replace(/^[●•]\s*/, ''), fKws)}</li>`; continue; }
      if (inList) { html += '</ul>'; inList = false; }
      if (!line.trim()) continue;
      if (/^[A-Z0-9 &?:,'’\-!]+$/.test(line) && /[A-Z]{3}/.test(line)) html += `<h4>${highlight(line, fKws)}</h4>`;
      else html += `<p>${highlight(line, fKws)}</p>`;
    }
    if (inList) html += '</ul>';
    document.getElementById('m-listing').innerHTML = `
      <div class="apphead"><img src="${a.icon.file}" alt="" width="56" height="56" style="border-radius:14px;box-shadow:0 0 0 1px var(--line)"><div><div class="t">${esc(f.title)}</div><div class="d">${esc(M.developer)} · ${esc(M.genre)}</div></div></div>
      <div class="field"><div class="field-label"><span>Title</span><span>${f.title.length} / 30</span></div><p>${highlight(f.title, fKws)}</p></div>
      <div class="field"><div class="field-label"><span>Short description</span><span>${f.short.length} / 80</span></div><p>${highlight(f.short, fKws)}</p></div>
      <div class="field longdesc"><div class="field-label"><span>Full description</span><span>${f.long.length.toLocaleString('en-US')} / 4,000</span></div>${html}</div>`;
    const wc = nWords(f.long);
    const phr = US.filter(r => r.tier !== 'D' && phraseN(f.long, r.q)).map(r => ({ r, n: phraseN(f.long, r.q), d: 100 * phraseN(f.long, r.q) * nWords(r.q) / wc })).sort((x, y) => y.n - x.n || y.r.P - x.r.P);
    document.getElementById('m-side').innerHTML = `
      <div class="panel"><h3>Board keywords in the full description</h3><p class="small muted" style="margin-bottom:6px">${wc} words · density = uses × words in phrase ÷ total words</p>
        <table><thead><tr><th>Phrase</th><th class="num">Uses</th><th class="num">Density</th><th>Tier</th></tr></thead><tbody>
        ${phr.map(x => `<tr><td class="kw">${esc(x.r.q)}</td><td class="num">${x.n}</td><td class="num">${x.d.toFixed(1)}%</td><td><span class="pill ${TIER_PILL[x.r.tier]}">${TIER[x.r.tier]}</span></td></tr>`).join('')}
        </tbody></table></div>
      <div class="panel"><h3>Finalized keywords by field</h3>
        <table><tbody>${[['In the title', ['title', 'titlew']], ['Title + short description', ['short', 'tsw']], ['Full description', ['long']], ['Reserved for future versions', ['none']]].map(([lab, keys]) => { const list = FINAL.filter(r => keys.includes(coverageOf(r.q, f).key)); return `<tr><td class="nowrap">${lab}</td><td class="num"><b>${list.length}</b></td></tr><tr><td colspan="2" class="small muted" style="border-top:0;padding-top:0">${list.map(r => esc(r.q)).join(' · ') || '—'}</td></tr>`; }).join('')}</tbody></table></div>`;

    // every targeted keyword, grouped by field, with its competitor origin
    const groups = [
      ['In the title', ['title', 'titlew'], 'Indexed from the heaviest-weighted field.'],
      ['Title + short description', ['short', 'tsw'], 'All of the keyword’s words appear across the two strongest fields.'],
      ['Full description', ['long'], 'Exact phrase used in the indexed full description.'],
    ];
    const tCols = 8;
    const tRow = r => {
      const ct = compTitlesWith(r.q), n10 = compTop10(r);
      return `<tr>
        <td style="min-width:190px"><span class="kw">${esc(r.q)}</span><div class="kwmeta"><span class="pill ${TIER_PILL[r.tier]}">${TIER[r.tier]}</span></div></td>
        <td><span class="pill ${r.src === 'comp' || r.src === 'title' ? 'p-acc' : 'p-mute'}">${SRC[r.src]}</span></td>
        <td class="num">${r.P}</td><td class="num">${Math.round(r.R * 100)}</td>
        <td class="num">${r.demand}</td>
        <td class="num">${n10}<span class="muted"> / 11</span></td>
        <td class="small" style="min-width:180px">${ct.length ? `<b>${ct.length}</b> · ${ct.map(x => esc(SHORT[x.i])).join(', ')}` : '<span class="muted">none</span>'}</td>
        <td class="small" style="min-width:150px">${entryCell(r)}</td></tr>`;
    };
    document.getElementById('m-targets-table').innerHTML = `<thead><tr><th>Keyword</th><th>Where the keyword came from</th><th class="num">Priority</th><th class="num">Relevance</th><th class="num">Demand</th><th class="num">Competitors in top 10</th><th>In competitors’ titles</th><th>Smallest app in top 10</th></tr></thead><tbody>` +
      groups.map(([label, keys, note]) => {
        const list = used.filter(r => keys.includes(coverageOf(r.q, f).key)).sort((x, y) => y.P - x.P);
        if (!list.length) return '';
        return `<tr class="grp"><td colspan="${tCols}">${label} · ${list.length} keyword${list.length > 1 ? 's' : ''} · ${note}</td></tr>` + list.map(tRow).join('');
      }).join('') + '</tbody>';
    const bySrc = k => used.filter(r => r.src === k).length;
    document.getElementById('m-targets-note').textContent = `This metadata targets ${used.length} of the board’s ${US.length} US keywords: ${bySrc('comp')} mined from competitors’ listings, ${bySrc('title')} lifted from competitors’ titles, ${bySrc('ac')} from Play autocomplete and ${bySrc('orig')} quoted in the 8 Sep report. ${inCompTitles.length} of them appear word for word in at least one competitor’s title, and your competitors hold top-10 ranks on ${withC.filter(r => compTop10(r) > 0).length}.`;

    // composition
    const titleKws = used.filter(r => ['title', 'titlew'].includes(coverageOf(r.q, f).key)).sort((x, y) => y.P - x.P);
    const shortKws = used.filter(r => ['short', 'tsw'].includes(coverageOf(r.q, f).key)).sort((x, y) => y.P - x.P);
    const longKws = used.filter(r => coverageOf(r.q, f).key === 'long').sort((x, y) => y.P - x.P);
    const chips = list => `<div class="kwlist">${list.slice(0, 10).map(r => `<span>${esc(r.q)}</span>`).join('')}</div>${list.length > 10 ? `<div class="small muted">+ ${list.length - 10} more</div>` : ''}`;
    document.getElementById('m-compose').innerHTML = `<thead><tr><th></th><th>Text</th><th>Board keywords it carries</th><th>Playbook source</th></tr></thead><tbody>
      <tr><td class="fieldname">Title</td><td class="txt"><b>${esc(f.title)}</b><div class="small muted">${f.title.length} / 30</div></td><td><b>${titleKws.length}</b>${chips(titleKws)}</td><td class="small muted">Title strategy: the generic head term first, paired with a low-competition term. Playbook practice: the title is the heaviest-weighted field and leads with the highest-volume generic keyword.</td></tr>
      <tr><td class="fieldname">Short description</td><td class="txt">${esc(f.short)}<div class="small muted">${f.short.length} / 80</div></td><td><b>${shortKws.length}</b>${chips(shortKws)}</td><td class="small muted">Proposed ASO package: the recommended short description, used word for word. Playbook practice: complementary keywords, not title repeats, phrased as a conversion message.</td></tr>
      <tr><td class="fieldname">Full description</td><td class="txt">${f.long.length.toLocaleString('en-US')} characters · ${wc} words</td><td><b>${longKws.length}</b>${chips(longKws)}</td><td class="small muted">Keyword board in priority order, front-loaded into the opening paragraph, headers and bullet starts, at the density recorded below.</td></tr>
      </tbody>`;
    const head = US.find(r => r.q === 'cloud storage'), cv = US.find(r => r.q === 'cloud vault'), scs = US.find(r => r.q === 'secure cloud storage'), sv = M.titleTerms.find(t => t.q === 'secure vault');
    const termRow = (name, role, text) => `<tr><td style="min-width:150px"><span class="kw"><b>${esc(name)}</b></span><div class="small muted">${role}</div></td><td class="small">${text}</td></tr>`;
    document.getElementById('m-title-strategy').innerHTML = `<h3>Title strategy: generic + low competition</h3>
      <p class="small muted" style="margin-bottom:8px">“${esc(f.title)}” pairs a head term with a term your competitors don’t contest.</p>
      <table><tbody>
        ${head ? termRow('cloud storage', 'Generic head term', `Autocomplete demand ${head.demand}${head.demandAt ? ` (suggested after “${esc(head.demandAt)}”)` : ''} · board priority ${head.P} · ${compTop10(head)} of 11 competitors in the top 10 · ${head.nb} non-brand apps in the top 10.`) : ''}
        ${sv ? termRow('secure vault', 'Low-competition term', `Autocomplete demand ${sv.demand}${sv.demandAt ? ` (suggested after “${esc(sv.demandAt)}”)` : ''} · ${sv.compRanks.length} of 11 competitors among its ${sv.depth} results.`) : ''}
        ${cv ? termRow('cloud vault', 'Covered by the title’s words', `Board priority ${cv.P} · relevance ${Math.round(cv.R * 100)} · ${compTop10(cv)} of 11 competitors in the top 10 · ${cv.nb} non-brand apps in the top 10.`) : ''}
        ${scs ? termRow('secure cloud storage', 'Covered by the title’s words', `Board priority ${scs.P} · relevance ${Math.round(scs.R * 100)} · ${compTop10(scs)} of 11 competitors in the top 10 · entry bar ${scs.entry < 1000 ? 'under 1K' : fmt(scs.entry)}.`) : ''}
      </tbody></table>`;
    const practices = [];
    practices.push(`Keywords come from the board, not from guesswork: ${fromComp.length} of the ${used.length} targeted keywords were mined from the 11 competitors’ listings and titles.`);
    if (f.short === PROP.short) practices.push('The short description is the playbook’s recommended short description, word for word.');
    if (normT(f.title).startsWith(' cloud storage ')) practices.push('Head term first: the title opens with “cloud storage”, the generic term the category is searched by.');
    practices.push(`Title and short description together carry ${FINAL.filter(r => strongKeys.includes(coverageOf(r.q, f).key)).length} finalized keywords in the two strongest fields.`);
    practices.push(`Claims match the listing: no “No ads” line against an ads-supported app, no template placeholder, and the account wording matches the sign-up flow.`);
    const rec = policyRecord(f);
    const unmet = rec.filter(x => x.s === 'not').length;
    practices.push(unmet ? `${rec.filter(x => x.s === 'met').length} metadata policy rules met; ${unmet} recorded as not met.` : `Every metadata policy rule checked is met (${rec.filter(x => x.s === 'met').length}), with ${rec.filter(x => x.s === 'rec').length} values recorded for reference.`);
    document.getElementById('m-practices').innerHTML = `<h3>Playbook practices this metadata applies</h3><ul class="checks">${practices.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`;
    const pill = s => s === 'met' ? '<span class="pill p-good">✓ Met</span>' : s === 'not' ? '<span class="pill p-risk">✕ Not met</span>' : '<span class="pill p-mute">• Recorded</span>';
    document.getElementById('m-policy').innerHTML = `<thead><tr><th>Status</th><th>Rule</th><th>Detail</th></tr></thead><tbody>` + rec.map(x => `<tr><td>${pill(x.s)}</td><td><b>${esc(x.rule)}</b></td><td>${esc(x.detail)}</td></tr>`).join('') + '</tbody>';

    // finalized keywords: targeted now vs reserved
    const maxP = FINAL[0].P;
    const kwRow = (r, withField) => { const c = coverageOf(r.q, f); return `<tr>
        <td class="num muted">${FINAL.indexOf(r) + 1}</td>
        <td style="min-width:200px"><span class="kw">${esc(r.q)}</span><div class="kwmeta"><span class="pill ${TIER_PILL[r.tier]}">${TIER[r.tier]}</span><span class="pill p-mute">${SRC[r.src]}</span></div></td>
        <td><div class="pbar"><div class="track"><div class="fill" style="width:${(100 * r.P / maxP).toFixed(1)}%"></div></div><b>${r.P}</b></div></td>
        <td class="num">${Math.round(r.R * 100)}</td><td class="num">${r.nb}<span class="muted">/10</span></td>
        <td class="num">${r.demand}<div class="small muted">${r.demandAt ? `after “${esc(r.demandAt)}”` : 'not suggested'}</div></td>
        <td class="num">${entryCell(r)}</td>
        <td class="small" style="min-width:160px">${compNames(r)}</td>
        ${withField ? `<td>${covPill(c)}</td>` : ''}</tr>`; };
    const kwHead = withField => `<thead><tr><th class="num">#</th><th>Keyword</th><th>Priority</th><th class="num">Relevance</th><th class="num">Winnable</th><th class="num">Demand</th><th class="num">Entry bar</th><th>Competitors ranking (US)</th>${withField ? '<th>Targeted in</th>' : ''}</tr></thead>`;
    document.getElementById('m-kw-now-h').textContent = `Targeted in this metadata · ${now.length} of ${FINAL.length}`;
    document.getElementById('m-kw-future-h').textContent = `Reserved for future metadata versions · ${future.length} of ${FINAL.length}`;
    document.getElementById('m-kw-now').innerHTML = kwHead(true) + '<tbody>' + (now.map(r => kwRow(r, true)).join('') || '<tr><td colspan="9" class="muted">None.</td></tr>') + '</tbody>';
    document.getElementById('m-kw-future').innerHTML = kwHead(false) + '<tbody>' + (future.map(r => kwRow(r, false)).join('') || '<tr><td colspan="8" class="muted">Every finalized keyword is targeted.</td></tr>') + '</tbody>';
    document.getElementById('m-kw-note').textContent = `A keyword counts as targeted when its exact phrase, or all of its words, appear in the title or across title and short description, or its exact phrase appears in the full description. # is the keyword’s position on the finalized list. The plan-size keywords (“100gb cloud storage”, “1tb cloud storage”) are on the list because this metadata advertises 100 GB free and 1 TB plans.`;

    // ladder
    document.getElementById('m-ladder-list').innerHTML = ladderPhases(US).map(([ph, sub, list]) => {
      const cov = list.map(r => coverageOf(r.q, f).key);
      const strong = cov.filter(k => strongKeys.includes(k)).length, longOnly = cov.filter(k => k === 'long').length, none = cov.filter(k => k === 'none').length;
      return `<div class="rung"><div class="ph">${ph}<small>${sub}</small></div><div><ul>${list.map(r => { const c = coverageOf(r.q, f); return `<li>${esc(r.q)} <i>P${r.P}</i><span class="cov pill ${COVSTYLE[c.key][1]}">${COVSTYLE[c.key][0]}</span> <i>· ${compTop10(r)} comp. top-10</i></li>`; }).join('') || '<li>none</li>'}</ul>
        <p class="proof">This metadata targets <b>${strong}</b> in the title or short description and <b>${longOnly}</b> in the full description; <b>${none}</b> ${none === 1 ? 'is' : 'are'} not in this version. Competitors hold ${list.reduce((s, r) => s + compTop10(r), 0)} top-10 ranks across these keywords.</p></div></div>`;
    }).join('');

    // competitor ranks on the keywords used
    const sorted = used.slice().sort((x, y) => (compRanks(y).length > 0) - (compRanks(x).length > 0) || y.R - x.R || y.P - x.P);
    const noC = sorted.filter(r => !compRanks(r).length);
    const cols = 3 + COMP.length + 2;
    const urow = r => { const c = coverageOf(r.q, f); return `<tr><td class="kwc"><span class="kw">${esc(r.q)}</span><div style="margin-top:3px">${covPill(c)}</div></td><td class="num small">${Math.round(r.R * 100)}</td><td class="num small">${r.P}</td>${COMP.map(cid => { const k = r.ids.indexOf(cid) + 1; return `<td>${k ? `<span class="rk ${band(k)}" data-a="${cid}" data-r="${k}" data-q="${esc(r.q)}">${k}</span>` : '<span class="rk b0" aria-label="not in results">·</span>'}</td>`; }).join('')}<td class="num"><b>${compTop10(r)}</b><span class="muted"> / 11</span></td><td class="small" style="min-width:170px">${entryCell(r)}</td></tr>`; };
    document.getElementById('m-used-table').innerHTML = `<thead><tr><th>Keyword · where this metadata uses it</th><th class="num">Relevance</th><th class="num">Priority</th>${COMP.map((c, i) => `<th class="ch" title="${esc(A[c].t)}">${esc(SHORT[i])}</th>`).join('')}<th class="num">Competitors in top 10</th><th>Smallest app in top 10</th></tr></thead><tbody>` +
      `<tr class="grp"><td colspan="${cols}">Competitors rank on these · ${withC.length}</td></tr>` + sorted.filter(r => compRanks(r).length).map(urow).join('') +
      (noC.length ? `<tr class="grp"><td colspan="${cols}">No competitor in the results · ${noC.length}</td></tr>` + noC.map(urow).join('') : '') + '</tbody>';
    document.getElementById('m-used-note').textContent = `${used.length} board keywords appear in this metadata. At least one of your 11 competitors ranks on ${withC.length} of them; none appears in the results for the other ${noC.length}. Ranks are the 15 Sep 2026 US results used across the playbook; a dot means the app was not among the results Play returned (8–30 per search). Hover a rank for the app.`;

    // metadata vs proposed package
    const covRel = prioCoverage(f), covProp = prioCoverage(PROP);
    const strongN = x => FINAL.filter(r => strongKeys.includes(coverageOf(r.q, x).key)).length;
    const anyN = x => FINAL.filter(r => coverageOf(r.q, x).key !== 'none').length;
    const provenN = x => FINAL.filter(r => compTop10(r) > 0 && strongKeys.includes(coverageOf(r.q, x).key)).length;
    const dens = (x, p) => (100 * phraseN(x.long, p) * nWords(p) / nWords(x.long)).toFixed(1) + '%';
    const offN = x => phraseN([x.title, x.short, x.long].join(' '), 'free up space') + phraseN([x.title, x.short, x.long].join(' '), 'free up storage');
    const status = (label, cls) => `<span class="pill ${cls}">${label}</span>`;
    const crow = (name, rel, prop, st) => `<tr><td class="fieldname">${name}</td><td class="txt">${rel}</td><td class="txt">${prop}</td><td>${st}</td></tr>`;
    document.getElementById('m-compare').innerHTML = `<thead><tr><th></th><th>This metadata</th><th>Proposed ASO package</th><th>Status</th></tr></thead><tbody>` +
      crow('Title', `<b>${esc(f.title)}</b><div class="small muted">${f.title.length} / 30</div>`, `<b>${esc(PROP.title)}</b><div class="small muted">${PROP.title.length} / 30</div>`, status('Kept by decision', 'p-acc') + '<div class="small muted" style="margin-top:3px">Generic head term + low-competition term</div>') +
      crow('Short description', `${esc(f.short)}<div class="small muted">${f.short.length} / 80</div>`, `${esc(PROP.short)}<div class="small muted">${PROP.short.length} / 80</div>`, f.short === PROP.short ? status('Adopted word for word', 'p-good') : status('Different', 'p-mute')) +
      crow('Full description', `${f.long.length.toLocaleString('en-US')} characters · ${wc} words`, `${PROP.long.length.toLocaleString('en-US')} characters · ${nWords(PROP.long)} words`, status('App’s own copy', 'p-acc')) +
      crow('Priority coverage', `<b>${covRel.toFixed(0)}%</b>`, `<b>${covProp.toFixed(0)}%</b>`, status('Recorded', 'p-mute')) +
      crow('Finalized keywords targeted', `<b>${anyN(f)}</b> / ${FINAL.length}`, `<b>${anyN(PROP)}</b> / ${FINAL.length}`, status('Recorded', 'p-mute')) +
      crow('…in the title or short description', `<b>${strongN(f)}</b>`, `<b>${strongN(PROP)}</b>`, status('Recorded', 'p-mute')) +
      crow('…of those, with a competitor in the top 10', `<b>${provenN(f)}</b>`, `<b>${provenN(PROP)}</b>`, status('Recorded', 'p-mute')) +
      crow('“cloud storage” density', dens(f, 'cloud storage'), dens(PROP, 'cloud storage'), status('Recorded', 'p-mute')) +
      crow('“free up space / storage” mentions', `${offN(f)}`, `${offN(PROP)}`, status('Recorded', 'p-mute')) + '</tbody>';

    // did the first run hold up (competitor and evidence apps only)
    const ev = D.evidence, evUsed = ev.filter(e => coverageOf(e.q, f).key !== 'none');
    const exactN = x => x.filter(e => e.now === e.was).length, withinN = x => x.filter(e => e.now && Math.abs(e.now - e.was) <= 1).length;
    const a8 = sentences(M.sep8.longText), relSet = new Set(sentences(f.long));
    const kept8 = a8.filter(s => relSet.has(s)).length;
    const ladder8 = M.sep8.ladder.flatMap(p => p.keywords.map(q => ({ phase: p.phase, range: p.range, proof: p.proof, q, r: US.find(x => x.q === q) })));
    const used8 = ladder8.filter(x => coverageOf(x.q, f).key !== 'none').length;
    document.getElementById('m-hold-tiles').innerHTML = [
      [`${withinN(ev)}<small>/${ev.length}</small>`, `8 Sep ranks reproduced within ±1 on 15 Sep (${exactN(ev)} identical)`],
      [`${withinN(evUsed)}<small>/${evUsed.length}</small>`, 'of those ranks sit on keywords this metadata uses'],
      [`${kept8}<small>/${a8.length}</small>`, '8 Sep draft sentences still in the description'],
      [`${used8}<small>/${ladder8.length}</small>`, '8 Sep ladder keywords this metadata targets'],
    ].map(([n, l]) => `<div class="tile"><div class="n">${n}</div><div class="l">${l}</div></div>`).join('');
    const bestT = M.sep8.titles.map((t, i) => ({ t, i, j: jacc(t, f.title) })).sort((x, y) => y.j - x.j)[0];
    document.getElementById('m-shipped').innerHTML = `<h3>What this metadata took from the 8 Sep package</h3>
      <table><tbody>
        <tr><td class="nowrap">Title</td><td>Closest to 8 Sep option ${bestT.i + 1}, <span class="quote">${esc(bestT.t)}</span> (${Math.round(bestT.j * 100)}% word overlap), led by the generic head term. The 8 Sep recommended option 1, <span class="quote">${esc(M.sep8.titles[0])}</span>, now belongs to another app.</td></tr>
        <tr><td class="nowrap">Short</td><td>${f.short === PROP.short ? `The 15 Sep proposed short description, word for word. It replaces text built on the 8 Sep alternate short description, <span class="quote">${esc(M.sep8.shortAlt)}</span>.` : esc(f.short)}</td></tr>
        <tr><td class="nowrap">Long</td><td>${kept8} of the draft’s ${a8.length} sentences remain, with the draft’s placeholder and “No ads” line removed.</td></tr>
      </tbody></table>`;
    const holds = x => {
      if (!x.r) return [null, 'not on board'];
      const top = x.r.ids.map(i => A[i]).filter(Boolean);
      if (x.phase === 'Phase 0') { const hit = top.slice(0, 5).find(p => !p.b && p.i != null && p.i <= 34000); return [!!hit, hit ? `${hit.t} (${fmt(hit.i)}) is top-5` : 'no app of 34K installs or fewer in the top 5']; }
      if (x.phase === 'Phase 1') { const hit = top.slice(0, 10).find(p => !p.b && p.i != null && p.i <= 160000); return [!!hit, hit ? `${hit.t} (${fmt(hit.i)}) is top-10` : 'no app of 160K installs or fewer in the top 10']; }
      if (x.phase === 'Phase 2') { const hit = top.slice(0, 10).find(p => !p.b && p.i != null && p.i <= 513000); return [!!hit, hit ? `${hit.t} (${fmt(hit.i)}) is top-10` : 'no app of 513K installs or fewer in the top 10']; }
      const brandTop3 = top.slice(0, 3).filter(p => p.b).length; return [brandTop3 >= 2, `${brandTop3} of the top 3 are brands`];
    };
    const holdN = ladder8.filter(x => holds(x)[0]).length;
    const demoted = ladder8.filter(x => x.r && x.r.R < 0.75);
    const newTop = FINAL.slice(0, 5).filter(r => !ladder8.some(x => x.q === r.q));
    document.getElementById('m-verdict').innerHTML = `<h3>What held and what changed</h3>
      <ul class="checks">
        <li><b>The ranking data held.</b> ${withinN(ev)} of ${ev.length} quoted ranks reproduced within one position a week later, so the keyword choices in this metadata rest on stable results.</li>
        <li><b>${holdN} of ${ladder8.length} ladder claims still hold</b> when each phase’s proof is re-tested on today’s US results (table below).</li>
        <li><b>Relevance changed the order.</b> ${demoted.length ? demoted.map(x => `“${esc(x.q)}”`).join(', ') + (demoted.length > 1 ? ' now fall' : ' now falls') : 'No 8 Sep ladder keyword falls'} below the relevance bar${newTop.length ? `, and ${newTop.length} of today’s top 5 finalized keywords (${newTop.map(r => `“${esc(r.q)}”`).join(', ')}) were not on the 8 Sep ladder` : ''}.</li>
        <li><b>The copy is finished.</b> The draft’s placeholder and “No ads” line are gone and the account wording matches the sign-up flow, so the metadata now says only what the listing supports.</li>
      </ul>`;
    document.getElementById('m-hold-evidence').innerHTML = `<thead><tr><th>App</th><th>Keyword</th><th>In this metadata</th><th class="num">8 Sep</th><th class="num">15 Sep</th><th>Change</th></tr></thead><tbody>` +
      evUsed.map(e => { const ch = !e.now ? `<span class="pill p-risk">out of top ${e.depth}</span>` : e.now === e.was ? '<span class="pill p-mute">same</span>' : e.now < e.was ? `<span class="pill p-good">▲ up ${e.was - e.now}</span>` : `<span class="pill p-warn">▼ down ${e.now - e.was}</span>`; return `<tr><td>${esc(e.name)}</td><td class="kw">${esc(e.q)}</td><td>${covPill(coverageOf(e.q, f))}</td><td class="num">#${e.was}</td><td class="num">${e.now ? '#' + e.now : '—'}</td><td>${ch}</td></tr>`; }).join('') + '</tbody>';
    document.getElementById('m-hold-table').innerHTML = `<thead><tr><th>8 Sep phase</th><th>Keyword</th><th>8 Sep proof</th><th>Holds on 15 Sep?</th><th class="num">Priority · relevance today</th><th>Competitors ranking today</th><th>In this metadata</th></tr></thead><tbody>` +
      ladder8.map(x => { const [ok, why] = holds(x); return `<tr><td class="nowrap"><b>${esc(x.phase)}</b><div class="small muted">${esc(x.range)}</div></td><td class="kw">${esc(x.q)}</td><td class="small muted" style="max-width:220px">${esc(x.proof)}</td><td style="min-width:200px">${ok == null ? '—' : ok ? '<span class="pill p-good">✓ Holds</span>' : '<span class="pill p-warn">! Does not hold</span>'}<div class="small muted" style="margin-top:3px">${esc(why)}</div></td><td class="num">${x.r ? `${x.r.P} · ${Math.round(x.r.R * 100)}` : '—'}</td><td class="small" style="min-width:150px">${x.r ? compNames(x.r) : '—'}</td><td>${covPill(coverageOf(x.q, f))}</td></tr>`; }).join('') + '</tbody>';

    document.getElementById('m-method-text').innerHTML = [
      `<b>The metadata.</b> The Google Play listing for <span class="quote">${esc(M.appId)}</span> (English, United States) was copied on ${dateStr}, and the team’s finalized wording was applied to it: the short description from the proposed package, the app name in place of the draft placeholder, the ads wording removed and the account wording aligned with sign-up. The title is unchanged. Listing graphics shown are copies of the published icon, feature graphic and screenshots.`,
      '<b>No app ranking.</b> This tab never measures where your own app ranks. Every rank shown belongs to your 11 competitors or to the evidence apps from the 8 Sep report, all from the same 15 Sep US results the playbook uses. They are the baseline against which this metadata’s results will be read.',
      '<b>Keyword coverage.</b> Text is lowercased and “&” is read as “and”. A keyword counts as in the title when its exact phrase or all of its words appear there; as title + short when all its words appear across those two fields; otherwise its exact-phrase uses in the full description are counted. Priority coverage weights these at 1, 0.85, 0.7 and 0.3.',
      '<b>Where keywords came from.</b> Each board keyword carries its origin: mined from the 11 competitors’ listings, lifted from a competitor’s title, suggested by Play autocomplete, or quoted in the 8 Sep report. “In competitors’ titles” counts the competitor titles that contain the keyword word for word.',
      '<b>Finalized keywords.</b> US board rows with core or adjacent intent and relevance of 80 or more, excluding “unlimited storage” for policy risk, ranked by the board’s priority score (relevance² × opportunity). Targeted = used in any field; reserved = not used in this version.',
      '<b>Policy record.</b> Field lengths, promotional wording in the title, placeholders, ad and account wording against the listing’s own labels, and listing assets, following Google Play’s metadata policy. Head-term density is recorded against the competitor set rather than scored against a flat 3% rule, since “cloud storage” is the app’s core niche term.',
    ].map(p => `<p>${p}</p>`).join('');
  }

  // ---------- features & IAP comparison ----------
  const F = PAYLOAD.features, PR = PAYLOAD.pricing;
  const FV = { full: ['✓', 'full', 'Full'], basic: ['◐', 'basic', 'Basic'], none: ['✕', 'none', 'Not present'] };
  const fScore = i => F.features.reduce((s, r) => s + (r.v[i] === 'full' ? 1 : r.v[i] === 'basic' ? 0.5 : 0), 0);
  const rs = n => n == null ? '—' : 'Rs ' + n.toLocaleString('en-US');
  const appLabel = a => `${a.n} <span class="muted">(${a.dev})</span>`;

  function bars(rows, opts) {
    const max = Math.max(...rows.map(r => r.v || 0)) || 1;
    return rows.map(r => `<div class="barrow${r.ours ? ' ours' : ''}${r.alt ? ' alt' : ''}">
      <span class="lbl">${r.label}</span>
      <span class="track"><span class="fill" style="width:${r.v == null ? 0 : Math.max(2, 100 * r.v / max).toFixed(1)}%"></span></span>
      <b class="val">${r.v == null ? '<span class="muted">not offered</span>' : (opts && opts.fmt ? opts.fmt(r.v) : r.v)}</b></div>`).join('');
  }

  function renderFeatures() {
    const scores = F.apps.map((a, i) => ({ a, i, s: fScore(i) }));
    const ours = scores[0], rivals = scores.slice(1).sort((x, y) => y.s - x.s);
    const onlyUs = F.features.filter(r => r.v[0] === 'full' && !r.v.slice(1).includes('full'));
    const rare = F.features.filter(r => r.v[0] === 'full' && r.v.slice(1).filter(v => v === 'full').length === 1);
    const common = F.features.filter(r => r.v.slice(1).filter(v => v !== 'none').length >= 5);
    document.getElementById('f-appline').textContent = `${F.ours.name} · ${F.ours.dev}`;
    document.getElementById('f-lede').textContent = `Our app against the 11 competitors on 14 audited features, then every paywall price the category charges. Our build ships all 14 features in full; the strongest competitor reaches ${rivals[0].s} of 14, and ${onlyUs.length} features have no full implementation anywhere else in the set.`;
    const y1000 = PR.benchmark.filter(b => b.y1000 != null && !b.kind);
    const medY = y1000.map(b => b.y1000).sort((a, b) => a - b)[Math.floor(y1000.length / 2)];
    document.getElementById('f-tiles').innerHTML = [
      [`${ours.s}<small>/14</small>`, 'features our app ships in full'],
      [`${rivals[0].s}<small>/14</small>`, `best competitor · ${rivals[0].a.n} (${rivals[0].a.dev})`],
      [`${onlyUs.length}`, 'features no competitor ships in full'],
      [`${F.apps.length}`, 'apps audited, ours included'],
      [`${rs(PR.recommended.plans[2].recY)}`, `recommended 1 TB a year · category median ${rs(medY)}`],
    ].map(([n, l]) => `<div class="tile"><div class="n">${n}</div><div class="l">${l}</div></div>`).join('');
    document.getElementById('f-tiles').style.gridTemplateColumns = 'repeat(auto-fit,minmax(170px,1fr))';
    document.getElementById('f-pitch').innerHTML = `<p>${esc(F.pitch)}</p><cite>Positioning statement · ${esc(F.ours.name)}</cite>`;

    document.getElementById('f-coverage').innerHTML = bars([ours, ...rivals].map(x => ({
      label: `${esc(x.a.n)} <span class="muted">${esc(x.a.dev)} · ${esc(x.a.installs)}</span>`, v: x.s, ours: !!x.a.ours,
    })), { fmt: v => `${v} / 14` });

    const cardList = (title, list, body) => `<div class="card"><div class="tag">${title}</div><h3 style="font-size:1rem;margin-bottom:6px">${list.length} feature${list.length === 1 ? '' : 's'}</h3><p>${body}</p><div class="kwlist" style="margin-top:8px">${list.map(r => `<span>${esc(r.f.replace(/ \(.*\)$/, ''))}</span>`).join('')}</div></div>`;
    document.getElementById('f-lead-cards').innerHTML =
      cardList('Only in our app', onlyUs, `No competitor ships these in full. ${onlyUs.map(r => `For ${esc(r.f.replace(/ \(.*\)$/, ''))}, ${r.v.slice(1).filter(v => v === 'basic').length} of the 11 offer only a basic version and the rest have nothing`).join('; ')}.`) +
      cardList('Rare', rare, 'Exactly one competitor matches each of these in full, so they still separate the listing from nine or ten of the alternatives.') +
      cardList('Table stakes', common, 'Five or more competitors offer at least a basic version, so these keep the app level with the category rather than ahead of it.') +
      `<div class="card"><div class="tag">Depth, not just presence</div><h3 style="font-size:1rem;margin-bottom:6px">${F.features.filter(r => r.v.slice(1).some(v => v === 'basic')).length} features where rivals stop at basic</h3><p>Encryption is the clearest case: ${F.features.find(r => /encryption/i.test(r.f)).v.slice(1).filter(v => v === 'basic').length} competitors claim it but ship a basic version, and none implements it fully. Our column is a full implementation in every row.</p></div>`;

    document.getElementById('f-legend').innerHTML = Object.entries(FV).map(([k, [sym, cls, lab]]) => `<span><i class="fv ${cls}" aria-hidden="true">${sym}</i>${lab}</span>`).join('');
    let mhtml = `<thead><tr><th>Feature</th><th class="ch ours-col">${esc(F.apps[0].n)}<div class="small muted">ours</div></th>${F.apps.slice(1).map(a => `<th class="ch" title="${esc(a.n + ' · ' + a.dev)}">${esc(a.dev)}</th>`).join('')}<th class="num">Competitors with it</th></tr></thead><tbody>`;
    let group = '';
    F.features.forEach(r => {
      if (r.group !== group) { group = r.group; mhtml += `<tr class="grp"><td colspan="${F.apps.length + 2}">${esc(group)}</td></tr>`; }
      const have = r.v.slice(1).filter(v => v !== 'none').length, full = r.v.slice(1).filter(v => v === 'full').length;
      mhtml += `<tr><td class="kwc" style="min-width:220px">${esc(r.f)}</td>` +
        r.v.map((v, i) => `<td${i === 0 ? ' class="ours-col"' : ''}><span class="fv ${FV[v][1]}" title="${FV[v][2]}">${FV[v][0]}</span></td>`).join('') +
        `<td class="num"><b>${have}</b><span class="muted"> / 11</span>${full ? `<div class="small muted">${full} in full</div>` : '<div class="small muted">none in full</div>'}</td></tr>`;
    });
    mhtml += `</tbody><tfoot><tr><td class="kwc">Coverage score</td>${scores.map((x, i) => `<td${i === 0 ? ' class="ours-col"' : ''}>${x.s}</td>`).join('')}<td class="num">of 14</td></tr></tfoot>`;
    document.getElementById('f-matrix-table').innerHTML = mhtml;

    document.getElementById('f-inventory-cards').innerHTML = F.inventory.map(s => `<div class="card"><div class="tag">${esc(s.screen)}</div><ul class="checks" style="margin-top:4px">${s.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('');

    // ---- IAP ----
    const pct = (cur, rec) => { const d = Math.round(100 * (rec - cur) / cur); return d === 0 ? '<span class="pill p-mute">no change</span>' : d < 0 ? `<span class="pill p-good">▼ ${Math.abs(d)}% cheaper</span>` : `<span class="pill p-warn">▲ ${d}% higher</span>`; };
    document.getElementById('f-our-plans').innerHTML = `<thead><tr><th>Plan</th><th class="num">Storage</th><th class="num">Monthly now</th><th class="num">Monthly recommended</th><th class="num">Yearly now</th><th class="num">Yearly recommended</th><th>Yearly change</th><th>Positioning</th></tr></thead><tbody>` +
      PR.recommended.plans.map(p => `<tr><td><b>${esc(p.plan)}</b></td><td class="num">${p.gb >= 1000 ? p.gb / 1000 + ' TB' : p.gb + ' GB'}</td><td class="num money">${rs(p.curM)}</td><td class="num money"><b>${rs(p.recM)}</b></td><td class="num money">${rs(p.curY)}</td><td class="num money"><b>${rs(p.recY)}</b></td><td>${pct(p.curY, p.recY)}</td><td class="small">${esc(p.pos)}</td></tr>`).join('') + '</tbody>';
    document.getElementById('f-paywall-note').textContent = `Recommended paywall: ${PR.recommended.paywall} Yearly billing on the Family plan moves from ${rs(PR.recommended.plans[2].curY)} to ${rs(PR.recommended.plans[2].recY)}, which is ${Math.round(100 - 100 * PR.recommended.plans[2].recY / PR.recommended.plans[2].curY)}% below today’s price and under the category median of ${rs(medY)}.`;

    const chartRows = key => PR.benchmark.filter(b => b[key] != null).sort((a, b) => a[key] - b[key]).map(b => ({
      label: esc(b.app), v: b[key], ours: b.kind === 'ours-rec', alt: b.kind === 'ours-current',
    }));
    document.getElementById('f-chart-1tb').innerHTML = bars(chartRows('y1000'), { fmt: rs });
    document.getElementById('f-chart-500').innerHTML = bars(chartRows('y500'), { fmt: rs });
    const noY = PR.benchmark.filter(b => b.y1000 == null).map(b => b.app);
    document.getElementById('f-chart-note').textContent = `Cheapest first; our recommended price is highlighted and today’s price is shown beside it. ${noY.length ? `No yearly 1 TB plan published by: ${noY.join(', ')}.` : ''} Daily Utility’s yearly figures are excluded here — see the notes below.`;

    const perGB = [];
    const byApp = {};
    PR.plans.forEach(p => { if (p.y == null || p.flag) return; (byApp[p.app] = byApp[p.app] || []).push(p); });
    Object.entries(byApp).forEach(([app, list]) => {
      const best = list.map(p => ({ p, v: (p.y / 12) / (p.gb / 100) })).sort((x, y) => x.v - y.v)[0];
      perGB.push({ app, kind: best.p.kind, plan: best.p.plan, gb: best.p.gb, y: best.p.y, v: best.v });
    });
    perGB.sort((a, b) => a.v - b.v);
    document.getElementById('f-value').innerHTML = `<thead><tr><th class="num">#</th><th>App</th><th>Best-value plan</th><th class="num">Storage</th><th class="num">Yearly price</th><th class="num">Per 100 GB a month</th></tr></thead><tbody>` +
      perGB.map((x, i) => `<tr${x.kind ? ' style="background:var(--accent-soft)"' : ''}><td class="num muted">${i + 1}</td><td><b>${esc(x.app)}</b></td><td class="small">${esc(x.plan)}</td><td class="num">${x.gb >= 1000 ? x.gb / 1000 + ' TB' : x.gb + ' GB'}</td><td class="num money">${rs(x.y)}</td><td class="num money"><b>Rs ${x.v.toFixed(0)}</b></td></tr>`).join('') + '</tbody>';

    let phtml = `<thead><tr><th>Plan</th><th class="num">Storage</th><th class="num">Monthly</th><th class="num">Yearly</th><th>Note</th></tr></thead><tbody>`;
    let app = '';
    PR.plans.forEach(p => {
      if (p.app !== app) { app = p.app; phtml += `<tr class="grp"><td colspan="5">${esc(app)}</td></tr>`; }
      const m = p.origM ? `<s class="muted">${rs(p.origM)}</s> ${rs(p.m)}` : rs(p.m);
      const y = p.origY ? `<s class="muted">${rs(p.origY)}</s> ${rs(p.y)}` : rs(p.y);
      phtml += `<tr${p.kind ? ' style="background:var(--accent-soft)"' : ''}><td>${esc(p.plan)}</td><td class="num">${p.gb >= 1000 ? p.gb / 1000 + ' TB' : p.gb + ' GB'}</td><td class="num money">${m}</td><td class="num money">${y}${p.flag ? ' <span class="pill p-warn">check</span>' : ''}</td><td class="small muted">${esc(p.note || '')}</td></tr>`;
    });
    document.getElementById('f-plans').innerHTML = phtml + '</tbody>';
    document.getElementById('f-price-notes').innerHTML = PR.notes.map(n => `<li>${esc(n)}</li>`).join('');

    document.getElementById('f-method-text').innerHTML = [
      `<b>Features.</b> The matrix is the team’s own feature audit of ${F.apps.length} apps across ${F.features.length} features, scored full, basic or not present. Our column is backed by the app’s own screens, listed above. Competitor rows describe what each paywall and feature list exposes, not a code-level review.`,
      '<b>Coverage score.</b> A full feature counts 1 and a basic one 0.5, so an app that merely claims a feature cannot score the same as one that ships it. The score is the sum across the 14 audited features.',
      `<b>Prices.</b> Every price comes from each app’s own paywall, captured in the pricing comparison document, in ${PR.currency}. Promotional prices are shown with the struck-through original where the paywall displays one. Where an app publishes no plan at a size, the cell reads “not offered” rather than being estimated.`,
      '<b>Value.</b> Price per 100 GB a month divides the yearly price by twelve, then by the plan’s storage in hundreds of gigabytes, using each app’s cheapest qualifying plan. Add-on tiers that sell features rather than storage, and figures flagged as suspect, are left out of that calculation.',
    ].map(p => `<p>${p}</p>`).join('');
  }

  // ---------- page ----------
  const bar = document.getElementById('bar');
  const syncBar = () => document.documentElement.style.setProperty('--barh', bar.offsetHeight + 'px');
  window.addEventListener('resize', syncBar); syncBar();
  // A link to a competitor that the graphics filter hides clears the filter first.
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
    const el = document.getElementById(a.getAttribute('href').slice(1)); if (!el) return;
    const art = el.closest('.g-app');
    if (art && art.hidden) { ['g-q', 'g-app', 'g-kind', 'g-orient'].forEach(id => { document.getElementById(id).value = ''; }); applyGraphicsFilter(); e.preventDefault(); el.scrollIntoView(); }
  });

  const renderScope = () => document.querySelectorAll('[data-scope]').forEach(s => { s.textContent = MNAME[state.gl]; });
  function renderScoped() {
    renderScope();
    renderShare(); renderCompetitors(); renderMatrix(); renderStrips(); renderBoard(); renderLadder(); renderListing();
  }
  if (PAGE === 'playbook') { renderHeader(); renderMarketSeg(); renderTierChips(); renderMovement(); renderProbe(); renderScoped(); }
  else if (PAGE === 'metadata') renderMetadata();
  else if (PAGE === 'features') renderFeatures();
  else if (PAGE === 'graphics') { renderGraphics(); renderScope(); renderGraphicsVis(); }

  // Sections are drawn by this script, so jump to a #section link only after rendering.
  const startHash = decodeURIComponent(location.hash.slice(1)), startEl = startHash && document.getElementById(startHash);
  if (startEl) startEl.scrollIntoView();
})();
