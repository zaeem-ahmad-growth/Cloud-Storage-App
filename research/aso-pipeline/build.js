// Build: inject data + listing copy into the page template, and print listing checks.
const fs = require('fs');
const path = require('path');
const data = require('./data.json');

const LISTING = {
  titles: [
    { text: 'Cloud Storage & Backup Drive', rec: true, why: 'Highest board coverage of 18 scored candidates. Every word of 13 priority keywords sits in 28 characters, including “cloud storage drive backup”, where competitors hold 3–4 top-10 slots on title phrases alone.' },
    { text: 'Backup & Restore Cloud Storage', why: 'Leads with “backup and restore”, the strongest autocomplete demand among niche phrases (88/100), and still carries the head term. Play already matches “&” to “and”: SMS Backup & Restore is #1 on that search.' },
    { text: 'Cloud Drive: 1TB Cloud Storage', why: 'Aims at “1tb cloud storage”, which surfaces after typing just “1tb”. Use it only if a 1TB plan ships. Fazcon’s new ad-free 1TB app is claiming this angle this week.' },
  ],
  taken: [
    { text: 'Cloud Storage - Photo Backup', note: 'the 8 Sep recommended title' },
    { text: 'Cloud Storage Backup & Restore', note: 'the obvious title for the #1 priority keyword' },
  ],
  shorts: [
    { text: 'Secure, private backup for photos, videos & data. Restore to any phone in a tap.', pair: 0 },
    { text: 'Secure cloud drive for photos & videos, with phone backup and a private vault.', pair: 1 },
  ],
  long: `Cloud storage backup and restore for everything on your phone. [App name] moves your photos, videos and files into secure cloud storage, keeps them in sync, and brings them back to any device in one tap. A lost, broken or full phone never has to cost you a memory.

## Why [App name]
Phones fail, get stolen and run out of space. Your backup shouldn't. [App name] gives you a private cloud drive with room to grow from free cloud storage to 2TB, encryption for the files that matter, and a restore that works the first time.

## Made for the moments that matter
• New phone: sign in, tap restore, and your whole gallery is back
• Storage full: move old videos to cloud storage and keep shooting
• Lost or broken phone: every photo is already safe in your backup
• Family memories: share an album with everyone through one link

## Automatic photo & video backup
• Back up photos and videos automatically in the background
• Original quality: no compression, no stripped metadata
• Choose Wi-Fi only or any connection, and pause whenever you like
• Free up space on your phone once your gallery is safely backed up

## Backup and restore in one tap
• Moving to a new phone? Restore photos, videos and files in minutes
• Scheduled phone backup runs quietly, so you set it once and forget it
• Restore exactly what you need: one album, one folder or everything
• Version history brings back a file from before it changed

## Secure cloud storage, private by default
• Files are encrypted in transit and at rest
• Lock the app with a PIN, fingerprint or face unlock
• A private vault keeps your most sensitive photos and documents apart
• No ads, and we never sell your data

## One cloud drive for all your files
• Upload documents, PDFs, music, archives and any other file type
• Organise with folders, search by name and preview without downloading
• Open your files on your phone, tablet or the web
• Keep the files you choose available offline

## Share without shrinking
• Share a file, folder or album with a simple link
• Send long videos at full quality
• Set an expiry date and revoke access at any time

## Plans that grow with you
Start with free cloud storage, then move to 100GB, 1TB or 2TB when you need more room. Every plan includes automatic backup and restore, the private vault and full-quality sharing, and you can cancel from Google Play whenever you want.

## Questions people ask
Is my data private? Yes. Your files are encrypted, the vault has its own lock, and we never sell your data.
Will backup use my mobile data? Only if you allow it. Wi-Fi only is the default setting.
Can I restore to a different phone? Yes. Sign in on the new phone, then restore everything or only what you pick.
What if I stop my plan? Your files stay in your cloud storage to view and download, so nothing is lost when you leave.

Install [App name], turn on backup, and keep your photos, videos and files safe in the cloud.`,
  phrases: ['cloud storage', 'backup and restore', 'secure cloud storage', 'cloud drive', 'back up photos', 'phone backup', 'free cloud storage', 'private vault', 'restore', 'backup'],
  verify: ['Free storage amount and the 100GB / 1TB / 2TB plan sizes', 'Encryption in transit and at rest', 'Version history', 'Offline files', 'Expiring share links', 'No ads in any tier', 'App lock with PIN and biometrics', 'Wi-Fi-only backup as the default', 'Files stay viewable and downloadable after a plan ends'],
};

// ---- title candidates scored against the priority board (mean P across markets) ----
const CANDIDATES = ['Cloud Storage: Backup & Sync', 'Cloud Storage Backup & Restore', 'Backup & Restore Cloud Storage', 'Cloud Drive Backup & Restore',
  'Cloud Storage & Photo Backup', 'Cloud Drive: 1TB Cloud Storage', 'Private Cloud Storage & Backup', 'Secure Cloud Storage & Restore',
  'Cloud Backup: Secure Storage', '1TB Cloud Storage & Backup', 'Cloud Storage: Backup Restore', 'Photo Backup & Cloud Storage',
  'Cloud Storage & Backup Drive', 'Cloud Storage: Drive & Restore', 'Cloud Storage: Backup, Restore', 'Secure Cloud Drive & Restore',
  'Cloud Storage Drive & Restore', 'Cloud Backup & Storage Drive'];
