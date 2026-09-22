# Research data

The backend data, scripts and reports behind the site's tabs, and the studies done after it.

| Folder | What it holds | Tabs it feeds |
| --- | --- | --- |
| `aso-pipeline/` | The Google Play scrape of 15 Sep 2026 and the Node scripts that collected, scored and built it | All four tabs |
| `google-ads-assets/` | The Google Ads App campaign assets of 21 Sep 2026: headlines, descriptions, the keyword and title checks behind them, and the delivered document | — (follow-on study) |
| `free-gb-offer-analysis/` | The 21 Sep 2026 study of whether "free GB/TB" offers in competitors' icons and screenshots drive installs: install velocity, reviews, ads and ranks | Free 100 GB Offer |
| `reports/` | Earlier reports on the app and its market (August to September 2026) | Background |

The scripts here were written on the owner's PC. Node scripts run with Node 18 or later; PowerShell scripts with Windows PowerShell 5.1. Some PowerShell scripts expect to run from the folder they were written in, so check the paths at the top before running them.

## aso-pipeline/

The main run, in order:

| Script | Writes | What it does |
| --- | --- | --- |
| `lib.js` | `cache/` | Google Play search (first page plus follow-on pages to depth 30), app details and autocomplete. Every response is cached; delete `cache/` to force a fresh scrape. |
| `stage1.js` | `competitors.json`, `competitor_ngrams.json` | Fetches the 11 named competitors and mines their metadata for keyword candidates |
| `harvest.js` | | Harvests Play autocomplete suggestions from niche seeds (US and PK) |
| `longtail.js` | `longtail.json` | Checks long-tail phrases lifted from competitors' titles and short descriptions |
| `markets.js` | | Probes which Play country catalogues the competitors rank in (the 12-market probe) |
| `stage2.js`, `final.js` | `serps.json`, `apps.json`, `final_raw.json` | Live result lists, depth 30, for the keyword universe in 4 markets, details for every top-10 app, and autocomplete demand |
| `analyze.js` | `data.json` | Classifies apps, scores relevance, opportunity and priority, builds the competitor rank tables |
| `mymeta.js`, `myrecheck.js`, `myassets.js` | `mymeta.json`, `myrecheck.json`, `mymeta_payload.json` | Fetches the app's own live listing, re-checks its ranks and assembles the PlayStore Metadata tab's data |
| `parse_graphics.js` | `graphics.json` | Turns the competitor visual-memory catalogue into the Competitor's Graphics tab's data |
| `build.js` + `page.html` | the one-page site | Injected the data and listing copy into the page and printed the listing checks |

Also here: `features.json` and `pricing.json` (the hand-edited feature and IAP comparison), `titleterms.js`/`titleterms.json` (competitor presence on the title's own phrases), `meta_js.js`, `meta_section.html`, `feat_js.js` and `feat_section.html` (the tab code as it was spliced into the page), `convert_graphics.ps1` (recompresses competitor images), and small helpers used while exploring the data (`explore.js`, `probe*.js`, `debug.js`, `list.js`, `tiny.js`, `ozone.js`, `comphits.js`, `splice*.js`, `suggest_probe.js`). `build.js` reads files from the owner's local toolkit, so it does not run from this folder; the live pages are now edited directly in `tabs/` and `assets/`.

## google-ads-assets/

- `Cloud Storage Google Ads Assets By Zaeem.docx` / `.pdf`: the delivered assets, 10 headlines (30 characters) and 10 descriptions (90 characters) in two ad groups, storage and security, and backup and restore.
- `serps.ps1`, `serps_live.json`, `serp_rows.json`: live Play results for the candidate phrases.
- `generic.ps1`, `brandcheck.ps1`, `brandcheck.json`, `headcheck.ps1`, `resolve.ps1`, `summary.ps1`: the brand-name and exact-title checks of every headline against 522 board apps and live Play searches.
- `keywords.txt`, `candidates.txt`, `final_headlines.txt`, `assets.txt`: the working lists.
- `export/build-docx.ps1`, `export/content.json`: build the Word document from the content file and export the PDF through Word.

## free-gb-offer-analysis/

- `live.ps1`, `live.json`: the competitors' live listings and exact installs.
- `ranks.ps1`, `ranks.json`: ranks on the "free GB" long-tail searches.
- `reviews.ps1`, `reviews.json`, `revstats.ps1`, `revstats.json`, `rv-*.txt`: 2,908 competitor reviews (text, score and date only) and the share that mention offers, paywalls or bait.
- `atc*.ps1`, `atc-*.json`: Google Ads Transparency Center lookups of competitors' video ads.
- `appbrain.json`, `sensortower.json`: third-party install and ranking estimates.
- `sheet-icons.jpg`, `sheet-fg.jpg`, `sheet-ss.jpg`, `sheet-yt.jpg`: contact sheets of competitor icons, feature graphics, screenshots and ad videos.
- `offer-study/`: the study's summary page.

## reports/

- `CloudStorage-Market-Teardown.pdf` and `Cloud-Vault-CallerID-App-Analysis.pdf` (17 Aug 2026)
- `CloudVault_ASO_Competitor_Analysis.md` and `Cloud_Vault_Play_Store_Portfolio_Optimized.pdf` (7 Sep 2026)
- `Cloud App Metadata.rtf` (11 Sep 2026)
- `Cloud-Storage-Visual-Research.pdf` (14 Sep 2026)
- `Cloud Storage ASO Playbook.pdf` (15 Sep 2026)

## Kept out on purpose

The repository is public, so these stay out: AdMob unit IDs, Firebase config, release `.aab` and `.apk` builds, Play Console exports (installs and traffic), and the raw 100 MB competitor image archives (`cloud-competitor-memory.zip`, `Cloud Storage Competitor Visual Memory.pdf`). The raw Play page dumps saved during the Google Ads and offer studies (about 250 MB of HTML) are also left out; the scripts fetch them again.
