# Documentation: start here

Everything on the site at https://zaeem-ahmad-growth.github.io/Cloud-Storage-App/ is in this repository as readable files, so any contributor or Claude session can answer questions and make changes without opening the site. Tabs 01-04 came from the Claude artifact https://claude.ai/artifact/GMDahxdE589GyGefGyTdpK and tab 05 from https://claude.ai/artifact/GasaKEBQrEuCu1HqTCxtWz; [parity.md](parity.md) shows the site matches both with no gaps.

## Answering a request

**"What does the site say about …?"** Search the tab snapshots in [tabs/](tabs/). Each is the full visible text of one tab (every heading, paragraph, table row, list item and image reference) with anchors such as `<a id="keywords">` for each section. For values the default view does not show (other markets, rows hidden behind "show all"), read [assets/data.js](../assets/data.js) using the [data dictionary](data-dictionary.md).

**"Change …" or "Add …"** Find the section in the [code map](code-map.md): it gives the markup file and line, the function in [assets/app.js](../assets/app.js) that fills the section, and the data fields that function reads. Static wording lives in the tab's `index.html`; sentences built from numbers live in the named function; numbers and lists live in `assets/data.js`. Tab 05 is a plain page: edit its `index.html` directly. After the change, run `node tools/export-docs.js` so the snapshots, code map and dictionary match, then commit everything together (see [CLAUDE.md](../CLAUDE.md)).

**"Where did this number come from?"** The Google Play scrape and scoring scripts, the Google Ads assets study, the free-GB offer study and earlier reports are in [research/](../research/) ([research/README.md](../research/README.md) lists each file); the methods are also written out on the tabs.

## What is where

| Path | What it is |
| --- | --- |
| [tabs/](../tabs/) | One folder per tab: `index.html` plus the images it uses |
| [assets/data.js](../assets/data.js) | `PAYLOAD`: all research data behind tabs 01-04, one field per line (plain JSON) |
| [assets/app.js](../assets/app.js) | Draws tabs 01-04 from `PAYLOAD`; `<body data-page>` picks the tab |
| [assets/site.css](../assets/site.css) · [assets/bar.css](../assets/bar.css) · [assets/nav.js](../assets/nav.js) | Shared styles · the tab bar alone, for self-styled tabs · the tab bar and its tab list |
| [assets/mylisting/](../assets/mylisting/) | The app's live Play Store icon, feature graphic and 4 screenshots |
| [docs/tabs/](tabs/) | Generated: full text of each tab |
| [docs/code-map.md](code-map.md) | Generated: section → markup line → function → data fields |
| [docs/data-dictionary.md](data-dictionary.md) | Generated: every field in `assets/data.js`, with types, sizes and examples |
| [docs/parity.md](parity.md) | Audit of the site against the original artifacts |
| [tools/](../tools/) | `export-docs.js` regenerates the generated docs; `dom-to-md.js` is the page-to-Markdown converter it uses |
| [research/](../research/) | Backend scripts, raw scrape, study files and reports |

## The tabs

