# UA Strategy: code and data

> **Generated file: do not edit by hand.** Produced by `node tools/export-docs.js` (GitHub runs it after every push).
> Everything behind the [UA Strategy](../../tabs/06-ua-strategy/index.html) tab in one place: how the page is put together, the full source of the code that draws it, and the full data it reads. **Load it when a question or change concerns how this tab works** (its calculations, data, filters or behaviour); wording-only edits do not need it. The visible text is in [docs/tabs/06-ua-strategy.md](../tabs/06-ua-strategy.md); where the data came from is in [research.md](research.md).

## How the page is put together

- Markup: [tabs/06-ua-strategy/index.html](../../tabs/06-ua-strategy/index.html) (643 lines), `<body data-page="ua-strategy">`
- Self-contained: static HTML with its own styles and the inline script below; tab bar from [assets/nav.js](../../assets/nav.js)
- Sections and the functions that fill them: see the [code map](../code-map.md#06-ua-strategy)

## Code

The page's content is static HTML in [index.html](../../tabs/06-ua-strategy/index.html); its text is in [docs/tabs/06-ua-strategy.md](../tabs/06-ua-strategy.md). Its inline script, in full:

```js
(function () {
  var box = document.getElementById('cmp');
  var controls = document.getElementById('cmp-controls');
  if (!box || !controls) return;
  var buttons = controls.querySelectorAll('button[data-set]');
  controls.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-set]');
    if (!btn) return;
    box.setAttribute('data-view', btn.getAttribute('data-set'));
    Array.prototype.forEach.call(buttons, function (b) {
      b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
    });
  });
})();
```

### Styles

```css
/* This page carries its own copy and needs no PAYLOAD, so it does not load app.js or data.js.
     app.js is what normally measures the bar and sets --barh; without it the fallback is too short for this two-row bar. */
  :root{ --barh:96px }

  .assets{display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,330px),1fr)); gap:12px}
  .asset{display:flex; align-items:baseline; gap:12px; background:var(--surface); border:1px solid var(--line); border-radius:10px; padding:13px 15px}
  .asset .n{flex:none; width:1.6em; font:600 12px/1.5 var(--mono); color:var(--muted); font-variant-numeric:tabular-nums}
  .asset .t{flex:1 1 auto; min-width:0; color:var(--ink); overflow-wrap:anywhere}
  .asset.head .t{font-weight:600}
  .asset .c{flex:none; font:500 12px/1.5 var(--mono); color:var(--muted); font-variant-numeric:tabular-nums}

  /* Comparison view switch: the wrapper carries data-view, each row carries data-match. */
  [data-view] tbody tr{transition:background-color .12s ease}
  [data-view="highlight"] tbody tr[data-match="exact"]{background:var(--good-soft)}
  [data-view="highlight"] tbody tr[data-match="changed"]{background:var(--warn-soft)}
  [data-view="diff"] tbody tr[data-match="exact"]{display:none}
  [data-view="diff"] tbody tr[data-match="changed"]{background:var(--warn-soft)}
  @media (prefers-reduced-motion: reduce){ [data-view] tbody tr{transition:none} }
  .cmp td:nth-child(2), .cmp td:nth-child(4){min-width:16ch}
  .cmp .idx{font:600 12px/1.5 var(--mono); color:var(--muted); font-variant-numeric:tabular-nums}
  .subhead{margin-top:34px}
  .mt12{margin-top:12px}

  /* Section 06: country cards. Four SWOT quadrants per country, stacking to one column on a phone. */
  .ctries{display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,430px),1fr)); gap:14px; margin-top:18px}
  .ctry{background:var(--surface); border:1px solid var(--line); border-radius:12px; padding:16px 18px}
  .ctry-head{display:flex; align-items:baseline; gap:9px; flex-wrap:wrap}
  .ctry-head h4{font-size:1.06rem}
  .ctry-head .sc{font:500 12px/1.5 var(--mono); color:var(--muted); font-variant-numeric:tabular-nums; margin-left:auto}
  .ctry .why{font-size:13.5px; color:var(--muted); margin-top:7px}
  .quad{display:grid; grid-template-columns:1fr 1fr; gap:9px; margin-top:13px}
  .q{border-radius:9px; padding:9px 11px; font-size:14px; color:var(--ink-2)}
  .q .lbl{display:block; font:600 10.5px/1.4 var(--mono); letter-spacing:.08em; text-transform:uppercase; margin-bottom:3px}
  .q.s{background:var(--good-soft)}  .q.s .lbl{color:var(--good)}
  .q.w{background:var(--risk-soft)}  .q.w .lbl{color:var(--risk)}
  .q.o{background:var(--accent-soft)} .q.o .lbl{color:var(--accent)}
  .q.t{background:var(--warn-soft)}  .q.t .lbl{color:var(--warn)}
  @media (max-width:620px){ .quad{grid-template-columns:1fr} }
```

## Data this tab reads

None from `assets/data.js`: every number is in the page itself.
