# UA Strategy: code and data

> **Generated file: do not edit by hand.** Produced by `node tools/export-docs.js` (GitHub runs it after every push).
> Everything behind the [UA Strategy](../../tabs/06-ua-strategy/index.html) tab in one place: how the page is put together, the full source of the code that draws it, and the full data it reads. **Load it when a question or change concerns how this tab works** (its calculations, data, filters or behaviour); wording-only edits do not need it. The visible text is in [docs/tabs/06-ua-strategy.md](../tabs/06-ua-strategy.md); where the data came from is in [research.md](research.md).

## How the page is put together

- Markup: [tabs/06-ua-strategy/index.html](../../tabs/06-ua-strategy/index.html) (309 lines), `<body data-page="ua-strategy">`
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
```

## Data this tab reads

None from `assets/data.js`: every number is in the page itself.
