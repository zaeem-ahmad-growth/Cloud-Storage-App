# Competitor target countries — source document

> Behind the **Target Countries of Competitors** section of the UA Strategy tab (`tabs/06-ua-strategy/`, section 06).
> Built 24 Sep 2026. Every figure below carries its source and its date. Nothing here is an unlabelled guess.

## 1. What was asked, and what the data can actually support

The request was a country-by-country read of the eleven tracked competitors: the top 15 countries where they rank
and earn their downloads, a SWOT per country, and their paid-ads spend and in-app revenue from third-party tools
(AppBrain, Sensor Tower, App Annie, AppsFlyer and similar).

Two of those three are supportable from data this repository already holds. The third — **per-country** spend and
**per-country** download volume — is not available at any price we are paying today, and a live re-check on
24 Sep 2026 confirmed it:

| Tool | What was tried on 24 Sep 2026 | Result |
| --- | --- | --- |
| AppBrain | direct fetch of `appbrain.com/app/<package>` for all 11 packages, plus a text-proxy retry | HTTP 403 bot wall on every attempt. Only search-engine snippets of those pages were readable, and snippets never carry country cuts |
| Sensor Tower | free app profiles for the 5 largest competitors | Country splits are behind a login; the free page renders no numbers to a fetch |
| App Annie / data.ai | looked for the product | No longer exists as a separate product — Sensor Tower acquired data.ai in March 2024 and retired the brand |
| AppMagic, Appfigures, Apptopia, SimilarWeb | app profiles for all 11 | Login-walled; apps this small are not publicly profiled at all |
| Google Ads Transparency Center | advertiser search for all 11 developer names | A JavaScript app that returns no advertiser id, ad count or region list to a fetch. Needs a real browser session |
| Meta Ad Library | all 11 developer names | No matches |
| AppsFlyer | — | Not a competitor-spy tool. It measures your own installs; it cannot report a competitor's spend. Its public value here is the benchmark reports, which are used in §6 |

**So the country evidence in this section comes from pulls this repository already made** — the Sensor Tower pull of
21 Sep 2026, the 94-keyword rank board of 15 Sep 2026 and the 12-market probe of the same date — not from a fresh
country scrape. That is stated on the page too.

## 2. Evidence base

### 2a. Sensor Tower, pulled 21 Sep 2026 — `research/free-gb-offer-analysis/sensortower.json`

Each competitor's three largest download markets, its monthly downloads, its monthly revenue and whether it was
advertising. `1,000` is Sensor Tower's floor bucket and means "under 1,000", so it is written `<1K` below.

| App | Publisher | Publisher country | Downloads/mo | Revenue/mo | Top 3 markets | Advertising |
| --- | --- | --- | --- | --- | --- | --- |
| Cloud Storage: Cloud Drive App | Fazcon Apps | Australia | 60,000 | $40,000 | US, IN, BR | Inactive (<28 days) |
| Cloud Storage & Cloud Drive | Fuzon Apps | Australia | 60,000 | <$1K | ES, ZA, GB | — |
| Cloud Storage Drive Backup app | MindByte Studios L.L.C-FZ | Pakistan | 40,000 | $60,000 | US, IN, NG | **Active** |
| Cloud Storage: Drive Backup | Utility Forge | United Kingdom | 10,000 | <$1K | KZ, ID, RU | New (<28 days) |
| Cloud Backup : Cloud Storage | MAPIDIRECTIONS STUDIOS | Pakistan | <1K | <$1K | ID, DZ, IN | New (<28 days) |
| Cloudgate: Cloud Storage Drive | CloudGate Technologies | Australia | <1K | <$1K | US, IN, MX | — |
| Nova Cloud: Storage & Backup | Nova Apps Studios | Australia | <1K | <$1K | BD, TN, LB | — |
| ANZ Cloud Drive: Cloud Storage | Auzi Apps Studios | Australia | <1K | <$1K | none returned | — |
| Cloud Storage App Drive Backup | Golden Associate | Pakistan | <1K | <$1K | none returned | — |

Not in that pull: **Daily Utility Apps** (3.8M installs) and **DataHatch** — so two of the eleven contribute no
country signal at all. That is a real hole in the country ranking, not a rounding error.

### 2b. 94-keyword rank board, 15 Sep 2026 — `assets/data.js` → `PAYLOAD.data.profiles[].perMarket`

Four catalogs were measured in full: **US, PK, AE, NG**. Competitor top-10 slots out of 94 keywords:

| Market | Competitor top-10 slots | Keywords with any competitor in top 10 | Keywords with none | Average entry bar (installs of the weakest app holding a top-10) | Keywords whose entry bar is under 50K installs |
| --- | --- | --- | --- | --- | --- |
| Nigeria | 36 | 19 / 94 | 75 | 2,109,995 | 68 |
| Pakistan | 30 | 17 / 94 | 77 | 2,417,703 | 56 |
| UAE | 21 | 13 / 94 | 81 | 619,919 | 65 |
| US | 19 | 11 / 94 | 83 | 1,653,164 | 65 |

