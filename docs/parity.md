# Artifact parity report

> Produced on 2026-09-22 by a one-off audit that compared each Claude artifact with this repository, line by line. Re-run the audit only when an artifact changes; day-to-day edits happen in this repository, which is the master copy.

## https://claude.ai/artifact/GMDahxdE589GyGefGyTdpK

Artifact version `1789545617-d633` (the live version on 2026-09-22).

### Files

118 of 118 published files are in the repository, byte for byte (SHA-256).

| Artifact path | Repository path |
| --- | --- |
| `graphics/` | `tabs/04-competitors-graphics/graphics/` |
| `mylisting/` | `assets/mylisting/` |

### Data

**Identical.** Every value in the artifact's `PAYLOAD` was compared with [assets/data.js](../assets/data.js) after undoing the one intended change: image paths now point into `assets/` (`mylisting/` → `../../assets/mylisting/`). `assets/data.js` is laid out one field per line; the values are unchanged.

### Script

[assets/app.js](../assets/app.js) is the artifact's script with only the changes needed to run one tab per page: 851 of 889 artifact lines are unchanged, 38 replaced and 32 added. What changed:

- At the top: `PAGE` (read from `<body data-page>`) and an `on(id, …)` helper that attaches a listener only if the element exists on this page.
- Listener lines that used `document.getElementById(id).addEventListener(…)` now use `on(id, …)`; lightbox listeners are guarded with `if (lb)`.
- The tab-switching block at the end (`setTab`, tab buttons, cross-tab anchor handling) is replaced by a block that runs only the current page's render functions and then scrolls to `#section` links.

<details><summary>Exact lines removed and added</summary>

```diff
-   document.getElementById('market-seg').addEventListener('click', e => {
-   document.getElementById('matrix-all').addEventListener('change', e => { state.matrixAll = e.target.checked; renderMatrix(); });
-   document.getElementById('strips').addEventListener('click', e => {
-   document.getElementById('strips-more').addEventListener('click', () => { state.stripsAll = !state.stripsAll; renderStrips(); });
-   document.getElementById('tier-chips').addEventListener('click', e => {
-   document.getElementById('kw-search').addEventListener('input', e => { state.q = e.target.value.trim().toLowerCase(); renderBoard(); });
-   document.getElementById('board').addEventListener('click', e => {
-   ['g-q', 'g-app', 'g-kind', 'g-orient'].forEach(id => document.getElementById(id).addEventListener('input', applyGraphicsFilter));
-   document.getElementById('graphics').addEventListener('click', e => {
-   document.getElementById('lb-close').addEventListener('click', () => lb.close());
-   document.getElementById('lb-prev').addEventListener('click', () => lbStep(-1));
-   document.getElementById('lb-next').addEventListener('click', () => lbStep(1));
-   lb.addEventListener('click', e => { if (e.target === lb || e.target.id === 'lb-in') lb.close(); });
-   lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') lbStep(-1); if (e.key === 'ArrowRight') lbStep(1); });
-   // ---------- tabs ----------
-   window.addEventListener('resize', syncBar);
-   const TABS = ['playbook', 'graphics', 'metadata', 'features'];
-   function setTab(t, scrollTop) {
-     document.querySelectorAll('[data-tab]').forEach(el => { el.hidden = el.dataset.tab !== t; });
-     TABS.forEach(x => { document.getElementById('tab-' + x).setAttribute('aria-selected', String(x === t)); document.getElementById('jump-' + x).hidden = x !== t; });
-     document.getElementById('mk').hidden = t !== 'playbook';
-     tip.hidden = true;
-     syncBar();
-     if (scrollTop) window.scrollTo(0, 0);
-   }
-   document.getElementById('tab-playbook').addEventListener('click', () => setTab('playbook', true));
-   document.getElementById('tab-graphics').addEventListener('click', () => setTab('graphics', true));
-   document.getElementById('tab-metadata').addEventListener('click', () => setTab('metadata', true));
-   document.getElementById('tab-features').addEventListener('click', () => setTab('features', true));
-     const host = el.closest('[data-tab]');
-     if (host && host.hidden) { e.preventDefault(); setTab(host.dataset.tab, false); el.scrollIntoView(); }
-     document.querySelectorAll('[data-scope]').forEach(s => { s.textContent = MNAME[state.gl]; });
-     renderShare(); renderCompetitors(); renderMatrix(); renderStrips(); renderBoard(); renderLadder(); renderListing(); renderGraphicsVis();
-   renderHeader(); renderMarketSeg(); renderTierChips(); renderMovement(); renderProbe(); renderGraphics(); renderMetadata(); renderFeatures(); renderScoped();
-   const startHash = decodeURIComponent(location.hash.slice(1));
-   const startEl = startHash && document.getElementById(startHash);
-   const startHost = startEl && startEl.closest('[data-tab]');
-   if (startHost && startHost.dataset.tab !== 'playbook') { setTab(startHost.dataset.tab, false); startEl.scrollIntoView(); } else setTab('playbook', false);
+   const PAGE = document.body.dataset.page;
+   // Listeners for elements that exist on one tab page only.
+   const on = (id, ...args) => { const el = document.getElementById(id); if (el) el.addEventListener(...args); };
+   on('market-seg', 'click', e => {
+   on('matrix-all', 'change', e => { state.matrixAll = e.target.checked; renderMatrix(); });
+   on('strips', 'click', e => {
+   on('strips-more', 'click', () => { state.stripsAll = !state.stripsAll; renderStrips(); });
+   on('tier-chips', 'click', e => {
+   on('kw-search', 'input', e => { state.q = e.target.value.trim().toLowerCase(); renderBoard(); });
+   on('board', 'click', e => {
+   ['g-q', 'g-app', 'g-kind', 'g-orient'].forEach(id => on(id, 'input', applyGraphicsFilter));
+   on('graphics', 'click', e => {
+   on('lb-close', 'click', () => lb.close());
+   on('lb-prev', 'click', () => lbStep(-1));
+   on('lb-next', 'click', () => lbStep(1));
+   if (lb) lb.addEventListener('click', e => { if (e.target === lb || e.target.id === 'lb-in') lb.close(); });
+   if (lb) lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') lbStep(-1); if (e.key === 'ArrowRight') lbStep(1); });
+   // ---------- page ----------
+   window.addEventListener('resize', syncBar); syncBar();
+   // A link to a competitor that the graphics filter hides clears the filter first.
+   const renderScope = () => document.querySelectorAll('[data-scope]').forEach(s => { s.textContent = MNAME[state.gl]; });
+     renderScope();
+     renderShare(); renderCompetitors(); renderMatrix(); renderStrips(); renderBoard(); renderLadder(); renderListing();
+   if (PAGE === 'playbook') { renderHeader(); renderMarketSeg(); renderTierChips(); renderMovement(); renderProbe(); renderScoped(); }
+   else if (PAGE === 'metadata') renderMetadata();
+   else if (PAGE === 'features') renderFeatures();
+   else if (PAGE === 'graphics') { renderGraphics(); renderScope(); renderGraphicsVis(); }
+ 
+   // Sections are drawn by this script, so jump to a #section link only after rendering.
+   const startHash = decodeURIComponent(location.hash.slice(1)), startEl = startHash && document.getElementById(startHash);
+   if (startEl) startEl.scrollIntoView();
+ 
```

