$sp = Split-Path -Parent $MyInvocation.MyCommand.Path
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36'
$apps = [ordered]@{
  'CloudGate'      = 'com.cloudgate.cloudstorage'
  'Fazcon'         = 'com.fazconapps.backup.restore.data'
  'ANZ'            = 'com.filestorage.cloudbackup.clouddrive.photosbackup.storagespace'
  'Mapi'           = 'com.backup.restore.clould.backup.freecloud.storage'
  'Fuzon'          = 'com.cloudstorageapp.cloudbackup.storagespace.databackup'
  'DailyUtility'   = 'com.backup.and.restore.all.apps.photo.backup'
  'MindByte'       = 'com.cloudstorage.backupapp.storagespace.mycloud.clouldbackup'
  'DataHatch'      = 'com.datahatch.cloud.storage.drive.data.backup'
  'UtilityForge'   = 'com.cloud.storage.extrastorage.gbsfreespace'
  'Golden'         = 'com.cloudstorage.cloudbackup.storagespaceapp'
  'Nova'           = 'com.securebackup.cloudstorage.drivebackup.filestorage'
}
function Get-Page($appId, $token) {
  if ($token) { $inner = '[null,[2,2,[150,null,"' + $token + '"],null,[null,null,null,null,null,null,null,null,2]],["' + $appId + '",7]]' }
  else { $inner = '[null,[2,2,[150],null,[null,null,null,null,null,null,null,null,2]],["' + $appId + '",7]]' }
  $innerEsc = $inner.Replace('\','\\').Replace('"','\"')
  $freq = '[[["oCPfdb","' + $innerEsc + '",null,"generic"]]]'
  $body = 'f.req=' + [uri]::EscapeDataString($freq)
  $r = Invoke-WebRequest -Uri 'https://play.google.com/_/PlayStoreUi/data/batchexecute?hl=en&gl=US' -Method Post -Body $body -ContentType 'application/x-www-form-urlencoded;charset=UTF-8' -UserAgent $ua -UseBasicParsing -TimeoutSec 60
  $t = $r.Content
  $line = ($t -split "`n" | Where-Object { $_ -match '^\[\["wrb\.fr"' } | Select-Object -First 1)
  if (-not $line) { return $null }
  $outer = $line | ConvertFrom-Json
  $payload = $outer[0][2]
  if (-not $payload) { return $null }
  return ($payload | ConvertFrom-Json)
}
$all = @()
foreach ($k in $apps.Keys) {
  $id = $apps[$k]; $token = $null; $n = 0
  for ($p = 0; $p -lt 4; $p++) {
    try { $d = Get-Page $id $token } catch { "ERR $k page $p : $($_.Exception.Message)"; break }
    if (-not $d -or -not $d[0]) { break }
    foreach ($rv in $d[0]) {
      $rep = ""; if ($rv[7]) { $rep = [string]$rv[7][1] }; $tsv = 0; if ($rv[5]) { $tsv = [int64]$rv[5][0] }; $all += [pscustomobject]@{ app=$k; score=[int]$rv[2]; text=[string]$rv[4]; ts=$tsv; up=[int]$rv[6]; reply=$rep; ver=[string]$rv[10] }
      $n++
    }
    $token = $null
    try { $token = $d[1][1] } catch {}
    if (-not $token) { break }
    Start-Sleep -Milliseconds 700
  }
  "{0,-14} reviews fetched: {1}" -f $k, $n
}
$all | ConvertTo-Json -Depth 3 | Out-File "$sp\reviews.json" -Encoding utf8
"TOTAL: $($all.Count)"
