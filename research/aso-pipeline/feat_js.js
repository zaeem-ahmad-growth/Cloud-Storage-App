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
      cardList('Only in our app', onlyUs, `No competitor ships these in full. ${onlyUs.map(r => `On ${esc(r.f.replace(/ \(.*\)$/, '').toLowerCase())}, ${r.v.slice(1).filter(v => v === 'basic').length} of 11 offer a basic version and the rest have nothing`).join('. ')}.`) +
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