Per app, top-10 slots by market (and the best rank in each):

| App | US | PK | AE | NG | Best single rank |
| --- | --- | --- | --- | --- | --- |
| Fazcon | 8 | 12 | 10 | 15 | #1 "cloud storage cloud drive" in all four; #1 "cloud storage premium" PK, NG |
| Cloud Storage & Cloud Drive (Fuzon) | 2 | 5 | 3 | 8 | #4 "cloud storage cloud drive" NG, #4 "cloud storage and cloud drive" PK/AE |
| Cloud Storage Drive Backup (MindByte) | 3 | 5 | 3 | 5 | #1 "cloud storage drive backup app" PK, #2 elsewhere |
| Cloud Storage-Sync (Utility Forge) | 2 | 3 | 2 | 4 | #1 "cloud storage drive backup" in all four |
| Cloud Storage Backup & Drive (Daily Utility) | 2 | 1 | 1 | 1 | #2 "cloud storage backup drive" in all four |
| Cloud storage (Golden) | 1 | 2 | 1 | 1 | #8 "cloud storage app drive backup" PK |
| Cloud Backup (Mapidirections) | 1 | 1 | 1 | 1 | — |
| CloudGate | 0 | 1 | 0 | 1 | #8 "cloud storage app drive backup" PK, #10 NG |
| DataHatch, Nova Cloud, ANZ | 0 | 0 | 0 | 0 | none in any market |

### 2c. 12-market head-term probe, 15 Sep 2026 — `assets/data.js` → `PAYLOAD.data.probe`

Five head terms (`cloud storage`, `cloud backup`, `cloud storage space`, `backup and restore`, `cloud drive`) across
twelve catalogs. Competitor placements anywhere in the returned results:

| Country | Placements | Detail |
| --- | --- | --- |
| Pakistan | 4 | cloud backup: Fuzon #18, Fazcon #22, Utility Forge #25 · cloud storage space: Fuzon #12 |
| Nigeria | 4 | cloud storage: **Fazcon #8**, Fuzon #16 · cloud backup: Fuzon #12, Fazcon #25 |
| UAE | 4 | cloud backup: Fuzon #21, Fazcon #22, Utility Forge #23 · cloud storage space: Fuzon #12 |
| Philippines | 2 | cloud backup: Fuzon #15, Utility Forge #23 |
| Bangladesh | 2 | cloud backup: Fuzon #22 · cloud storage space: Fuzon #11 |
| UK | 1 | cloud storage space: Fuzon #13 |
| Egypt | 1 | cloud storage space: Fuzon #12 |
| Mexico | 1 | cloud storage: **Fazcon #6** |
| US, India, Indonesia, Brazil | 0 | no competitor anywhere in the returned results for any of the five terms |

Only **two** top-10 head-term placements exist in the whole probe: Fazcon #8 in Nigeria and Fazcon #6 in Mexico.

### 2d. AppBrain 30-day downloads, pulled 21 Sep 2026 — `research/free-gb-offer-analysis/appbrain.json`

Worldwide, not split by country: Fazcon 75K · Utility Forge 38K · MindByte 36K · Fuzon 29K · Daily Utility 7K ·
CloudGate 6.9K · Mapidirections 6.6K · DataHatch 850 · Nova 560 · Golden 540 · ANZ 0.

## 3. How the top 15 was ranked

Script: `research/ua-strategy/country-score.ps1` (no network, reads the three files above). Two indices per country,
each normalised to 100, and the score is their mean:

- **dlIndex — modelled, not measured.** Each app's Sensor Tower monthly downloads are split across its three top
  markets 50/30/20. Sensor Tower publishes the *order* of the top three, never the split, so the weights are an
  assumption. This is the weakest number in the section and the page says so.
- **rankIndex — measured.** Competitor top-10 slots on the 94-keyword board where a board exists (US, PK, AE, NG);
  otherwise probe placements, scaled so the busiest probe country matches the busiest board market. Four catalogs
  were therefore measured far more deeply than the rest, which pushes them up the table. Stated on the page.

Output, 24 Sep 2026:

