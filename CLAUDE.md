# Cloud Storage App: rules for Claude

This repository is the shared, public research site for the Android app **Cloud Storage: Secure Vault** (package `com.softwarealliance.cloudvault`, developer Cell Cave). Several people edit it, each from their own VS Code and their own Claude account. GitHub Pages publishes the `main` branch as it is: there is no build step, and a push goes live about a minute later at `https://zaeem-ahmad-growth.github.io/Cloud-Storage-App/`.

The site started as the Claude artifact https://claude.ai/artifact/GMDahxdE589GyGefGyTdpK ("Cloud Storage ASO By Zaeem"). Only the account that owns an artifact can update it, so this repository is now the master copy. Edit here, not the artifact.

## Knowledge base (always loaded)

The file below is imported into every Claude Code session in this repository, so the key facts are known before any request.

@docs/knowledge.md

## Load only what the request needs

Keep every request cheap. Answer from the knowledge base when you can, and open other files only when the request needs them:

| The request is about | Open | Do not |
| --- | --- | --- |
| Wording, numbers or a new paragraph on a tab | `docs/tabs/<tab>.md` to find the text, then the file and line the [code map](docs/code-map.md) points to (the tab's `index.html`, or `assets/data.js`) | load backend files, or run scripts, browsers, builds or checks |
| How a tab works (calculations, filters, data flow, behaviour) or a change to its code | `docs/backend/<tab>.md` first, or run `/backend <tab>`: the full code that draws the tab and the full data it reads | run anything the user did not ask for |
| How the data was collected or scored | `docs/backend/research.md` (or `/backend research`), `docs/research-index.md`, `research/README.md` | re-run the scrapers unless the user asks |
| What a data field means | `docs/data-dictionary.md` | |
| Anything else about the repository | `docs/README.md` | |

## Layout

```
index.html                     redirects to the first tab
assets/
  nav.js                       the tab bar on every page; the TABS list sets the tabs and their order
  site.css                     shared styles
  bar.css                      the tab bar alone, for tabs that bring their own styles
  data.js                      PAYLOAD: the research data behind every tab
  app.js                       draws the tabs from PAYLOAD; <body data-page="..."> picks which part runs
  mylisting/                   the app's Play Store icon, feature graphic and screenshots
tabs/
  01-aso-playbook/             data-page="playbook"
  02-playstore-metadata/       data-page="metadata"
  03-features-comparison/      data-page="features"
  04-competitors-graphics/     data-page="graphics"; competitor images in graphics/
  05-free-100-gb-offer/        self-contained page with its own CSS and JS (from a Claude artifact); images in img/
docs/                          knowledge.md (always loaded) and README.md are written by hand; everything else is generated
  backend/                     per tab: the full code that draws it and the full data it reads; research.md: every research script
.github/workflows/docs.yml     regenerates docs/ on GitHub after every push
.claude/commands/backend.md    the /backend command, which loads a tab's code and data
tools/                         export-docs.js regenerates docs/; dom-to-md.js converts a rendered page to Markdown
research/                      backend data, scripts and reports behind the pages
```

## Editing an existing tab

- Tab 05 is a plain, self-contained page: edit `tabs/05-free-100-gb-offer/index.html` directly. Its numbers are inline in the HTML and in the small script at the bottom. Keep its section menu (the `.jump` links in the bar) in step with the section `id`s.
- Tabs 01-04 are drawn by `assets/app.js` from `assets/data.js`. Numbers and tables come from `PAYLOAD`; many sentences are written in the render function for that tab (`renderHeader`, `renderListing`, `renderMetadata`, `renderFeatures`, `renderGraphics` and so on). Static headings, section intros and the niche table are in the tab's `index.html`.
- `app.js` and `data.js` are shared by tabs 01-04. After changing them, open all the tabs and check that nothing broke (see "Checking your work").
- `assets/data.js` is laid out one field per line. The value after each `= ` is plain JSON, so keep it valid JSON: double quotes, no trailing commas, no comments inside.
- In `app.js`, attach listeners with `on('<element id>', 'click', ...)` rather than `document.getElementById(...).addEventListener(...)`: the element may exist on only one page.

## Adding a tab

1. Run `git pull --rebase` first.
2. Create `tabs/<NN>-<slug>/index.html`. `NN` is one more than the highest number in `tabs/`; `<slug>` is short, lowercase and hyphenated.
3. Start from the page skeleton of an existing tab: the `<head>` (fonts and `../../assets/site.css`), the `<nav class="bar" id="bar">` block with an empty `<div class="tabs" id="site-tabs">`, and the `<script src="../../assets/nav.js"></script>` line straight after the nav. Set `<body data-page="<slug>">` and a `<title>` of the form `<Tab label> · Cloud Storage App`.
4. Put the tab's own CSS and JS inline, or in files inside the tab folder. Save its images and data files in the tab folder and use relative paths (`img/chart.png`), never `/img/...` and never a claude.ai URL.
5. Add one line to `TABS` in `assets/nav.js`: `{ slug: '<NN>-<slug>', label: '<Tab label>' }`.
6. The page must work at phone width and in light and dark mode. Reuse the CSS variables in `site.css` (`--surface`, `--ink`, `--accent`, `--line` and so on) instead of fixed colours.

To turn a Claude artifact into a tab: read it with the Artifact tool (`action: "read"`), fetch every file it references (`action: "read"` with `paths`) into the tab folder, then wrap it in the skeleton above. An artifact keeps its own design: load `../../assets/bar.css` instead of `site.css`, give the nav `id="bar"` but no `bar` class (many artifacts use `.bar` and `.wrap` for their own elements), and keep the artifact's CSS and script inline. Drop the claude.ai frame-runtime script if the saved HTML has one at the top of `<head>`. `tabs/05-free-100-gb-offer/` is the worked example.

## Checking your work

Only after a code change (`assets/app.js`, a page's `<script>`, or the structure of `assets/data.js`): open the affected tab pages from disk in a browser, click through them and look for errors in the browser console. Skip this for wording and number edits.

## Saving and publishing

1. `git pull --rebase`
2. Do not run `tools/export-docs.js` and do not edit the generated files in `docs/`: after your push, GitHub regenerates them (the "Update docs" workflow) and commits the result within a few minutes, so run `git pull --rebase` before your next change. If your change makes a fact in `docs/knowledge.md` wrong, correct that line in the same commit.
3. `git add` only the files you changed, then `git commit -m "<Tab label>: <what changed>"`.
4. `git push`. If it is rejected because someone pushed first, run `git pull --rebase` and push again. Never force-push.
5. Tell the user the change is live about a minute after the push, at `https://zaeem-ahmad-growth.github.io/Cloud-Storage-App/tabs/<NN>-<slug>/`.

## Other people's work

- Change or delete only what the user asked for. Before rewriting someone else's section or tab, check who wrote it with `git log --format=%an -- <path>` and confirm with the user.
- Never renumber or rename other tabs. Do not restructure `assets/` unless the repository owner asks.

## Content rules

- The repository and site are public. Never commit API keys, tokens, passwords, `google-services.json`, AdMob unit IDs, signing keys, release `.aab`/`.apk` builds, Play Console exports (installs, traffic, revenue) or personal email addresses.
- Store-listing copy and ad copy written for this app must not contain other companies' brand or product names (Google Drive, Google Photos, Dropbox, TeraBox, MEGA, OneDrive and so on). Category keywords that many competitors carry in their titles, such as "cloud storage", "cloud drive", "cloud backup" and "backup and restore", are generic and free to use. A proposed title or headline must not repeat another app's exact title, or a near-exact one (same words in the same order once "and", "&", "app" and punctuation are ignored); check with a script and a live Google Play search, and never report a check as passed unless it was run.
- Competitor names are fine in research content.
- Every page carries `<meta name="robots" content="noindex">` to keep the site out of search engines. Keep it on new pages.