</details>

### Styles

**Identical.** The artifact's style block is in [assets/site.css](../assets/site.css) verbatim. Added after them: the rules for the tab links (`.tabs a`). The host page's own wrapper style is not needed; only its `img{max-width:100%}` rule is kept.

### Rendered text, tab by tab

The artifact and each tab page were rendered in headless Microsoft Edge with the same default settings (US market, default version and filters), and all visible text, tables, lists, links and image references were converted to Markdown with [tools/dom-to-md.js](../tools/dom-to-md.js) and compared line by line. Image and file links are compared by file name, since the folders moved. Because the data and the render code are the same, every other view (other markets, other versions, filters and sort orders) matches too.

| Tab | Artifact lines | Tab page lines | Result |
| --- | --- | --- | --- |
| [01-aso-playbook](tabs/01-aso-playbook.md) | 509 | 509 | identical |
| [02-playstore-metadata](tabs/02-playstore-metadata.md) | 407 | 407 | identical |
| [03-features-comparison](tabs/03-features-comparison.md) | 235 | 235 | identical |
| [04-competitors-graphics](tabs/04-competitors-graphics.md) | 568 | 568 | identical |

## https://claude.ai/artifact/GasaKEBQrEuCu1HqTCxtWz

Artifact version `1790053657-2407` (the live version on 2026-09-22).

### Files

4 of 4 published files are in the repository, byte for byte (SHA-256).

| Artifact path | Repository path |
| --- | --- |
| `img/` | `tabs/05-free-100-gb-offer/img/` |

### Page

The artifact's own CSS and inline script are in [tabs/05-free-100-gb-offer/index.html](../tabs/05-free-100-gb-offer/index.html) unchanged, except: body padding moved to a `.page` wrapper so the tab bar can sit flush at the top, and claude.ai's frame-runtime script (host code, not part of the page) was left out. The tab bar comes from [assets/bar.css](../assets/bar.css) and [assets/nav.js](../assets/nav.js).

### Rendered text, tab by tab

The artifact and each tab page were rendered in headless Microsoft Edge with the same default settings (US market, default version and filters), and all visible text, tables, lists, links and image references were converted to Markdown with [tools/dom-to-md.js](../tools/dom-to-md.js) and compared line by line. Image and file links are compared by file name, since the folders moved. Because the data and the render code are the same, every other view (other markets, other versions, filters and sort orders) matches too.

| Tab | Artifact lines | Tab page lines | Result |
| --- | --- | --- | --- |
| [05-free-100-gb-offer](tabs/05-free-100-gb-offer.md) | 119 | 119 | identical |

## Result

**No gaps.** Every file, every data value, every style rule and every line of visible text in the artifact is in this repository.

Intended differences, by design: each tab is its own page with a shared tab bar and a "Research data" link; the tab bar replaced the artifact's in-page tab buttons; pages carry `<meta name="robots" content="noindex">`.