| # | Country | Score | dlIndex (modelled) | rankIndex (measured) | Apps naming it a top-3 market | Board top-10 slots | Probe placements |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | United States | 76.4 | 100 | 52.8 | 3 | 19 | 0 |
| 2 | Nigeria | 57.9 | 15.8 | 100 | 1 | 36 | 4 |
| 3 | Pakistan | 41.7 | 0 | 83.3 | 0 | 30 | 4 |
| 4 | India | 30.2 | 60.4 | 0 | 4 | — | 0 |
| 5 | Spain | 29.7 | 59.4 | 0 | 1 | — | — |
| 6 | UAE | 29.2 | 0 | 58.3 | 0 | 21 | 4 |
| 7 | Bangladesh | 25.5 | 1.0 | 50 | 1 | — | 2 |
| 8 | Philippines | 25.0 | 0 | 50 | 0 | — | 2 |
| 9 | United Kingdom | 24.4 | 23.8 | 25 | 1 | — | 1 |
| 10 | South Africa | 17.8 | 35.6 | 0 | 1 | — | — |
| 11 | Mexico | 12.7 | 0.4 | 25 | 1 | — | 1 |
| 12 | Egypt | 12.5 | 0 | 25 | 0 | — | 1 |
| 13 | Brazil | 11.9 | 23.8 | 0 | 1 | — | 0 |
| 14 | Kazakhstan | 5.0 | 9.9 | 0 | 1 | — | — |
| 15 | Indonesia | 3.5 | 6.9 | 0 | 2 | — | 0 |

