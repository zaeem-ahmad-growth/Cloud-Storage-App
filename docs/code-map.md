# Code map

> **Generated file: do not edit by hand.** Produced by `node tools/export-docs.js`, which GitHub runs after every push.
> For every section of every tab: the anchor id, where its markup is (file and line), which function in [assets/app.js](../assets/app.js) fills it, and which fields of [assets/data.js](../assets/data.js) that function reads (paths as in the [data dictionary](data-dictionary.md)). To change a section's wording, edit the markup for static text or the named function for text built from data; to change numbers, edit the data.

<a id="07-cloud-storage"></a>

## Cloud Storage

Markup: [tabs/07-cloud-storage/index.html](../tabs/07-cloud-storage/index.html) · `<body data-page="cloud-storage">` · self-contained page (static HTML plus the inline script at the bottom of the file) · [text snapshot](tabs/07-cloud-storage.md)

| Section | Menu label | Heading in the markup | Markup line | Filled by (assets/app.js) | Data read |
| --- | --- | --- | --- | --- | --- |
| [#overview](tabs/07-cloud-storage.md#overview) | Overview | Cloud Storage:Secure Vault | [L289](../tabs/07-cloud-storage/index.html#L289) | static markup / inline script |  |
| [#spec](tabs/07-cloud-storage.md#spec) | Spec | What ships inside the build | [L304](../tabs/07-cloud-storage/index.html#L304) | static markup / inline script |  |
| [#market](tabs/07-cloud-storage.md#market) | Market research | The most complete build in a crowded search | [L309](../tabs/07-cloud-storage/index.html#L309) | static markup / inline script |  |
| [#versions](tabs/07-cloud-storage.md#versions) | Versions & APK | From the first commit to 0.2.6 | [L328](../tabs/07-cloud-storage/index.html#L328) | static markup / inline script |  |
| [#money](tabs/07-cloud-storage.md#money) | Monetization | 46 ad slots, each with its own switch | [L332](../tabs/07-cloud-storage/index.html#L332) | static markup / inline script |  |
| [#shots](tabs/07-cloud-storage.md#shots) | Screenshots | What the Play listing shows | [L344](../tabs/07-cloud-storage/index.html#L344) | static markup / inline script |  |
| [#graphics](tabs/07-cloud-storage.md#graphics) | Graphics | Brand assets and store readiness | [L349](../tabs/07-cloud-storage/index.html#L349) | static markup / inline script |  |
| [#qa](tabs/07-cloud-storage.md#qa) | QA history | 14 bugs fixed, 2 improvements scheduled | [L354](../tabs/07-cloud-storage/index.html#L354) | static markup / inline script |  |

<a id="01-aso-playbook"></a>

## ASO Playbook

Markup: [tabs/01-aso-playbook/index.html](../tabs/01-aso-playbook/index.html) · `<body data-page="playbook">` · content drawn by assets/app.js · [text snapshot](tabs/01-aso-playbook.md)

| Section | Menu label | Heading in the markup | Markup line | Filled by (assets/app.js) | Data read |
| --- | --- | --- | --- | --- | --- |
| [#niches](tabs/01-aso-playbook.md#niches) | Niches | Five niches, one opening | [L59](../tabs/01-aso-playbook/index.html#L59) | `renderShare()` [L62-71](../assets/app.js#L62) | `data.apps` |
| [#competitors](tabs/01-aso-playbook.md#competitors) | Competitors | The 11 apps you named, measured | [L86](../tabs/01-aso-playbook/index.html#L86) | `renderCompetitors()` [L72-107](../assets/app.js#L72) | `data.apps`, `data.profiles` |
| [#matrix](tabs/01-aso-playbook.md#matrix) | Rank tracker | Where each competitor ranks, keyword by keyword | [L96](../tabs/01-aso-playbook/index.html#L96) | `renderMatrix()` [L108-120](../assets/app.js#L108) | `data.apps`, `data.compIdx` |
| [#serps](tabs/01-aso-playbook.md#serps) | Result slots | Every search, slot by slot | [L111](../tabs/01-aso-playbook/index.html#L111) | `renderStrips()` [L121-150](../assets/app.js#L121) | `data.apps`, `data.compIdx` |
| [#keywords](tabs/01-aso-playbook.md#keywords) | Keyword board | Keyword opportunity board, relevance first | [L122](../tabs/01-aso-playbook/index.html#L122) | `renderTierChips()` [L151-160](../assets/app.js#L151)<br>`renderBoard()` [L161-194](../assets/app.js#L161) | `data.apps` |
| [#ladder](tabs/01-aso-playbook.md#ladder) | Ladder | Launch keyword ladder | [L136](../tabs/01-aso-playbook/index.html#L136) | `renderLadder()` [L195-215](../assets/app.js#L195) | `data.apps` |
| [#listing](tabs/01-aso-playbook.md#listing) | Listing | Proposed ASO package | [L145](../tabs/01-aso-playbook/index.html#L145) | `renderListing()` [L222-272](../assets/app.js#L222) | `data.apps`, `listing.long`, `listing.phrases`, `listing.shorts`, `listing.taken`, `listing.titles`, `listing.verify` |
| [#movement](tabs/01-aso-playbook.md#movement) | 8→15 Sep | Did the first run hold up? | [L159](../tabs/01-aso-playbook/index.html#L159) | `renderMovement()` [L273-288](../assets/app.js#L273) | `data.evidence` |
| [#probe](tabs/01-aso-playbook.md#probe) | 12 markets | Where the 11 competitors surface at all | [L200](../tabs/01-aso-playbook/index.html#L200) | `renderProbe()` [L289-299](../assets/app.js#L289) | `data.apps`, `data.compIdx`, `data.probe` |
| [#practice](tabs/01-aso-playbook.md#practice) | Practice | What the industry says | [L209](../tabs/01-aso-playbook/index.html#L209) | static markup |  |
| [#risks](tabs/01-aso-playbook.md#risks) | Watch-outs | Watch-outs | [L225](../tabs/01-aso-playbook/index.html#L225) | static markup |  |
| [#method](tabs/01-aso-playbook.md#method) | Method | (built by script) | [L246](../tabs/01-aso-playbook/index.html#L246) | static markup |  |

<a id="02-playstore-metadata"></a>

## PlayStore Metadata

Markup: [tabs/02-playstore-metadata/index.html](../tabs/02-playstore-metadata/index.html) · `<body data-page="metadata">` · content drawn by assets/app.js · [text snapshot](tabs/02-playstore-metadata.md)

| Section | Menu label | Heading in the markup | Markup line | Filled by (assets/app.js) | Data read |
| --- | --- | --- | --- | --- | --- |
| [#metadata](tabs/02-playstore-metadata.md#metadata) |  | Title, short description and full description | [L28](../tabs/02-playstore-metadata/index.html#L28) | `renderMetadata()` [L529-756](../assets/app.js#L529) | `data.apps`, `data.compIdx`, `data.evidence`, `data.markets.US`, `features`, `mymeta.appId`, `mymeta.assets.feature`, `mymeta.assets.icon`, `mymeta.assets.screenshots`, `mymeta.containsAds`, `mymeta.contentRating`, `mymeta.developer`, `mymeta.developerSite`, `mymeta.fetchedAt` |
| [#m-overview](tabs/02-playstore-metadata.md#m-overview) | Listing | (built by script) | [L29](../tabs/02-playstore-metadata/index.html#L29) | `renderMetadata()` [L529-756](../assets/app.js#L529) | `data.apps`, `data.compIdx`, `data.evidence`, `data.markets.US`, `features`, `mymeta.appId`, `mymeta.assets.feature`, `mymeta.assets.icon`, `mymeta.assets.screenshots`, `mymeta.containsAds`, `mymeta.contentRating`, `mymeta.developer`, `mymeta.developerSite`, `mymeta.fetchedAt` |
| [#m-current](tabs/02-playstore-metadata.md#m-current) | Metadata | Title, short description and full description | [L37](../tabs/02-playstore-metadata/index.html#L37) | `renderMetadata()` [L529-756](../assets/app.js#L529) | `data.apps`, `data.compIdx`, `data.evidence`, `data.markets.US`, `features`, `mymeta.appId`, `mymeta.assets.feature`, `mymeta.assets.icon`, `mymeta.assets.screenshots`, `mymeta.containsAds`, `mymeta.contentRating`, `mymeta.developer`, `mymeta.developerSite`, `mymeta.fetchedAt` |
| [#m-targets](tabs/02-playstore-metadata.md#m-targets) | Targeted keywords | Every keyword this metadata targets | [L50](../tabs/02-playstore-metadata/index.html#L50) | `renderMetadata()` [L529-756](../assets/app.js#L529) | `data.apps`, `data.compIdx`, `data.evidence`, `data.markets.US`, `features`, `mymeta.appId`, `mymeta.assets.feature`, `mymeta.assets.icon`, `mymeta.assets.screenshots`, `mymeta.containsAds`, `mymeta.contentRating`, `mymeta.developer`, `mymeta.developerSite`, `mymeta.fetchedAt` |
| [#m-actions](tabs/02-playstore-metadata.md#m-actions) | Composition | How this metadata follows the ASO Playbook | [L60](../tabs/02-playstore-metadata/index.html#L60) | `renderMetadata()` [L529-756](../assets/app.js#L529) | `data.apps`, `data.compIdx`, `data.evidence`, `data.markets.US`, `features`, `mymeta.appId`, `mymeta.assets.feature`, `mymeta.assets.icon`, `mymeta.assets.screenshots`, `mymeta.containsAds`, `mymeta.contentRating`, `mymeta.developer`, `mymeta.developerSite`, `mymeta.fetchedAt` |
| [#m-keywords](tabs/02-playstore-metadata.md#m-keywords) | Finalized keywords | Finalized keywords | [L75](../tabs/02-playstore-metadata/index.html#L75) | `renderMetadata()` [L529-756](../assets/app.js#L529) | `data.apps`, `data.compIdx`, `data.evidence`, `data.markets.US`, `features`, `mymeta.appId`, `mymeta.assets.feature`, `mymeta.assets.icon`, `mymeta.assets.screenshots`, `mymeta.containsAds`, `mymeta.contentRating`, `mymeta.developer`, `mymeta.developerSite`, `mymeta.fetchedAt` |
| [#m-ladder](tabs/02-playstore-metadata.md#m-ladder) | Ladder | Launch keyword ladder of this metadata | [L88](../tabs/02-playstore-metadata/index.html#L88) | `renderMetadata()` [L529-756](../assets/app.js#L529) | `data.apps`, `data.compIdx`, `data.evidence`, `data.markets.US`, `features`, `mymeta.appId`, `mymeta.assets.feature`, `mymeta.assets.icon`, `mymeta.assets.screenshots`, `mymeta.containsAds`, `mymeta.contentRating`, `mymeta.developer`, `mymeta.developerSite`, `mymeta.fetchedAt` |
| [#m-used](tabs/02-playstore-metadata.md#m-used) | Competitor ranks | How your competitors rank on the keywords you use | [L97](../tabs/02-playstore-metadata/index.html#L97) | `renderMetadata()` [L529-756](../assets/app.js#L529) | `data.apps`, `data.compIdx`, `data.evidence`, `data.markets.US`, `features`, `mymeta.appId`, `mymeta.assets.feature`, `mymeta.assets.icon`, `mymeta.assets.screenshots`, `mymeta.containsAds`, `mymeta.contentRating`, `mymeta.developer`, `mymeta.developerSite`, `mymeta.fetchedAt` |
| [#m-package](tabs/02-playstore-metadata.md#m-package) | vs Proposed package | How this metadata follows the Proposed ASO package | [L112](../tabs/02-playstore-metadata/index.html#L112) | `renderMetadata()` [L529-756](../assets/app.js#L529) | `data.apps`, `data.compIdx`, `data.evidence`, `data.markets.US`, `features`, `mymeta.appId`, `mymeta.assets.feature`, `mymeta.assets.icon`, `mymeta.assets.screenshots`, `mymeta.containsAds`, `mymeta.contentRating`, `mymeta.developer`, `mymeta.developerSite`, `mymeta.fetchedAt` |
| [#m-holdup](tabs/02-playstore-metadata.md#m-holdup) | First run check | Did the first run hold up? | [L121](../tabs/02-playstore-metadata/index.html#L121) | `renderMetadata()` [L529-756](../assets/app.js#L529) | `data.apps`, `data.compIdx`, `data.evidence`, `data.markets.US`, `features`, `mymeta.appId`, `mymeta.assets.feature`, `mymeta.assets.icon`, `mymeta.assets.screenshots`, `mymeta.containsAds`, `mymeta.contentRating`, `mymeta.developer`, `mymeta.developerSite`, `mymeta.fetchedAt` |
| [#m-method](tabs/02-playstore-metadata.md#m-method) | Method | How this tab was built | [L138](../tabs/02-playstore-metadata/index.html#L138) | `renderMetadata()` [L529-756](../assets/app.js#L529) | `data.apps`, `data.compIdx`, `data.evidence`, `data.markets.US`, `features`, `mymeta.appId`, `mymeta.assets.feature`, `mymeta.assets.icon`, `mymeta.assets.screenshots`, `mymeta.containsAds`, `mymeta.contentRating`, `mymeta.developer`, `mymeta.developerSite`, `mymeta.fetchedAt` |

<a id="03-features-comparison"></a>

## Features Comparison

Markup: [tabs/03-features-comparison/index.html](../tabs/03-features-comparison/index.html) · `<body data-page="features">` · content drawn by assets/app.js · [text snapshot](tabs/03-features-comparison.md)

| Section | Menu label | Heading in the markup | Markup line | Filled by (assets/app.js) | Data read |
| --- | --- | --- | --- | --- | --- |
| [#features](tabs/03-features-comparison.md#features) |  | Features Comparison | [L28](../tabs/03-features-comparison/index.html#L28) | `renderFeatures()` [L769-860](../assets/app.js#L769) | `data.apps`, `features.apps`, `features.features`, `features.inventory`, `features.ours.dev`, `features.ours.name`, `features.pitch`, `pricing.benchmark`, `pricing.currency`, `pricing.notes`, `pricing.plans`, `pricing.recommended.paywall`, `pricing.recommended.plans` |
| [#f-overview](tabs/03-features-comparison.md#f-overview) | Overview | Features Comparison | [L29](../tabs/03-features-comparison/index.html#L29) | `renderFeatures()` [L769-860](../assets/app.js#L769) | `data.apps`, `features.apps`, `features.features`, `features.inventory`, `features.ours.dev`, `features.ours.name`, `features.pitch`, `pricing.benchmark`, `pricing.currency`, `pricing.notes`, `pricing.plans`, `pricing.recommended.paywall`, `pricing.recommended.plans` |
| [#f-lead](tabs/03-features-comparison.md#f-lead) | Coverage | How complete each app is | [L37](../tabs/03-features-comparison/index.html#L37) | `renderFeatures()` [L769-860](../assets/app.js#L769) | `data.apps`, `features.apps`, `features.features`, `features.inventory`, `features.ours.dev`, `features.ours.name`, `features.pitch`, `pricing.benchmark`, `pricing.currency`, `pricing.notes`, `pricing.plans`, `pricing.recommended.paywall`, `pricing.recommended.plans` |
| [#f-matrix](tabs/03-features-comparison.md#f-matrix) | Feature matrix | Feature matrix | [L47](../tabs/03-features-comparison/index.html#L47) | `renderFeatures()` [L769-860](../assets/app.js#L769) | `data.apps`, `features.apps`, `features.features`, `features.inventory`, `features.ours.dev`, `features.ours.name`, `features.pitch`, `pricing.benchmark`, `pricing.currency`, `pricing.notes`, `pricing.plans`, `pricing.recommended.paywall`, `pricing.recommended.plans` |
| [#f-inventory](tabs/03-features-comparison.md#f-inventory) | What ships | What ships in our app | [L57](../tabs/03-features-comparison/index.html#L57) | `renderFeatures()` [L769-860](../assets/app.js#L769) | `data.apps`, `features.apps`, `features.features`, `features.inventory`, `features.ours.dev`, `features.ours.name`, `features.pitch`, `pricing.benchmark`, `pricing.currency`, `pricing.notes`, `pricing.plans`, `pricing.recommended.paywall`, `pricing.recommended.plans` |
| [#f-iap](tabs/03-features-comparison.md#f-iap) | IAP comparison | Pricing against every competitor | [L66](../tabs/03-features-comparison/index.html#L66) | `renderFeatures()` [L769-860](../assets/app.js#L769) | `data.apps`, `features.apps`, `features.features`, `features.inventory`, `features.ours.dev`, `features.ours.name`, `features.pitch`, `pricing.benchmark`, `pricing.currency`, `pricing.notes`, `pricing.plans`, `pricing.recommended.paywall`, `pricing.recommended.plans` |
| [#f-method](tabs/03-features-comparison.md#f-method) | Method | Where this comes from | [L99](../tabs/03-features-comparison/index.html#L99) | `renderFeatures()` [L769-860](../assets/app.js#L769) | `data.apps`, `features.apps`, `features.features`, `features.inventory`, `features.ours.dev`, `features.ours.name`, `features.pitch`, `pricing.benchmark`, `pricing.currency`, `pricing.notes`, `pricing.plans`, `pricing.recommended.paywall`, `pricing.recommended.plans` |

<a id="04-competitors-graphics"></a>

## Competitor’s Graphics

Markup: [tabs/04-competitors-graphics/index.html](../tabs/04-competitors-graphics/index.html) · `<body data-page="graphics">` · content drawn by assets/app.js · [text snapshot](tabs/04-competitors-graphics.md)

| Section | Menu label | Heading in the markup | Markup line | Filled by (assets/app.js) | Data read |
| --- | --- | --- | --- | --- | --- |
| [#graphics](tabs/04-competitors-graphics.md#graphics) |  | Competitor’s Graphics | [L28](../tabs/04-competitors-graphics/index.html#L28) | `lbStep()` [L420-437](../assets/app.js#L420)<br>`renderGraphics()` [L338-386](../assets/app.js#L338)<br>`applyGraphicsFilter()` [L396-414](../assets/app.js#L396) | `data.markets.US`, `mymeta`, `graphics.apps`, `graphics.captureNote`, `graphics.guidance`, `graphics.overview`, `graphics.patterns`, `graphics.requirements`, `graphics.scope`, `graphics.sources`, `graphics.table` |
| [#g-overview](tabs/04-competitors-graphics.md#g-overview) | Overview | Competitor’s Graphics | [L29](../tabs/04-competitors-graphics/index.html#L29) | `renderGraphics()` [L338-386](../assets/app.js#L338) | `graphics.apps`, `graphics.captureNote`, `graphics.guidance`, `graphics.overview`, `graphics.patterns`, `graphics.requirements`, `graphics.scope`, `graphics.sources`, `graphics.table` |
| [#g-icons](tabs/04-competitors-graphics.md#g-icons) | Icons | All 11 icons side by side | [L38](../tabs/04-competitors-graphics/index.html#L38) | `renderGraphics()` [L338-386](../assets/app.js#L338) | `graphics.apps`, `graphics.captureNote`, `graphics.guidance`, `graphics.overview`, `graphics.patterns`, `graphics.requirements`, `graphics.scope`, `graphics.sources`, `graphics.table` |
| [#g-features](tabs/04-competitors-graphics.md#g-features) | Feature graphics | All 11 feature graphics | [L47](../tabs/04-competitors-graphics/index.html#L47) | `renderGraphics()` [L338-386](../assets/app.js#L338)<br>`lbStep()` [L420-437](../assets/app.js#L420) | `graphics.apps`, `graphics.captureNote`, `graphics.guidance`, `graphics.overview`, `graphics.patterns`, `graphics.requirements`, `graphics.scope`, `graphics.sources`, `graphics.table`, `data.markets.US`, `mymeta` |
| [#g-apps](tabs/04-competitors-graphics.md#g-apps) | By app | Every asset, app by app | [L56](../tabs/04-competitors-graphics/index.html#L56) | `renderGraphics()` [L338-386](../assets/app.js#L338)<br>`applyGraphicsFilter()` [L396-414](../assets/app.js#L396) | `graphics.apps`, `graphics.captureNote`, `graphics.guidance`, `graphics.overview`, `graphics.patterns`, `graphics.requirements`, `graphics.scope`, `graphics.sources`, `graphics.table` |
| [#g-patterns](tabs/04-competitors-graphics.md#g-patterns) | Patterns | Cross-app design patterns | [L73](../tabs/04-competitors-graphics/index.html#L73) | `renderGraphics()` [L338-386](../assets/app.js#L338) | `graphics.apps`, `graphics.captureNote`, `graphics.guidance`, `graphics.overview`, `graphics.patterns`, `graphics.requirements`, `graphics.scope`, `graphics.sources`, `graphics.table` |
| [#g-guidance](tabs/04-competitors-graphics.md#g-guidance) | Guidance | Guidance for future graphics | [L81](../tabs/04-competitors-graphics/index.html#L81) | `renderGraphics()` [L338-386](../assets/app.js#L338) | `graphics.apps`, `graphics.captureNote`, `graphics.guidance`, `graphics.overview`, `graphics.patterns`, `graphics.requirements`, `graphics.scope`, `graphics.sources`, `graphics.table` |
| [#g-requirements](tabs/04-competitors-graphics.md#g-requirements) | Play requirements | Play Store production requirements | [L89](../tabs/04-competitors-graphics/index.html#L89) | `renderGraphics()` [L338-386](../assets/app.js#L338) | `graphics.apps`, `graphics.captureNote`, `graphics.guidance`, `graphics.overview`, `graphics.patterns`, `graphics.requirements`, `graphics.scope`, `graphics.sources`, `graphics.table` |
| [#g-scope](tabs/04-competitors-graphics.md#g-scope) | Scope | Scope, evidence and limitations | [L97](../tabs/04-competitors-graphics/index.html#L97) | `renderGraphics()` [L338-386](../assets/app.js#L338) | `graphics.apps`, `graphics.captureNote`, `graphics.guidance`, `graphics.overview`, `graphics.patterns`, `graphics.requirements`, `graphics.scope`, `graphics.sources`, `graphics.table` |
| [#g-sources](tabs/04-competitors-graphics.md#g-sources) | Sources | Sources | [L105](../tabs/04-competitors-graphics/index.html#L105) | `renderGraphics()` [L338-386](../assets/app.js#L338) | `graphics.apps`, `graphics.captureNote`, `graphics.guidance`, `graphics.overview`, `graphics.patterns`, `graphics.requirements`, `graphics.scope`, `graphics.sources`, `graphics.table` |

<a id="05-free-100-gb-offer"></a>

## Free 100 GB Offer

Markup: [tabs/05-free-100-gb-offer/index.html](../tabs/05-free-100-gb-offer/index.html) · `<body data-page="free-gb-offer">` · self-contained page (static HTML plus the inline script at the bottom of the file) · [text snapshot](tabs/05-free-100-gb-offer.md)

| Section | Menu label | Heading in the markup | Markup line | Filled by (assets/app.js) | Data read |
| --- | --- | --- | --- | --- | --- |

<a id="06-ua-strategy"></a>

## UA Strategy

Markup: [tabs/06-ua-strategy/index.html](../tabs/06-ua-strategy/index.html) · `<body data-page="ua-strategy">` · self-contained page (static HTML plus the inline script at the bottom of the file) · [text snapshot](tabs/06-ua-strategy.md)

| Section | Menu label | Heading in the markup | Markup line | Filled by (assets/app.js) | Data read |
| --- | --- | --- | --- | --- | --- |
| [#summary](tabs/06-ua-strategy.md#summary) | Summary | What this strategy bets on | [L99](../tabs/06-ua-strategy/index.html#L99) | static markup / inline script |  |
| [#keywords](tabs/06-ua-strategy.md#keywords) | Keyword board | Keyword metrics and competitor analysis | [L143](../tabs/06-ua-strategy/index.html#L143) | static markup / inline script |  |
| [#headlines](tabs/06-ua-strategy.md#headlines) | Headlines | Ten headlines | [L172](../tabs/06-ua-strategy/index.html#L172) | static markup / inline script |  |
| [#descriptions](tabs/06-ua-strategy.md#descriptions) | Descriptions | Ten descriptions | [L193](../tabs/06-ua-strategy/index.html#L193) | static markup / inline script |  |
| [#comparison](tabs/06-ua-strategy.md#comparison) | Side by side | First draft against the web-scraped re-run | [L214](../tabs/06-ua-strategy/index.html#L214) | static markup / inline script |  |
| [#countries](tabs/06-ua-strategy.md#countries) | Target countries | Target Countries of Competitors | [L275](../tabs/06-ua-strategy/index.html#L275) | static markup / inline script |  |
| [#checks](tabs/06-ua-strategy.md#checks) | Checks | What was verified, and what still has to be | [L580](../tabs/06-ua-strategy/index.html#L580) | static markup / inline script |  |

## All functions in assets/app.js

| Function | Lines | Data read |
| --- | --- | --- |
| `on` | [L6-22](../assets/app.js#L6) | `data.apps`, `data.compIdx`, `data.markets.US`, `data.profiles`, `listing` |
| `esc` | [L23-23](../assets/app.js#L23) |  |
| `fmt` | [L24-24](../assets/app.js#L24) |  |
| `daysOld` | [L25-25](../assets/app.js#L25) |  |
| `isFresh` | [L26-26](../assets/app.js#L26) |  |
| `slotClass` | [L27-27](../assets/app.js#L27) | `data.apps`, `data.compIdx` |
| `band` | [L28-31](../assets/app.js#L28) |  |
| `rowsOf` | [L32-34](../assets/app.js#L32) | `data.markets` |
| `renderHeader` | [L35-52](../assets/app.js#L35) | `data.apps`, `data.compIdx`, `data.evidence`, `data.markets.US`, `data.profiles` |
| `renderMarketSeg` | [L53-61](../assets/app.js#L53) |  |
| `renderShare` | [L62-71](../assets/app.js#L62) | `data.apps` |
| `renderCompetitors` | [L72-107](../assets/app.js#L72) | `data.apps`, `data.profiles` |
| `renderMatrix` | [L108-120](../assets/app.js#L108) | `data.apps`, `data.compIdx` |
| `renderStrips` | [L121-150](../assets/app.js#L121) | `data.apps`, `data.compIdx` |
| `renderTierChips` | [L151-160](../assets/app.js#L151) |  |
| `renderBoard` | [L161-194](../assets/app.js#L161) | `data.apps` |
| `renderLadder` | [L195-215](../assets/app.js#L195) | `data.apps` |
| `normWords` | [L216-217](../assets/app.js#L216) | `data.apps` |
| `coverage` | [L218-221](../assets/app.js#L218) |  |
| `renderListing` | [L222-272](../assets/app.js#L222) | `data.apps`, `listing.long`, `listing.phrases`, `listing.shorts`, `listing.taken`, `listing.titles`, `listing.verify` |
| `renderMovement` | [L273-288](../assets/app.js#L273) | `data.evidence` |
| `renderProbe` | [L289-299](../assets/app.js#L289) | `data.apps`, `data.compIdx`, `data.probe` |
| `tipFor` | [L300-306](../assets/app.js#L300) | `data.apps`, `data.compIdx` |
| `placeTip` | [L307-323](../assets/app.js#L307) | `graphics` |
| `gUrl` | [L324-324](../assets/app.js#L324) |  |
| `pkgOf` | [L325-327](../assets/app.js#L325) | `graphics.apps` |
| `iconOf` | [L328-328](../assets/app.js#L328) |  |
| `fgOf` | [L329-330](../assets/app.js#L329) |  |
| `gFigure` | [L331-337](../assets/app.js#L331) |  |
| `renderGraphics` | [L338-386](../assets/app.js#L338) | `graphics.apps`, `graphics.captureNote`, `graphics.guidance`, `graphics.overview`, `graphics.patterns`, `graphics.requirements`, `graphics.scope`, `graphics.sources`, `graphics.table` |
| `renderGraphicsVis` | [L387-395](../assets/app.js#L387) | `data.profiles` |
| `applyGraphicsFilter` | [L396-414](../assets/app.js#L396) |  |
| `lbShow` | [L415-419](../assets/app.js#L415) |  |
| `lbStep` | [L420-437](../assets/app.js#L420) | `data.markets.US`, `mymeta` |
| `reEsc` | [L438-438](../assets/app.js#L438) |  |
| `normT` | [L439-439](../assets/app.js#L439) |  |
| `phraseN` | [L440-440](../assets/app.js#L440) |  |
| `wordSet` | [L441-441](../assets/app.js#L441) |  |
| `allIn` | [L442-442](../assets/app.js#L442) |  |
| `nWords` | [L443-443](../assets/app.js#L443) |  |
| `plainLong` | [L444-448](../assets/app.js#L444) | `listing.long`, `listing.shorts`, `listing.titles`, `mymeta.release.description`, `mymeta.release.summary`, `mymeta.release.title` |
| `coverageOf` | [L449-457](../assets/app.js#L449) |  |
| `covPill` | [L458-458](../assets/app.js#L458) |  |
| `prioCoverage` | [L459-460](../assets/app.js#L459) | `data.markets.US` |
| `placeIn` | [L461-461](../assets/app.js#L461) |  |
| `compRanks` | [L462-462](../assets/app.js#L462) | `data.compIdx` |
| `compTop10` | [L463-463](../assets/app.js#L463) |  |
| `compNames` | [L464-464](../assets/app.js#L464) |  |
| `entryCell` | [L465-465](../assets/app.js#L465) | `data.apps` |
| `jacc` | [L466-466](../assets/app.js#L466) |  |
| `sentences` | [L467-468](../assets/app.js#L467) |  |
| `highlight` | [L469-478](../assets/app.js#L469) |  |
| `ladderPhases` | [L479-489](../assets/app.js#L479) |  |
| `compTitlesWith` | [L490-491](../assets/app.js#L490) | `data.profiles` |
| `policyRecord` | [L492-528](../assets/app.js#L492) | `data.apps`, `data.markets.US`, `data.profiles`, `graphics.table`, `mymeta.assets.feature`, `mymeta.assets.screenshots`, `mymeta.containsAds`, `mymeta.genre`, `mymeta.iap`, `mymeta.privacyPolicy` |
| `renderMetadata` | [L529-756](../assets/app.js#L529) | `data.apps`, `data.compIdx`, `data.evidence`, `data.markets.US`, `features`, `mymeta.appId`, `mymeta.assets.feature`, `mymeta.assets.icon`, `mymeta.assets.screenshots`, `mymeta.containsAds`, `mymeta.contentRating`, `mymeta.developer` |
| `fScore` | [L757-757](../assets/app.js#L757) | `features.features` |
| `rs` | [L758-758](../assets/app.js#L758) |  |
| `appLabel` | [L759-760](../assets/app.js#L759) |  |
| `bars` | [L761-768](../assets/app.js#L761) |  |
| `renderFeatures` | [L769-860](../assets/app.js#L769) | `data.apps`, `features.apps`, `features.features`, `features.inventory`, `features.ours.dev`, `features.ours.name`, `features.pitch`, `pricing.benchmark`, `pricing.currency`, `pricing.notes`, `pricing.plans`, `pricing.recommended.paywall` |
| `syncBar` | [L861-870](../assets/app.js#L861) | `data.apps` |
| `renderScope` | [L871-871](../assets/app.js#L871) |  |
| `renderScoped` | [L872-885](../assets/app.js#L872) |  |
