# Cloud Storage App

Research site for the Android app **Cloud Storage: Secure Vault** (`com.softwarealliance.cloudvault`, Cell Cave), released on Google Play on 8 Sep 2026.

**Live site:** https://zaeem-ahmad-growth.github.io/Cloud-Storage-App/

| Tab | What it covers |
| --- | --- |
| [Cloud Storage](https://zaeem-ahmad-growth.github.io/Cloud-Storage-App/tabs/07-cloud-storage/) | Product dossier for the app itself: overview, spec, market research, versions and builds, monetization, screenshots, graphics and QA history, from the app repository at 0.2.6 (17) |
| [ASO Playbook](https://zaeem-ahmad-growth.github.io/Cloud-Storage-App/tabs/01-aso-playbook/) | Niches, the 11 named competitors, rank tracker, result slots, keyword board, ladder, proposed listing, 8→15 Sep rank check, 12-market probe, practice and watch-outs |
| [PlayStore Metadata](https://zaeem-ahmad-growth.github.io/Cloud-Storage-App/tabs/02-playstore-metadata/) | The live listing, targeted and finalized keywords, composition, ladder, competitor ranks, comparison with the proposed package, first-run check |
| [Features Comparison](https://zaeem-ahmad-growth.github.io/Cloud-Storage-App/tabs/03-features-comparison/) | Feature coverage and matrix against the competitors, what ships, in-app purchase comparison |
| [Competitor’s Graphics](https://zaeem-ahmad-growth.github.io/Cloud-Storage-App/tabs/04-competitors-graphics/) | Every competitor icon, feature graphic and screenshot, patterns, design guidance and Play requirements |
| [Free 100 GB Offer](https://zaeem-ahmad-growth.github.io/Cloud-Storage-App/tabs/05-free-100-gb-offer/) | Do free-GB offers drive installs? What actually drives each competitor's downloads (paid ads, search rank, old install base), offer load against downloads, revenue per download, and what it means for the app |
| [UA Strategy](https://zaeem-ahmad-growth.github.io/Cloud-Storage-App/tabs/06-ua-strategy/) | Version 1 section: a Google Ads asset set built on the out of space and switching phones moment, an 8-keyword board, and the first draft against a web-scraped re-run |

Each section of a tab has its own link, for example `.../tabs/01-aso-playbook/#keywords`.

## Documentation

Start with [docs/README.md](docs/README.md): the full text of every tab ([docs/tabs/](docs/tabs/)), a [code map](docs/code-map.md) from each section to its markup, code and data, a [data dictionary](docs/data-dictionary.md) of every field, and a [parity report](docs/parity.md) against the original Claude artifacts. `node tools/export-docs.js` regenerates the generated parts.

## How it is built

Plain HTML, CSS and JavaScript, published by GitHub Pages straight from the `main` branch; there is no build step. Every page opens from disk too. `CLAUDE.md` describes the layout and the editing rules, and Claude Code loads it automatically. `CONTRIBUTING.md` covers getting access and making changes.

The pages were split from the Claude artifact https://claude.ai/artifact/GMDahxdE589GyGefGyTdpK on 22 Sep 2026. This repository is now the master copy.

## Data

The Google Play data behind the tabs (collected 15 Sep 2026) is in `assets/data.js`. The scripts, raw data and reports that produced it are in [`research/`](research/).