Just outside: **Russia** 2.0 (Utility Forge's #3 market — excluded on merit anyway, see §6), Tunisia 0.3, Algeria 0.3,
Lebanon 0.2, each resting on one small app's top-3 ordering.

**Sensitivity.** Spain, South Africa and the UK sit where they sit because of one app: Fuzon's top-3 ordering.
Kazakhstan and Indonesia rest on Utility Forge and Mapidirections alone. Treat positions 5-15 as a band, not a ladder.

## 4. In-app revenue

| App | Installs | Sensor Tower downloads/mo | Sensor Tower revenue/mo | Revenue per download | AppBrain 30-day | Play IAP range (15 Sep) |
| --- | --- | --- | --- | --- | --- | --- |
| Fazcon | 6.1M | 60,000 | **$40,000** | $0.67 | 75,000 | $0.99 – $215.99 |
| Cloud Storage Backup & Drive (Daily Utility) | 3.8M | not in pull | not in pull | — | 7,000 | $0.49 – $499.99 |
| Cloud Storage Drive Backup (MindByte) | 656K | 40,000 | **$60,000** | **$1.50** | 36,000 | $9.99 – $179.99 |
| Cloud Storage & Cloud Drive (Fuzon) | 542K | 60,000 | <$1K | $0.02 | 29,000 | $1.49 – $69.99 |
| Cloud Backup (Mapidirections) | 452K | <1K | <$1K | — | 6,600 | $1.99 – $4.99 |
| CloudGate | 441K | <1K | <$1K | — | 6,900 | $1.99 – $179.99 |
| Cloud Storage-Sync (Utility Forge) | 211K | 10,000 | <$1K | — | 38,000 | $2.49 – $134.99 |
| DataHatch | 19.5K | not in pull | not in pull | — | 850 | $2.99 – $39.99 |
| Nova Cloud | 8.7K | <1K | <$1K | — | 560 | $0.99 – $119.99 |
| ANZ Cloud Drive | 5.5K | <1K | <$1K | — | 0 | $1.99 – $99.99 |
| Cloud storage (Golden) | 3.6K | <1K | <$1K | — | 540 | $1.09 – $14.99 |

Revenue/mo and revenue per download: Sensor Tower, 21-22 Sep 2026. Installs and IAP ranges: Google Play, 15 Sep 2026.

**The reading.** MindByte earns more per month than Fazcon on two-thirds of Fazcon's downloads, and it is the only
one of the eleven whose revenue could comfortably fund sustained paid UA. Fuzon takes 29-60K downloads a month and
earns under $1K on them — an organic engine with no money behind it. Seven of the eleven are under Sensor Tower's
$1K floor: their paywalls are, in revenue terms, decoration.

## 5. Paid-ads investment

No dollar spend figure exists for any of the eleven in any tool we can reach. What does exist:

- **Sensor Tower advertising flags, 21 Sep 2026.** MindByte **Active**; Mapidirections **New** (started inside 28 days);
  Utility Forge **New**; Fazcon **Inactive** (stopped inside 28 days). The other seven: no flag.
- **The growth-engine split from the free-GB study, 22 Sep 2026.** Paid ads drive MindByte (36K downloads/mo),
  Utility Forge (38K) and Mapidirections (6.6K). Search rank drives Fazcon (75K) and Fuzon (29K). An old install base
  carries Daily Utility (7K) and CloudGate (6.9K). DataHatch, Nova, Golden and ANZ have no engine at all.
- **Ads Transparency Center creative scans** for MindByte and Mapidirections, 21 Sep 2026, in
  `research/free-gb-offer-analysis/atc-scan.json` — creative ids, first/last seen dates and landing packages. It holds
  no country field and no spend.

**Inference, labelled as one:** where an advertising-flagged app's money goes is best approximated by its own top-3
markets — MindByte US/IN/NG, Utility Forge KZ/ID/RU, Mapidirections ID/DZ/IN. That is an inference from two separate
Sensor Tower fields, not a spend report.

To get real per-country spend: a Sensor Tower or AppMagic seat with ad-intelligence (country-level ad impressions and
share of voice), or a browser session on the Ads Transparency Center, which shows served regions per advertiser.

## 6. What an install costs and earns, by country

All figures are third-party benchmarks for Android, not category-specific to cloud storage — no source publishes CPI
for this category. Confidence is marked because several are tier bands from secondary write-ups, not primary reports.

| Country | Android CPI | Rewarded eCPM | Other | Confidence |
| --- | --- | --- | --- | --- |
| US | $4–8 (Business of Apps, 2025); $5.28 baseline (Linkrunner, 2024) | $16.49 (Tenjin/Mistplay, Q4 2024) | ~$60bn Play consumer spend 2025 (Sensor Tower) | Medium |
| UK | $3.85 install cost, +80% YoY (Adjust, H1 2026, e-commerce vertical) | $14–22 tier-1 band (RevenueLab, 2026) | Named Play-growth driver (Sensor Tower, 2025) | Medium-low |
| Spain | $1.85 Android, Western Europe (AppsFlyer, 2026) | $8–10 tier-2 band (RevenueLab, 2026) | — | Medium |
| UAE | no country-exact figure found | ~$14.55 blended (ad-network aggregate) | High-ARPU Gulf market, 82.1% smartphone penetration | Low |
| India | ≈0.12× US baseline (Linkrunner, 2024); utilities $0.05 (same) | $2–3 tier-3 band | 25.5bn Play installs 2025, #1 by downloads (Sensor Tower) | Medium-low |
| Pakistan | under $0.30 (2026 multi-region synthesis) | $2–3 | 93.8% Android; JazzCash + Easypaisa over 85% of wallet transactions (Simpaisa, 2026) | Low |
| Nigeria | under $0.30 (same) | $2–3 | 91.3% Android, 83.3M users; GSMA $40 entry-4G pilot signals device-cost barrier (Mar 2026) | Low |
| Bangladesh | under $0.30 (same) — lowest global tier | $2–3 assumed, not explicit | GSMA: lags in mobile-economy growth | Low |
| Philippines | very low, a common soft-launch market (qualitative) | $2–3 | no monetisation figure found | Low |
| Indonesia | $0.50–2 SEA band (Business of Apps, 2025) | $2–3 | 89.6% Android; DANA/OVO/GoPay wallets | Low |
| Brazil | $0.50–2 LatAm band (same) | $2–3 | Top-3 global download market 2025; Pix payments | Low |
| Mexico | $0.50–2 LatAm band (same) | $0.76 blended, dated | OXXO cash vouchers dampen subscription conversion | Low |
| Egypt | no recent public figure | no recent public figure | 90.4% Android; EGP devaluation history | Very low |
| South Africa | no recent public figure | no recent public figure | nothing surfaced on any dimension | Very low |
| Kazakhstan | no recent public figure | no recent public figure | Kaspi-dominant payments; 93.4% internet penetration (DataReportal, 2024) | Very low |
| Russia | n/a | n/a | **Play billing suspended for Russian users since Mar 2022; developer payouts to Russian bank accounts halted Dec 2024** (Google support) | High on the block itself |

Global reference points: Android CPI $1.12 worldwide, $1.85 Western Europe (Adjust and AppsFlyer, 2026).

## 7. Gaps to close if this section is ever taken further

1. **Per-country downloads and ranks for all eleven apps** — needs a paid Sensor Tower or AppMagic seat. Nothing free exposes it.
2. **Per-country ad spend and creative reach** — needs ad intelligence, or a browser session on the Ads Transparency Center.
3. **Daily Utility Apps (3.8M) and DataHatch have no country signal at all** — they are missing from the 21 Sep Sensor Tower pull, so the ranking is built on nine of eleven competitors.
4. **No rank board for India, Indonesia, Brazil, Spain, South Africa or Kazakhstan** — the 12-market probe covers only five head terms, and Spain, South Africa and Kazakhstan were never probed. A 94-keyword board for India and Indonesia would change the order of this table.
5. **No cloud-storage-category CPI anywhere** — the closest proxy found is generic Android utilities in India, 2024.
6. **Low-storage device mix by country** (share of 32/64GB phones) — the single most relevant demand signal for this app, and no source publishes it per country.
7. **South Africa, Tunisia, Kazakhstan and Algeria are economics blind spots** — no CPI, eCPM or Play-spend figure surfaced for any of them.
