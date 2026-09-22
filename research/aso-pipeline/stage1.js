// Stage 1: fetch the 11 direct competitors and mine their metadata for niche keyword candidates.
const fs = require('fs');
const path = require('path');
const { details, pool } = require('./lib');

const COMPETITORS = [
  ['CloudGate', 'com.cloudgate.cloudstorage'],
  ['Fazcon', 'com.fazconapps.backup.restore.data'],
  ['ANZ Cloud Drive', 'com.filestorage.cloudbackup.clouddrive.photosbackup.storagespace'],
  ['Cloud Backup', 'com.backup.restore.clould.backup.freecloud.storage'],
  ['Cloud Storage & Drive', 'com.cloudstorageapp.cloudbackup.storagespace.databackup'],
  ['Cloud Storage Backup & Drive', 'com.backup.and.restore.all.apps.photo.backup'],
  ['Cloud Storage Drive Backup', 'com.cloudstorage.backupapp.storagespace.mycloud.clouldbackup'],
  ['DataHatch', 'com.datahatch.cloud.storage.drive.data.backup'],
  ['Cloud Storage-Sync', 'com.cloud.storage.extrastorage.gbsfreespace'],
  ['Cloud storage', 'com.cloudstorage.cloudbackup.storagespaceapp'],
  ['Nova Cloud', 'com.securebackup.cloudstorage.drivebackup.filestorage'],
];

(async () => {
  const rows = await pool(COMPETITORS, 4, async ([label, id]) => ({ label, ...(await details(id)) }));
  fs.writeFileSync(path.join(__dirname, 'competitors.json'), JSON.stringify(rows, null, 1));
  for (const r of rows) {
    if (r.error || r.missing) { console.log('!!', r.label, r.error || 'MISSING (404)'); continue; }
    console.log(`\n## ${r.label} | ${r.title} (${r.title.length}c)`);
    console.log(`   ${r.installsLabel} real=${r.realInstalls} score=${r.score?.toFixed?.(2)} ratings=${r.ratings} rel=${r.released} upd=${r.updated} ads=${r.containsAds} iap=${r.iap} dev=${r.developer} genre=${r.genre} desc=${r.description?.length}`);
    console.log(`   short (${r.summary?.length}c): ${r.summary}`);
  }
  // n-gram mining across titles + summaries + descriptions
  const STOP = new Set('the a an and or to of for your you with in on all any is are it this that from by be as at can our we us app apps get just more one easy use using will have has into up out not no its'.split(' '));
  const counts = {};
  for (const r of rows) {
    if (!r.title) continue;
    const seen = new Set();
    const text = [r.title, r.summary, (r.description || '').replace(/<[^>]+>/g, ' ')].join(' . ').toLowerCase().replace(/[^a-z0-9&\s.]/g, ' ');
    for (const sentence of text.split(/[.\n]/)) {
      const w = sentence.split(/\s+/).filter(Boolean);
      for (const n of [2, 3]) for (let i = 0; i + n <= w.length; i++) {
        const gram = w.slice(i, i + n);
        if (STOP.has(gram[0]) || STOP.has(gram[n - 1])) continue;
        const k = gram.join(' ');
        counts[k] = counts[k] || { total: 0, apps: 0 };
        counts[k].total++;
        if (!seen.has(k)) { seen.add(k); counts[k].apps++; }
      }
    }
  }
  const top = Object.entries(counts).filter(([, v]) => v.apps >= 3).sort((a, b) => b[1].apps - a[1].apps || b[1].total - a[1].total).slice(0, 70);
  console.log('\n## n-grams used by >=3 of 11 competitors (apps / total uses)');
  console.log(top.map(([k, v]) => `${k} ${v.apps}/${v.total}`).join(' | '));
  fs.writeFileSync(path.join(__dirname, 'competitor_ngrams.json'), JSON.stringify(Object.fromEntries(top), null, 1));
})();
