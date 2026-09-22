$ErrorActionPreference = 'Stop'
$sp = Split-Path -Parent $MyInvocation.MyCommand.Path
$apps = [ordered]@{
  'CloudGate'      = 'com.cloudgate.cloudstorage'
  'Fazcon'         = 'com.fazconapps.backup.restore.data'
  'ANZ'            = 'com.filestorage.cloudbackup.clouddrive.photosbackup.storagespace'
  'Mapi CloudBackup' = 'com.backup.restore.clould.backup.freecloud.storage'
  'Fuzon'          = 'com.cloudstorageapp.cloudbackup.storagespace.databackup'
  'Daily Utility'  = 'com.backup.and.restore.all.apps.photo.backup'
  'MindByte'       = 'com.cloudstorage.backupapp.storagespace.mycloud.clouldbackup'
  'DataHatch'      = 'com.datahatch.cloud.storage.drive.data.backup'
  'Utility Forge'  = 'com.cloud.storage.extrastorage.gbsfreespace'
  'Golden'         = 'com.cloudstorage.cloudbackup.storagespaceapp'
  'Nova'           = 'com.securebackup.cloudstorage.drivebackup.filestorage'
  'YOU CloudVault' = 'com.softwarealliance.cloudvault'
}
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
$out = @()
foreach ($k in $apps.Keys) {
  $id = $apps[$k]
  try {
    $r = Invoke-WebRequest -Uri "https://play.google.com/store/apps/details?id=$id&hl=en&gl=US" -UserAgent $ua -UseBasicParsing -TimeoutSec 40
    $h = $r.Content
    [IO.File]::WriteAllText("$sp\live-$id.html", $h, (New-Object Text.UTF8Encoding $false))
    $inst = $null; $label = $null
    $m = [regex]::Match($h, '\["([\d,]+\+)",(\d+),(\d+),"([^"]+)"\]')
    if ($m.Success) { $label = $m.Groups[1].Value; $inst = [int64]$m.Groups[3].Value }
    $title = [regex]::Match($h, '<title[^>]*>([^<]+)</title>').Groups[1].Value -replace ' - Apps on Google Play',''
    $rt = [regex]::Match($h, '"ratingValue":"([\d.]+)"').Groups[1].Value
    $rc = [regex]::Match($h, '"ratingCount":"(\d+)"').Groups[1].Value
    $hasVideo = $h -match 'youtube\.com/embed'
    $out += [pscustomobject]@{ label=$k; id=$id; title=[Net.WebUtility]::HtmlDecode($title); bracket=$label; installs=$inst; rating=$rt; ratings=$rc; video=$hasVideo }
  } catch {
    $out += [pscustomobject]@{ label=$k; id=$id; title="ERR $($_.Exception.Message)"; bracket=$null; installs=$null; rating=$null; ratings=$null; video=$null }
  }
  Start-Sleep -Milliseconds 600
}
$out | ConvertTo-Json -Depth 3 | Out-File "$sp\live.json" -Encoding utf8
$out | Format-Table label, title, bracket, installs, rating, ratings, video -AutoSize -Wrap
