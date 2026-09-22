$sp = Split-Path -Parent $MyInvocation.MyCommand.Path
$ua = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36'
$comp = [ordered]@{
  'com.cloudgate.cloudstorage'='CloudGate'
  'com.fazconapps.backup.restore.data'='Fazcon'
  'com.filestorage.cloudbackup.clouddrive.photosbackup.storagespace'='ANZ'
  'com.backup.restore.clould.backup.freecloud.storage'='Mapi'
  'com.cloudstorageapp.cloudbackup.storagespace.databackup'='Fuzon'
  'com.backup.and.restore.all.apps.photo.backup'='DailyUtil'
  'com.cloudstorage.backupapp.storagespace.mycloud.clouldbackup'='MindByte'
  'com.datahatch.cloud.storage.drive.data.backup'='DataHatch'
  'com.cloud.storage.extrastorage.gbsfreespace'='UtilForge'
  'com.cloudstorage.cloudbackup.storagespaceapp'='Golden'
  'com.securebackup.cloudstorage.drivebackup.filestorage'='Nova'
  'com.softwarealliance.cloudvault'='YOU'
}
$kw = @(
 @('head','cloud storage'), @('head','cloud backup'), @('head','cloud drive'), @('head','cloud storage app'),
 @('head','backup and restore'), @('head','cloud storage backup and restore'), @('head','cloud storage drive backup'), @('head','photo backup'),
 @('offer','free cloud storage'), @('offer','cloud storage free'), @('offer','free cloud storage for android'), @('offer','100gb cloud storage'),
 @('offer','100gb free cloud storage'), @('offer','1tb cloud storage'), @('offer','1tb free cloud storage'), @('offer','free storage'),
 @('offer','unlimited cloud storage'), @('offer','unlimited storage'), @('offer','extra storage'), @('offer','cloud space free'),
 @('offer','more storage'), @('offer','free 1000gb cloud storage')
)
$out = @()
foreach ($pair in $kw) {
  $fam = $pair[0]; $q = $pair[1]
  try {
    $h = (Invoke-WebRequest -Uri ("https://play.google.com/store/search?q=" + [uri]::EscapeDataString($q) + "&c=apps&hl=en&gl=US") -UserAgent $ua -UseBasicParsing -TimeoutSec 40 -Headers @{ 'Accept-Language'='en-US,en;q=0.9' }).Content
    $ids = New-Object System.Collections.Generic.List[string]
    foreach ($m in [regex]::Matches($h, '/store/apps/details\?id=([\w.]+)')) { $v = $m.Groups[1].Value; if (-not $ids.Contains($v)) { $ids.Add($v) } }
    $hits = @()
    foreach ($id in $comp.Keys) { $p = $ids.IndexOf($id); if ($p -ge 0) { $hits += "$($comp[$id])#$($p+1)" } }
    $out += [pscustomobject]@{ fam=$fam; q=$q; depth=$ids.Count; hits=($hits -join '; '); top5=(($ids | Select-Object -First 5) -join ' | ') }
  } catch { $out += [pscustomobject]@{ fam=$fam; q=$q; depth=0; hits="ERR $($_.Exception.Message)"; top5='' } }
  Start-Sleep -Milliseconds 900
}
$out | ConvertTo-Json -Depth 3 | Out-File "$sp\ranks.json" -Encoding utf8
$out | Format-Table fam, q, depth, hits -AutoSize -Wrap
"--- top5 on offer keywords ---"
$out | Where-Object { $_.fam -eq 'offer' } | ForEach-Object { "{0,-32} {1}" -f $_.q, $_.top5 }
"--- autocomplete ---"
foreach ($t in @('free cloud','cloud storage f','cloud storage 1','100gb','1tb','free storage','unlimited','cloud storage')) {
  try {
    $inner = '[[null,["' + $t + '"],[10],[2],4]]'
    $freq = '[[["IJ4APc","' + $inner.Replace('"','\"') + '",null,"generic"]]]'
    $r = Invoke-WebRequest -Uri 'https://play.google.com/_/PlayStoreUi/data/batchexecute?rpcids=IJ4APc&hl=en&gl=us&authuser&soc-app=121&soc-platform=1&soc-device=1' -Method Post -Body ('f.req=' + [uri]::EscapeDataString($freq)) -ContentType 'application/x-www-form-urlencoded;charset=UTF-8' -UserAgent $ua -UseBasicParsing -TimeoutSec 40
    $line = ($r.Content -split "`n" | Where-Object { $_ -match '^\[\["wrb\.fr"' } | Select-Object -First 1)
    $data = (($line | ConvertFrom-Json)[0][2]) | ConvertFrom-Json
    $sug = @(); foreach ($x in $data[0][0]) { $sug += $x[0] }
    "{0,-18} => {1}" -f $t, ($sug -join ' | ')
  } catch { "{0,-18} => ERR {1}" -f $t, $_.Exception.Message }
  Start-Sleep -Milliseconds 600
}