| Tab | Covers | Built from | Text snapshot |
| --- | --- | --- | --- |
| [ASO Playbook](https://zaeem-ahmad-growth.github.io/Cloud-Storage-App/tabs/01-aso-playbook/) | Five niches, the 11 named competitors, rank tracker, result slots, keyword board, ladder, proposed listing, the 8→15 Sep rank check, the 12-market probe, practice, watch-outs, method | `app.js` render functions from `PAYLOAD.data` and `listing` | [01-aso-playbook.md](tabs/01-aso-playbook.md) |
| [PlayStore Metadata](https://zaeem-ahmad-growth.github.io/Cloud-Storage-App/tabs/02-playstore-metadata/) | The live listing of Cloud Storage: Secure Vault, targeted keywords, composition, finalized keywords, ladder, competitor ranks, comparison with the proposed package, first-run check, method | `renderMetadata()` from `PAYLOAD.mymeta`, `listing`, `data` | [02-playstore-metadata.md](tabs/02-playstore-metadata.md) |
| [Features Comparison](https://zaeem-ahmad-growth.github.io/Cloud-Storage-App/tabs/03-features-comparison/) | Feature coverage and matrix against the competitors, what ships, IAP comparison, method | `renderFeatures()` from `PAYLOAD.features`, `pricing` | [03-features-comparison.md](tabs/03-features-comparison.md) |
| [Competitor’s Graphics](https://zaeem-ahmad-growth.github.io/Cloud-Storage-App/tabs/04-competitors-graphics/) | Every competitor icon, feature graphic and screenshot, per-app design notes, patterns, guidance, Play requirements, scope, sources | `renderGraphics()` from `PAYLOAD.graphics`; images in the tab's `graphics/` | [04-competitors-graphics.md](tabs/04-competitors-graphics.md) |
| [Free 100 GB Offer](https://zaeem-ahmad-growth.github.io/Cloud-Storage-App/tabs/05-free-100-gb-offer/) | Whether free-GB offers drive installs: the engine behind each competitor, offer load against downloads, third-party numbers, paid ads, features that rank, revenue per download, what it means for the app | Static HTML and an inline script (chart data at the bottom of the page); images in `img/` | [05-free-100-gb-offer.md](tabs/05-free-100-gb-offer.md) |

## The data in plain words

Tabs 01-04 read `PAYLOAD` in [assets/data.js](../assets/data.js), collected from Google Play on 15 Sep 2026 (first run 8 Sep). Field-level detail is in the [data dictionary](data-dictionary.md). Tab 05 keeps its numbers in its own page (collected 22 Sep 2026).

| Field | What it holds | Shown on |
| --- | --- | --- |
| `data.apps` | 522 apps seen in any result list, one record each: package id, title, developer, installs, rating, ratings count, release date, Play category, brand flag, niche category (cloud, device backup, vault and so on), competitor flag | Tooltips, result slots, tables |
| `data.markets.<market>` | The keyword board for US, PK, AE and NG: 94 keywords each with intent tier, relevance, opportunity, priority, demand, entry bar, competitor ranks and the result list | Keyword board, rank tracker, result slots, ladder, metadata keywords |
| `data.profiles`, `data.compIdx` | The 11 named competitors: listing text, placements per market, installs, rating, monetisation, title phrases | Competitors, features, metadata ranks |
| `data.evidence` | The ranks quoted in the 8 Sep report, looked up again on 15 Sep | 8→15 Sep rank check |
| `data.probe` | The 12-market probe of where the competitors rank | 12 markets |
| `listing` | The proposed title options, titles already taken, short descriptions, full description, phrases and checks | Playbook listing, metadata comparison |
| `mymeta` | The app's own live listing (fetched), its store assets, the 8 Sep draft, title terms and release checks | PlayStore Metadata |
| `features`, `pricing` | The feature matrix and what ships; the IAP benchmark and recommended plans | Features Comparison |
| `graphics` | The competitor-graphics catalogue: per-app assets with sizes and captions, patterns, guidance, requirements, sources | Competitor’s Graphics |

## Views the snapshots do not show

The snapshots record each tab in its default state. These controls change what is on screen; the data for every option is already in the repository.

- ASO Playbook: market buttons US · PK · AE · NG (remembered in the browser), "Show all 94 keywords" in the rank tracker, "show all" in result slots and clicking a row for its full result list, tier filters, keyword search and column sorting on the keyword board, hover tooltips on ranks and slots.
- Competitor’s Graphics: search and filters by app, asset kind and orientation; click any image to enlarge it.
- Free 100 GB Offer: hover or focus a bar for the detail behind it (the text is in the script's `dl`, `fam` and `rpi` lists).

## Keeping this complete

- The generated files carry a "do not edit by hand" note. Change the page or data, then run `node tools/export-docs.js` (Node 18+, and Edge or Chrome) and commit the regenerated docs with the change.
- New tabs are picked up automatically from the `TABS` list in `assets/nav.js`.
- Put new backend material (scripts, raw data, reports as `.md`, `.json`, `.csv`) in `research/` and list it in `research/README.md`. Never commit secrets (see the content rules in [CLAUDE.md](../CLAUDE.md)).