const norm = s => s.toLowerCase().replace(/&/g, ' and ').match(/[a-z0-9]+/g) || [];
const meanP = {};
for (const rows of Object.values(data.markets)) for (const r of rows) (meanP[r.q] = meanP[r.q] || []).push(r.P);
const kwP = Object.entries(meanP).map(([q, a]) => [q, a.reduce((x, y) => x + y, 0) / a.length]);
const takenTitles = new Set(data.apps.map(a => (a[1] || '').toLowerCase()));
const scoreTitle = t => {
  const w = new Set(norm(t)); const phrase = ' ' + norm(t).join(' ') + ' ';
  let s = 0; const hit = [];
  for (const [q, p] of kwP) { const qw = norm(q); if (qw.every(x => w.has(x))) { const exact = phrase.includes(' ' + qw.join(' ') + ' '); s += p * (exact ? 1.25 : 1); hit.push(q); } }
  return { t, len: t.length, score: Math.round(s), taken: takenTitles.has(t.toLowerCase()), hits: hit.length };
};
console.log('title candidates:\n' + CANDIDATES.map(scoreTitle).sort((a, b) => b.score - a.score).map(c => `  ${String(c.score).padStart(4)} ${c.len}c ${c.taken ? 'TAKEN ' : ''}${c.t} (${c.hits} kw)`).join('\n'));
const takenApp = data.apps.find(a => (a[1] || '').toLowerCase() === 'cloud storage backup & restore');
console.log('taken app:', JSON.stringify(takenApp));

// ---- checks ----
const plain = LISTING.long.replace(/^## /gm, '');
const words = plain.toLowerCase().match(/[a-z0-9']+/g).length;
console.log('titles:', LISTING.titles.map(t => `${t.text} = ${t.text.length}`).join(' | '));
console.log('shorts:', LISTING.shorts.map(t => `${t.text.length}: ${t.text}`).join(' | '));
console.log('long chars', plain.length, 'words', words);
for (const p of LISTING.phrases) { const n = (plain.match(new RegExp('\\b' + p + '\\b', 'gi')) || []).length; console.log(`  ${p}: ${n} (${(100 * n * p.split(' ').length / words).toFixed(1)}%)`); }
const titles = new Set(data.apps.map(a => (a[1] || '').toLowerCase()));
LISTING.titles.forEach(t => console.log('title taken?', t.text, titles.has(t.text.toLowerCase())));
LISTING.taken.forEach(t => console.log('taken check', t.text, titles.has(t.text.toLowerCase())));
LISTING.shorts.forEach(s => { const t = LISTING.titles[s.pair].text; const sc = scoreTitle(t + ' ' + s.text); console.log(`pair ${s.pair}: title+short covers ${sc.hits} keywords (score ${sc.score})`); });
// Does "&" in a title match "and" queries? Look at the US "cloud storage backup and restore" and "backup and restore" top-10 titles.
for (const q of ['cloud storage backup and restore', 'backup and restore', 'cloud backup and restore']) {
  const row = data.markets.US.find(r => r.q === q);
  console.log(q, '→', row.ids.slice(0, 12).map((i, n) => `#${n + 1} ${data.apps[i] ? data.apps[i][1] : '?'}`).join(' | '));
}

const tpl = fs.readFileSync(path.join(__dirname, 'page.html'), 'utf8');
const graphics = require('./graphics.json');
const mymeta = require('./mymeta_payload.json');
delete mymeta.recheck; // own-app ranks are deliberately excluded from the page
mymeta.titleTerms = require('./titleterms.json').map(({ top3, ...t }) => t);

// Next-release metadata: the live listing with the fixes the team applied.
const RELEASE_EDITS = [
  { field: 'Full description', label: 'Template placeholder replaced with the app name', before: 'download [App name]', after: 'download Cloud Storage: Secure Vault', ref: 'Validation: no template placeholders' },
  { field: 'Full description', label: '“No ads” wording removed', before: 'No ads. We don’t sell your data.', after: 'We don’t sell your data.', ref: 'Google Play metadata policy: claims must match the listing (app contains ads)' },
  { field: 'Full description', label: 'Account wording aligned with sign-up', before: 'No account creation, no trial period, no credit card, no countdown timer.', after: 'Get limited features without account creation, no trial period, no credit card, no countdown timer.', ref: 'Validation: account claims agree with each other' },
];
let releaseLong = mymeta.description;
for (const e of RELEASE_EDITS) {
  if (!releaseLong.includes(e.before)) throw new Error('Release edit not found in live description: ' + e.before);
  releaseLong = releaseLong.replace(e.before, e.after);
}
const RELEASE_SHORT = 'Secure, private backup for photos, videos & data. Restore to any phone in a tap.';
mymeta.release = {
  title: mymeta.title, summary: RELEASE_SHORT, description: releaseLong,
  edits: [{ field: 'Short description', label: 'Short description rewritten around backup and restore', before: mymeta.summary, after: RELEASE_SHORT, ref: 'Proposed ASO package: recommended short description (80/80)' }].concat(RELEASE_EDITS),
  titleDecision: 'Title kept: “Cloud Storage: Secure Vault” pairs the generic head term with a low-competition keyword.',
};
console.log('release short', RELEASE_SHORT.length, '| long', releaseLong.length, '| [App name] left:', /\[app name\]/i.test(releaseLong), '| "No ads" left:', /no ads/i.test(releaseLong));
const features = require('./features.json');
const pricing = require('./pricing.json');
const payload = JSON.stringify({ data, listing: LISTING, graphics, mymeta, features, pricing }).replace(/</g, '\\u003c');
const html = tpl.replace('/*__PAYLOAD__*/null', payload);
const out = path.join(__dirname, '..', 'cloud-storage-aso-playbook-live.html');
fs.writeFileSync(out, html);
console.log('wrote', out, fs.statSync(out).size, 'bytes');
