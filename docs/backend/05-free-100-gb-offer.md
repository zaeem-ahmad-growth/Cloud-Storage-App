# Free 100 GB Offer: code and data

> **Generated file: do not edit by hand.** Produced by `node tools/export-docs.js` (GitHub runs it after every push).
> Everything behind the [Free 100 GB Offer](../../tabs/05-free-100-gb-offer/index.html) tab in one place: how the page is put together, the full source of the code that draws it, and the full data it reads. **Load it when a question or change concerns how this tab works** (its calculations, data, filters or behaviour); wording-only edits do not need it. The visible text is in [docs/tabs/05-free-100-gb-offer.md](../tabs/05-free-100-gb-offer.md); where the data came from is in [research.md](research.md).

## How the page is put together

- Markup: [tabs/05-free-100-gb-offer/index.html](../../tabs/05-free-100-gb-offer/index.html) (498 lines), `<body data-page="free-gb-offer">`
- Self-contained: static HTML with its own styles and the inline script below; tab bar from [assets/nav.js](../../assets/nav.js)
- Sections and the functions that fill them: see the [code map](../code-map.md#05-free-100-gb-offer)

## Code

The page's content is static HTML in [index.html](../../tabs/05-free-100-gb-offer/index.html); its text is in [docs/tabs/05-free-100-gb-offer.md](../tabs/05-free-100-gb-offer.md). Its inline script, in full:

```js
(function(){
  var dl=[
    {n:"Fazcon",v:75000,e:"org",o:[0,0,1],t:"Not advertising. #81 in Productivity. 8 top-10 keyword ranks."},
    {n:"Utility Forge",v:38000,e:"paid",o:[0,1,1],t:"Newly advertising <28 days. Top markets KZ, ID, RU. Ratings +39.4% in 30d."},
    {n:"MindByte",v:36000,e:"paid",o:[1,0,0],t:"Actively advertising. 219 live US video creatives. $60,000/mo revenue."},
    {n:"Fuzon",v:29000,e:"org",o:[1,1,1],t:"Ranks #6-#9 on numbered GB searches. Only $1,000/mo revenue."},
    {n:"Daily Utility",v:7000,e:"leg",o:[0,1,0],t:"Reached 1M in Nov 2022. Ratings +0.14% in 30d — flat."},
    {n:"CloudGate",v:6900,e:"leg",o:[1,1,1],t:"Heaviest offer load in the set. Not ranked on any of the 94 keywords."},
    {n:"Mapidirections",v:6600,e:"paid",o:[0,1,0],t:"One video ad running 1,492 days. Weakest offer messaging, fewest offer complaints."},
    {n:"DataHatch",v:850,e:"none",o:[0,1,1],t:"25 GB free on banner and screenshot 1. Rating 3.33, the lowest here."},
    {n:"Nova Cloud",v:560,e:"none",o:[0,0,0],t:"Best-looking listing, no offer anywhere, no ads, no rank."},
    {n:"Golden",v:540,e:"none",o:[0,0,0],t:"No offer, no ads, no rank."},
    {n:"ANZ",v:0,e:"none",o:[0,1,1],t:"0 downloads in 30 days despite 15 GB free on banner AND screenshot 1."}
  ];
  var fam=[
    {n:"Backup & restore",v:13,k:"37 keywords · 8 of the 11 apps rank here"},
    {n:"Cloud / drive",v:3,k:"25 keywords · only Fazcon, Fuzon, Utility Forge"},
    {n:"Offer / free GB",v:2,k:"17 keywords · only Fazcon and Fuzon"},
    {n:"Photos & videos",v:1,k:"8 keywords · Fazcon only"},
    {n:"Security / vault",v:0,k:"7 keywords · nobody ranks. Open ground for your app"}
  ];
  var rpi=[
    {n:"MindByte",v:1.50,d:"$60,000 revenue ÷ 40,000 downloads"},
    {n:"Fazcon",v:0.67,d:"$40,000 revenue ÷ 60,000 downloads"},
    {n:"Fuzon",v:0.02,d:"$1,000 revenue ÷ 60,000 downloads"}
  ];
  var tip=document.getElementById("tip");
  function show(e,txt){tip.textContent=txt;tip.hidden=false;var r=e.currentTarget.getBoundingClientRect();tip.style.left=Math.max(8,Math.min(r.left,window.innerWidth-262))+"px";tip.style.top=(r.bottom+8)+"px";}
  function hide(){tip.hidden=true;}
  function wire(el,txt){el.tabIndex=0;el.addEventListener("mouseenter",function(e){show(e,txt)});el.addEventListener("focus",function(e){show(e,txt)});el.addEventListener("mouseleave",hide);el.addEventListener("blur",hide);}
  function fmt(n){return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
  function mk(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;}

  var box=document.getElementById("dl"),max=75000;
  dl.forEach(function(d){
    var row=mk("div","row");
    row.appendChild(mk("span","name",d.n));
    var dots=mk("span","dots");
    d.o.forEach(function(s){dots.appendChild(mk("b",s?"on":""));});
    dots.setAttribute("role","img");
    dots.setAttribute("aria-label",d.o.reduce(function(a,b){return a+b;},0)+" of 3 offer slots used");
    row.appendChild(dots);
    var cell=mk("span","barcell");
    var bar=mk("span","bar b-"+d.e);
    bar.style.width=Math.max(0.4,d.v/max*74)+"%";
    bar.setAttribute("role","img");
    bar.setAttribute("aria-label",d.n+": "+fmt(d.v)+" downloads in 30 days");
    wire(bar,d.n+" — "+d.t);
    cell.appendChild(bar);
    cell.appendChild(mk("span","val",fmt(d.v)));
    row.appendChild(cell);
    box.appendChild(row);
  });

  var fbox=document.getElementById("fam");
  fam.forEach(function(d){
    var row=mk("div","row two");
    row.appendChild(mk("span","name",d.n));
    var cell=mk("span","barcell");
    var bar=mk("span","bar b-org");
    bar.style.width=Math.max(0.4,d.v/13*62)+"%";
    bar.setAttribute("role","img");
    bar.setAttribute("aria-label",d.n+": "+d.v+" top-10 ranks");
    wire(bar,d.k);
    cell.appendChild(bar);
    cell.appendChild(mk("span","val",d.v+" rank"+(d.v===1?"":"s")));
    row.appendChild(cell);
    fbox.appendChild(row);
  });

  var rbox=document.getElementById("rpi");
  rpi.forEach(function(d){
    var row=mk("div","row two");
    row.appendChild(mk("span","name",d.n));
    var cell=mk("span","barcell");
    var bar=mk("span","bar b-paid");
    bar.style.width=Math.max(0.5,d.v/1.5*60)+"%";
    bar.setAttribute("role","img");
    bar.setAttribute("aria-label",d.n+": $"+d.v.toFixed(2)+" per download");
    wire(bar,d.d);
    cell.appendChild(bar);
    cell.appendChild(mk("span","val","$"+d.v.toFixed(2)));
    row.appendChild(cell);
    rbox.appendChild(row);
  });
})();
```

### Styles

```css
/* This tab keeps the design of the Claude artifact it came from (https://claude.ai/artifact/GasaKEBQrEuCu1HqTCxtWz),
   so it loads bar.css for the tab bar instead of site.css. */
:root{color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){color-scheme:dark}}
:root[data-theme="dark"]{color-scheme:dark}
img{max-width:100%}
[hidden]{display:none!important}
:root{
  --ground:#eef1f5; --surface:#fbfcfd; --raise:#f4f6f9;
  --ink:#101419; --ink-2:#4d5663; --muted:#7c8694;
  --line:#dde2e9; --track:#e6eaf0;
  --paid:#2a78d6; --organic:#eb6834; --legacy:#1baf7a; --none:#98a1ae;
  --crit:#d03b3b; --goodtext:#006300;
  --chip:#e8f0fa; --chip-ink:#184f95;
  --tip-bg:#101419; --tip-ink:#ffffff;
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]){
    --ground:#0c0e11; --surface:#191b1f; --raise:#212429;
    --ink:#f4f6f8; --ink-2:#bcc3cd; --muted:#8a93a0;
    --line:#2b2f36; --track:#262a31;
    --paid:#3987e5; --organic:#d95926; --legacy:#199e70; --none:#79828f;
    --crit:#e66767; --goodtext:#0ca30c;
    --chip:#152540; --chip-ink:#b7d3f6;
    --tip-bg:#f4f6f8; --tip-ink:#101419;
  }
}
:root[data-theme="dark"]{
  --ground:#0c0e11; --surface:#191b1f; --raise:#212429;
  --ink:#f4f6f8; --ink-2:#bcc3cd; --muted:#8a93a0;
  --line:#2b2f36; --track:#262a31;
  --paid:#3987e5; --organic:#d95926; --legacy:#199e70; --none:#79828f;
  --crit:#e66767; --goodtext:#0ca30c;
  --chip:#152540; --chip-ink:#b7d3f6;
  --tip-bg:#f4f6f8; --tip-ink:#101419;
}
*{box-sizing:border-box}
body{background:var(--ground);color:var(--ink);font-family:"Instrument Sans",system-ui,-apple-system,"Segoe UI",sans-serif;font-size:16px;line-height:1.55;margin:0}
.page{padding:30px 16px 60px}
.wrap{max-width:1040px;margin-inline:auto;display:flex;flex-direction:column;gap:40px}
h1,h2,h3{font-family:"Bricolage Grotesque","Instrument Sans",system-ui,sans-serif;margin:0;line-height:1.1;text-wrap:balance}
h1{font-size:clamp(28px,5.2vw,46px);font-weight:700;letter-spacing:-.02em}
h2{font-size:clamp(20px,3vw,26px);font-weight:600;letter-spacing:-.01em}
h3{font-size:16px;font-weight:600;font-family:"Instrument Sans",sans-serif}
p{margin:0;max-width:72ch}
.kicker{font-family:"IBM Plex Mono",ui-monospace,Consolas,monospace;font-size:11.5px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted)}
.lede{font-size:18px;color:var(--ink-2);max-width:64ch}
section{display:flex;flex-direction:column;gap:16px}
.mono{font-family:"IBM Plex Mono",ui-monospace,monospace;font-variant-numeric:tabular-nums}

/* verdict band */
.verdict{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:20px 22px;display:flex;flex-direction:column;gap:14px}
.vgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(168px,1fr));gap:1px;background:var(--line);border:1px solid var(--line);border-radius:7px;overflow:hidden}
.vcell{background:var(--surface);padding:14px 15px;display:flex;flex-direction:column;gap:5px}
.vcell .n{font-family:"Bricolage Grotesque",sans-serif;font-size:31px;font-weight:700;line-height:1;display:flex;align-items:baseline;gap:7px}
.vcell .n i{width:10px;height:10px;border-radius:2px;display:inline-block;flex:0 0 auto}
.vcell .t{font-weight:600;font-size:14.5px}
.vcell .s{font-size:13px;color:var(--ink-2);line-height:1.4}

/* engine rows */
.enginelist{display:flex;flex-direction:column;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:8px;overflow:hidden}
.erow{background:var(--surface);display:grid;grid-template-columns:174px 128px 1fr;gap:14px;padding:13px 16px;align-items:start}
.erow.head{background:var(--raise);font-family:"IBM Plex Mono",monospace;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);align-items:center}
.eapp{display:flex;flex-direction:column;gap:3px;min-width:0}
.eapp b{font-weight:600;font-size:15px;overflow-wrap:anywhere;line-height:1.2}
.eapp span{font-size:12px;color:var(--muted);font-family:"IBM Plex Mono",monospace}
.etag{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;padding:3px 9px;border-radius:5px;background:var(--raise);border:1px solid var(--line);white-space:nowrap;align-self:start}
.etag i{width:9px;height:9px;border-radius:2px;flex:0 0 auto}
.i-paid{background:var(--paid)} .i-org{background:var(--organic)} .i-leg{background:var(--legacy)} .i-none{background:var(--none)}
.eproof{font-size:14px;color:var(--ink-2);line-height:1.5}
.eproof b{color:var(--ink);font-weight:600}

/* bar rows */
.chart{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:18px;display:flex;flex-direction:column;gap:13px}
.chart .sub{font-size:13.5px;color:var(--ink-2);max-width:74ch}
.legend{display:flex;flex-wrap:wrap;gap:6px 15px;font-size:12.5px;color:var(--ink-2)}
.legend span{display:inline-flex;align-items:center;gap:6px}
.sw{width:11px;height:11px;border-radius:2px;display:inline-block;flex:0 0 auto}
.rows{display:flex;flex-direction:column;gap:8px}
.row{display:grid;grid-template-columns:150px 62px 1fr;gap:12px;align-items:center;font-size:13.5px}
.row.two{grid-template-columns:150px 1fr}
.colhead{display:grid;grid-template-columns:150px 62px 1fr;gap:12px;font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}
.colhead.two{grid-template-columns:150px 1fr}
.name{overflow-wrap:anywhere;line-height:1.25}
.dots{display:flex;gap:4px}
.dots b{width:15px;height:15px;border-radius:3px;background:var(--track);display:block}
.dots b.on{background:var(--ink-2)}
.barcell{display:flex;align-items:center;gap:9px;min-width:0}
.bar{height:15px;border-radius:0 4px 4px 0;min-width:3px;flex:0 0 auto;outline-offset:3px;cursor:default}
.bar:focus-visible{outline:2px solid var(--ink)}
.b-paid{background:var(--paid)} .b-org{background:var(--organic)} .b-leg{background:var(--legacy)} .b-none{background:var(--none)}
.val{font-family:"IBM Plex Mono",monospace;font-variant-numeric:tabular-nums;font-size:12.5px;color:var(--ink);white-space:nowrap}
.val em{font-style:normal;color:var(--muted)}

/* tables */
.tablebox{overflow-x:auto;border:1px solid var(--line);border-radius:8px;background:var(--surface)}
table{border-collapse:collapse;width:100%;font-size:14px;min-width:620px}
th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--line);vertical-align:top}
tr:last-child td{border-bottom:0}
th{font-family:"IBM Plex Mono",monospace;font-weight:500;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);white-space:nowrap;background:var(--raise)}
td.num,th.num{text-align:right;font-family:"IBM Plex Mono",monospace;font-variant-numeric:tabular-nums;white-space:nowrap}
td b{font-weight:600}
.tag{display:inline-block;background:var(--chip);color:var(--chip-ink);border-radius:4px;padding:1px 7px;font-size:12.5px;font-weight:500;white-space:nowrap}
.tag.hot{background:color-mix(in srgb,var(--paid) 16%,transparent);color:var(--paid)}
.dash{color:var(--muted)}
.do{color:var(--goodtext);font-weight:600}
.dont{color:var(--crit);font-weight:600}

/* misc */
figure{margin:0;display:flex;flex-direction:column;gap:7px}
figure img{width:100%;height:auto;border-radius:6px;border:1px solid var(--line);display:block}
figcaption{font-size:13px;color:var(--ink-2)}
details{border:1px solid var(--line);border-radius:8px;background:var(--surface)}
summary{cursor:pointer;padding:12px 15px;font-weight:500;font-size:14.5px}
summary:focus-visible{outline:2px solid var(--paid);outline-offset:-2px}
details .inner{padding:0 15px 15px;display:flex;flex-direction:column;gap:14px}
ol.steps{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:11px;max-width:74ch}
ol.steps li::marker{font-family:"IBM Plex Mono",monospace;color:var(--muted);font-size:13px}
.note{font-size:13px;color:var(--ink-2);border-top:1px solid var(--line);padding-top:14px;max-width:80ch;line-height:1.5}
.flag{background:var(--raise);border:1px solid var(--line);border-left:3px solid var(--organic);border-radius:0 6px 6px 0;padding:12px 14px;font-size:13.5px;color:var(--ink-2);max-width:78ch}
#tip{position:fixed;z-index:30;pointer-events:none;background:var(--tip-bg);color:var(--tip-ink);font-size:12.5px;line-height:1.4;padding:8px 11px;border-radius:6px;max-width:250px}
@media (max-width:720px){
  .erow{grid-template-columns:1fr;gap:9px}
  .erow.head{display:none}
  .row,.colhead{grid-template-columns:104px 56px 1fr;gap:9px}
  .row.two,.colhead.two{grid-template-columns:104px 1fr}
}
```

## Data this tab reads

None from `assets/data.js`: every number is in the page itself, including the chart data in the script above.
