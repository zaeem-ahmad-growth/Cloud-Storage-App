# Research: scripts and data in full

> **Generated file: do not edit by hand.** Produced by `node tools/export-docs.js` (GitHub runs it after every push).
> The full source of every script in [research/](../../research/), then every small data file (up to 60 KB) in full. Large data files are listed with their structure in the [research index](../research-index.md) and are best searched in place. The overview of the studies is [research/README.md](../../research/README.md). **Load this file when a question or change concerns how the data was collected or scored.**

## Contents

- [research/free-gb-offer-analysis/atc.ps1](#researchfree-gb-offer-analysisatcps1)
- [research/free-gb-offer-analysis/atc2.ps1](#researchfree-gb-offer-analysisatc2ps1)
- [research/free-gb-offer-analysis/atc3.ps1](#researchfree-gb-offer-analysisatc3ps1)
- [research/free-gb-offer-analysis/atc4.ps1](#researchfree-gb-offer-analysisatc4ps1)
- [research/free-gb-offer-analysis/live.ps1](#researchfree-gb-offer-analysisliveps1)
- [research/free-gb-offer-analysis/ranks.ps1](#researchfree-gb-offer-analysisranksps1)
- [research/free-gb-offer-analysis/reviews.ps1](#researchfree-gb-offer-analysisreviewsps1)
- [research/free-gb-offer-analysis/revstats.ps1](#researchfree-gb-offer-analysisrevstatsps1)
- [research/google-ads-assets/brandcheck.ps1](#researchgoogle-ads-assetsbrandcheckps1)
- [research/google-ads-assets/export/build-docx.ps1](#researchgoogle-ads-assetsexportbuild-docxps1)
- [research/google-ads-assets/generic.ps1](#researchgoogle-ads-assetsgenericps1)
- [research/google-ads-assets/headcheck.ps1](#researchgoogle-ads-assetsheadcheckps1)
- [research/google-ads-assets/resolve.ps1](#researchgoogle-ads-assetsresolveps1)
- [research/google-ads-assets/serps.ps1](#researchgoogle-ads-assetsserpsps1)
- [research/google-ads-assets/summary.ps1](#researchgoogle-ads-assetssummaryps1)
- [research/free-gb-offer-analysis/appbrain.json](#researchfree-gb-offer-analysisappbrainjson)
- [research/free-gb-offer-analysis/atc-creatives-Mapidirections-1.json](#researchfree-gb-offer-analysisatc-creatives-mapidirections-1json)
- [research/free-gb-offer-analysis/atc-creatives-MindByte-2.json](#researchfree-gb-offer-analysisatc-creatives-mindbyte-2json)
- [research/free-gb-offer-analysis/atc-creatives-MindByte2-0.json](#researchfree-gb-offer-analysisatc-creatives-mindbyte2-0json)
- [research/free-gb-offer-analysis/atc-suggest.json](#researchfree-gb-offer-analysisatc-suggestjson)
- [research/free-gb-offer-analysis/live.json](#researchfree-gb-offer-analysislivejson)
- [research/free-gb-offer-analysis/ranks.json](#researchfree-gb-offer-analysisranksjson)
- [research/free-gb-offer-analysis/revstats.json](#researchfree-gb-offer-analysisrevstatsjson)
- [research/free-gb-offer-analysis/rv-B.txt](#researchfree-gb-offer-analysisrv-btxt)
- [research/free-gb-offer-analysis/rv-test.txt](#researchfree-gb-offer-analysisrv-testtxt)
- [research/free-gb-offer-analysis/sensortower.json](#researchfree-gb-offer-analysissensortowerjson)
- [research/google-ads-assets/assets.txt](#researchgoogle-ads-assetsassetstxt)
- [research/google-ads-assets/brandcheck.json](#researchgoogle-ads-assetsbrandcheckjson)
- [research/google-ads-assets/candidates.txt](#researchgoogle-ads-assetscandidatestxt)
- [research/google-ads-assets/export/content.json](#researchgoogle-ads-assetsexportcontentjson)
- [research/google-ads-assets/final_headlines.txt](#researchgoogle-ads-assetsfinal_headlinestxt)
- [research/google-ads-assets/keywords.txt](#researchgoogle-ads-assetskeywordstxt)
- [research/google-ads-assets/serps_live.json](#researchgoogle-ads-assetsserps_livejson)

## Scripts

### research/free-gb-offer-analysis/atc.ps1

```powershell
$sp = Split-Path -Parent $MyInvocation.MyCommand.Path
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
$terms = @('Fazcon','Utility Forge','MindByte','Fuzon','CloudGate','Daily Utility Apps','MAPIDIRECTIONS','Appseen','Auzi Apps','Golden Associate','Nova Apps Studios')
$all = @()
foreach ($t in $terms) {
  $req = '{"1":"' + $t + '","2":10,"3":10}'
  $body = 'f.req=' + [uri]::EscapeDataString($req)
  try {
    $r = Invoke-WebRequest -Uri 'https://adstransparency.google.com/anji/_/rpc/SearchService/SearchSuggestions?authuser=0' -Method Post -Body $body -ContentType 'application/x-www-form-urlencoded' -UserAgent $ua -UseBasicParsing -TimeoutSec 40
    $all += [pscustomobject]@{ term=$t; raw=$r.Content }
    "=== $t ==="
    $r.Content.Substring(0, [Math]::Min(1500, $r.Content.Length))
  } catch {
    "=== $t === ERR $($_.Exception.Message)"
  }
  Start-Sleep -Milliseconds 800
}
$all | ConvertTo-Json -Depth 3 | Out-File "$sp\atc-suggest.json" -Encoding utf8
```

### research/free-gb-offer-analysis/atc2.ps1

```powershell
$sp = Split-Path -Parent $MyInvocation.MyCommand.Path
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
function Post($path, $req) {
  $body = 'f.req=' + [uri]::EscapeDataString($req)
  (Invoke-WebRequest -Uri "https://adstransparency.google.com/anji/_/rpc/$path`?authuser=0" -Method Post -Body $body -ContentType 'application/x-www-form-urlencoded' -UserAgent $ua -UseBasicParsing -TimeoutSec 40).Content
}
$terms = @('fazconapps.com','Fazcon Apps','cloudgate-app.com','CloudGate Technologies','dailyutilityapps.store','Daily Utility','Cybertech','Fuzon Apps','Appseen Studio','Utility Forge Apps','Auzi','Nova Apps','Golden Associate Pvt','Cell Cave')
foreach ($t in $terms) {
  try { $c = Post 'SearchService/SearchSuggestions' ('{"1":"' + $t + '","2":10,"3":10}'); "=== $t ==="; $c.Substring(0,[Math]::Min(900,$c.Length)) } catch { "=== $t === ERR $($_.Exception.Message)" }
  Start-Sleep -Milliseconds 700
}
```

### research/free-gb-offer-analysis/atc3.ps1

```powershell
$sp = Split-Path -Parent $MyInvocation.MyCommand.Path
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
function Post($path, $req) {
  $body = 'f.req=' + [uri]::EscapeDataString($req)
  (Invoke-WebRequest -Uri "https://adstransparency.google.com/anji/_/rpc/$path`?authuser=0" -Method Post -Body $body -ContentType 'application/x-www-form-urlencoded' -UserAgent $ua -UseBasicParsing -TimeoutSec 60).Content
}
$advs = [ordered]@{ 'MindByte' = 'AR02261580089873399809'; 'MindByte2' = 'AR07944279940873060353'; 'Mapidirections' = 'AR12707166228507000833' }
foreach ($k in $advs.Keys) {
  $id = $advs[$k]
  $token = $null; $page = 0; $rows = @()
  do {
    if ($token) { $req = '{"2":100,"3":{"12":{"1":"","2":true},"13":{"1":["' + $id + '"]}},"4":"' + $token + '","7":{"1":1,"2":0,"3":2840}}' }
    else { $req = '{"2":100,"3":{"12":{"1":"","2":true},"13":{"1":["' + $id + '"]}},"7":{"1":1,"2":0,"3":2840}}' }
    try { $c = Post 'SearchService/SearchCreatives' $req } catch { "ERR $k $($_.Exception.Message)"; break }
    [IO.File]::WriteAllText("$sp\atc-creatives-$k-$page.json", $c, (New-Object Text.UTF8Encoding $false))
    $j = $c | ConvertFrom-Json
    $items = @($j.'1')
    $rows += $items
    $token = $j.'2'
    $page++
    Start-Sleep -Milliseconds 800
  } while ($token -and $page -lt 6)
  "=== $k ($id): creatives fetched = $($rows.Count); total reported = $($j.'4') / $($j.'5') ==="
  if ($rows.Count -gt 0) { ($rows[0] | ConvertTo-Json -Depth 8 -Compress).Substring(0, [Math]::Min(1400, ($rows[0] | ConvertTo-Json -Depth 8 -Compress).Length)) }
}
```

### research/free-gb-offer-analysis/atc4.ps1

```powershell
$sp = Split-Path -Parent $MyInvocation.MyCommand.Path
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36'
$now = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$res = @()
foreach ($k in 'MindByte','Mapidirections') {
  $rows = @(); Get-ChildItem "$sp\atc-creatives-$k-*.json" | ForEach-Object { $rows += @((Get-Content $_.FullName -Raw | ConvertFrom-Json).'1') }
  $rows = @($rows | Where-Object { [int64]$_.'7'.'1' -gt ($now - 30*86400) })
  foreach ($r in $rows) {
    $u = $r.'3'.'1'.'4'
    if (-not $u) { $u = $r.'3'.'3'.'2' }
    $pkg = $null; $yt = $null; $txt = $null
    try {
      $c = (Invoke-WebRequest -Uri $u -UserAgent $ua -UseBasicParsing -TimeoutSec 40).Content
      $c2 = $c -replace '\\x3d','=' -replace '\\x26','&' -replace '\\x22','"' -replace '\\x3c','<' -replace '\\x3e','>' -replace '\\x27',"'"
      $pkg = ([regex]::Matches($c2, '(?:id=|id%3D)([a-zA-Z][\w]*(?:\.[\w]+){1,9})') | ForEach-Object { $_.Groups[1].Value } | Where-Object { $_ -notmatch '^this\.' } | Select-Object -Unique -First 1)
      $yt = [regex]::Match($c2, 'ytimg\.com/vi/([\w-]{11})').Groups[1].Value
      $snips = [regex]::Matches($c2, '>([^<>{}\\]{6,120})<') | ForEach-Object { $_.Groups[1].Value.Trim() } | Where-Object { $_ -match '[A-Za-z]{3}' -and $_ -notmatch 'function|var |return|window' } | Select-Object -Unique -First 8
      $txt = $snips -join ' || '
    } catch { $txt = "ERR $($_.Exception.Message)" }
    $res += [pscustomobject]@{ adv=$k; cr=$r.'2'; first=[int64]$r.'6'.'1'; last=[int64]$r.'7'.'1'; days=$r.'13'; pkg=$pkg; yt=$yt; txt=$txt }
    Start-Sleep -Milliseconds 250
  }
}
$res | ConvertTo-Json -Depth 3 | Out-File "$sp\atc-scan.json" -Encoding utf8
"scanned: $($res.Count)"
$res | Group-Object adv, pkg | Sort-Object Count -Descending | Select-Object Count, Name | Format-Table -AutoSize -Wrap
```

### research/free-gb-offer-analysis/live.ps1

```powershell
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
```

### research/free-gb-offer-analysis/ranks.ps1

```powershell
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
```

### research/free-gb-offer-analysis/reviews.ps1

```powershell
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
```

### research/free-gb-offer-analysis/revstats.ps1

```powershell
$sp = Split-Path -Parent $MyInvocation.MyCommand.Path
$rv = Get-Content "$sp\reviews.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$offer   = '(?i)\bfree\b|\d+\s?(gb|tb)\b|\bgb\b|\btb\b|gigabyte|terabyte|unlimited|extra (storage|space)|more (storage|space)'
$paywall = '(?i)\bpay\b|\bpaid\b|paying|payment|subscri|premium|purchase|\bmoney\b|charg|\bprice|\bbuy\b|refund|\bcost|\$\d'
$bait    = '(?i)fake|scam|\blie[sd]?\b|liar|mislead|fraud|cheat|not free|isn.?t free|no free|nothing (is )?free|false|trick|bait|clickbait|decei'
$ads     = '(?i)\bads?\b|advert|commercial'
$func    = '(?i)upload|restore|backup|back up|download|sync|login|log in|sign in|crash|slow|stuck|not work|doesn.?t work|error|lost|delete'
function Pct($n, $d) { if ($d -eq 0) { return 0 } else { return [math]::Round(100.0 * $n / $d, 1) } }
$rows = @()
$groups = @($rv | Group-Object app) + @([pscustomobject]@{ Name='ALL'; Group=$rv })
foreach ($g in $groups) {
  $r = @($g.Group); $n = $r.Count
  $withText = @($r | Where-Object { $_.text.Length -ge 15 })
  $o = @($r | Where-Object { $_.text -match $offer })
  $oPos = @($o | Where-Object { $_.score -ge 4 }); $oNeg = @($o | Where-Object { $_.score -le 2 })
  $p = @($r | Where-Object { $_.text -match $paywall })
  $b = @($r | Where-Object { $_.text -match $bait })
  $a = @($r | Where-Object { $_.text -match $ads })
  $low = @($r | Where-Object { $_.score -le 2 })
  $lowOfferPay = @($low | Where-Object { $_.text -match $offer -or $_.text -match $paywall -or $_.text -match $bait })
  $rows += [pscustomobject]@{
    app=$g.Name; n=$n; substantive=$withText.Count
    avg=[math]::Round((($r | Measure-Object score -Average).Average),2)
    low12=(Pct $low.Count $n)
    offer=(Pct $o.Count $n); offerOfSubst=(Pct (@($withText | Where-Object { $_.text -match $offer }).Count) $withText.Count)
    offerPos=$oPos.Count; offerNeg=$oNeg.Count
    paywall=(Pct $p.Count $n); bait=(Pct $b.Count $n); ads=(Pct $a.Count $n)
    lowDueOfferPay=(Pct $lowOfferPay.Count $low.Count)
  }
}
$rows | Format-Table -AutoSize
$rows | ConvertTo-Json | Out-File "$sp\revstats.json" -Encoding utf8
"--- date span per app ---"
$rv | Group-Object app | ForEach-Object { $mn = ($_.Group | Where-Object { $_.ts -gt 0 } | Measure-Object ts -Minimum -Maximum); "{0,-14} {1:yyyy-MM-dd} .. {2:yyyy-MM-dd}" -f $_.Name, [DateTimeOffset]::FromUnixTimeSeconds($mn.Minimum).DateTime, [DateTimeOffset]::FromUnixTimeSeconds($mn.Maximum).DateTime }
"--- sample OFFER-POSITIVE (score>=4) ---"
$rv | Where-Object { $_.text -match $offer -and $_.score -ge 4 -and $_.text.Length -gt 25 } | Sort-Object up -Descending | Select-Object -First 14 | ForEach-Object { "[{0}|{1}*|up{2}] {3}" -f $_.app, $_.score, $_.up, $_.text.Substring(0,[math]::Min(230,$_.text.Length)) }
"--- sample OFFER-NEGATIVE (score<=2) ---"
$rv | Where-Object { ($_.text -match $offer -or $_.text -match $bait) -and $_.score -le 2 -and $_.text.Length -gt 25 } | Sort-Object up -Descending | Select-Object -First 22 | ForEach-Object { "[{0}|{1}*|up{2}] {3}" -f $_.app, $_.score, $_.up, $_.text.Substring(0,[math]::Min(260,$_.text.Length)) }
```

### research/google-ads-assets/brandcheck.ps1

```powershell
$ErrorActionPreference = 'Stop'
$sp = "C:\Users\HP\AppData\Local\Temp\claude\C--Users-HP\989e82b5-54b9-4cbd-8e7d-b6b07fc76f06\scratchpad"
$old = "C:\Users\HP\AppData\Local\Temp\claude\C--Users-HP\148ec70d-5bcf-4059-9a87-dec996069a0b\scratchpad\aso\data.json"
$UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
$enc = New-Object Text.UTF8Encoding($false)
$d = Get-Content $old -Raw -Encoding UTF8 | ConvertFrom-Json
$terms = [ordered]@{ 'drive' = '\bdrive\b'; 'cloud drive' = '\bcloud drive\b'; 'vault' = '\bvault\b'; 'photos' = '\bphotos\b'; 'gallery' = '\bgallery\b' }
$ownerDev = 'Google LLC|Microsoft Corporation|Samsung Electronics|Apple'
$ownerTitle = 'google|onedrive|microsoft|samsung|icloud|dropbox'
$result = @()
foreach ($t in $terms.Keys) {
  $hits = $d.apps | Where-Object { $_[1] -match $terms[$t] -and $_[2] -notmatch $ownerDev -and $_[1] -notmatch $ownerTitle } | Sort-Object { [int64]$_[3] } -Descending
  $top = $hits | Select-Object -First 8
  foreach ($a in $top) {
    $id = $a[0]; $f = "$sp\det\$id.html"
    if (-not (Test-Path $f)) {
      try {
        $r = Invoke-WebRequest -Uri ("https://play.google.com/store/apps/details?id=" + $id + "&hl=en&gl=US") -UseBasicParsing -UserAgent $UA -Headers @{ 'Accept-Language' = 'en-US,en;q=0.9' }
        [IO.File]::WriteAllText($f, $r.Content, $enc)
      } catch { }
      Start-Sleep -Milliseconds 400
    }
    $live = $false; $lt = ''; $li = 0; $rel = $a[6]
    if (Test-Path $f) {
      $h = [IO.File]::ReadAllText($f)
      $lt = [System.Net.WebUtility]::HtmlDecode([regex]::Match($h, '<meta property="og:title" content="([^"]*?)( - Apps on Google Play)?"').Groups[1].Value)
      $m = [regex]::Match($h, '\["([\d,]+\+)",(\d+),(\d+),"[^"]*"\]')
      if ($m.Success) { $li = [int64]$m.Groups[3].Value }
      $r2 = [regex]::Match($h, '\["([A-Z][a-z]{2} \d{1,2}, \d{4})",\[\d{9,10}').Groups[1].Value
      if ($r2) { $rel = $r2 }
      $live = ($lt -match $terms[$t])
    }
    $result += [pscustomobject]@{ term = $t; totalThirdParty = @($hits).Count; id = $id; boardTitle = $a[1]; liveTitle = $lt; stillInTitle = $live; dev = $a[2]; installs = $li; released = $rel }
  }
}
$result | ConvertTo-Json -Depth 3 | Out-File "$sp\brandcheck.json" -Encoding utf8
$result | Group-Object term | ForEach-Object {
  $g = $_.Group | Where-Object stillInTitle
  $m1 = @($g | Where-Object { $_.installs -ge 1000000 }).Count
  "=== {0}: {1} third-party titles on board; live-verified top {2}; {3} at 1M+" -f $_.Name, $_.Group[0].totalThirdParty, @($g).Count, $m1
  $_.Group | ForEach-Object { "   {0} | {1} | {2:N0} | {3} | live={4}" -f $_.liveTitle, $_.dev, $_.installs, $_.released, $_.stillInTitle }
}
```

### research/google-ads-assets/export/build-docx.ps1

```powershell
param([string]$OutDocx, [string]$OutPdf)
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$blocks = Get-Content "$here\content.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
$R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'

function Esc([string]$s) { return [System.Security.SecurityElement]::Escape($s) }

# "**bold**" markup -> runs
function Runs([string]$text, [string]$extraRpr = '', [bool]$allBold = $false) {
  $parts = $text -split '\*\*'
  $sb = New-Object Text.StringBuilder
  for ($i = 0; $i -lt $parts.Count; $i++) {
    if ($parts[$i] -eq '') { continue }
    $bold = $allBold -or (($i % 2) -eq 1)
    $rpr = $(if ($bold) { '<w:b/>' } else { '' }) + $extraRpr
    [void]$sb.Append('<w:r>')
    if ($rpr) { [void]$sb.Append("<w:rPr>$rpr</w:rPr>") }
    [void]$sb.Append('<w:t xml:space="preserve">' + (Esc $parts[$i]) + '</w:t></w:r>')
  }
  return $sb.ToString()
}
function Para([string]$style, [string]$text, [string]$extraPpr = '') {
  return "<w:p><w:pPr><w:pStyle w:val=`"$style`"/>$extraPpr</w:pPr>" + (Runs $text) + '</w:p>'
}
function Table($b) {
  $widths = @($b.widths); $total = ($widths | Measure-Object -Sum).Sum
  $border = { param($n) "<w:$n w:val=`"single`" w:sz=`"4`" w:space=`"0`" w:color=`"CBD2DC`"/>" }
  $sb = New-Object Text.StringBuilder
  [void]$sb.Append("<w:tbl><w:tblPr><w:tblW w:w=`"$total`" w:type=`"dxa`"/><w:tblBorders>")
  foreach ($n in 'top', 'left', 'bottom', 'right', 'insideH', 'insideV') { [void]$sb.Append((& $border $n)) }
  [void]$sb.Append('</w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="60" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>')
  foreach ($w0 in $widths) { [void]$sb.Append("<w:gridCol w:w=`"$w0`"/>") }
  [void]$sb.Append('</w:tblGrid>')
  # header row
  [void]$sb.Append('<w:tr><w:trPr><w:cantSplit/><w:tblHeader/></w:trPr>')
  for ($c = 0; $c -lt $widths.Count; $c++) {
    [void]$sb.Append("<w:tc><w:tcPr><w:tcW w:w=`"$($widths[$c])`" w:type=`"dxa`"/><w:shd w:val=`"clear`" w:color=`"auto`" w:fill=`"1F3A5F`"/><w:vAlign w:val=`"center`"/></w:tcPr>")
    [void]$sb.Append((Para 'TableHead' ([string]$b.header[$c])))
    [void]$sb.Append('</w:tc>')
  }
  [void]$sb.Append('</w:tr>')
  $ri = 0
  foreach ($row in $b.rows) {
    $fill = $(if (($ri % 2) -eq 1) { 'F4F6F9' } else { 'FFFFFF' }); $ri++
    [void]$sb.Append('<w:tr><w:trPr><w:cantSplit/></w:trPr>')
    for ($c = 0; $c -lt $widths.Count; $c++) {
      [void]$sb.Append("<w:tc><w:tcPr><w:tcW w:w=`"$($widths[$c])`" w:type=`"dxa`"/><w:shd w:val=`"clear`" w:color=`"auto`" w:fill=`"$fill`"/></w:tcPr>")
      [void]$sb.Append((Para 'TableText' ([string]$row[$c])))
      [void]$sb.Append('</w:tc>')
    }
    [void]$sb.Append('</w:tr>')
  }
  [void]$sb.Append('</w:tbl>')
  [void]$sb.Append('<w:p><w:pPr><w:pStyle w:val="TableGap"/></w:pPr></w:p>')
  return $sb.ToString()
}

$body = New-Object Text.StringBuilder
foreach ($b in $blocks) {
  switch ($b.type) {
    'title'    { [void]$body.Append((Para 'Title' $b.text)) }
    'subtitle' { [void]$body.Append((Para 'Subtitle' $b.text)) }
    'meta'     { [void]$body.Append((Para 'Meta' $b.text)) }
    'h1'       { [void]$body.Append((Para 'Heading1' $b.text)) }
    'h1break'  { [void]$body.Append((Para 'Heading1' $b.text '<w:pageBreakBefore/>')) }
    'h2'       { [void]$body.Append((Para 'Heading2' $b.text)) }
    'p'        { [void]$body.Append((Para 'Normal' $b.text)) }
    'note'     { [void]$body.Append((Para 'Note' $b.text)) }
    'bullets'  { foreach ($it in $b.items) { [void]$body.Append((Para 'ListBullet' ([string]$it) '<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>')) } }
    'table'    { [void]$body.Append((Table $b)) }
  }
}
$sect = '<w:sectPr><w:footerReference w:type="default" r:id="rId3"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr>'
$document = "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><w:document xmlns:w=`"$W`" xmlns:r=`"$R`"><w:body>" + $body.ToString() + $sect + '</w:body></w:document>'

$font = 'Calibri'
$styles = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="$W">
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="$font" w:hAnsi="$font" w:cs="$font" w:eastAsia="$font"/><w:color w:val="1D2433"/><w:sz w:val="21"/><w:szCs w:val="21"/><w:lang w:val="en-US"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:before="0" w:after="60" w:line="240" w:lineRule="auto"/></w:pPr><w:rPr><w:b/><w:color w:val="1F3A5F"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="80"/></w:pPr><w:rPr><w:color w:val="2F5FA8"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Meta"><w:name w:val="Meta"/><w:basedOn w:val="Normal"/><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="8" w:space="8" w:color="1F3A5F"/></w:pBdr><w:spacing w:after="200"/></w:pPr><w:rPr><w:color w:val="5B6577"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:keepLines/><w:spacing w:before="320" w:after="120"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:color w:val="1F3A5F"/><w:sz w:val="30"/><w:szCs w:val="30"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:keepLines/><w:spacing w:before="200" w:after="100"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:color w:val="2F5FA8"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="ListBullet"><w:name w:val="List Bullet"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="90"/></w:pPr></w:style>
<w:style w:type="paragraph" w:styleId="TableText"><w:name w:val="Table Text"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="0" w:line="252" w:lineRule="auto"/></w:pPr><w:rPr><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="TableHead"><w:name w:val="Table Head"/><w:basedOn w:val="TableText"/><w:pPr><w:keepNext/></w:pPr><w:rPr><w:b/><w:color w:val="FFFFFF"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="TableGap"><w:name w:val="Table Gap"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="60" w:line="120" w:lineRule="exact"/></w:pPr><w:rPr><w:sz w:val="8"/><w:szCs w:val="8"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Note"><w:name w:val="Note"/><w:basedOn w:val="Normal"/><w:rPr><w:i/><w:color w:val="5B6577"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Footer"><w:name w:val="footer"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="0"/><w:jc w:val="center"/></w:pPr><w:rPr><w:color w:val="5B6577"/><w:sz w:val="16"/><w:szCs w:val="16"/></w:rPr></w:style>
</w:styles>
"@
$bullet = [string][char]0x2022
$numbering = "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><w:numbering xmlns:w=`"$W`"><w:abstractNum w:abstractNumId=`"0`"><w:multiLevelType w:val=`"hybridMultilevel`"/><w:lvl w:ilvl=`"0`"><w:start w:val=`"1`"/><w:numFmt w:val=`"bullet`"/><w:lvlText w:val=`"$bullet`"/><w:lvlJc w:val=`"left`"/><w:pPr><w:ind w:left=`"425`" w:hanging=`"283`"/></w:pPr><w:rPr><w:color w:val=`"2F5FA8`"/></w:rPr></w:lvl></w:abstractNum><w:num w:numId=`"1`"><w:abstractNumId w:val=`"0`"/></w:num></w:numbering>"
$fld = { param($t) "<w:r><w:fldChar w:fldCharType=`"begin`"/></w:r><w:r><w:instrText xml:space=`"preserve`"> $t </w:instrText></w:r><w:r><w:fldChar w:fldCharType=`"separate`"/></w:r><w:r><w:t>1</w:t></w:r><w:r><w:fldChar w:fldCharType=`"end`"/></w:r>" }
$footer = "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><w:ftr xmlns:w=`"$W`" xmlns:r=`"$R`"><w:p><w:pPr><w:pStyle w:val=`"Footer`"/></w:pPr><w:r><w:t xml:space=`"preserve`">Cloud Storage: Secure Vault | Google Ads text assets | 21 Sep 2026 | Page </w:t></w:r>" + (& $fld 'PAGE') + '<w:r><w:t xml:space="preserve"> of </w:t></w:r>' + (& $fld 'NUMPAGES') + '</w:p></w:ftr>'
$ctypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>'
$rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>'
$docrels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/></Relationships>'
$core = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Google Ads Text Assets - Cloud Storage: Secure Vault</dc:title><dc:subject>App campaign headlines and descriptions, United States</dc:subject><dcterms:created xsi:type="dcterms:W3CDTF">2026-09-21T00:00:00Z</dcterms:created></cp:coreProperties>'

# every part must be well-formed before it is zipped
foreach ($x in $document, $styles, $numbering, $footer, $ctypes, $rels, $docrels, $core) { $null = [xml]$x }

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
if (Test-Path $OutDocx) { Remove-Item $OutDocx -Force }
$utf8 = New-Object Text.UTF8Encoding($false)
$fs = [IO.File]::Open($OutDocx, [IO.FileMode]::Create)
$zip = New-Object IO.Compression.ZipArchive($fs, [IO.Compression.ZipArchiveMode]::Create)
$parts = [ordered]@{ '[Content_Types].xml' = $ctypes; '_rels/.rels' = $rels; 'docProps/core.xml' = $core; 'word/document.xml' = $document; 'word/styles.xml' = $styles; 'word/numbering.xml' = $numbering; 'word/footer1.xml' = $footer; 'word/_rels/document.xml.rels' = $docrels }
foreach ($k in $parts.Keys) {
  $e = $zip.CreateEntry($k, [IO.Compression.CompressionLevel]::Optimal)
  $s = $e.Open(); $bytes = $utf8.GetBytes([string]$parts[$k]); $s.Write($bytes, 0, $bytes.Length); $s.Dispose()
}
$zip.Dispose(); $fs.Dispose()
"docx written: $OutDocx ({0:N0} bytes)" -f (Get-Item $OutDocx).Length

# Word opens the file strictly (no repair) and exports the matching PDF
$word = New-Object -ComObject Word.Application
$word.Visible = $false; $word.DisplayAlerts = 0
try {
  $doc = $word.Documents.Open($OutDocx, $false, $true, $false, '', '', $false, '', '', 0, 0, $false, $false)
  "pages in Word: " + $doc.ComputeStatistics(2)
  if (Test-Path $OutPdf) { Remove-Item $OutPdf -Force }
  $doc.ExportAsFixedFormat($OutPdf, 17, $false, 0, 0, 0, 0, 0, $true, $true, 1, $true, $true, $false)
  $doc.Close(0)
  "pdf written: $OutPdf ({0:N0} bytes)" -f (Get-Item $OutPdf).Length
} finally { $word.Quit(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($word) }
```

### research/google-ads-assets/generic.ps1

```powershell
$ErrorActionPreference = 'Stop'
$sp = "C:\Users\HP\AppData\Local\Temp\claude\C--Users-HP\989e82b5-54b9-4cbd-8e7d-b6b07fc76f06\scratchpad"
$old = "C:\Users\HP\AppData\Local\Temp\claude\C--Users-HP\148ec70d-5bcf-4059-9a87-dec996069a0b\scratchpad\aso\data.json"
$d = Get-Content $old -Raw -Encoding UTF8 | ConvertFrom-Json
function Norm([string]$s) { $x = $s.ToLower().Replace('&', ' and '); $x = [regex]::Replace($x, '[^a-z0-9]+', ' '); return $x.Trim() }
function Near([string]$s) { $t = (Norm $s) -split ' ' | Where-Object { $_ -and $_ -notin 'and', 'app', 'apps', 'the', 'for', 'to', 'your', 'my', 'a' }; return ($t -join ' ') }
function Fmt($n) { if ($n -ge 1e9) { '{0:0.#}B' -f ($n / 1e9) } elseif ($n -ge 1e6) { '{0:0.#}M' -f ($n / 1e6) } elseif ($n -ge 1e3) { '{0:0.#}K' -f ($n / 1e3) } else { "$n" } }

# corpus: 522 board apps + every details page fetched live on 21 Sep
$corp = @{}
foreach ($a in $d.apps) { $corp[$a[0]] = [pscustomobject]@{ id = $a[0]; t = [string]$a[1]; dev = [string]$a[2]; i = [int64]$a[3]; b = $a[8]; cat = $a[9]; comp = $a[10] } }
foreach ($f in Get-ChildItem "$sp\det" -Filter *.html) {
  $id = $f.BaseName; if ($corp.ContainsKey($id)) { continue }
  $h = [IO.File]::ReadAllText($f.FullName)
  $t = [System.Net.WebUtility]::HtmlDecode([regex]::Match($h, '<meta property="og:title" content="([^"]*?)( - Apps on Google Play)?"').Groups[1].Value)
  $m = [regex]::Match($h, '\["([\d,]+\+)",(\d+),(\d+),"[^"]*"\]')
  $corp[$id] = [pscustomobject]@{ id = $id; t = $t; dev = ''; i = $(if ($m.Success) { [int64]$m.Groups[3].Value } else { 0 }); b = 0; cat = ''; comp = 0 }
}
$all = $corp.Values
"corpus: {0} app titles" -f $all.Count

"=== A. How widely each keyword is shared in app titles (non-big-brand developers only)"
"phrase | titles | distinct developers | at 1M+ | at 100K+ | of your 11 competitors | biggest third-party title"
$phrases = 'cloud storage', 'cloud drive', 'cloud backup', 'drive backup', 'backup and restore', 'cloud storage drive', 'cloud storage backup', 'storage backup', 'data backup', 'phone backup', 'photo backup', 'secure cloud storage', 'secure cloud', 'private cloud', 'cloud vault', 'secure vault', 'data restore', 'file storage', 'photo storage'
foreach ($p in $phrases) {
  $hits = $all | Where-Object { $_.b -ne 1 -and (' ' + (Norm $_.t) + ' ').Contains(' ' + $p + ' ') }
  $devs = @($hits | ForEach-Object { if ($_.dev) { $_.dev } else { $_.id } } | Sort-Object -Unique).Count
  $top = $hits | Sort-Object i -Descending | Select-Object -First 1
  "{0} | {1} | {2} | {3} | {4} | {5} | {6}" -f $p, @($hits).Count, $devs, @($hits | Where-Object { $_.i -ge 1e6 }).Count, @($hits | Where-Object { $_.i -ge 1e5 }).Count, @($hits | Where-Object { $_.comp -eq 1 }).Count, $(if ($top) { "$($top.t) [$(Fmt $top.i)]" } else { '' })
}

"=== A2. Most shared 2- and 3-word phrases in cloud-niche titles (auto-extracted, by distinct developer)"
$grams = @{}
foreach ($a in ($all | Where-Object { $_.cat -eq 'cloud' -and $_.b -ne 1 })) {
  $w = (Norm $a.t) -split ' ' | Where-Object { $_ }
  $seen = @{}
  foreach ($n in 2, 3) { for ($i = 0; $i + $n -le $w.Count; $i++) { $g = ($w[$i..($i + $n - 1)] -join ' '); if (-not $seen.ContainsKey($g)) { $seen[$g] = 1; if (-not $grams.ContainsKey($g)) { $grams[$g] = New-Object System.Collections.Generic.HashSet[string] }; [void]$grams[$g].Add($a.dev) } } }
}
$grams.GetEnumerator() | Where-Object { $_.Key -notmatch '^(and|for|the|of|to) | (and|for|the|of|to)$' } | Sort-Object { $_.Value.Count } -Descending | Select-Object -First 22 | ForEach-Object { "   {0} : {1} developers" -f $_.Key, $_.Value.Count }

"=== B. Exact full titles shared by 2+ apps (whole corpus)"
$dups = $all | Group-Object { Norm $_.t } | Where-Object { $_.Count -ge 2 -and $_.Name }
"{0} of {1} distinct titles are shared by more than one app" -f @($dups).Count, @($all | Group-Object { Norm $_.t }).Count
$dups | Sort-Object Count -Descending | ForEach-Object { "   '{0}' x{1}: {2}" -f $_.Group[0].t, $_.Count, (($_.Group | ForEach-Object { "$($_.dev) [$(Fmt $_.i)]" }) -join ' ; ') }

"=== C. Candidate headlines vs every known title"
$exact = @{}; $near = @{}
foreach ($a in $all) { $k = Norm $a.t; if ($k) { if (-not $exact.ContainsKey($k)) { $exact[$k] = @() }; $exact[$k] += $a }; $k2 = Near $a.t; if ($k2) { if (-not $near.ContainsKey($k2)) { $near[$k2] = @() }; $near[$k2] += $a } }
foreach ($h in (Get-Content "$sp\candidates.txt" -Encoding UTF8 | Where-Object { $_.Trim() })) {
  $e = $exact[(Norm $h)]; $n = $near[(Near $h)]
  $status = $(if ($e) { 'EXACT TITLE' } elseif ($n) { 'NEAR TITLE ' } else { 'clear      ' })
  $who = $(if ($e) { $e } elseif ($n) { $n } else { @() })
  "{0} {1,2} | {2} {3}" -f $status, $h.Length, $h, $(if ($who) { '<= ' + (($who | ForEach-Object { "$($_.t) [$(Fmt $_.i)]" }) -join ' ; ') } else { '' })
}
```

### research/google-ads-assets/headcheck.ps1

```powershell
$ErrorActionPreference = 'Stop'
$sp = "C:\Users\HP\AppData\Local\Temp\claude\C--Users-HP\989e82b5-54b9-4cbd-8e7d-b6b07fc76f06\scratchpad"
$old = "C:\Users\HP\AppData\Local\Temp\claude\C--Users-HP\148ec70d-5bcf-4059-9a87-dec996069a0b\scratchpad\aso\data.json"
$UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
$enc = New-Object Text.UTF8Encoding($false)
New-Item -ItemType Directory -Force "$sp\hserp" | Out-Null
$d = Get-Content $old -Raw -Encoding UTF8 | ConvertFrom-Json
function Norm([string]$s) { $x = $s.ToLower().Replace('&', ' and '); $x = [regex]::Replace($x, '[^a-z0-9]+', ' '); return $x.Trim() }
function Near([string]$s) { $t = (Norm $s) -split ' ' | Where-Object { $_ -and $_ -notin 'and', 'app', 'apps', 'the', 'for', 'to', 'your', 'my', 'a' }; return ($t -join ' ') }
function Fmt($n) { if ($n -ge 1e9) { '{0:0.#}B' -f ($n / 1e9) } elseif ($n -ge 1e6) { '{0:0.#}M' -f ($n / 1e6) } elseif ($n -ge 1e3) { '{0:0.#}K' -f ($n / 1e3) } else { "$n" } }
$title = @{}; $inst = @{}
foreach ($a in $d.apps) { $title[$a[0]] = [string]$a[1]; $inst[$a[0]] = [int64]$a[3] }
function Get-App($id) {
  if ($title.ContainsKey($id)) { return }
  $f = "$sp\det\$id.html"
  if (-not (Test-Path $f)) {
    try { $r = Invoke-WebRequest -Uri ("https://play.google.com/store/apps/details?id=" + $id + "&hl=en&gl=US") -UseBasicParsing -UserAgent $UA -Headers @{ 'Accept-Language' = 'en-US,en;q=0.9' }; [IO.File]::WriteAllText($f, $r.Content, $enc) } catch { }
    Start-Sleep -Milliseconds 350
  }
  if (Test-Path $f) {
    $h = [IO.File]::ReadAllText($f)
    $title[$id] = [System.Net.WebUtility]::HtmlDecode([regex]::Match($h, '<meta property="og:title" content="([^"]*?)( - Apps on Google Play)?"').Groups[1].Value)
    $m = [regex]::Match($h, '\["([\d,]+\+)",(\d+),(\d+),"[^"]*"\]'); $inst[$id] = $(if ($m.Success) { [int64]$m.Groups[3].Value } else { 0 })
  } else { $title[$id] = ''; $inst[$id] = 0 }
}
foreach ($hl in (Get-Content "$sp\final_headlines.txt" -Encoding UTF8 | Where-Object { $_.Trim() })) {
  $f = "$sp\hserp\" + ((Norm $hl) -replace ' ', '_') + ".html"
  if (-not (Test-Path $f)) {
    $r = Invoke-WebRequest -Uri ("https://play.google.com/store/search?q=" + [uri]::EscapeDataString($hl) + "&c=apps&hl=en&gl=US") -UseBasicParsing -UserAgent $UA -Headers @{ 'Accept-Language' = 'en-US,en;q=0.9' }
    [IO.File]::WriteAllText($f, $r.Content, $enc); Start-Sleep -Milliseconds 500
  }
  $html = [IO.File]::ReadAllText($f); $seen = @{}; $ids = @()
  foreach ($m in [regex]::Matches($html, '\["([A-Za-z0-9_.]+)",7\]')) { $i = $m.Groups[1].Value; if (-not $seen.ContainsKey($i)) { $seen[$i] = 1; $ids += $i } }
  $ids = $ids | Select-Object -First 15
  foreach ($i in $ids) { Get-App $i }
  $ex = @($ids | Where-Object { (Norm $title[$_]) -eq (Norm $hl) })
  $nr = @($ids | Where-Object { (Near $title[$_]) -eq (Near $hl) -and (Norm $title[$_]) -ne (Norm $hl) })
  $status = $(if ($ex.Count) { 'EXACT' } elseif ($nr.Count) { 'NEAR ' } else { 'clear' })
  "{0} {1,2} | {2} | checked {3} live results | closest: {4}" -f $status, $hl.Length, $hl, $ids.Count, (($ids | Select-Object -First 3 | ForEach-Object { "$($title[$_]) [$(Fmt $inst[$_])]" }) -join ' ; ')
  if ($ex.Count -or $nr.Count) { ($ex + $nr) | ForEach-Object { "      match: $($title[$_]) [$(Fmt $inst[$_])]" } }
}
```

### research/google-ads-assets/resolve.ps1

```powershell
$ErrorActionPreference = 'Stop'
$sp = "C:\Users\HP\AppData\Local\Temp\claude\C--Users-HP\989e82b5-54b9-4cbd-8e7d-b6b07fc76f06\scratchpad"
$old = "C:\Users\HP\AppData\Local\Temp\claude\C--Users-HP\148ec70d-5bcf-4059-9a87-dec996069a0b\scratchpad\aso\data.json"
$UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
$enc = New-Object Text.UTF8Encoding($false)
New-Item -ItemType Directory -Force "$sp\det" | Out-Null
$d = Get-Content $old -Raw -Encoding UTF8 | ConvertFrom-Json
$known = @{}
foreach ($a in $d.apps) { $known[$a[0]] = @{ id = $a[0]; t = $a[1]; dev = $a[2]; i = [int64]$a[3]; rel = $a[6]; b = $a[8]; comp = $a[10] } }
$serps = Get-Content "$sp\serps_live.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$depth = 10
$need = @{}
foreach ($p in $serps.PSObject.Properties) { $p.Value | Select-Object -First $depth | ForEach-Object { if (-not $known.ContainsKey($_)) { $need[$_] = 1 } } }
"unknown ids to fetch: " + $need.Count
foreach ($id in $need.Keys) {
  $f = "$sp\det\$id.html"
  if (-not (Test-Path $f)) {
    try {
      $r = Invoke-WebRequest -Uri ("https://play.google.com/store/apps/details?id=" + $id + "&hl=en&gl=US") -UseBasicParsing -UserAgent $UA -Headers @{ 'Accept-Language' = 'en-US,en;q=0.9' }
      [IO.File]::WriteAllText($f, $r.Content, $enc)
    } catch { "fail $id" }
    Start-Sleep -Milliseconds 400
  }
  if (Test-Path $f) {
    $h = [IO.File]::ReadAllText($f)
    $t = [regex]::Match($h, '<meta property="og:title" content="([^"]*?)( - Apps on Google Play)?"').Groups[1].Value
    $t = [System.Net.WebUtility]::HtmlDecode($t)
    $m = [regex]::Match($h, '\["([\d,]+\+)",(\d+),(\d+),"[^"]*"\]')
    $rel = [regex]::Match($h, '\["([A-Z][a-z]{2} \d{1,2}, \d{4})",\[\d{9,10}').Groups[1].Value
    $dev = [regex]::Match($h, '/store/apps/dev(?:eloper)?\?id=[^"]+"[^>]*><span>([^<]+)<').Groups[1].Value
    $known[$id] = @{ id = $id; t = $t; dev = [System.Net.WebUtility]::HtmlDecode($dev); i = $(if ($m.Success) { [int64]$m.Groups[3].Value } else { 0 }); rel = $rel; b = $null; comp = 0 }
  }
}
$rows = @()
foreach ($p in $serps.PSObject.Properties) {
  $rank = 0
  foreach ($id in $p.Value) {
    $rank++
    $k = $known[$id]
    if ($rank -le $depth -or ($k -and $k.comp -eq 1) -or $id -eq 'com.softwarealliance.cloudvault') {
      $rows += [pscustomobject]@{ q = $p.Name; rank = $rank; id = $id; title = $(if ($k) { $k.t } else { '?' }); dev = $(if ($k) { $k.dev } else { '' }); installs = $(if ($k) { $k.i } else { 0 }); released = $(if ($k) { $k.rel } else { '' }); brand = $(if ($k) { $k.b } else { $null }); comp = $(if ($k) { $k.comp } else { 0 }); total = $p.Value.Count }
    }
  }
}
$rows | ConvertTo-Json -Depth 3 | Out-File "$sp\serp_rows.json" -Encoding utf8
"rows: " + $rows.Count
```

### research/google-ads-assets/serps.ps1

```powershell
$ErrorActionPreference = 'Stop'
$sp = "C:\Users\HP\AppData\Local\Temp\claude\C--Users-HP\989e82b5-54b9-4cbd-8e7d-b6b07fc76f06\scratchpad"
$UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
$enc = New-Object Text.UTF8Encoding($false)
$kws = Get-Content "$sp\keywords.txt" | Where-Object { $_.Trim() }
$out = @{}
foreach ($q in $kws) {
  $f = "$sp\serp\" + ($q -replace '[^a-z0-9]+', '_') + ".html"
  if (-not (Test-Path $f)) {
    $u = "https://play.google.com/store/search?q=" + [uri]::EscapeDataString($q) + "&c=apps&hl=en&gl=US"
    $ok = $false
    for ($a = 0; $a -lt 3 -and -not $ok; $a++) {
      try {
        $r = Invoke-WebRequest -Uri $u -UseBasicParsing -UserAgent $UA -Headers @{ 'Accept-Language' = 'en-US,en;q=0.9' }
        [IO.File]::WriteAllText($f, $r.Content, $enc); $ok = $true
      } catch { Start-Sleep -Seconds (2 * ($a + 1)) }
    }
    Start-Sleep -Milliseconds 500
  }
  if (Test-Path $f) {
    $html = [IO.File]::ReadAllText($f)
    $seen = @{}; $ord = @()
    foreach ($m in [regex]::Matches($html, '\["([A-Za-z0-9_.]+)",7\]')) { $i = $m.Groups[1].Value; if (-not $seen.ContainsKey($i)) { $seen[$i] = 1; $ord += $i } }
    $out[$q] = $ord
    "{0} -> {1} results" -f $q, $ord.Count
  } else { "{0} -> FETCH FAILED" -f $q }
}
$out | ConvertTo-Json -Depth 4 | Out-File "$sp\serps_live.json" -Encoding utf8
```

### research/google-ads-assets/summary.ps1

```powershell
$ErrorActionPreference = 'Stop'
$sp = "C:\Users\HP\AppData\Local\Temp\claude\C--Users-HP\989e82b5-54b9-4cbd-8e7d-b6b07fc76f06\scratchpad"
$old = "C:\Users\HP\AppData\Local\Temp\claude\C--Users-HP\148ec70d-5bcf-4059-9a87-dec996069a0b\scratchpad\aso\data.json"
$d = Get-Content $old -Raw -Encoding UTF8 | ConvertFrom-Json
$rows = Get-Content "$sp\serp_rows.json" -Raw -Encoding UTF8 | ConvertFrom-Json
function Fmt($n) { if ($n -ge 1e9) { '{0:0.#}B' -f ($n / 1e9) } elseif ($n -ge 1e6) { '{0:0.#}M' -f ($n / 1e6) } elseif ($n -ge 1e3) { '{0:0.#}K' -f ($n / 1e3) } else { "$n" } }
$brandRx = 'Google|Dropbox|OneDrive|MEGA|TeraBox|pCloud|Proton|Amazon|Samsung|Synology|IDrive|NordLocker|Keepsafe|Yandex|Dr\.Fone|MobiSaver|^Sync -|^Cloud: Video|^Gallery$'
"--- unknown-brand apps in live top 10 (flag null)"
$rows | Where-Object { $null -eq $_.brand -and $_.rank -le 10 } | Select-Object -Property title, dev, installs -Unique | ForEach-Object { "   {0} | {1} | {2}" -f $_.title, $_.dev, (Fmt $_.installs) }
"--- per keyword"
"keyword | demand(15Sep) | P | R | results | brandTop10 | smallApps<100K top10 | entryBar(smallest non-brand top10) | competitors live (rank) | competitors 15Sep (rank)"
foreach ($g in ($rows | Group-Object q)) {
  $q = $g.Name
  $b = $d.markets.US | Where-Object { $_.q -eq $q }
  $top = $g.Group | Where-Object { $_.rank -le 10 }
  $isBrand = { param($r) ($r.brand -eq 1) -or ($null -eq $r.brand -and $r.title -match $brandRx) }
  $nbrand = @($top | Where-Object { & $isBrand $_ }).Count
  $non = $top | Where-Object { -not (& $isBrand $_) -and $_.installs -gt 0 }
  $small = @($non | Where-Object { $_.installs -lt 100000 }).Count
  $entry = $non | Sort-Object installs | Select-Object -First 1
  $compLive = ($g.Group | Where-Object { $_.comp -eq 1 } | ForEach-Object { "{0} #{1}" -f $_.title, $_.rank }) -join '; '
  $compOld = ''
  if ($b) { $compOld = (0..10 | ForEach-Object { $ix = [array]::IndexOf([int[]]$b.ids, $_); if ($ix -ge 0) { "{0} #{1}" -f $d.apps[$_][1], ($ix + 1) } }) -join '; ' }
  "{0} | {1} | {2} | {3} | {4} | {5} | {6} | {7} | {8} | {9}" -f $q, $(if ($b) { "$($b.demand) @ '$($b.demandAt)'" } else { 'n/a' }), $(if ($b) { $b.P } else { '' }), $(if ($b) { $b.R } else { '' }), $g.Group[0].total, $nbrand, $small, $(if ($entry) { "$(Fmt $entry.installs) ($($entry.title) #$($entry.rank))" } else { '' }), $compLive, $compOld
}
"--- asset lengths"
$assets = Get-Content "$sp\assets.txt" -Encoding UTF8 | Where-Object { $_.Trim() }
foreach ($a in $assets) { $t = $a.Substring(2); $lim = $(if ($a.StartsWith('H')) { 30 } else { 90 }); "{0} {1,3}/{2} {3} {4}" -f $a.Substring(0, 1), $t.Length, $lim, $(if ($t.Length -le $lim) { 'OK ' } else { 'OVER' }), $t }
```

## Small data files

### research/free-gb-offer-analysis/appbrain.json

```json
[
  {
    "app": "Cloud Storage Backup & Drive",
    "total": "3.8 million",
    "last30": "7 thousand",
    "perDay": "230",
    "rank": "",
    "ranking": "Medium ranked",
    "libs": "27",
    "id": "com.backup.and.restore.all.apps.photo.backup"
  },
  {
    "app": "Cloud Backup : Cloud Storage",
    "total": "450 thousand",
    "last30": "6.6 thousand",
    "perDay": "220",
    "rank": "",
    "ranking": "Not ranked",
    "libs": "55",
    "id": "com.backup.restore.clould.backup.freecloud.storage"
  },
  {
    "app": "Cloud Storage: Drive Backup",
    "total": "220 thousand",
    "last30": "38 thousand",
    "perDay": "1.3 thousand",
    "rank": "",
    "ranking": "Medium ranked",
    "libs": "0",
    "id": "com.cloud.storage.extrastorage.gbsfreespace"
  },
  {
    "app": "Cloudgate: Cloud Storage Drive",
    "total": "440 thousand",
    "last30": "6.9 thousand",
    "perDay": "230",
    "rank": "",
    "ranking": "Not ranked",
    "libs": "0",
    "id": "com.cloudgate.cloudstorage"
  },
  {
    "app": "Cloud Storage Drive Backup app",
    "total": "660 thousand",
    "last30": "36 thousand",
    "perDay": "1.2 thousand",
    "rank": "",
    "ranking": "Highly ranked",
    "libs": "30",
    "id": "com.cloudstorage.backupapp.storagespace.mycloud.clouldbackup"
  },
  {
    "app": "Cloud Storage App Drive Backup",
    "total": "3.6 thousand",
    "last30": "540",
    "perDay": "18",
    "rank": "",
    "ranking": "Not ranked",
    "libs": "",
    "id": "com.cloudstorage.cloudbackup.storagespaceapp"
  },
  {
    "app": "Cloud Storage & Cloud Drive",
    "total": "540 thousand",
    "last30": "29 thousand",
    "perDay": "980",
    "rank": "",
    "ranking": "Not ranked",
    "libs": "29",
    "id": "com.cloudstorageapp.cloudbackup.storagespace.databackup"
  },
  {
    "app": "Cloud Storage Drive: DataHatch",
    "total": "19 thousand",
    "last30": "850",
    "perDay": "28",
    "rank": "",
    "ranking": "Not ranked",
    "libs": "27",
    "id": "com.datahatch.cloud.storage.drive.data.backup"
  },
  {
    "app": "Cloud Storage: Cloud Drive App",
    "total": "6.1 million",
    "last30": "75 thousand",
    "perDay": "2.5 thousand",
    "rank": "#81 in Productivity Do",
    "ranking": "Highly ranked",
    "libs": "64",
    "id": "com.fazconapps.backup.restore.data"
  },
  {
    "app": "ANZ Cloud Drive: Cloud Storage",
    "total": "5.5 thousand",
    "last30": "0",
    "perDay": "",
    "rank": "",
    "ranking": "Not ranked",
    "libs": "26",
    "id": "com.filestorage.cloudbackup.clouddrive.photosbackup.storagespace"
  },
  {
    "app": "Nova Cloud: Storage & Backup",
    "total": "8.7 thousand",
    "last30": "560",
    "perDay": "19",
    "rank": "",
    "ranking": "Not ranked",
    "libs": "",
    "id": "com.securebackup.cloudstorage.drivebackup.filestorage"
  }
]
```

### research/free-gb-offer-analysis/atc-creatives-Mapidirections-1.json

```json
{
  "1": [
    {
      "1": "AR12707166228507000833",
      "2": "CR11994948457694494721",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=807662671637&uiFeatures=12,54&versionId=3&assets=%3DH4sIAAAAAAAAAONS5OLk-DJ_xd0jzAKMXJwcx-5dO9vIJsDMxckxu__cnDNsAswAVgwnlSMAAAA&sig=ACiVB_zmnq22QpufS_UxEu_MzEYRgOWRmg&htmlParentId=fletch-render-6660256613191753787&responseCallback=fletchCallback6660256613191753787"
        }
      },
      "4": 3,
      "6": {"1":"1777810630","2":347301000},
      "7": {"1":"1787629581","2":836679000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 114
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR16739879892245544961",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=807547989738&uiFeatures=12,54&versionId=5&sig=ACiVB_z-AxPQWh6c8nWFRE3d3w46V1TThA&htmlParentId=fletch-render-2823835023365220889&responseCallback=fletchCallback2823835023365220889"
        }
      },
      "4": 3,
      "6": {"1":"1777816603","2":838713000},
      "7": {"1":"1787629557","2":671493000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 114
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR05700411789322223617",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=812538072616&uiFeatures=12,54&versionId=1&sig=ACiVB_xNH1ejHrHAy87QSbWpPuamwOySng&htmlParentId=fletch-render-5308645840543088027&responseCallback=fletchCallback5308645840543088027"
        }
      },
      "4": 3,
      "6": {"1":"1781204767","2":6913000},
      "7": {"1":"1787629512","2":534386000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 75
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR17786808475934785537",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=807583340308&uiFeatures=12,54&versionId=3&assets=%3DH4sIAAAAAAAAAOPi5uLkuL9q_p5GLgFGAKCKjYENAAAA&sig=ACiVB_x0vq1lBdLhmq9SNu8N00_9xTWqAw&htmlParentId=fletch-render-17693422805370581951&responseCallback=fletchCallback17693422805370581951"
        }
      },
      "4": 3,
      "6": {"1":"1777816764","2":694247000},
      "7": {"1":"1787629482","2":185300000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 114
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR00444677145478823937",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=793391155575&uiFeatures=12,54&versionId=10&sig=ACiVB_wOMuTZhuHTcmvE6z4Ou_Syrq5Ktg&htmlParentId=fletch-render-10802236974518687033&responseCallback=fletchCallback10802236974518687033"
        }
      },
      "4": 3,
      "6": {"1":"1768838005","2":24566000},
      "7": {"1":"1787629460","2":680870000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 217
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR06088996696275025921",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=7402882174&creativeId=780685091925&uiFeatures=12,54&versionId=33&sig=ACiVB_xo0y4Bh_AkWfDOr9foNCW9iVGIRw&htmlParentId=fletch-render-12151007009726799925&responseCallback=fletchCallback12151007009726799925"
        }
      },
      "4": 3,
      "6": {"1":"1761380186","2":567131000},
      "7": {"1":"1787629434","2":629489000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 304
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR14304077082529890305",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=812537851672&uiFeatures=12,54&versionId=2&sig=ACiVB_yu0GBuvNJIkn8WYg-yhbc9Cdm7PA&htmlParentId=fletch-render-4831728550097513097&responseCallback=fletchCallback4831728550097513097"
        }
      },
      "4": 3,
      "6": {"1":"1781203239","2":394056000},
      "7": {"1":"1787629399","2":682700000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 75
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR14546340176059170817",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=812507748132&uiFeatures=12,54&adGroupId=198900470153&assets=%3DH4sIAAAAAAAAAONS4OLgeHJ10zVDAWYuTo7dZ9taTjCDmT_O3V2zgU2AEQDgeONFIgAAAA&sig=ACiVB_y4l_CzFy7T0diCh7FFtSZKnWos9Q&htmlParentId=fletch-render-3423962070642911944&responseCallback=fletchCallback3423962070642911944"
        }
      },
      "4": 3,
      "6": {"1":"1781202587","2":414595000},
      "7": {"1":"1787629259","2":179656000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 75
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR06203406679350968321",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=793391348775&uiFeatures=12,54&versionId=10&assets=%3DH4sIAAAAAAAAAOPi5uLkmN3x5_4HZgEWAJIWsogNAAAA&sig=ACiVB_znNhuhxwq7EvlK4y0JzwPD0Ft5-A&htmlParentId=fletch-render-13392086703114689211&responseCallback=fletchCallback13392086703114689211"
        }
      },
      "4": 3,
      "6": {"1":"1768836575","2":901555000},
      "7": {"1":"1787629257","2":981261000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 218
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR12462961629371301889",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=810004176478&uiFeatures=12,54&adGroupId=201972501332&sig=ACiVB_xHbrCM4NeKyTbKv-Y0Ad_KtjjOhQ&htmlParentId=fletch-render-7524918781867658079&responseCallback=fletchCallback7524918781867658079"
        }
      },
      "4": 3,
      "6": {"1":"1779644516","2":554187000},
      "7": {"1":"1787629234","2":191195000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 93
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR12421001834703880193",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=7402882174&creativeId=776269624020&uiFeatures=12,54&versionId=32&assets=%3DH4sIAAAAAAAAAONS5OLkuLa6b_UXDgFmLk6OdydePD8IYc7-8_LTOi4BRgC_XDsXIwAAAA&sig=ACiVB_x3UKnD_B7T1-qF66dD9kaNMsRnQQ&htmlParentId=fletch-render-11856471228112447899&responseCallback=fletchCallback11856471228112447899"
        }
      },
      "4": 3,
      "6": {"1":"1759141762","2":122432000},
      "7": {"1":"1787629211","2":913868000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 329
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR15142731500761382913",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=807547431087&uiFeatures=12,54&versionId=3&assets=%3DH4sIAAAAAAAAAONS5OLkOHbv2tlGNgFmLk6O2f3n5pyBML_MX3H3CLMAIwCqLK2OIwAAAA&sig=ACiVB_zpLM1yYDOhTIpDm3KxSnPb-B7ung&htmlParentId=fletch-render-16334985274257805290&responseCallback=fletchCallback16334985274257805290"
        }
      },
      "4": 3,
      "6": {"1":"1777811055","2":860426000},
      "7": {"1":"1787629016","2":663141000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 114
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR13313297534014193665",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=809969002533&uiFeatures=12,54&versionId=3&sig=ACiVB_z9YAzg232iKBXBlZHO9wjjgrPEDA&htmlParentId=fletch-render-9493935030423155455&responseCallback=fletchCallback9493935030423155455"
        }
      },
      "4": 3,
      "6": {"1":"1779644535","2":342702000},
      "7": {"1":"1787628958","2":264374000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 82
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR05179184385164836865",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=7402882174&creativeId=797775842580&uiFeatures=12,54&versionId=12&sig=ACiVB_xoA1aRyXqB0f1dWMhJHeR76pndDQ&htmlParentId=fletch-render-18354977643391792940&responseCallback=fletchCallback18354977643391792940"
        }
      },
      "4": 3,
      "6": {"1":"1771520469","2":193075000},
      "7": {"1":"1787628779","2":501871000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 187
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR04880035308793495553",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=793505794208&uiFeatures=12,54&versionId=7&sig=ACiVB_wsIi6vzCf5tk4-Af6kAehxQ8bUPw&htmlParentId=fletch-render-3445001924937175069&responseCallback=fletchCallback3445001924937175069"
        }
      },
      "4": 3,
      "6": {"1":"1768836810","2":656097000},
      "7": {"1":"1787628753","2":587269000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 218
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR07512680635803107329",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=744200647394&uiFeatures=12,54&versionId=9&sig=ACiVB_wDPW_0Iu8Ko316-Yh_8lF-w1ekDg&htmlParentId=fletch-render-3201651606058186607&responseCallback=fletchCallback3201651606058186607"
        }
      },
      "4": 3,
      "6": {"1":"1762183340","2":474805000},
      "7": {"1":"1787627563","2":793870000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 295
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR18209846674233229313",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=807583359757&uiFeatures=12,54&versionId=5&assets=%3DH4sIAAAAAAAAAOPi5uLk-N0__fVWZgFGAPg1zHcNAAAA&sig=ACiVB_x2OxdhzmggJtno41JKTeokepiJLw&htmlParentId=fletch-render-7042568696732866679&responseCallback=fletchCallback7042568696732866679"
        }
      },
      "4": 3,
      "6": {"1":"1777816799","2":528206000},
      "7": {"1":"1787625392","2":381884000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 114
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR11758972096774930433",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=812507770446&uiFeatures=12,54&versionId=1&sig=ACiVB_xpo1BdmKVmkmQs1eRwKI2ocgaspQ&htmlParentId=fletch-render-12884680180849934232&responseCallback=fletchCallback12884680180849934232"
        }
      },
      "4": 3,
      "6": {"1":"1781195275","2":243758000},
      "7": {"1":"1787624209","2":921473000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 75
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR03707337988049469441",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=7724526235&creativeId=795506480052&uiFeatures=12,54&adGroupId=191881504719&assets=%3DH4sIAAAAAAAAAOOS5-LgeL7o2hIdAWYuDo4nYBYjFydH6-SDi-5xCDADAJYABZwhAAAA&sig=ACiVB_ws__Ml_zDsMaux77Rm3XA8bDEUZQ&htmlParentId=fletch-render-7008179063806568258&responseCallback=fletchCallback7008179063806568258"
        }
      },
      "4": 3,
      "6": {"1":"1770031338","2":976011000},
      "7": {"1":"1787623011","2":573041000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 204
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR01965231564107284481",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=7402882174&creativeId=820818519490&uiFeatures=12,54&adGroupId=207656106428&sig=ACiVB_y-3433IeY_03fQOZ6VGDmKuIVgmg&htmlParentId=fletch-render-13514241641832786765&responseCallback=fletchCallback13514241641832786765"
        }
      },
      "4": 3,
      "6": {"1":"1786654335","2":698757000},
      "7": {"1":"1787604511","2":269343000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 12
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR13469797621065318401",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=809969000628&uiFeatures=12,54&versionId=3&sig=ACiVB_zZvMa02ViAofE7AcS4e_WHmJQDng&htmlParentId=fletch-render-12042384200493880833&responseCallback=fletchCallback12042384200493880833"
        }
      },
      "4": 3,
      "6": {"1":"1779644577","2":887693000},
      "7": {"1":"1787601634","2":623314000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 86
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR09659276797530865665",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=807662643752&uiFeatures=12,54&versionId=3&sig=ACiVB_xuPNFCWFnmlIynyb9mCw37WwMUrg&htmlParentId=fletch-render-9645817567296558663&responseCallback=fletchCallback9645817567296558663"
        }
      },
      "4": 3,
      "6": {"1":"1777816613","2":694724000},
      "7": {"1":"1787581081","2":705518000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 106
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR15769052700202762241",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=807583293769&uiFeatures=12,54&versionId=8&assets=%3DH4sIAAAAAAAAAOPi5uLkOD35zv9XHALMAOvKtdMNAAAA&sig=ACiVB_wIT2ayGXzc55-rSwaKvmBF3ffgJg&htmlParentId=fletch-render-8298403551447152775&responseCallback=fletchCallback8298403551447152775"
        }
      },
      "4": 3,
      "6": {"1":"1777807101","2":562070000},
      "7": {"1":"1786221973","2":528036000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 98
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR17249371384165957633",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=807583294927&uiFeatures=12,54&versionId=6&sig=ACiVB_yLc4HCO-ivN1VYIeGKum5mt1_AeA&htmlParentId=fletch-render-10129312036047309518&responseCallback=fletchCallback10129312036047309518"
        }
      },
      "4": 3,
      "6": {"1":"1777806319","2":460302000},
      "7": {"1":"1786221973","2":511251000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 98
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR09221466660513251329",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=807547349685&uiFeatures=12,54&versionId=3&assets=%3DH4sIAAAAAAAAAOMS4-Lk-PTz5PY_HALMXJwcD_bO6P7OKsAIAEr65qYYAAAA&sig=ACiVB_woeSDB8IqlUbS30lTJDK5qBJkXfw&htmlParentId=fletch-render-13281344282007475537&responseCallback=fletchCallback13281344282007475537"
        }
      },
      "4": 3,
      "6": {"1":"1777806175","2":768509000},
      "7": {"1":"1786221972","2":281718000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 98
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR01306783390816534529",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=810003031105&uiFeatures=12,54&versionId=9&assets=%3DH4sIAAAAAAAAAOPi5uLk2Pr1-_33rAIsAKUcwY8NAAAA&sig=ACiVB_yGz0duolEnNi79A_NOiYRfTHQPxA&htmlParentId=fletch-render-1243528378255909391&responseCallback=fletchCallback1243528378255909391"
        }
      },
      "4": 3,
      "6": {"1":"1779634512","2":548540000},
      "7": {"1":"1786221961","2":956710000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 77
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR14644168398506819585",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=809967854784&uiFeatures=12,54&versionId=3&sig=ACiVB_x4bOw4PhI_3pjwuGPqPvSmNSTkaQ&htmlParentId=fletch-render-4277931055211963042&responseCallback=fletchCallback4277931055211963042"
        }
      },
      "4": 3,
      "6": {"1":"1779638868","2":958104000},
      "7": {"1":"1786221961","2":328939000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 77
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR03359144989362749441",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=809967952797&uiFeatures=12,54&versionId=5&sig=ACiVB_xtxiI5aXgdUD9wK0z-1TWFi4OaGg&htmlParentId=fletch-render-1129814255932365486&responseCallback=fletchCallback1129814255932365486"
        }
      },
      "4": 3,
      "6": {"1":"1779644587","2":352333000},
      "7": {"1":"1786221166","2":441077000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 77
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR12608822567034159105",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=812610306146&uiFeatures=12,54&versionId=3&sig=ACiVB_xojsM4QkqaRAciFPFd4O0qYpC1ZQ&htmlParentId=fletch-render-17110962269018416551&responseCallback=fletchCallback17110962269018416551"
        }
      },
      "4": 3,
      "6": {"1":"1781194480","2":544096000},
      "7": {"1":"1786220703","2":450888000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 59
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR00653606757305679873",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=807547348950&uiFeatures=12,54&versionId=4&assets=%3DH4sIAAAAAAAAAONS5OLkWP350tt9HALMXJwcjfs7JnyFMA92dVw5zSHACACSARoMIwAAAA&sig=ACiVB_wW-8HQ9Gd22g7sO9j4egZv7CdlEw&htmlParentId=fletch-render-4152681410767427478&responseCallback=fletchCallback4152681410767427478"
        }
      },
      "4": 3,
      "6": {"1":"1777807402","2":805352000},
      "7": {"1":"1786220423","2":524153000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 97
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR17431162437679185921",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=807662388623&uiFeatures=12,54&versionId=11&sig=ACiVB_wo4g-FB_krxJKIefhqB3vSRYzkYw&htmlParentId=fletch-render-3200718833438294752&responseCallback=fletchCallback3200718833438294752"
        }
      },
      "4": 3,
      "6": {"1":"1777809000","2":744159000},
      "7": {"1":"1786220358","2":914293000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 98
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR12007333150511333377",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=807662356550&uiFeatures=12,54&versionId=3&sig=ACiVB_yuhJnRY1ho4BmYDeq0LtdThZttCQ&htmlParentId=fletch-render-6142024190252889015&responseCallback=fletchCallback6142024190252889015"
        }
      },
      "4": 3,
      "6": {"1":"1777816604","2":62702000},
      "7": {"1":"1786220235","2":941312000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 98
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR07938996572753231873",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=812610350600&uiFeatures=12,54&versionId=1&sig=ACiVB_xaAgdxw4cdsmTfr5e7CCVihIHniQ&htmlParentId=fletch-render-14936261224624852677&responseCallback=fletchCallback14936261224624852677"
        }
      },
      "4": 3,
      "6": {"1":"1781194585","2":801339000},
      "7": {"1":"1786220059","2":137630000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 59
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR06988300545261830145",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=812508069585&uiFeatures=12,54&versionId=1&assets=%3DH4sIAAAAAAAAAOPi5uLkmN3x5_4HZgEWAJIWsogNAAAA&sig=ACiVB_xWKlhoMnomWhCTExl90Rnw4o7V0g&htmlParentId=fletch-render-5472219838548200669&responseCallback=fletchCallback5472219838548200669"
        }
      },
      "4": 3,
      "6": {"1":"1781195015","2":377836000},
      "7": {"1":"1786219864","2":461876000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 59
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR00553793091736174593",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=807662378849&uiFeatures=12,54&versionId=5&sig=ACiVB_zsqBAoFXbO3vRhd62oZwn65ug75A&htmlParentId=fletch-render-9957468655047408762&responseCallback=fletchCallback9957468655047408762"
        }
      },
      "4": 3,
      "6": {"1":"1777816629","2":999056000},
      "7": {"1":"1786219536","2":555448000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 98
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR00637179435111415809",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=812538261340&uiFeatures=12,54&versionId=1&sig=ACiVB_xN4iuxAIisqqxx4TkRWtfSvFqRMA&htmlParentId=fletch-render-18118106270650955503&responseCallback=fletchCallback18118106270650955503"
        }
      },
      "4": 3,
      "6": {"1":"1781199747","2":398269000},
      "7": {"1":"1786216713","2":638841000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 59
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR01057393606513393665",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=807662361812&uiFeatures=12,54&versionId=3&sig=ACiVB_wK6Rm-kd3XbNZ5Czvd66uNSznRZw&htmlParentId=fletch-render-7669815738880447931&responseCallback=fletchCallback7669815738880447931"
        }
      },
      "4": 3,
      "6": {"1":"1777816609","2":321930000},
      "7": {"1":"1786215142","2":77924000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 98
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR01201499654898843649",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=810003028537&uiFeatures=12,54&versionId=3&sig=ACiVB_y-pH3aigJbIdqV0xyhkd2eBznYPw&htmlParentId=fletch-render-9658960550767713186&responseCallback=fletchCallback9658960550767713186"
        }
      },
      "4": 3,
      "6": {"1":"1779637102","2":492550000},
      "7": {"1":"1786197548","2":565443000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 77
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR11611700004657299457",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=7724526235&creativeId=802586677672&uiFeatures=12,54&adGroupId=195295639136&assets=%3DH4sIAAAAAAAAAOMS4-Lk2Lf-7ZZGLgFmLk6OHRAmIwD-NT61GAAAAA&sig=ACiVB_z-cYM68VCZ52Zj1MYfuZ_ngUIswQ&htmlParentId=fletch-render-7935518398762602735&responseCallback=fletchCallback7935518398762602735"
        }
      },
      "4": 3,
      "6": {"1":"1774719732","2":544739000},
      "7": {"1":"1786040690","2":935509000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 110
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR04836906389668364289",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=7402882174&creativeId=782684850637&uiFeatures=12,54&versionId=20&assets=%3DH4sIAAAAAAAAAONS5OLk-DSj6_oXDgFGLk6OFddWz_rEIcDMxcmx-sCejo8cAswA9GRHYyMAAAA&sig=ACiVB_zTrpSgPP4eAVbfdQA6kJ7PA8hQSA&htmlParentId=fletch-render-1145268320562524346&responseCallback=fletchCallback1145268320562524346"
        }
      },
      "4": 3,
      "6": {"1":"1762426018","2":339979000},
      "7": {"1":"1785409022","2":398927000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 267
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR13792767934680006657",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=7402882174&creativeId=775582835950&uiFeatures=12,54&versionId=42&assets=%3DH4sIAAAAAAAAAONS5OLkmDu_Yc0XDgFmLk6O5x8uLb3EIcDCxcnRv2rZtE8cAswAZyHE0SMAAAA&sig=ACiVB_xH58ucxKEOhUqtz70-TRnIT36Iwg&htmlParentId=fletch-render-17471692573796575771&responseCallback=fletchCallback17471692573796575771"
        }
      },
      "4": 3,
      "6": {"1":"1758746021","2":787073000},
      "7": {"1":"1785408617","2":269013000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 310
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR01147849302849093633",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=7402882174&creativeId=777983652664&uiFeatures=12,54&versionId=24&assets=%3DH4sIAAAAAAAAAONS5OLkWLtoxcwrHALMXJwcE_f3HP_EIcDIxcmxASoKANdurY0jAAAA&sig=ACiVB_wSK0K5mlLl1do95XESvT7N5j_W-w&htmlParentId=fletch-render-6302016708504765638&responseCallback=fletchCallback6302016708504765638"
        }
      },
      "4": 3,
      "6": {"1":"1759948117","2":49824000},
      "7": {"1":"1785408583","2":483799000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 296
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR05390104662793781249",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=7402882174&creativeId=815905161964&uiFeatures=12,54&versionId=7&assets=%3DH4sIAAAAAAAAAOPi5uLk-Pnowv_Z3AI8AD7h-mgNAAAA&sig=ACiVB_zXtKajoEZBVbLP_gUcmrCDV0B7GA&htmlParentId=fletch-render-14403310216516238826&responseCallback=fletchCallback14403310216516238826"
        }
      },
      "4": 3,
      "6": {"1":"1775572395","2":194056000},
      "7": {"1":"1785242730","2":409352000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 113
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR16141194891798511617",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=779786503136&uiFeatures=12,54&versionId=30&sig=ACiVB_yOYRE4-A_596yDwgB1kUQgoaKi8Q&htmlParentId=fletch-render-95746171435745233&responseCallback=fletchCallback95746171435745233"
        }
      },
      "4": 3,
      "6": {"1":"1760777000","2":113345000},
      "7": {"1":"1784796482","2":981547000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 279
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR04666742834827624449",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=7402882174&creativeId=807364819656&uiFeatures=12,54&versionId=4&assets=%3DH4sIAAAAAAAAAONS5OLk-D1t2fp1XAKMXJwcvdPBTGYuTo6tq09dW8clwAIAtbpgEyMAAAA&sig=ACiVB_yi8A0jA35cfyYJQQu3xgStqFah-w&htmlParentId=fletch-render-7616478120618671133&responseCallback=fletchCallback7616478120618671133"
        }
      },
      "4": 3,
      "6": {"1":"1777627285","2":248690000},
      "7": {"1":"1784575104","2":505680000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 81
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR17732675601489199105",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=793426673212&uiFeatures=12,54&versionId=22&sig=ACiVB_xklG8yRFLbEtczu82QCqMVoZZbmw&htmlParentId=fletch-render-9707328940445522271&responseCallback=fletchCallback9707328940445522271"
        }
      },
      "4": 3,
      "6": {"1":"1768831910","2":869655000},
      "7": {"1":"1783941584","2":755103000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 176
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR10587111847977025537",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=799609409020&uiFeatures=12,54&versionId=12&sig=ACiVB_xkMm8jeVGECCQU5ezpGsgqzCFO4A&htmlParentId=fletch-render-655317413052747553&responseCallback=fletchCallback655317413052747553"
        }
      },
      "4": 3,
      "6": {"1":"1773084538","2":25163000},
      "7": {"1":"1783940951","2":235000000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 125
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR09279216241019453441",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=790283798293&uiFeatures=12,54&versionId=20&assets=%3DH4sIAAAAAAAAAOPi5uLk-Pnv29fTbALMAG5oqwANAAAA&sig=ACiVB_ztNDEzzj4C_yKZiR3Tz3qU16BNlg&htmlParentId=fletch-render-6684981531681311300&responseCallback=fletchCallback6684981531681311300"
        }
      },
      "4": 3,
      "6": {"1":"1767009973","2":125266000},
      "7": {"1":"1783918720","2":422199000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 196
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR11479677357132873729",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=783778937449&uiFeatures=12,54&versionId=27&assets=%3DH4sIAAAAAAAAAONS5OLkOHxl78srrAKMXJwcV2cs_bCITYCZi5NjX9_14wc5BZgBr-rQRSMAAAA&sig=ACiVB_w7cMdwNSXn67ftMwHvDlnlf_7ENQ&htmlParentId=fletch-render-15004639816384586796&responseCallback=fletchCallback15004639816384586796"
        }
      },
      "4": 3,
      "6": {"1":"1762955994","2":537363000},
      "7": {"1":"1783916310","2":9990000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 243
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR18088182895121268737",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=792881355961&uiFeatures=12,54&versionId=24&sig=ACiVB_z782dXObfYSGLalt-AHT7F-ttfkQ&htmlParentId=fletch-render-13889359521511351028&responseCallback=fletchCallback13889359521511351028"
        }
      },
      "4": 3,
      "6": {"1":"1768494088","2":316577000},
      "7": {"1":"1783910966","2":773641000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 179
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR12739256325767168001",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=799574279748&uiFeatures=12,54&versionId=26&assets=%3DH4sIAAAAAAAAAOPi5uLk2Hxx4aQHXAI8AOagDFUNAAAA&sig=ACiVB_yRNPZGghwIrVHwh8yLplTzXj7qiw&htmlParentId=fletch-render-1753896383074015873&responseCallback=fletchCallback1753896383074015873"
        }
      },
      "4": 3,
      "6": {"1":"1773054760","2":313239000},
      "7": {"1":"1783882340","2":792586000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 112
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR10392447025131028481",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=793503659000&uiFeatures=12,54&versionId=1&sig=ACiVB_xB7dcPtit7Zj7HTqlHFmP7AQz_6g&htmlParentId=fletch-render-8221697758077172999&responseCallback=fletchCallback8221697758077172999"
        }
      },
      "4": 3,
      "6": {"1":"1768832373","2":775160000},
      "7": {"1":"1781860775","2":877799000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 148
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR17080711935462211585",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=790687053317&uiFeatures=12,54&versionId=10&sig=ACiVB_w22vyiId73V6EYZQhS2IuColaL_Q&htmlParentId=fletch-render-14555610476053163858&responseCallback=fletchCallback14555610476053163858"
        }
      },
      "4": 3,
      "6": {"1":"1767196793","2":974262000},
      "7": {"1":"1781859712","2":83822000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 168
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR16667396692718387201",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=786061768531&uiFeatures=12,54&versionId=13&sig=ACiVB_xYabiVjI37CTBZNLD1pe4buN3zSA&htmlParentId=fletch-render-13110101627573328449&responseCallback=fletchCallback13110101627573328449"
        }
      },
      "4": 3,
      "6": {"1":"1764340775","2":783029000},
      "7": {"1":"1781658620","2":535356000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 197
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR01675648582494978049",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=793389481653&uiFeatures=12,54&versionId=22&sig=ACiVB_zJzakw5vJRlw9V-yT7HzNmfYj5uA&htmlParentId=fletch-render-4896936378388896932&responseCallback=fletchCallback4896936378388896932"
        }
      },
      "4": 3,
      "6": {"1":"1768832081","2":642307000},
      "7": {"1":"1781635513","2":194914000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 148
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR09654560786000904193",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=7402882174&creativeId=807673036258&uiFeatures=12,54&adGroupId=193962381537&assets=%3DH4sIAAAAAAAAAONS5OLkuLa6b_UXDgFmLk6OFddWz_rEIcDIxcnx4sSL5wc5BJgBYOEQiiMAAAA&sig=ACiVB_xqVx7YK7lb5keKDx0VYa3Ex4tcZw&htmlParentId=fletch-render-16588895572911523369&responseCallback=fletchCallback16588895572911523369"
        }
      },
      "4": 3,
      "6": {"1":"1777894399","2":690873000},
      "7": {"1":"1778830892","2":161683000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 12
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR10499088494700265473",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=775506080838&uiFeatures=12,54&versionId=5&sig=ACiVB_wcouBSbKYSZYQMniilUhiFuwgC5A&htmlParentId=fletch-render-18432516218261182083&responseCallback=fletchCallback18432516218261182083"
        }
      },
      "4": 3,
      "6": {"1":"1758733880","2":471275000},
      "7": {"1":"1778669333","2":7886000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 232
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR18078032813658996737",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=721387172090&uiFeatures=12,54&versionId=14&sig=ACiVB_xPv9mCNOZwf4cP2UebZd_G5FCF6g&htmlParentId=fletch-render-8035465034954863114&responseCallback=fletchCallback8035465034954863114"
        }
      },
      "4": 3,
      "6": {"1":"1660374000"},
      "7": {"1":"1778667528","2":157259000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 1271
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR05088792134086033409",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=786058715881&uiFeatures=12,54&versionId=5&sig=ACiVB_w7p7qkY2SPJ34DLUegWq8IQm8kow&htmlParentId=fletch-render-10283643130645169308&responseCallback=fletchCallback10283643130645169308"
        }
      },
      "4": 3,
      "6": {"1":"1764338175","2":816755000},
      "7": {"1":"1773138917","2":135963000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 103
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR15700500211795230721",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=797868106481&uiFeatures=12,54&versionId=1&sig=ACiVB_wHiRziuZM6gEvHD1tCeME6-XOyHA&htmlParentId=fletch-render-15824506647267327003&responseCallback=fletchCallback15824506647267327003"
        }
      },
      "4": 3,
      "6": {"1":"1771499517","2":767945000},
      "7": {"1":"1773138887","2":596801000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 20
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR03913773589676949505",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=579944139803&uiFeatures=12,54&versionId=10&sig=ACiVB_xtmsCoBt5Y-MBGvcuZYmqXnVIIUw&htmlParentId=fletch-render-16991898586747826665&responseCallback=fletchCallback16991898586747826665"
        }
      },
      "4": 3,
      "6": {"1":"1712230008","2":52726000},
      "7": {"1":"1772792841","2":726962000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 690
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR03892358281443672065",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=782192842529&uiFeatures=12,54&versionId=2&sig=ACiVB_yMLmr_GIFsTpAbTdC8vUPa15Okdw&htmlParentId=fletch-render-8015565219923629448&responseCallback=fletchCallback8015565219923629448"
        }
      },
      "4": 3,
      "6": {"1":"1762183527","2":219273000},
      "7": {"1":"1772792783","2":174162000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 124
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR14977347677585408001",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=775152653700&uiFeatures=12,54&versionId=3&sig=ACiVB_wQ7e6DtEgETz_KyQYDsqbynzSX0w&htmlParentId=fletch-render-6815130642910255095&responseCallback=fletchCallback6815130642910255095"
        }
      },
      "4": 3,
      "6": {"1":"1758541038","2":530876000},
      "7": {"1":"1772792705","2":93091000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 166
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR14269550673661001729",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=782101838125&uiFeatures=12,54&versionId=4&sig=ACiVB_w5O04BieCO0Oi_WMIcgr28tTT2jg&htmlParentId=fletch-render-3146853223021849224&responseCallback=fletchCallback3146853223021849224"
        }
      },
      "4": 3,
      "6": {"1":"1762185268","2":261711000},
      "7": {"1":"1772791958","2":251127000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 124
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR05755509871768240129",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=782192709311&uiFeatures=12,54&versionId=1&sig=ACiVB_w86-RLmW1DtLsC7bhSkvnO6NuMNA&htmlParentId=fletch-render-10652772243994241813&responseCallback=fletchCallback10652772243994241813"
        }
      },
      "4": 3,
      "6": {"1":"1762183291","2":72300000},
      "7": {"1":"1772789028","2":402637000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 124
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR09476870197894709249",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=781616549963&uiFeatures=12,54&versionId=3&sig=ACiVB_yPGQlyXRU7sM8NjGpHNTp0cglxyA&htmlParentId=fletch-render-7340725920071336657&responseCallback=fletchCallback7340725920071336657"
        }
      },
      "4": 3,
      "6": {"1":"1761833240","2":878167000},
      "7": {"1":"1772774377","2":560176000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 126
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR08490395512279662593",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=783872377916&uiFeatures=12,54&versionId=2&sig=ACiVB_xMr3O0Y6ADEzKKDxgg5sacRkKHAg&htmlParentId=fletch-render-12919639250131806901&responseCallback=fletchCallback12919639250131806901"
        }
      },
      "4": 3,
      "6": {"1":"1762955973","2":681819000},
      "7": {"1":"1772486952","2":436570000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 111
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR00162660384413581313",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=797867890073&uiFeatures=12,54&versionId=1&sig=ACiVB_yz0YGdF6EA9yKnhmQoOx9bNy1GKQ&htmlParentId=fletch-render-637757913687140790&responseCallback=fletchCallback637757913687140790"
        }
      },
      "4": 3,
      "6": {"1":"1771521418","2":796701000},
      "7": {"1":"1772483744","2":492407000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 12
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR10203782924432572417",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=793389356322&uiFeatures=12,54&adGroupId=190186578685&sig=ACiVB_yQaUrrvQXfQ0C6wgC4n0A3fKuRhw&htmlParentId=fletch-render-3506074300932779678&responseCallback=fletchCallback3506074300932779678"
        }
      },
      "4": 3,
      "6": {"1":"1768832432","2":304532000},
      "7": {"1":"1772395824","2":5347000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 42
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR06109723890617942017",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=793389362319&uiFeatures=12,54&versionId=2&sig=ACiVB_xG8tIbiBY9nTyagkX5zmv-CG7GWA&htmlParentId=fletch-render-9635754212673352425&responseCallback=fletchCallback9635754212673352425"
        }
      },
      "4": 3,
      "6": {"1":"1768832627","2":803203000},
      "7": {"1":"1771907149","2":957193000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 36
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR02450821872263102465",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=793389480426&uiFeatures=12,54&versionId=3&assets=%3DH4sIAAAAAAAAAOPi5uLkmPq0630DmwAPAJqVLGgNAAAA&sig=ACiVB_xXcHPUn1EZ_5wqwFeg1UHFOtHaJA&htmlParentId=fletch-render-1972332724941333525&responseCallback=fletchCallback1972332724941333525"
        }
      },
      "4": 3,
      "6": {"1":"1768833136","2":116751000},
      "7": {"1":"1771907137","2":519017000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 36
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR05667218564071817217",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=795808976108&uiFeatures=12,54&adGroupId=193436142900&sig=ACiVB_ysdKr2XhDa-UljtqlXqoJc2fEqAw&htmlParentId=fletch-render-13488392967049805403&responseCallback=fletchCallback13488392967049805403"
        }
      },
      "4": 3,
      "6": {"1":"1770130453","2":278422000},
      "7": {"1":"1771584811","2":537353000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 18
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR10007664684653608961",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=790686816611&uiFeatures=12,54&versionId=2&sig=ACiVB_xKaHO1WkFbUONKQsh4CbNo8LRDSQ&htmlParentId=fletch-render-4652528333460000644&responseCallback=fletchCallback4652528333460000644"
        }
      },
      "4": 3,
      "6": {"1":"1767187366","2":840985000},
      "7": {"1":"1771554278","2":486654000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 51
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR16901549814250995713",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=790568390088&uiFeatures=12,54&versionId=1&sig=ACiVB_xznio8KBo6-m6fAyCOVDjdNN5GGA&htmlParentId=fletch-render-7128974308295352514&responseCallback=fletchCallback7128974308295352514"
        }
      },
      "4": 3,
      "6": {"1":"1767187395","2":394028000},
      "7": {"1":"1771554271","2":147667000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 51
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR14601263247177809921",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=721409062079&uiFeatures=12,54&versionId=6&sig=ACiVB_y3TXKo9QsKqwbzw3totmgl328RNQ&htmlParentId=fletch-render-15198734992817570891&responseCallback=fletchCallback15198734992817570891"
        }
      },
      "4": 3,
      "6": {"1":"1665844924","2":969175000},
      "7": {"1":"1766998308","2":368758000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 1153
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR08191327799768776705",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=779786817485&uiFeatures=12,54&versionId=10&assets=%3DH4sIAAAAAAAAAOPi4uLguH110zVDAUYAnJUxlgwAAAA&sig=ACiVB_yBvMn0ObeLJe7Y1_P_-5VHfiRZ1A&htmlParentId=fletch-render-1952533364087241367&responseCallback=fletchCallback1952533364087241367"
        }
      },
      "4": 3,
      "6": {"1":"1760781562","2":705941000},
      "7": {"1":"1766998305","2":375590000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 73
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR13255634376839921665",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=779786815826&uiFeatures=12,54&versionId=1&sig=ACiVB_xiOAQOVWtcy3yg4fbxi3wzTXKxYQ&htmlParentId=fletch-render-11119442898350690294&responseCallback=fletchCallback11119442898350690294"
        }
      },
      "4": 3,
      "6": {"1":"1760783221","2":692080000},
      "7": {"1":"1766998281","2":834429000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 73
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR00024419448878268417",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=775636070876&uiFeatures=12,54&versionId=2&sig=ACiVB_w8EEF0W3rDlepq7YVfe51_HSmanA&htmlParentId=fletch-render-15550700853781978404&responseCallback=fletchCallback15550700853781978404"
        }
      },
      "4": 3,
      "6": {"1":"1758740511","2":822448000},
      "7": {"1":"1766840693","2":955616000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 95
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR14710876275770130433",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=579895255888&uiFeatures=12,54&versionId=3&sig=ACiVB_yGGPvqUP2nYcbM9TOBxmsDwi7eYw&htmlParentId=fletch-render-2054674047945473612&responseCallback=fletchCallback2054674047945473612"
        }
      },
      "4": 3,
      "6": {"1":"1687093165","2":686539000},
      "7": {"1":"1766840648","2":81638000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 897
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR07906741016172953601",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=644130741323&uiFeatures=12,54&versionId=3&assets=%3DH4sIAAAAAAAAAONS4OLk6J33608vowAzkNkCYTJycXBcvbrpmqEAMwDz1besIgAAAA&sig=ACiVB_yZ7zrDA9SO8479dFps08QvlxpDBg&htmlParentId=fletch-render-6824467179720624548&responseCallback=fletchCallback6824467179720624548"
        }
      },
      "4": 3,
      "6": {"1":"1660374000"},
      "7": {"1":"1766806714","2":102564000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 723
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR11164284233411723265",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=775551144610&uiFeatures=12,54&versionId=10&assets=%3DH4sIAAAAAAAAAONS5OLkaDk6q_MrhwAjkPnrQuPaDWwCzEDm1RlLPywCMgEiXsV9IwAAAA&sig=ACiVB_w-3lQ2sSQHSoLlAEJHGqnv4zrklw&htmlParentId=fletch-render-17239469951509144413&responseCallback=fletchCallback17239469951509144413"
        }
      },
      "4": 3,
      "6": {"1":"1758734166","2":377664000},
      "7": {"1":"1764762007","2":72602000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 71
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR08590545851745566721",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=780941625071&uiFeatures=12,54&versionId=8&assets=%3DH4sIAAAAAAAAAOPi5uLkaOmb976BTYAHAL38y8kNAAAA&sig=ACiVB_xy-slSnHO8SN5bnK4YwiWsMgyCnw&htmlParentId=fletch-render-18158490197912892504&responseCallback=fletchCallback18158490197912892504"
        }
      },
      "4": 3,
      "6": {"1":"1687191675","2":904232000},
      "7": {"1":"1764760196","2":822844000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 667
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR02077002255420096513",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=751993264488&uiFeatures=12,54&versionId=13&sig=ACiVB_xtFVB8XOg-JvcvTLa-Kx6exN7ITg&htmlParentId=fletch-render-15512684531168158403&responseCallback=fletchCallback15512684531168158403"
        }
      },
      "4": 3,
      "6": {"1":"1747241019","2":531406000},
      "7": {"1":"1762175202","2":688106000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 171
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR18222367337124724737",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=750455378827&uiFeatures=12,54&versionId=2&sig=ACiVB_ztM4J4teifIpZvw14B_pnumypX8Q&htmlParentId=fletch-render-14519851014806123972&responseCallback=fletchCallback14519851014806123972"
        }
      },
      "4": 3,
      "6": {"1":"1746451599","2":762734000},
      "7": {"1":"1762172626","2":103106000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 179
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR04832784114417401857",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=753646838297&uiFeatures=12,54&versionId=25&assets=%3DH4sIAAAAAAAAAONS5OLkeLD0-58D7AKMQOakD2uf_GQTYAEyz7V_7VjLKsAMAPQ9L1EjAAAA&sig=ACiVB_xruWhQp3C_lRgeCkAEQCV6i2yPKg&htmlParentId=fletch-render-5263136198413633898&responseCallback=fletchCallback5263136198413633898"
        }
      },
      "4": 3,
      "6": {"1":"1747828043","2":360775000},
      "7": {"1":"1759389909","2":985796000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 133
    },
    {
      "1": "AR12707166228507000833",
      "2": "CR04215394041770016769",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=1664511468&creativeId=751793522116&uiFeatures=12,54&versionId=34&assets=%3DH4sIAAAAAAAAAONS5OLkWLH249UD7AKMQOajzz_7V7ILMAOZqzbufD4PyAQAUf8seCMAAAA&sig=ACiVB_yxnxG6Ipglj6mE61iGZ6AZi7_tpQ&htmlParentId=fletch-render-9882045801282516491&responseCallback=fletchCallback9882045801282516491"
        }
      },
      "4": 3,
      "6": {"1":"1747153797","2":862223000},
      "7": {"1":"1759389832","2":618142000},
      "12": "MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED",
      "13": 142
    }
  ],
  "4": "100",
  "5": "200"
}
```

### research/free-gb-offer-analysis/atc-creatives-MindByte-2.json

```json
{
  "1": [
    {
      "1": "AR02261580089873399809",
      "2": "CR16750988988365406209",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=7901563198&creativeId=784740685660&uiFeatures=12,54&versionId=14&assets=%3DH4sIAAAAAAAAAOPi5uLk2N8_9UYLpwALAC90OEQNAAAA&sig=ACiVB_zOoiQ-njD3OeASpxNspDcuQsfu0g&htmlParentId=fletch-render-2269895311162747243&responseCallback=fletchCallback2269895311162747243"
        }
      },
      "4": 3,
      "6": {"1":"1763481923","2":263771000},
      "7": {"1":"1772947616","2":624880000},
      "12": "MindByte Studios LLC-FZ",
      "13": 102
    },
    {
      "1": "AR02261580089873399809",
      "2": "CR05695512571667283969",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=9813971647&creativeId=793030192001&uiFeatures=12,54&versionId=1&assets=%3DH4sIAAAAAAAAAONS5OLkuPvvzJ6PHALMQOYtBHPmnW8n-jgFGAHif4QUIwAAAA&sig=ACiVB_xK5LbR2SYSvENekVJUrsabJ2lj_g&htmlParentId=fletch-render-17970042342331530393&responseCallback=fletchCallback17970042342331530393"
        }
      },
      "4": 3,
      "6": {"1":"1768509632","2":935185000},
      "7": {"1":"1771084163","2":271928000},
      "12": "MindByte Studios LLC-FZ",
      "13": 31
    },
    {
      "1": "AR02261580089873399809",
      "2": "CR10436518749707173889",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=9813971647&creativeId=792951862705&uiFeatures=12,54&versionId=2&assets=%3DH4sIAAAAAAAAAOMS4-Lk2LTif_NHDgFGIPPNpKa9WzgFmAH5Kou3GAAAAA&sig=ACiVB_yFJlGZzqbopw90UeXrkn1qAxaBOA&htmlParentId=fletch-render-12694188093803018147&responseCallback=fletchCallback12694188093803018147"
        }
      },
      "4": 3,
      "6": {"1":"1768512570","2":662103000},
      "7": {"1":"1771084134","2":307109000},
      "12": "MindByte Studios LLC-FZ",
      "13": 31
    },
    {
      "1": "AR02261580089873399809",
      "2": "CR12010749169930076161",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=9813971647&creativeId=781980458803&uiFeatures=12,54&versionId=8&assets=%3DH4sIAAAAAAAAAONS5OLk2LHif_NHDgFmIHMlhMkIZO6DigIAeQLRGyMAAAA&sig=ACiVB_wkEmJ6ds0f5XOEZh_CQyb9NcW6ww&htmlParentId=fletch-render-5918653129573131582&responseCallback=fletchCallback5918653129573131582"
        }
      },
      "4": 3,
      "6": {"1":"1762259274","2":312317000},
      "7": {"1":"1770200800","2":980878000},
      "12": "MindByte Studios LLC-FZ",
      "13": 93
    },
    {
      "1": "AR02261580089873399809",
      "2": "CR06079877896590065665",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=9813971647&creativeId=782296193988&uiFeatures=12,54&versionId=6&assets=%3DH4sIAAAAAAAAAOMS4-Lk2Dnj2bfPHALMQOYSCJMRAMHAvfIYAAAA&sig=ACiVB_ze-jDCgkYWx-6dJYti3FhBmIEhGg&htmlParentId=fletch-render-11651497425025923535&responseCallback=fletchCallback11651497425025923535"
        }
      },
      "4": 3,
      "6": {"1":"1762286583","2":910996000},
      "7": {"1":"1770200716","2":733608000},
      "12": "MindByte Studios LLC-FZ",
      "13": 93
    },
    {
      "1": "AR02261580089873399809",
      "2": "CR12160071645075079169",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=9813971647&creativeId=782005479967&uiFeatures=12,54&versionId=6&assets=%3DH4sIAAAAAAAAAOMS4-LkuPvvzJ6PHALMQOYVCJMRAFJ1Ya0YAAAA&sig=ACiVB_z5rhJzDmIgL8Rwy85P1TIXLu_dWQ&htmlParentId=fletch-render-11400551598130273906&responseCallback=fletchCallback11400551598130273906"
        }
      },
      "4": 3,
      "6": {"1":"1762259273","2":679620000},
      "7": {"1":"1770199127","2":783529000},
      "12": "MindByte Studios LLC-FZ",
      "13": 93
    },
    {
      "1": "AR02261580089873399809",
      "2": "CR13950947388303605761",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=9813971647&creativeId=782416927429&uiFeatures=12,54&versionId=4&assets=%3DH4sIAAAAAAAAAONS5OLkOLjif_NHDgFmIPN1z7t_nzkEeIDMlRBRRgDPguIRIwAAAA&sig=ACiVB_xWPrPgKW2UaVHwbOgdYwhDH8zdPQ&htmlParentId=fletch-render-2573152001439877860&responseCallback=fletchCallback2573152001439877860"
        }
      },
      "4": 3,
      "6": {"1":"1762307245","2":352527000},
      "7": {"1":"1769630309","2":188095000},
      "12": "MindByte Studios LLC-FZ",
      "13": 86
    },
    {
      "1": "AR02261580089873399809",
      "2": "CR09627266071266328577",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=9813971647&creativeId=782328618946&uiFeatures=12,54&versionId=5&assets=%3DH4sIAAAAAAAAAONS5OLk2Dzj2bfPHALMQOZaCJMRyNwGFQUA_mBlXyMAAAA&sig=ACiVB_zsuNlR0lP64jfLR8XixxUfongNkQ&htmlParentId=fletch-render-14991283142124030918&responseCallback=fletchCallback14991283142124030918"
        }
      },
      "4": 3,
      "6": {"1":"1762306792","2":765496000},
      "7": {"1":"1769629840","2":782036000},
      "12": "MindByte Studios LLC-FZ",
      "13": 86
    },
    {
      "1": "AR02261580089873399809",
      "2": "CR02219633308956884993",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=9813971647&creativeId=782327170777&uiFeatures=12,54&adGroupId=189661459842&assets=%3DH4sIAAAAAAAAAONS5OLkOPfvzJ6PHAKMQOYzCJMZyLwLZQIA39WGmCMAAAA&sig=ACiVB_zBEnh0XeSNsmLAxvRIDvhHTbCMPQ&htmlParentId=fletch-render-10744414439291571352&responseCallback=fletchCallback10744414439291571352"
        }
      },
      "4": 3,
      "6": {"1":"1762308360","2":325059000},
      "7": {"1":"1769628915","2":904231000},
      "12": "MindByte Studios LLC-FZ",
      "13": 86
    },
    {
      "1": "AR02261580089873399809",
      "2": "CR16803126455365009409",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=9813971647&creativeId=784440140799&uiFeatures=12,54&adGroupId=189546437675&assets=%3DH4sIAAAAAAAAAONS5OLkWDLj2bfPHAKMQOZmCJMZyNwJZQIAgocZxSMAAAA&sig=ACiVB_zPfOVQIG5pIRZ2iuzo_tPYxqcTUg&htmlParentId=fletch-render-15085135677312354692&responseCallback=fletchCallback15085135677312354692"
        }
      },
      "4": 3,
      "6": {"1":"1763400186","2":788880000},
      "7": {"1":"1769557618","2":581211000},
      "12": "MindByte Studios LLC-FZ",
      "13": 72
    },
    {
      "1": "AR02261580089873399809",
      "2": "CR01304065303583391745",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=9813971647&creativeId=784440140811&uiFeatures=12,54&adGroupId=189546437755&assets=%3DH4sIAAAAAAAAAONS5OLk2Lfif_NHDgFmIHMlhMkIZO6AigIAzkH8VCMAAAA&sig=ACiVB_zzwqgsoH6klebcEOROTVRzCwqMvg&htmlParentId=fletch-render-4242317283289386693&responseCallback=fletchCallback4242317283289386693"
        }
      },
      "4": 3,
      "6": {"1":"1763400593","2":244122000},
      "7": {"1":"1769555071","2":870675000},
      "12": "MindByte Studios LLC-FZ",
      "13": 72
    },
    {
      "1": "AR02261580089873399809",
      "2": "CR02737125878273146881",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=9813971647&creativeId=784474479103&uiFeatures=12,54&adGroupId=189546437715&assets=%3DH4sIAAAAAAAAAONS5OLkOP3vzJ6PHAKMQOZdCJMZyLwFZQIA3GWRwCMAAAA&sig=ACiVB_zTsvwc0bLQxnoEyGI-0DnPm-1lWQ&htmlParentId=fletch-render-8628957386010328923&responseCallback=fletchCallback8628957386010328923"
        }
      },
      "4": 3,
      "6": {"1":"1763400295","2":570519000},
      "7": {"1":"1769532785","2":51197000},
      "12": "MindByte Studios LLC-FZ",
      "13": 72
    },
    {
      "1": "AR02261580089873399809",
      "2": "CR01169237140471545857",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=7901563198&creativeId=787849348042&uiFeatures=12,54&versionId=1&assets=%3DH4sIAAAAAAAAAONS5OLk6Fz_uq-VU4AZyGxDMH-tAzMZAWgyFUsjAAAA&sig=ACiVB_y0ZW5wh3Pgv3HNTF-8NGA1-Ek9dw&htmlParentId=fletch-render-1701922114999153490&responseCallback=fletchCallback1701922114999153490"
        }
      },
      "4": 3,
      "6": {"1":"1765448287","2":693805000},
      "7": {"1":"1769261239","2":164751000},
      "12": "MindByte Studios LLC-FZ",
      "13": 45
    },
    {
      "1": "AR02261580089873399809",
      "2": "CR02965047491885531137",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=7901563198&creativeId=787816536930&uiFeatures=12,54&versionId=1&assets=%3DH4sIAAAAAAAAAONS5OLk-LLudV8rpwAjkNm2HsxkBjIboEwAAxwNzCMAAAA&sig=ACiVB_w6mDj41mLpkbaQp7I5YNLVVOc_rA&htmlParentId=fletch-render-14010524191332621040&responseCallback=fletchCallback14010524191332621040"
        }
      },
      "4": 3,
      "6": {"1":"1765450010","2":59279000},
      "7": {"1":"1769241443","2":983151000},
      "12": "MindByte Studios LLC-FZ",
      "13": 43
    },
    {
      "1": "AR02261580089873399809",
      "2": "CR06039753719405346817",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=7901563198&creativeId=790514488796&uiFeatures=12,54&versionId=1&assets=%3DH4sIAAAAAAAAAOPi5uLkmH923dblnAI8AFm-md0NAAAA&sig=ACiVB_wqTX_734_k28-S706l4rZj3vmY_A&htmlParentId=fletch-render-11516836247672285712&responseCallback=fletchCallback11516836247672285712"
        }
      },
      "4": 3,
      "6": {"1":"1766756575","2":618501000},
      "7": {"1":"1767666815","2":862735000},
      "12": "MindByte Studios LLC-FZ",
      "13": 11
    },
    {
      "1": "AR02261580089873399809",
      "2": "CR11689497461709078529",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=7901563198&creativeId=789471577677&uiFeatures=12,54&versionId=1&assets=%3DH4sIAAAAAAAAAONS5OLk6Fz_uq-VU4AZyPy-DsxkBDIboKIAuNy5kiMAAAA&sig=ACiVB_z5jbzSHhUj8xj95ql2wnIIZAshNQ&htmlParentId=fletch-render-16004210680319673414&responseCallback=fletchCallback16004210680319673414"
        }
      },
      "4": 3,
      "6": {"1":"1766499227","2":171458000},
      "7": {"1":"1767655414","2":834307000},
      "12": "MindByte Studios LLC-FZ",
      "13": 14
    },
    {
      "1": "AR02261580089873399809",
      "2": "CR01330902458272055297",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=9813971647&creativeId=782328589609&uiFeatures=12,54&versionId=1&assets=%3DH4sIAAAAAAAAAONS5OLk2Dzj2bfPHALMQOYqCJMRyNwDFQUAffebhCMAAAA&sig=ACiVB_wNPzKHetUG1LEGIsmBG0v577uUsw&htmlParentId=fletch-render-8373564354823461356&responseCallback=fletchCallback8373564354823461356"
        }
      },
      "4": 3,
      "6": {"1":"1762306360","2":217180000},
      "7": {"1":"1764578493","2":339833000},
      "12": "MindByte Studios LLC-FZ",
      "13": 9
    },
    {
      "1": "AR02261580089873399809",
      "2": "CR14994491675202551809",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=9813971647&creativeId=783177629744&uiFeatures=12,54&adGroupId=185596903582&assets=%3DH4sIAAAAAAAAAONS5OLk2Lfif_NHDgFmIHMrhMkIZO6GigIAQG34KSMAAAA&sig=ACiVB_zXvElMt_JnJUNAL6QuDCLDDs4yhQ&htmlParentId=fletch-render-12093643740332181180&responseCallback=fletchCallback12093643740332181180"
        }
      },
      "4": 3,
      "6": {"1":"1762615857","2":727591000},
      "7": {"1":"1763149202","2":409132000},
      "12": "MindByte Studios LLC-FZ",
      "13": 7
    },
    {
      "1": "AR02261580089873399809",
      "2": "CR00437907701494710273",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=9813971647&creativeId=783055320123&uiFeatures=12,54&adGroupId=188440801836&assets=%3DH4sIAAAAAAAAAONS5OLk2D_j2bfPHALMQOYeBLNl1p47PzgEGAEiaBfxIwAAAA&sig=ACiVB_wHUD9dzE_i3sMojWyWmi3DgkQr_w&htmlParentId=fletch-render-14471739553389828353&responseCallback=fletchCallback14471739553389828353"
        }
      },
      "4": 3,
      "6": {"1":"1762612945","2":571014000},
      "7": {"1":"1763146053","2":923226000},
      "12": "MindByte Studios LLC-FZ",
      "13": 7
    }
  ],
  "4": "200",
  "5": "300"
}
```

### research/free-gb-offer-analysis/atc-creatives-MindByte2-0.json

```json
{
  "1": [
    {
      "1": "AR07944279940873060353",
      "2": "CR11995383632370860033",
      "3": {
        "1": {
          "4": "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity-transparency&obfuscatedCustomerId=6990982166&creativeId=778469569167&uiFeatures=12,54&versionId=1&assets=%3DH4sIAAAAAAAAAONS5OLk2HD6ycnrHALMQGbDpZdLgUxGIHNv86H7IFEA2o1XwSMAAAA&sig=ACiVB_zOWH2TQCfzEqT3SKO3BPinx8QCvw&htmlParentId=fletch-render-3842903271136551919&responseCallback=fletchCallback3842903271136551919"
        }
      },
      "4": 3,
      "6": {"1":"1760202907","2":570821000},
      "7": {"1":"1760354723","2":246782000},
      "12": "MindByte Studios L.L.C-FZ",
      "13": 3
    }
  ],
  "4": "1",
  "5": "1"
}
```

### research/free-gb-offer-analysis/atc-suggest.json

```json
[
  {
    "term": "Fazcon",
    "raw": "{\"1\":[{\"2\":{\"1\":\"fazcontato.com.br\"}},{\"2\":{\"1\":\"latfazconstrucao.com.br\"}},{\"2\":{\"1\":\"martinfazconcreto.com.br\"}},{\"2\":{\"1\":\"fazconstrucaoaseco.com.br\"}},{\"2\":{\"1\":\"contabilidadefazcon.com.br\"}}],\"3\":\"Cgr/wEA6AAAAAAAAEhCVGVxlHOr1qPbFKysAAAAAGgn8+Gm/+MAKhyU\\u003d\"}"
  },
  {"term":"Utility Forge","raw":"{}"},
  {
    "term": "MindByte",
    "raw": "{\"1\":[{\"1\":{\"1\":\"MindByte Ab Oy\",\"2\":\"AR16599630861930856449\",\"3\":\"SK\",\"4\":{\"2\":{\"1\":\"4\",\"2\":\"4\"}}}},{\"1\":{\"1\":\"Mindbyte Labs Ltd\",\"2\":\"AR13223271514796720129\",\"3\":\"GB\",\"4\":{\"2\":{\"1\":\"8\",\"2\":\"8\"}}}},{\"1\":{\"1\":\"MindByte Studios LLC-FZ\",\"2\":\"AR02261580089873399809\",\"3\":\"AE\",\"4\":{\"2\":{\"1\":\"200\",\"2\":\"300\"}}}},{\"1\":{\"1\":\"MindByte Studios L.L.C-FZ\",\"2\":\"AR07944279940873060353\",\"3\":\"AE\",\"4\":{\"2\":{\"1\":\"1\",\"2\":\"1\"}}}},{\"2\":{\"1\":\"mindbyte.com\"}},{\"2\":{\"1\":\"hindimindbytes.online\"}}],\"3\":\"Cgr/wEA1AAAAAAAAEhCgdsfHg5PLOOmN2GwAAAAAGgn8+HQV+F9a6ao\\u003d\"}"
  },
  {
    "term": "Fuzon",
    "raw": "{\"1\":[{\"1\":{\"1\":\"Andreia Fuzon\",\"2\":\"AR16743659162818314241\",\"3\":\"US\",\"4\":{\"2\":{\"1\":\"4\",\"2\":\"4\"}}}},{\"1\":{\"1\":\"FUZON APS PTY LIMITED\",\"2\":\"AR02361885786896334849\",\"3\":\"AU\",\"4\":{\"2\":{\"1\":\"100\",\"2\":\"200\"}}}},{\"1\":{\"1\":\"ANDREIA CERBELO FUZON\",\"2\":\"AR09710855575184605185\",\"3\":\"US\",\"4\":{\"2\":{\"1\":\"5\",\"2\":\"5\"}}}},{\"2\":{\"1\":\"fuzonmedia.com\"}},{\"2\":{\"1\":\"kungfuzone.co.uk\"}},{\"2\":{\"1\":\"andreiafuzon.com\"}},{\"2\":{\"1\":\"michifuzonline.com\"}}],\"3\":\"Cgr/wEAyAAAAAAAAEhBzYRsqD8zIzjytfY4AAAAAGgj8+Gnk93O/XQ\\u003d\\u003d\"}"
  },
  {
    "term": "CloudGate",
    "raw": "{\"1\":[{\"2\":{\"1\":\"cloudgate.jp\"}},{\"2\":{\"1\":\"cloudgateway.in\"}},{\"2\":{\"1\":\"cloudgateway.co.uk\"}},{\"2\":{\"1\":\"cloudgatewaysq.com\"}},{\"2\":{\"1\":\"cloudgatequartet.com\"}}],\"3\":\"Cgr/wEA0AAAAAAAAEhBUb4hpKGU8RMQUlGkAAAAAGgn8+GnB+H3OL08\\u003d\"}"
  },
  {"term":"Daily Utility Apps","raw":"{}"},
  {
    "term": "MAPIDIRECTIONS",
    "raw": "{\"1\":[{\"1\":{\"1\":\"MAPIDIRECTIONS STUDIOS (PRIVATE) LIMITED\",\"2\":\"AR12707166228507000833\",\"3\":\"PK\",\"4\":{\"2\":{\"1\":\"200\",\"2\":\"300\"}}}}]}"
  },
  {"term":"Appseen","raw":"{}"},
  {"term":"Auzi Apps","raw":"{}"},
  {
    "term": "Golden Associate",
    "raw": "{\"1\":[{\"1\":{\"1\":\"Golden Gate Vision \\u0026 Associates\",\"2\":\"AR17296852075824545793\",\"3\":\"US\",\"4\":{\"2\":{\"1\":\"1\",\"2\":\"1\"}}}},{\"1\":{\"1\":\"101 S. GOLDEN MALL ASSOCIATES, LLC (200325310235)\",\"2\":\"AR11115046410502799361\",\"3\":\"US\",\"4\":{\"2\":{\"1\":\"2\",\"2\":\"2\"}}}}]}"
  },
  {"term":"Nova Apps Studios","raw":"{}"}
]
```

### research/free-gb-offer-analysis/live.json

```json
[
  {
    "label": "CloudGate",
    "id": "com.cloudgate.cloudstorage",
    "title": "Cloudgate: Cloud Storage Drive",
    "bracket": "100,000+",
    "installs": 441509,
    "rating": "3.9000000953674316",
    "ratings": "1893",
    "video": false
  },
  {
    "label": "Fazcon",
    "id": "com.fazconapps.backup.restore.data",
    "title": "Cloud Storage: Cloud Drive App",
    "bracket": "5,000,000+",
    "installs": 6121989,
    "rating": "4.072681903839111",
    "ratings": "14689",
    "video": false
  },
  {
    "label": "ANZ",
    "id": "com.filestorage.cloudbackup.clouddrive.photosbackup.storagespace",
    "title": "ANZ Cloud Drive: Cloud Storage",
    "bracket": "5,000+",
    "installs": 5507,
    "rating": "",
    "ratings": "",
    "video": false
  },
  {
    "label": "Mapi CloudBackup",
    "id": "com.backup.restore.clould.backup.freecloud.storage",
    "title": "Cloud Backup : Cloud Storage",
    "bracket": "100,000+",
    "installs": 454083,
    "rating": "4.269999980926514",
    "ratings": "1466",
    "video": false
  },
  {
    "label": "Fuzon",
    "id": "com.cloudstorageapp.cloudbackup.storagespace.databackup",
    "title": "Cloud Storage & Cloud Drive",
    "bracket": "500,000+",
    "installs": 543645,
    "rating": "4.050000190734863",
    "ratings": "1252",
    "video": false
  },
  {
    "label": "Daily Utility",
    "id": "com.backup.and.restore.all.apps.photo.backup",
    "title": "Cloud Storage Backup & Drive",
    "bracket": "1,000,000+",
    "installs": 3772147,
    "rating": "4.070000171661377",
    "ratings": "10017",
    "video": false
  },
  {
    "label": "MindByte",
    "id": "com.cloudstorage.backupapp.storagespace.mycloud.clouldbackup",
    "title": "Cloud Storage Drive Backup app",
    "bracket": "500,000+",
    "installs": 655989,
    "rating": "3.6666667461395264",
    "ratings": "1937",
    "video": false
  },
  {
    "label": "DataHatch",
    "id": "com.datahatch.cloud.storage.drive.data.backup",
    "title": "Cloud Storage Drive: DataHatch",
    "bracket": "10,000+",
    "installs": 19649,
    "rating": "3.555555582046509",
    "ratings": "77",
    "video": false
  },
  {
    "label": "Utility Forge",
    "id": "com.cloud.storage.extrastorage.gbsfreespace",
    "title": "Cloud Storage: Drive Backup",
    "bracket": "100,000+",
    "installs": 215408,
    "rating": "4.336633682250977",
    "ratings": "2811",
    "video": false
  },
  {
    "label": "Golden",
    "id": "com.cloudstorage.cloudbackup.storagespaceapp",
    "title": "Cloud Storage App Drive Backup",
    "bracket": "1,000+",
    "installs": 3606,
    "rating": "",
    "ratings": "",
    "video": false
  },
  {
    "label": "Nova",
    "id": "com.securebackup.cloudstorage.drivebackup.filestorage",
    "title": "Nova Cloud: Storage & Backup",
    "bracket": "5,000+",
    "installs": 8732,
    "rating": "",
    "ratings": "",
    "video": false
  },
  {
    "label": "YOU CloudVault",
    "id": "com.softwarealliance.cloudvault",
    "title": "Cloud Storage: Secure Vault",
    "bracket": "500+",
    "installs": 600,
    "rating": "",
    "ratings": "",
    "video": false
  }
]
```

### research/free-gb-offer-analysis/ranks.json

```json
[
  {
    "fam": "head",
    "q": "cloud storage",
    "depth": 16,
    "hits": "",
    "top5": "com.dropbox.android | com.google.android.apps.cloudconsole | com.microsoft.skydrive | com.google.android.apps.docs | com.google.android.apps.subscriptions.red"
  },
  {
    "fam": "head",
    "q": "cloud backup",
    "depth": 15,
    "hits": "",
    "top5": "cloud.storage.backup.restore | com.dropbox.android | com.microsoft.skydrive | com.google.android.apps.subscriptions.red | com.google.android.apps.cloudconsole"
  },
  {
    "fam": "head",
    "q": "cloud drive",
    "depth": 14,
    "hits": "",
    "top5": "com.microsoft.skydrive | com.dropbox.android | ru.mail.cloud | com.google.android.apps.docs | com.totaldrive.my.ts"
  },
  {
    "fam": "head",
    "q": "cloud storage app",
    "depth": 14,
    "hits": "",
    "top5": "com.dropbox.android | com.microsoft.skydrive | com.google.android.apps.docs | com.google.android.apps.subscriptions.red | com.google.android.apps.cloudconsole"
  },
  {
    "fam": "head",
    "q": "backup and restore",
    "depth": 20,
    "hits": "",
    "top5": "com.riteshsahu.SMSBackupRestore | com.cloud.backup.restore.data | com.riteshsahu.SMSBackupRestorePro | backup.restore.contacts.sms | com.katyayini.appbackup.pro"
  },
  {
    "fam": "head",
    "q": "cloud storage backup and restore",
    "depth": 20,
    "hits": "Fazcon#8; DailyUtil#14",
    "top5": "com.cloud.backup.restore.data | cloud.storage.backup.restore | com.infinite.cloudbackup | com.dropbox.android | com.mycloud.storage.photo.video.space"
  },
  {
    "fam": "head",
    "q": "cloud storage drive backup",
    "depth": 9,
    "hits": "MindByte#3; UtilForge#1",
    "top5": "com.cloud.storage.extrastorage.gbsfreespace | com.dropbox.android | com.cloudstorage.backupapp.storagespace.mycloud.clouldbackup | me.proton.android.drive | com.microsoft.skydrive"
  },
  {
    "fam": "head",
    "q": "photo backup",
    "depth": 15,
    "hits": "",
    "top5": "com.google.android.apps.photos | ru.mail.cloud | com.google.android.apps.photosgo | com.dropbox.android | com.amazon.clouddrive.photos"
  },
  {
    "fam": "offer",
    "q": "free cloud storage",
    "depth": 13,
    "hits": "",
    "top5": "com.dropbox.android | com.dubox.drive | com.microsoft.skydrive | mega.privacy.android.app | com.pcloud.pcloud"
  },
  {
    "fam": "offer",
    "q": "cloud storage free",
    "depth": 17,
    "hits": "",
    "top5": "com.dropbox.android | com.dubox.drive | com.microsoft.skydrive | mega.privacy.android.app | com.s3.drive.file.explorer.storage.cloud.manager"
  },
  {
    "fam": "offer",
    "q": "free cloud storage for android",
    "depth": 17,
    "hits": "",
    "top5": "com.dropbox.android | com.google.android.apps.cloudconsole | com.dubox.drive | com.microsoft.skydrive | com.google.android.apps.docs"
  },
  {
    "fam": "offer",
    "q": "100gb cloud storage",
    "depth": 14,
    "hits": "Fazcon#8; Fuzon#6",
    "top5": "com.dropbox.android | com.mobisystems.mobidrive | mega.privacy.android.app | com.cloudstorage.cloudbackup.drivebackup | com.dubox.drive"
  },
  {
    "fam": "offer",
    "q": "100gb free cloud storage",
    "depth": 10,
    "hits": "Fazcon#4; Fuzon#7",
    "top5": "com.dropbox.android | com.mobisystems.mobidrive | com.cloudstorage.cloudbackup.drivebackup | com.fazconapps.backup.restore.data | com.clouddrive.storage.cloudbackup.restore.datatransfer.smartshare"
  },
  {
    "fam": "offer",
    "q": "1tb cloud storage",
    "depth": 14,
    "hits": "",
    "top5": "com.dubox.drive | com.dropbox.android | com.s3.drive.file.explorer.storage.cloud.manager | com.microsoft.skydrive | com.mobisystems.mobidrive"
  },
  {
    "fam": "offer",
    "q": "1tb free cloud storage",
    "depth": 12,
    "hits": "Fuzon#9",
    "top5": "com.dubox.drive | com.dropbox.android | com.microsoft.skydrive | com.s3.drive.file.explorer.storage.cloud.manager | me.proton.android.drive"
  },
  {
    "fam": "offer",
    "q": "free storage",
    "depth": 15,
    "hits": "",
    "top5": "com.dropbox.android | com.dubox.drive | com.google.android.apps.subscriptions.red | com.google.android.apps.docs | com.microsoft.skydrive"
  },
  {
    "fam": "offer",
    "q": "unlimited cloud storage",
    "depth": 20,
    "hits": "",
    "top5": "com.kratosle.unlim | com.dropbox.android | com.pcloud.pcloud | me.proton.android.drive | com.dubox.drive"
  },
  {
    "fam": "offer",
    "q": "unlimited storage",
    "depth": 13,
    "hits": "Fuzon#10",
    "top5": "com.kratosle.unlim | com.dropbox.android | com.metamare.cloudifyplus | com.pcloud.pcloud | me.proton.android.drive"
  },
  {
    "fam": "offer",
    "q": "extra storage",
    "depth": 20,
    "hits": "",
    "top5": "com.extraspace.aspen | com.dropbox.android | com.dubox.drive | com.publicstorage.officialapp | com.catchy.tools.storagespace.nb"
  },
  {
    "fam": "offer",
    "q": "cloud space free",
    "depth": 13,
    "hits": "Fuzon#8",
    "top5": "com.dropbox.android | com.dubox.drive | com.pcloud.pcloud | com.s3.drive.file.explorer.storage.cloud.manager | com.microsoft.skydrive"
  },
  {
    "fam": "offer",
    "q": "more storage",
    "depth": 20,
    "hits": "Fuzon#17",
    "top5": "com.google.android.apps.subscriptions.red | com.dubox.drive | com.dropbox.android | com.avg.cleaner | com.extraspace.aspen"
  },
  {
    "fam": "offer",
    "q": "free 1000gb cloud storage",
    "depth": 13,
    "hits": "Fazcon#6; Fuzon#7",
    "top5": "com.dubox.drive | com.tt.cloudstorage.databackup | com.dropbox.android | com.microsoft.skydrive | com.cloudstorage.cloudbackup.drivebackup"
  }
]
```

### research/free-gb-offer-analysis/revstats.json

```json
[
  {
    "app": "CloudGate",
    "n": 571,
    "substantive": 505,
    "avg": 4.38,
    "low12": 14,
    "offer": 8.8,
    "offerOfSubst": 9.9,
    "offerPos": 38,
    "offerNeg": 11,
    "paywall": 2.8,
    "bait": 1.9,
    "ads": 4.6,
    "lowDueOfferPay": 33.8
  },
  {
    "app": "Fazcon",
    "n": 600,
    "substantive": 415,
    "avg": 4.29,
    "low12": 14.7,
    "offer": 5.8,
    "offerOfSubst": 8.2,
    "offerPos": 25,
    "offerNeg": 9,
    "paywall": 3.7,
    "bait": 1.7,
    "ads": 4.2,
    "lowDueOfferPay": 28.4
  },
  {
    "app": "Mapi",
    "n": 600,
    "substantive": 513,
    "avg": 4.24,
    "low12": 18.3,
    "offer": 7.3,
    "offerOfSubst": 8.4,
    "offerPos": 37,
    "offerNeg": 7,
    "paywall": 0.7,
    "bait": 0.7,
    "ads": 0.3,
    "lowDueOfferPay": 6.4
  },
  {
    "app": "Fuzon",
    "n": 127,
    "substantive": 69,
    "avg": 3.72,
    "low12": 29.1,
    "offer": 9.4,
    "offerOfSubst": 17.4,
    "offerPos": 3,
    "offerNeg": 8,
    "paywall": 6.3,
    "bait": 2.4,
    "ads": 4.7,
    "lowDueOfferPay": 35.1
  },
  {
    "app": "DailyUtility",
    "n": 600,
    "substantive": 402,
    "avg": 4.04,
    "low12": 22.5,
    "offer": 3.3,
    "offerOfSubst": 4.7,
    "offerPos": 10,
    "offerNeg": 8,
    "paywall": 3.8,
    "bait": 2.5,
    "ads": 1.8,
    "lowDueOfferPay": 25.9
  },
  {
    "app": "MindByte",
    "n": 304,
    "substantive": 220,
    "avg": 3.98,
    "low12": 23.4,
    "offer": 6.9,
    "offerOfSubst": 9.1,
    "offerPos": 14,
    "offerNeg": 7,
    "paywall": 7.2,
    "bait": 3,
    "ads": 2,
    "lowDueOfferPay": 29.6
  },
  {
    "app": "DataHatch",
    "n": 8,
    "substantive": 4,
    "avg": 4.75,
    "low12": 0,
    "offer": 12.5,
    "offerOfSubst": 25,
    "offerPos": 1,
    "offerNeg": 0,
    "paywall": 0,
    "bait": 0,
    "ads": 12.5,
    "lowDueOfferPay": 0
  },
  {
    "app": "UtilityForge",
    "n": 96,
    "substantive": 34,
    "avg": 4.22,
    "low12": 15.6,
    "offer": 3.1,
    "offerOfSubst": 5.9,
    "offerPos": 1,
    "offerNeg": 2,
    "paywall": 2.1,
    "bait": 1,
    "ads": 4.2,
    "lowDueOfferPay": 26.7
  },
  {
    "app": "Golden",
    "n": 1,
    "substantive": 0,
    "avg": 5,
    "low12": 0,
    "offer": 0,
    "offerOfSubst": 0,
    "offerPos": 0,
    "offerNeg": 0,
    "paywall": 0,
    "bait": 0,
    "ads": 0,
    "lowDueOfferPay": 0
  },
  {
    "app": "Nova",
    "n": 1,
    "substantive": 1,
    "avg": 5,
    "low12": 0,
    "offer": 0,
    "offerOfSubst": 0,
    "offerPos": 0,
    "offerNeg": 0,
    "paywall": 0,
    "bait": 0,
    "ads": 0,
    "lowDueOfferPay": 0
  },
  {
    "app": "ALL",
    "n": 2908,
    "substantive": 2163,
    "avg": 4.19,
    "low12": 18.4,
    "offer": 6.4,
    "offerOfSubst": 8.4,
    "offerPos": 129,
    "offerNeg": 52,
    "paywall": 3.3,
    "bait": 1.8,
    "ads": 2.8,
    "lowDueOfferPay": 24.6
  }
]
```

### research/free-gb-offer-analysis/rv-B.txt

```text
)]}'

[["er",null,null,null,null,400,null,null,null,3],["di",3],["af.httprm",3,"3075720243359412912",37]]
```

### research/free-gb-offer-analysis/rv-test.txt

```text
)]}'

[["er",null,null,null,null,400,null,null,null,3],["di",4],["af.httprm",3,"677323388311816813",36]]
```

### research/free-gb-offer-analysis/sensortower.json

```json
[
  {
    "name": "Cloud Backup : Cloud Storage",
    "pub": "MAPIDIRECTIONS STUDIOS",
    "pubCountry": "Pakistan",
    "dl": 1000,
    "revUSD": 1000,
    "top": "ID,DZ,IN",
    "adv": "New (< last 28 Days)",
    "usFree": " #",
    "usGross": " #",
    "rel": "2020-10-21",
    "id": "com.backup.restore.clould.backup.freecloud.storage"
  },
  {
    "name": "Cloud Storage: Drive Backup",
    "pub": "Utility Forge",
    "pubCountry": "United Kingdom",
    "dl": 10000,
    "revUSD": 1000,
    "top": "KZ,ID,RU",
    "adv": "New (< last 28 Days)",
    "usFree": "productivity #",
    "usGross": " #",
    "rel": "2025-12-15",
    "id": "com.cloud.storage.extrastorage.gbsfreespace"
  },
  {
    "name": "Cloudgate: Cloud Storage Drive",
    "pub": "CloudGate Technologies",
    "pubCountry": "Australia",
    "dl": 1000,
    "revUSD": 1000,
    "top": "US,IN,MX",
    "adv": null,
    "usFree": " #",
    "usGross": "productivity #315",
    "rel": "2024-04-22",
    "id": "com.cloudgate.cloudstorage"
  },
  {
    "name": "Cloud Storage Drive Backup app",
    "pub": "MindByte Studios L.L.C-FZ",
    "pubCountry": "Pakistan",
    "dl": 40000,
    "revUSD": 60000,
    "top": "US,IN,NG",
    "adv": "Active",
    "usFree": "tools #520",
    "usGross": "tools #86",
    "rel": "2026-01-13",
    "id": "com.cloudstorage.backupapp.storagespace.mycloud.clouldbackup"
  },
  {
    "name": "Cloud Storage App Drive Backup",
    "pub": "Golden Associate Pvt. Ltd.",
    "pubCountry": "Pakistan",
    "dl": 1000,
    "revUSD": 1000,
    "top": "",
    "adv": null,
    "usFree": " #",
    "usGross": " #",
    "rel": "2026-05-04",
    "id": "com.cloudstorage.cloudbackup.storagespaceapp"
  },
  {
    "name": "Cloud Storage & Cloud Drive",
    "pub": "Fuzon Apps",
    "pubCountry": "Australia",
    "dl": 60000,
    "revUSD": 1000,
    "top": "ES,ZA,GB",
    "adv": null,
    "usFree": " #",
    "usGross": "productivity #",
    "rel": "2025-11-21",
    "id": "com.cloudstorageapp.cloudbackup.storagespace.databackup"
  },
  {
    "name": "Cloud Storage: Cloud Drive App",
    "pub": "Fazcon Apps",
    "pubCountry": "Australia",
    "dl": 60000,
    "revUSD": 40000,
    "top": "US,IN,BR",
    "adv": "Inactive (< last 28 Days)",
    "usFree": "productivity #360",
    "usGross": "productivity #82",
    "rel": "2021-03-01",
    "id": "com.fazconapps.backup.restore.data"
  },
  {
    "name": "ANZ Cloud Drive: Cloud Storage",
    "pub": "Auzi Apps Studios",
    "pubCountry": "Australia",
    "dl": 1000,
    "revUSD": 1000,
    "top": "",
    "adv": null,
    "usFree": " #",
    "usGross": " #",
    "rel": "2025-08-13",
    "id": "com.filestorage.cloudbackup.clouddrive.photosbackup.storagespace"
  },
  {
    "name": "Nova Cloud: Storage & Backup",
    "pub": "Nova Apps Studios",
    "pubCountry": "Australia",
    "dl": 1000,
    "revUSD": 1000,
    "top": "BD,TN,LB",
    "adv": null,
    "usFree": " #",
    "usGross": " #",
    "rel": "2026-05-11",
    "id": "com.securebackup.cloudstorage.drivebackup.filestorage"
  }
]
```

### research/google-ads-assets/assets.txt

```text
H|Secure Cloud Storage Vault
H|Backup & Restore Cloud Storage
H|Cloud Backup & Easy Restore
H|Private Cloud Storage Drive
H|100 GB Free Cloud Storage
H|Cloud Photos & Video Backup
H|Secure Cloud Drive Backup
H|Phone Backup & Quick Restore
H|Data Backup to Cloud Storage
H|Private Cloud Drive & Vault
D|Back up photos, videos & data to secure cloud storage in one tap.
D|Restore your data to any phone in minutes from your secure cloud backup.
D|Get 100 GB of free cloud storage when you sign up. No card, no trial.
D|Move photos and videos to private cloud storage and free up space on your phone.
D|Keep sensitive files in a private cloud vault, locked with PIN or biometrics.
D|Switch phones easily: back up the old phone, then restore with no cables or PC.
D|Turn on automatic photo backup and save every picture in original quality.
D|Stream videos and open documents straight from your cloud drive.
D|Share files and albums with a link, and revoke access whenever you like.
D|Protect your memories with encrypted data backup you can restore anytime.
```

### research/google-ads-assets/brandcheck.json

```json
[
  {
    "term": "drive",
    "totalThirdParty": 28,
    "id": "com.fazconapps.backup.restore.data",
    "boardTitle": "Cloud Storage: Cloud Drive App",
    "liveTitle": "Cloud Storage: Cloud Drive App",
    "stillInTitle": true,
    "dev": "Fazcon Apps",
    "installs": 6121989,
    "released": "Mar 1, 2021"
  },
  {
    "term": "drive",
    "totalThirdParty": 28,
    "id": "com.backup.and.restore.all.apps.photo.backup",
    "boardTitle": "Cloud Storage Backup & Drive",
    "liveTitle": "Cloud Storage Backup & Drive",
    "stillInTitle": true,
    "dev": "Daily Utility Apps",
    "installs": 3772147,
    "released": "Dec 12, 2019"
  },
  {
    "term": "drive",
    "totalThirdParty": 28,
    "id": "com.mireo.rtasmartdrive",
    "boardTitle": "RTA Smart Drive",
    "liveTitle": "RTA Smart Drive",
    "stillInTitle": true,
    "dev": "RTA-ITS",
    "installs": 2806403,
    "released": "Oct 15, 2014"
  },
  {
    "term": "drive",
    "totalThirdParty": 28,
    "id": "me.proton.android.drive",
    "boardTitle": "Proton Drive: Cloud Storage",
    "liveTitle": "Proton Drive: Cloud Storage",
    "stillInTitle": true,
    "dev": "Proton AG",
    "installs": 1601069,
    "released": "Nov 9, 2022"
  },
  {
    "term": "drive",
    "totalThirdParty": 28,
    "id": "com.cloudstorage.backupapp.storagespace.mycloud.clouldbackup",
    "boardTitle": "Cloud Storage Drive Backup app",
    "liveTitle": "Cloud Storage Drive Backup app",
    "stillInTitle": true,
    "dev": "MindByte Studios L.L.C-FZ",
    "installs": 655989,
    "released": "Dec 18, 2025"
  },
  {
    "term": "drive",
    "totalThirdParty": 28,
    "id": "com.cloudstorageapp.cloudbackup.storagespace.databackup",
    "boardTitle": "Cloud Storage & Cloud Drive",
    "liveTitle": "Cloud Storage & Cloud Drive",
    "stillInTitle": true,
    "dev": "Fuzon Apps",
    "installs": 543645,
    "released": "Nov 20, 2025"
  },
  {
    "term": "drive",
    "totalThirdParty": 28,
    "id": "com.totaldrive.my.ts",
    "boardTitle": "Total Drive - Cloud Storage",
    "liveTitle": "Total Drive - Cloud Storage",
    "stillInTitle": true,
    "dev": "Total Security Limited",
    "installs": 526419,
    "released": "Aug 30, 2024"
  },
  {
    "term": "drive",
    "totalThirdParty": 28,
    "id": "com.cloudgate.cloudstorage",
    "boardTitle": "Cloudgate: Cloud Storage Drive",
    "liveTitle": "Cloudgate: Cloud Storage Drive",
    "stillInTitle": true,
    "dev": "CloudGate Technologies",
    "installs": 441509,
    "released": "Apr 22, 2024"
  },
  {
    "term": "cloud drive",
    "totalThirdParty": 7,
    "id": "com.fazconapps.backup.restore.data",
    "boardTitle": "Cloud Storage: Cloud Drive App",
    "liveTitle": "Cloud Storage: Cloud Drive App",
    "stillInTitle": true,
    "dev": "Fazcon Apps",
    "installs": 6121989,
    "released": "Mar 1, 2021"
  },
  {
    "term": "cloud drive",
    "totalThirdParty": 7,
    "id": "com.cloudstorageapp.cloudbackup.storagespace.databackup",
    "boardTitle": "Cloud Storage & Cloud Drive",
    "liveTitle": "Cloud Storage & Cloud Drive",
    "stillInTitle": true,
    "dev": "Fuzon Apps",
    "installs": 543645,
    "released": "Nov 20, 2025"
  },
  {
    "term": "cloud drive",
    "totalThirdParty": 7,
    "id": "com.abl.cloud.backup.restore",
    "boardTitle": "Cloud Drive: Secure Storage",
    "liveTitle": "Cloud Drive: Secure Storage",
    "stillInTitle": true,
    "dev": "Appbotics Lab",
    "installs": 23105,
    "released": "Dec 30, 2025"
  },
  {
    "term": "cloud drive",
    "totalThirdParty": 7,
    "id": "com.filestorage.cloudbackup.clouddrive.photosbackup.storagespace",
    "boardTitle": "ANZ Cloud Drive: Cloud Storage",
    "liveTitle": "ANZ Cloud Drive: Cloud Storage",
    "stillInTitle": true,
    "dev": "Auzi Apps Studios",
    "installs": 5507,
    "released": "Aug 28, 2026"
  },
  {
    "term": "cloud drive",
    "totalThirdParty": 7,
    "id": "com.cloudapp.cloudstorage",
    "boardTitle": "Cloud storage - Cloud Drive",
    "liveTitle": "Cloud storage - Cloud Drive",
    "stillInTitle": true,
    "dev": "8th Generation Apps -Global Earth Map Live apps",
    "installs": 96,
    "released": "Aug 12, 2026"
  },
  {
    "term": "cloud drive",
    "totalThirdParty": 7,
    "id": "com.cloud.storage.cloud.backup.clouddrive.filebackup",
    "boardTitle": "Cloud storage: Cloud Drive App",
    "liveTitle": "Cloud storage: Cloud Drive App",
    "stillInTitle": true,
    "dev": null,
    "installs": 384,
    "released": "Sep 10, 2026"
  },
  {
    "term": "cloud drive",
    "totalThirdParty": 7,
    "id": "com.ecareme.asuswebstorage",
    "boardTitle": "ASUS WebStorage - Cloud Drive",
    "liveTitle": "ASUS WebStorage - Cloud Drive",
    "stillInTitle": true,
    "dev": null,
    "installs": 131472269,
    "released": "May 5, 2010"
  },
  {
    "term": "vault",
    "totalThirdParty": 28,
    "id": "com.mi.android.globalminusscreen",
    "boardTitle": "App Vault",
    "liveTitle": "App Vault",
    "stillInTitle": true,
    "dev": "Xiaomi Inc.",
    "installs": 1599472538,
    "released": "Sep 23, 2019"
  },
  {
    "term": "vault",
    "totalThirdParty": 28,
    "id": "com.mi.globalminusscreen",
    "boardTitle": "App Vault",
    "liveTitle": "App Vault",
    "stillInTitle": true,
    "dev": "Xiaomi Inc.",
    "installs": 1542052938,
    "released": "May 8, 2022"
  },
  {
    "term": "vault",
    "totalThirdParty": 28,
    "id": "com.netqin.ps",
    "boardTitle": "Vault - Hide Pics, App Lock",
    "liveTitle": "Vault - Hide Pics, App Lock",
    "stillInTitle": true,
    "dev": "Wafer Co.",
    "installs": 125030653,
    "released": "Dec 16, 2011"
  },
  {
    "term": "vault",
    "totalThirdParty": 28,
    "id": "com.kii.safe",
    "boardTitle": "Private Photo Vault - Keepsafe",
    "liveTitle": "Private Photo Vault - Keepsafe",
    "stillInTitle": true,
    "dev": "Keepsafe",
    "installs": 78233840,
    "released": "Jun 3, 2011"
  },
  {
    "term": "vault",
    "totalThirdParty": 28,
    "id": "gallery.hidepictures.photovault.lockgallery",
    "boardTitle": "Gallery - Album, Photo Vault",
    "liveTitle": "Gallery - Album, Photo Vault",
    "stillInTitle": true,
    "dev": "InShot Inc.",
    "installs": 68787767,
    "released": "Jul 7, 2020"
  },
  {
    "term": "vault",
    "totalThirdParty": 28,
    "id": "photo.manager.private.photogallery",
    "boardTitle": "Photo Gallery - Album, Vault",
    "liveTitle": "Photo Gallery - Album, Vault",
    "stillInTitle": true,
    "dev": "Mobile_V5",
    "installs": 53184515,
    "released": "Dec 5, 2019"
  },
  {
    "term": "vault",
    "totalThirdParty": 28,
    "id": "com.hld.anzenbokusucal",
    "boardTitle": "Calculator - photo vault",
    "liveTitle": "Calculator - photo vault",
    "stillInTitle": true,
    "dev": "FishingNet",
    "installs": 44944332,
    "released": "Jan 5, 2019"
  },
  {
    "term": "vault",
    "totalThirdParty": 28,
    "id": "com.ai.gallery.android",
    "boardTitle": "Gallery - Photo Gallery, Vault",
    "liveTitle": "Gallery - Photo Gallery, Vault",
    "stillInTitle": true,
    "dev": "o16i Apps",
    "installs": 26202746,
    "released": "Dec 15, 2022"
  },
  {
    "term": "photos",
    "totalThirdParty": 20,
    "id": "com.amazon.clouddrive.photos",
    "boardTitle": "Amazon Photos: Photo & Video",
    "liveTitle": "Amazon Photos: Photo & Video",
    "stillInTitle": true,
    "dev": "Amazon Mobile LLC",
    "installs": 91471837,
    "released": "Nov 2, 2012"
  },
  {
    "term": "photos",
    "totalThirdParty": 20,
    "id": "com.bitcraft.allrecoveryfiles",
    "boardTitle": "Recovery Lost Photos & Videos",
    "liveTitle": "Recovery Lost Photos & Videos",
    "stillInTitle": true,
    "dev": "BitCraft Tools",
    "installs": 7520354,
    "released": "Jan 6, 2026"
  },
  {
    "term": "photos",
    "totalThirdParty": 20,
    "id": "com.synology.projectkailash",
    "boardTitle": "Synology Photos",
    "liveTitle": "Synology Photos",
    "stillInTitle": true,
    "dev": "Synology Inc.",
    "installs": 2308134,
    "released": "Dec 2, 2020"
  },
  {
    "term": "photos",
    "totalThirdParty": 20,
    "id": "com.luminousbyte.photorecovery.recoveryallfiles",
    "boardTitle": "All Recovery - Photos, Videos",
    "liveTitle": "All Recovery - Photos, Videos",
    "stillInTitle": true,
    "dev": "LuminousByte",
    "installs": 1128985,
    "released": "Jan 17, 2026"
  },
  {
    "term": "photos",
    "totalThirdParty": 20,
    "id": "io.klebo.iphoto",
    "boardTitle": "Photo Gallery for Cloud Photos",
    "liveTitle": "Photo Gallery for Cloud Photos",
    "stillInTitle": true,
    "dev": "klebo",
    "installs": 180078,
    "released": "Jun 17, 2025"
  },
  {
    "term": "photos",
    "totalThirdParty": 20,
    "id": "io.ente.photos",
    "boardTitle": "Ente Photos - Encrypted Backup",
    "liveTitle": "Ente Photos - Encrypted Backup",
    "stillInTitle": true,
    "dev": "Ente Technologies, Inc.",
    "installs": 171023,
    "released": "May 6, 2020"
  },
  {
    "term": "photos",
    "totalThirdParty": 20,
    "id": "com.file.recovery.photo.video.contactnew",
    "boardTitle": "Recover Photos, Video, Contact",
    "liveTitle": "Recover Photos, Video, Contact",
    "stillInTitle": true,
    "dev": "Swayambhutaya Inc",
    "installs": 59388,
    "released": "Oct 11, 2023"
  },
  {
    "term": "photos",
    "totalThirdParty": 20,
    "id": "com.applock.hidden.vaultmaster",
    "boardTitle": "Cloud Vault For Photos & Files",
    "liveTitle": "Cloud Vault For Photos & Files",
    "stillInTitle": true,
    "dev": "102Apps Studio",
    "installs": 3723,
    "released": "Oct 10, 2023"
  },
  {
    "term": "gallery",
    "totalThirdParty": 36,
    "id": "gallery.hidepictures.photovault.lockgallery",
    "boardTitle": "Gallery - Album, Photo Vault",
    "liveTitle": "Gallery - Album, Photo Vault",
    "stillInTitle": true,
    "dev": "InShot Inc.",
    "installs": 68787767,
    "released": "Jul 7, 2020"
  },
  {
    "term": "gallery",
    "totalThirdParty": 36,
    "id": "photo.manager.private.photogallery",
    "boardTitle": "Photo Gallery - Album, Vault",
    "liveTitle": "Photo Gallery - Album, Vault",
    "stillInTitle": true,
    "dev": "Mobile_V5",
    "installs": 53184515,
    "released": "Dec 5, 2019"
  },
  {
    "term": "gallery",
    "totalThirdParty": 36,
    "id": "gallery.photomanager.picturegalleryapp.imagegallery",
    "boardTitle": "Gallery - photo gallery, album",
    "liveTitle": "Gallery - photo gallery, album",
    "stillInTitle": true,
    "dev": "PhotoZen Studio",
    "installs": 30981247,
    "released": "Feb 9, 2020"
  },
  {
    "term": "gallery",
    "totalThirdParty": 36,
    "id": "com.ai.gallery.android",
    "boardTitle": "Gallery - Photo Gallery, Vault",
    "liveTitle": "Gallery - Photo Gallery, Vault",
    "stillInTitle": true,
    "dev": "o16i Apps",
    "installs": 26202746,
    "released": "Dec 15, 2022"
  },
  {
    "term": "gallery",
    "totalThirdParty": 36,
    "id": "photo.gallery.photoeditor.photo.album",
    "boardTitle": "Gallery- Photo Gallery & Album",
    "liveTitle": "Gallery- Photo Gallery & Album",
    "stillInTitle": true,
    "dev": "Mobile_V5",
    "installs": 25608370,
    "released": "Jan 4, 2024"
  },
  {
    "term": "gallery",
    "totalThirdParty": 36,
    "id": "bt.photo.video.lock.album",
    "boardTitle": "Gallery - Private Photo Vault",
    "liveTitle": "Gallery - Private Photo Vault",
    "stillInTitle": true,
    "dev": "Brain Trust",
    "installs": 1823915,
    "released": "May 29, 2025"
  },
  {
    "term": "gallery",
    "totalThirdParty": 36,
    "id": "gallery.photogallery.photoeditor.galleryapp",
    "boardTitle": "Gallery- Photo Gallery & Album",
    "liveTitle": "Gallery- Photo Gallery & Album",
    "stillInTitle": true,
    "dev": "Incredible Fun Games",
    "installs": 1357796,
    "released": "Apr 1, 2026"
  },
  {
    "term": "gallery",
    "totalThirdParty": 36,
    "id": "gallery.galeria.galleria.galerie.galeria.galerie.galereya",
    "boardTitle": "Gallery: Album & Photo Vault",
    "liveTitle": "Gallery: Album & Photo Vault",
    "stillInTitle": true,
    "dev": "Gallery Photo Galeria Album",
    "installs": 1269157,
    "released": "Oct 22, 2023"
  }
]
```

### research/google-ads-assets/candidates.txt

```text
Secure Cloud Storage Vault
Backup & Restore Cloud Storage
Cloud Backup & Easy Restore
Private Cloud Storage Drive
100 GB Free Cloud Storage
Cloud Photos & Video Backup
Secure Cloud Drive Backup
Phone Backup & Quick Restore
Data Backup to Cloud Storage
Private Cloud Drive & Vault
```

### research/google-ads-assets/export/content.json

```json
[
  {"type":"title","text":"Google Ads Text Assets"},
  {"type":"subtitle","text":"Cloud Storage: Secure Vault | App campaign | United States | English"},
  {
    "type": "meta",
    "text": "Version 2, revised 21 Sep 2026 | Package com.softwarealliance.cloudvault | Developer Cell Cave | Sources: the 15 Sep 2026 US keyword board (94 keywords, 522 apps, 11 competitors), 38 live US Google Play keyword searches and 10 live headline-title checks run on 21 Sep 2026."
  },
  {"type":"h1","text":"1. What the analysis found"},
  {
    "type": "bullets",
    "items": [
      "**Generic keywords are shared by the whole category, so they are not brands.** \"Cloud storage\" sits in the titles of 45 third-party apps from 44 developers, including all 11 of your competitors. \"Backup and restore\" is in 42 titles, \"cloud backup\" in 12, \"cloud drive\" in 8 and \"drive backup\" in 5. These are free to use.",
      "**Titles built from those generic keywords rank.** \"Cloud Storage: Drive Backup\" (released Dec 2025) is #1 for \"cloud storage drive backup\". A 3.6K-install app is #1 for \"cloud storage app drive backup\". Fazcon is #1 for \"cloud storage cloud drive\".",
      "**Only an exact full title works as brand identity.** About 94% of titles are unique to one app. The headlines reuse the shared keywords and never repeat a full title.",
      "**Head terms are owned by big companies.** For \"cloud storage\", \"cloud drive\" and \"cloud storage photos\", 9 to 10 of the top 10 results come from big companies. Use these terms for relevance; the app will not outrank them soon.",
      "**The backup-and-restore keywords are the most winnable.** Those searches have 0 to 2 big companies in the top 10, and apps with 864 to 27.5K installs hold top-10 ranks.",
      "**\"Secure vault\" on its own is a different niche.** Searches for \"secure vault\", \"private vault\" and \"file vault\" return photo-hiding and app-lock apps, so \"vault\" is used only next to \"cloud\".",
      "**The app is live but not ranking yet.** It shows 500+ installs, was released 8 Sep 2026, and appears in none of the 38 result sets."
    ]
  },
  {"type":"h1break","text":"2. Ten headlines (limit 30 characters)"},
  {
    "type": "p",
    "text": "Each headline pairs a generic head term of the niche with a lower-competition keyword. The keywords come from the app's title, short description and the first paragraph of the full description, plus the keywords your competitors rank on. In the last column, \"short\" means the short description. Character counts include spaces and punctuation and were counted by script. No headline repeats an existing app title (see section 6)."
  },
  {
    "type": "table",
    "widths": [450,2700,650,1700,2546,1700],
    "header": ["#","Headline","Chars","Generic head term","Low-competition partner","From your metadata"],
    "rows": [
      ["1","**Secure Cloud Storage Vault**","26","cloud storage","secure cloud storage, cloud vault","Title"],
      ["2","**Backup & Restore Cloud Storage**","30","cloud storage","backup and restore (every word of the board's top keyword)","Title + short"],
      ["3","**Cloud Backup & Easy Restore**","27","cloud backup","cloud backup and restore (all words)","Title + short"],
      ["4","**Private Cloud Storage Drive**","27","cloud storage","private cloud storage, cloud storage drive","Title + short + first paragraph"],
      ["5","**100 GB Free Cloud Storage**","25","free cloud storage","100gb cloud storage","First paragraph"],
      ["6","**Cloud Photos & Video Backup**","27","cloud photos","cloud photos backup, video backup","Short + first paragraph"],
      ["7","**Secure Cloud Drive Backup**","25","cloud drive","drive backup, secure cloud","Title + first paragraph"],
      ["8","**Phone Backup & Quick Restore**","28","phone backup","phone backup and restore (all words)","Short"],
      ["9","**Data Backup to Cloud Storage**","28","cloud storage","data backup, cloud storage data backup","Title + short"],
      ["10","**Private Cloud Drive & Vault**","27","cloud drive","private cloud, cloud vault","First paragraph + title"]
    ]
  },
  {"type":"h1","text":"3. Ten descriptions (limit 90 characters)"},
  {
    "type": "p",
    "text": "Each description opens with an action verb, names a feature the app ships, and answers a user intent. None uses the full 90 characters."
  },
  {
    "type": "table",
    "widths": [450,8546,750],
    "header": ["#","Description","Chars"],
    "rows": [
      ["1","Back up photos, videos & data to secure cloud storage in one tap.","65"],
      ["2","Restore your data to any phone in minutes from your secure cloud backup.","72"],
      ["3","Get 100 GB of free cloud storage when you sign up. No card, no trial.","69"],
      ["4","Move photos and videos to private cloud storage and free up space on your phone.","80"],
      ["5","Keep sensitive files in a private cloud vault, locked with PIN or biometrics.","77"],
      ["6","Switch phones easily: back up the old phone, then restore with no cables or PC.","79"],
      ["7","Turn on automatic photo backup and save every picture in original quality.","74"],
      ["8","Stream videos and open documents straight from your cloud drive.","64"],
      ["9","Share files and albums with a link, and revoke access whenever you like.","72"],
      ["10","Protect your memories with encrypted data backup you can restore anytime.","73"]
    ]
  },
  {
    "type": "p",
    "text": "Every claim matches the live listing: 100 GB on sign-up, no card or trial, PIN and biometrics, original quality, encryption and link sharing. There is no \"No ads\" claim, no exclamation mark and no all-caps wording."
  },
  {"type":"h1","text":"4. Ad group split"},
  {
    "type": "p",
    "text": "App campaigns are understood to accept 5 headlines and 5 descriptions per ad group, so the 10 + 10 are grouped by theme. Confirm the limit in the Google Ads account when creating the ad groups."
  },
  {
    "type": "table",
    "widths": [2000,4546,3200],
    "header": ["Ad group","Headlines","Descriptions"],
    "rows": [
      [
        "**Storage, drive and security**",
        "1 Secure Cloud Storage Vault; 4 Private Cloud Storage Drive; 5 100 GB Free Cloud Storage; 7 Secure Cloud Drive Backup; 10 Private Cloud Drive & Vault",
        "3, 4, 5, 8, 9"
      ],
      [
        "**Backup and restore**",
        "2 Backup & Restore Cloud Storage; 3 Cloud Backup & Easy Restore; 6 Cloud Photos & Video Backup; 8 Phone Backup & Quick Restore; 9 Data Backup to Cloud Storage",
        "1, 2, 6, 7, 10"
      ]
    ]
  },
  {"type":"h1","text":"5. Traffic, competition and competitor ranks"},
  {
    "type": "p",
    "text": "Google Ads Keyword Planner was not available, so **traffic** is the Google Play autocomplete demand score (0 to 100) from the 15 Sep board. **Competition** is taken from the live US top 10 on 21 Sep. \"Big companies\" are apps from large publishers such as Google, Microsoft and Dropbox, identified by developer, never by keyword. \"Smallest app in top 10\" excludes them and shows how small an app can be and still rank. Competitor ranks show 21 Sep first, with the 15 Sep rank in brackets."
  },
  {
    "type": "table",
    "widths": [2350,1000,1050,1100,4246],
    "header": ["Keyword","Demand","Big companies in top 10","Smallest app in top 10","Competitor ranks, 21 Sep (15 Sep)"],
    "rows": [
      ["cloud storage drive backup","55","6","27.5K","Cloud Storage: Drive Backup #1 (#1); Cloud Storage Drive Backup app #3 (#2); Fazcon out (#6)"],
      ["cloud storage cloud drive","40","4","under 1K","Fazcon #1 (#1); Fuzon #6 (#7); CloudGate #10 (new)"],
      [
        "cloud storage app drive backup", "0", "7", "3.6K",
        "Cloud Storage App Drive Backup #1 (#1); Cloud Storage Drive Backup app #4 (#3); Fazcon #7 (#8); Cloud Storage Backup & Drive out (#12)"
      ],
      [
        "cloud storage backup drive", "27", "6", "74.6K",
        "Cloud Storage Backup & Drive #2 (#2); Cloud Storage Drive Backup app #4 (new); Cloud Storage: Drive Backup #11 (#8)"
      ],
      [
        "cloud storage backup and restore", "57", "1", "3.9K",
        "Fazcon #8 (#10); Cloud Storage Backup & Drive #14 (#7); Cloud Storage: Drive Backup #21 (#17); Fuzon #28 (#26); CloudGate #29 (new); Cloud Backup : Cloud Storage out (#25)"
      ],
      ["100gb cloud storage","75","4","under 1K","Fuzon #6 (#11); Fazcon #7 (#5); CloudGate out (#13)"],
      [
        "cloud backup cloud storage", "0", "4", "27.5K",
        "Cloud Backup : Cloud Storage #2 (#2); Fazcon #11 (#9); CloudGate out (#14); Cloud Storage: Drive Backup out (#11); Cloud Storage Backup & Drive out (#16)"
      ],
      ["backup and restore","88","0","864","none"],
      ["cloud backup and restore","68","2","864","none"],
      ["data backup and restore","68","1","759","none"],
      ["phone backup and restore","55","0","27.5K","none"],
      ["secure cloud storage","63","8","34.1K","none"],
      ["private cloud storage","63","7","34.1K","none"],
      ["cloud storage","60","10","none","none"],
      ["cloud backup","60","7","27.5K","none"],
      ["cloud drive app","59","9","522K","none"],
      ["cloud drive","56","9","522K","none"],
      ["secure cloud storage backup","56","8","34.1K","none"],
      ["cloud vault","49","5","3.7K","none"],
      ["cloud photos backup","47","7","3.9K","none"],
      ["free cloud storage","44","9","34.1K","none"],
      ["data backup","40","5","864","none"],
      ["cloud photos","38","7","169.8K","none"],
      ["secure cloud","35","2","694","none"],
      ["cloud storage photos","35","10","none","Fazcon out (#6)"],
      ["cloud storage drive","31","9","522K","Fuzon out (#14)"]
    ]
  },
  {
    "type": "note",
    "text": "Play returned 9 to 30 results per search; \"out\" means the app was not among the results returned on 21 Sep. A demand score of 0 means Play autocomplete did not suggest the phrase."
  },
  {"type":"h2","text":"Your 11 competitors"},
  {
    "type": "p",
    "text": "All 11 titles are built from the same shared keywords: every one carries \"cloud\" and \"storage\", and 9 of the 11 add \"drive\". The last column is only the short label used in the rank table above."
  },
  {
    "type": "table",
    "widths": [3300,2746,1400,2300],
    "header": ["Google Play title","Developer","Installs (15 Sep)","Label in the rank table"],
    "rows": [
      ["Cloud Storage: Cloud Drive App","Fazcon Apps","6.1M","Fazcon"],
      ["Cloud Storage Backup & Drive","Daily Utility Apps","3.8M","full title"],
      ["Cloud Storage Drive Backup app","MindByte Studios L.L.C-FZ","656K","full title"],
      ["Cloud Storage & Cloud Drive","Fuzon Apps","542K","Fuzon"],
      ["Cloud Backup : Cloud Storage","MAPIDIRECTIONS STUDIOS","452K","full title"],
      ["Cloudgate: Cloud Storage Drive","CloudGate Technologies","441K","CloudGate"],
      ["Cloud Storage: Drive Backup","Utility Forge","211K","full title"],
      ["Cloud Storage Drive: DataHatch","Appseen Studio","19.5K","not in any result set"],
      ["Nova Cloud: Storage & Backup","Nova Apps Studios","8.7K","not in any result set"],
      ["ANZ Cloud Drive: Cloud Storage","Auzi Apps Studios","5.5K","not in any result set"],
      ["Cloud Storage App Drive Backup","Golden Associate Pvt. Ltd.","3.6K","full title"]
    ]
  },
  {"type":"h1","text":"6. Generic keywords versus brand identity: cross-verification"},
  {
    "type": "p",
    "text": "**The rule applied in this version.** A keyword that many developers carry in their titles is generic to the category and free to use. Brand identity is limited to two things: a real company or product name, and the exact full title of another app. This was tested against 551 app titles (the 522 apps on the keyword board plus 29 fetched live) and against live Play results."
  },
  {"type":"h2","text":"Test 1: are the top keywords shared across many developers? Confirmed."},
  {
    "type": "table",
    "widths": [2746,1700,1800,1700,1800],
    "header": ["Keyword in app titles","Third-party titles","Distinct developers","With 100K+ installs","Of your 11 competitors"],
    "rows": [
      ["cloud storage","45","44","19","11"],
      ["backup and restore","42","38","14","0"],
      ["cloud backup","12","12","5","1"],
      ["cloud drive","8","8","3","3"],
      ["drive backup","5","5","2","3"],
      ["cloud storage backup","5","5","2","1"],
      ["secure cloud","5","5","2","0"],
      ["phone backup","6","6","3","0"],
      ["cloud storage drive","4","4","3","4"],
      ["data backup","5","5","1","0"]
    ]
  },
  {
    "type": "note",
    "text": "Apps from big companies are excluded from these counts. A keyword carried by this many unrelated developers cannot be one company's brand."
  },
  {"type":"h2","text":"Test 2: does an exact full title work as identity? Confirmed."},
  {
    "type": "bullets",
    "items": [
      "Only 28 of 505 distinct titles (under 6%) are shared by more than one app. The other 94% belong to a single app.",
      "Where a title is shared, the copies are usually tiny clones beside one established app: \"Cloud Backup and Restore\" (277K and 3.9K installs), \"Phone Backup and Restore\" (2.6M and 2.4K), \"Cloud Storage : Cloud Backup\" (four apps, from 1 install to 1.5M).",
      "One nuance: Play does leave some duplicate titles live, so an exact match is not always removed. Avoiding exact titles is still the right rule, because an ad carrying another app's full title reads as that app."
    ]
  },
  {"type":"h2","text":"Test 3: do generic-keyword titles rank? Confirmed."},
  {
    "type": "p",
    "text": "On the four searches built from \"cloud storage\", \"drive\" and \"backup\", your competitors hold a rank between #1 and #4 on every one, with titles made only of those generic words, including an app released in Dec 2025 and an app with 3.6K installs (first four rows of the table in section 5)."
  },
  {"type":"h2","text":"What changed from version 1"},
  {
    "type": "p",
    "text": "Version 1 stated that no headline matched another app's title. That statement was wrong: it had not been checked by script. The check found two exact matches and two near-exact matches, all now replaced. Two more headlines were extended to carry the \"drive\" keywords your competitors rank on."
  },
  {
    "type": "table",
    "widths": [2700,4346,2700],
    "header": ["Version 1","What the check found","Version 2"],
    "rows": [
      ["Cloud Storage Backup & Restore","Exact full title of a live app (74.6K installs)","**Backup & Restore Cloud Storage**"],
      ["Cloud Backup and Restore","Exact full title of two live apps (277K and 3.9K installs)","**Cloud Backup & Easy Restore**"],
      ["Cloud Storage & Data Backup","Near-exact: \"Cloud Storage: Data Backup\" (3M installs)","**Data Backup to Cloud Storage**"],
      ["Data Backup and Restore","Near-exact: \"Data Backup and Restore App\"","**Phone Backup & Quick Restore**"],
      ["Private Cloud Storage","Clear. Extended to add \"cloud storage drive\"","**Private Cloud Storage Drive**"],
      ["Secure Cloud Backup","Clear. Replaced to add \"cloud drive\" and \"drive backup\"","**Secure Cloud Drive Backup**"],
      ["Descriptions 2 and 6","Contained the exact titles \"Cloud Backup and Restore\" and \"Phone Backup and Restore\"","Reworded, same features"]
    ]
  },
  {
    "type": "p",
    "text": "**Title check on the final 10 headlines.** Each was compared with all 551 known titles and with the live Play results for a search of the headline itself (9 to 15 results each). Result: no exact and no near-exact match for any of the 10. A near-exact match means the same words in the same order once \"and\", \"&\", \"app\" and punctuation are ignored."
  },
  {
    "type": "p",
    "text": "**Real brand names left out of every asset:** Google Drive, Google Photos, Google One, OneDrive, Dropbox, iCloud, MEGA, TeraBox, pCloud, Proton, S3Drive, Icedrive, MobiDrive and Smart Switch. The version 1 pass/fail table for \"Drive\", \"Vault\", \"Photos\" and \"Gallery\" has been removed, because these are generic category words."
  }
]
```

### research/google-ads-assets/final_headlines.txt

```text
Secure Cloud Storage Vault
Backup & Restore Cloud Storage
Cloud Backup & Easy Restore
Private Cloud Storage Drive
100 GB Free Cloud Storage
Cloud Photos & Video Backup
Secure Cloud Drive Backup
Phone Backup & Quick Restore
Data Backup to Cloud Storage
Private Cloud Drive & Vault
```

### research/google-ads-assets/keywords.txt

```text
cloud storage
secure cloud storage
cloud storage backup and restore
cloud backup and restore
private cloud storage
cloud backup cloud storage
secure cloud storage backup
cloud photos backup
cloud backup
data backup
free cloud storage
100gb cloud storage
cloud drive
secure vault
cloud vault
private vault
backup and restore
phone backup and restore
data backup and restore
photo backup
cloud storage photos
cloud photos
private cloud
secure cloud
secure storage
data restore
drive backup
backup photos and videos
phone backup
file vault
video backup
gallery backup
cloud storage drive backup
cloud storage cloud drive
cloud storage backup drive
cloud storage app drive backup
cloud storage drive
cloud drive app
```

### research/google-ads-assets/serps_live.json

```json
{
  "video backup": [
    "com.google.android.apps.photos", "com.dropbox.android", "com.amazon.clouddrive.photos", "ru.mail.cloud", "com.microsoft.skydrive",
    "org.swiftapps.swiftbackup", "com.dubox.drive", "io.ente.photos", "com.baloota.dumpster", "com.idrive.photos.android",
    "com.google.android.apps.docs", "com.google.android.apps.photosgo", "com.kii.safe", "com.google.android.apps.subscriptions.red",
    "com.simplifieditproducts.ub4in1"
  ],
  "cloud storage photos": [
    "com.dropbox.android", "ru.mail.cloud", "com.google.android.apps.photos", "com.microsoft.skydrive", "com.amazon.clouddrive.photos",
    "com.pcloud.pcloud", "com.dubox.drive", "com.google.android.apps.cloudconsole", "com.google.android.apps.subscriptions.red",
    "me.proton.android.drive", "com.cloud.backup.restore.data", "mega.privacy.android.app", "com.google.android.apps.docs"
  ],
  "cloud storage drive backup": [
    "com.cloud.storage.extrastorage.gbsfreespace", "com.dropbox.android", "com.cloudstorage.backupapp.storagespace.mycloud.clouldbackup",
    "me.proton.android.drive", "com.microsoft.skydrive", "com.cloud.backup.restore.data", "com.google.android.apps.subscriptions.red",
    "com.dubox.drive", "com.google.android.apps.docs"
  ],
  "cloud storage app drive backup": [
    "com.cloudstorage.cloudbackup.storagespaceapp", "com.dropbox.android", "com.google.android.apps.subscriptions.red",
    "com.cloudstorage.backupapp.storagespace.mycloud.clouldbackup", "com.google.android.apps.docs", "com.dubox.drive",
    "com.fazconapps.backup.restore.data", "com.microsoft.skydrive", "me.proton.android.drive", "ru.mail.cloud"
  ],
  "cloud backup cloud storage": [
    "com.dropbox.android", "com.backup.restore.clould.backup.freecloud.storage", "com.microsoft.skydrive", "com.cloud.backup.restore.data",
    "com.mycloud.storage.photo.video.space", "com.google.android.apps.subscriptions.red", "com.dubox.drive",
    "com.cloudstorage.mycloud.storagespace.cloudapp", "com.cloudstorage.cloudbackup.drivebackup", "cloud.storage.backup.restore",
    "com.fazconapps.backup.restore.data", "com.genie9.gcloudbackup", "me.proton.android.drive"
  ],
  "drive backup": [
    "com.google.android.apps.docs", "com.google.android.apps.subscriptions.red", "com.dropbox.android", "org.swiftapps.swiftbackup",
    "com.ttxapps.drivesync", "com.microsoft.skydrive", "me.proton.android.drive", "com.cloud.backup.restore.data",
    "com.prosoftnet.android.idriveonline", "com.ttxapps.autosync", "com.mobisystems.mobidrive", "com.s3.drive.file.explorer.storage.cloud.manager",
    "ru.mail.cloud", "com.google.android.apps.photos", "com.katyayini.appbackup.pro", "com.totaldrive.my.ts", "com.dubox.drive", "com.pcloud.pcloud",
    "com.backupify.cloudbackup", "com.guberdev.gdrivebackup", "com.ttxapps.onesyncv2", "com.google.android.apps.nbu.files", "jrbeetroots.phonebackup"
  ],
  "secure vault": [
    "com.fourchars.privary", "com.kii.safe", "com.netqin.ps", "com.macymind.calculatorlock", "com.communityhelper.securevault",
    "com.lkpixel.secure_vault_app", "com.katyayini.hidefiles", "com.katyayini.hidefiles.pro", "com.abhi.securevault.app", "com.hld.anzenbokusucal",
    "security.plus.applock.callblocker.lockscreen", "com.dev.mediavault", "com.smartwho.smartpassword", "com.rvaliev.safevault"
  ],
  "gallery backup": [
    "com.google.android.apps.photos", "com.google.android.apps.photosgo", "com.amazon.clouddrive.photos", "com.idrive.photos.android", "ru.mail.cloud",
    "com.backupify.cloudbackup", "io.ente.photos", "com.dropbox.android", "backup.restore.contacts.sms"
  ],
  "cloud storage drive": [
    "com.dropbox.android", "com.microsoft.skydrive", "com.google.android.apps.docs", "com.totaldrive.my.ts",
    "com.google.android.apps.subscriptions.red", "com.dubox.drive", "mega.privacy.android.app", "me.proton.android.drive", "ru.mail.cloud",
    "com.pcloud.pcloud", "com.s3.drive.file.explorer.storage.cloud.manager", "com.mobisystems.mobidrive", "com.icedrive.app"
  ],
  "private vault": [
    "com.enchantedcloud.photovault", "com.kii.safe", "com.fourchars.privary", "com.dpl.privatevault.hidephoto.locker",
    "com.fubianapp.toolbox.privatevault", "com.netqin.ps", "com.theronrogers.vaultyfree", "com.hld.anzenbokusucal",
    "master.app.photo.vault.calculator"
  ],
  "phone backup and restore": [
    "com.phone.backup.restore", "com.riteshsahu.SMSBackupRestore", "org.swiftapps.swiftbackup", "com.simpler.backup", "com.ppn.backuprestore",
    "jrbeetroots.phonebackup", "com.riteshsahu.SMSBackupRestorePro", "com.cloud.backup.restore.data", "com.rerware.android.MyBackupPro",
    "all.backup.restore"
  ],
  "cloud storage cloud drive": [
    "com.fazconapps.backup.restore.data", "com.cloudapp.cloudstorage", "com.totaldrive.my.ts", "com.dropbox.android", "ru.mail.cloud",
    "com.cloudstorageapp.cloudbackup.storagespace.databackup", "com.microsoft.skydrive", "me.proton.android.drive", "com.abl.cloud.backup.restore",
    "com.cloudgate.cloudstorage", "com.cloud.backup.restore.data", "com.cloudstorage.cloudbackup.drivebackup", "com.mycloud.storage.photo.video.space"
  ],
  "cloud photos backup": [
    "ru.mail.cloud", "com.google.android.apps.cloudconsole", "com.dropbox.android", "com.cloud.backup.restore.data", "com.microsoft.skydrive",
    "com.google.android.apps.photos", "com.amazon.clouddrive.photos", "com.infinite.cloudbackup", "me.proton.android.drive",
    "com.mycloud.storage.photo.video.space", "io.ente.photos", "com.pcloud.pcloud", "com.backupify.cloudbackup"
  ],
  "cloud backup and restore": [
    "cloud.storage.backup.restore", "com.genie9.gcloudbackup", "com.dropbox.android", "com.cloud.backup.restore.data", "com.pcloud.pcloud",
    "org.swiftapps.swiftbackup", "com.riteshsahu.SMSBackupRestore", "com.phone.backup.restore", "com.katyayini.appbackup.pro",
    "jrbeetroots.phonebackup"
  ],
  "file vault": [
    "com.textsdev.securefilevaultsharing", "io.adaptiv.filevault", "com.alif.vault.file", "dev.stephenkingston.apfsreader", "com.personal.vault",
    "com.utility.secretVault", "com.securefolder.hidemedia.filelocker", "com.hld.anzenbokusucal", "com.ahm3dev.docvaultmobile",
    "com.ascendo.DataVault", "com.securefolder.securefiles.vault.file", "com.kii.safe", "com.securefolder.file.vault", "fv.foldervault.pro",
    "com.arytan.vault", "com.mobisystems.fileman", "com.hexamindlab.novafilemanager", "com.thinkyeah.galleryvault", "com.fourchars.privary",
    "com.katyayini.hidefiles.pro"
  ],
  "secure cloud": [
    "com.safeincloud", "cloud.secure", "com.pentabit.secure.cloud.storage.phone.data.backup.drive", "com.inceptionapps.localcloud.android",
    "com.dropbox.android", "com.sync.mobileapp", "se.authenticator.android", "com.hivenet.android.hivedisk", "com.cutcom.apparmor.stcloudstate"
  ],
  "free cloud storage": [
    "com.dropbox.android", "com.dubox.drive", "com.microsoft.skydrive", "mega.privacy.android.app", "com.pcloud.pcloud",
    "com.s3.drive.file.explorer.storage.cloud.manager", "com.google.android.apps.docs", "com.google.android.apps.cloudconsole", "ru.mail.cloud",
    "me.proton.android.drive", "ru.yandex.disk", "com.icedrive.app", "com.mobisystems.mobidrive"
  ],
  "secure storage": [
    "com.noke.nokeaccess", "com.dropbox.android", "com.s3.drive.file.explorer.storage.cloud.manager", "com.totaldrive.my.ts",
    "com.sedisto.android.sds", "me.proton.android.drive", "com.nordlocker.android.encrypt.cloud", "com.icedrive.app", "com.sync.mobileapp",
    "com.kii.safe", "com.google.android.apps.subscriptions.red", "com.storapp.app.wcs.mss", "com.storapp.app.cprd",
    "com.nordlocker.android.encrypt.cloud.v4"
  ],
  "photo backup": [
    "com.google.android.apps.photos", "ru.mail.cloud", "com.google.android.apps.photosgo", "com.dropbox.android", "com.amazon.clouddrive.photos",
    "io.ente.photos", "com.microsoft.skydrive", "com.kii.safe", "gallery.hidepictures.photovault.lockgallery", "com.synology.projectkailash",
    "com.google.android.apps.docs", "com.pcloud.pcloud", "com.snapwood.skyfolio", "photo.gallery.photoeditor.photo.album", "com.snapwood.nfolio"
  ],
  "cloud storage backup and restore": [
    "com.cloud.backup.restore.data", "cloud.storage.backup.restore", "com.infinite.cloudbackup", "com.dropbox.android",
    "com.mycloud.storage.photo.video.space", "backup.restore.contacts.sms", "mobi.infolife.appbackup", "com.fazconapps.backup.restore.data",
    "com.cloudstorage.mycloud.storagespace.cloudapp", "com.genie9.gcloudbackup", "com.backupify.cloudbackup", "com.fazconapps.cloudstorage.pro",
    "com.pcloud.pcloud", "com.backup.and.restore.all.apps.photo.backup", "me.proton.android.drive", "com.ppn.backuprestore",
    "com.cloud.phone.backup.restoredata", "org.swiftapps.swiftbackup", "com.files.fm",
    "com.clouddrive.storage.cloudbackup.restore.datatransfer.smartshare", "com.cloud.storage.extrastorage.gbsfreespace", "com.allbackup",
    "com.dubox.drive", "com.katyayini.appbackup.pro", "com.cloudstorage.cloudbackup.drivebackup", "ru.mail.cloud",
    "com.google.android.apps.subscriptions.red", "com.cloudstorageapp.cloudbackup.storagespace.databackup", "com.cloudgate.cloudstorage",
    "com.fruitmobile.app.backup"
  ],
  "cloud vault": [
    "com.applock.hidden.vaultmaster", "com.netqin.ps", "com.kii.safe", "com.pcloud.pcloud", "com.genie9.gcloudbackup", "com.veeva.vault.mobile",
    "com.dropbox.android", "com.cloud.backup.restore.data", "ru.mail.cloud", "com.dubox.drive", "com.fourchars.privary", "com.theronrogers.vaultyfree",
    "com.lf.bob.vault", "com.s3.drive.file.explorer.storage.cloud.manager", "me.proton.android.drive", "com.frederik.tcscanner", "com.safeincloud",
    "com.raymond.kiwi_vault", "com.vaultomb.classic"
  ],
  "private cloud": [
    "com.safeincloud", "com.pcloud.pcloud", "com.s3.drive.file.explorer.storage.cloud.manager", "com.nordlocker.android.encrypt.cloud.v4",
    "com.google.android.apps.cloudconsole", "com.dropbox.android", "me.proton.android.drive", "com.pikcloud.pikpak", "ru.mail.cloud",
    "com.dubox.drive", "com.kii.safe", "pro.denet.storage", "com.icedrive.app", "hyper.nest.innovations.hni.cloudvault", "io.filen.app"
  ],
  "cloud storage": [
    "com.dropbox.android", "com.google.android.apps.cloudconsole", "com.microsoft.skydrive", "com.google.android.apps.docs",
    "com.google.android.apps.subscriptions.red", "mega.privacy.android.app", "com.dubox.drive", "com.pcloud.pcloud", "com.google.android.apps.photos",
    "ru.mail.cloud", "ru.yandex.disk", "me.proton.android.drive", "com.s3.drive.file.explorer.storage.cloud.manager", "com.icedrive.app",
    "io.filen.app", "com.mobisystems.mobidrive"
  ],
  "cloud drive": [
    "com.microsoft.skydrive", "com.dropbox.android", "ru.mail.cloud", "com.google.android.apps.docs", "com.totaldrive.my.ts",
    "mega.privacy.android.app", "com.dubox.drive", "me.proton.android.drive", "com.pcloud.pcloud", "com.google.android.apps.subscriptions.red",
    "com.s3.drive.file.explorer.storage.cloud.manager", "com.mobisystems.mobidrive", "com.icedrive.app", "com.google.android.apps.cloudconsole"
  ],
  "phone backup": [
    "com.google.android.apps.subscriptions.red", "jrbeetroots.phonebackup", "com.riteshsahu.SMSBackupRestore", "com.phone.backup.restore",
    "com.microsoft.skydrive", "com.dropbox.android", "com.google.android.apps.docs", "com.sec.android.easyMover", "org.swiftapps.swiftbackup",
    "com.katyayini.appbackup.pro", "com.cloud.backup.restore.data", "com.dubox.drive", "com.ppn.backuprestore", "com.google.android.apps.photos",
    "com.rerware.android.MyBackupPro", "com.simpler.backup", "com.genie9.gcloudbackup", "com.mediamushroom.copymydata",
    "com.contacts.backup.sim.phone.number.transfer.restore", "com.ttxapps.autosync", "com.simplifieditproducts.ub4in1", "backup.restore.contacts.sms",
    "com.prosoftnet.android.idriveonline", "com.touchfield.appbackuprestore", "com.prosoftnet.android.ibackup.activity", "com.idea.backup.smscontacts",
    "com.pcloud.pcloud", "com.riteshsahu.SMSBackupRestorePro", "com.mobisystems.mobidrive", "com.oneplus.backuprestore"
  ],
  "backup and restore": [
    "com.riteshsahu.SMSBackupRestore", "com.cloud.backup.restore.data", "com.riteshsahu.SMSBackupRestorePro", "backup.restore.contacts.sms",
    "com.katyayini.appbackup.pro", "com.touchfield.appbackuprestore", "com.ppn.backuprestore", "org.swiftapps.swiftbackup", "com.simpler.backup",
    "com.rerware.android.MyBackupPro", "com.backupify.cloudbackup", "mobi.infolife.appbackup", "com.gilapps.smsshare2", "com.infinite.cloudbackup",
    "com.idea.backup.smscontacts", "jrbeetroots.phonebackup", "com.genie9.gcloudbackup", "all.backup.restore", "com.mobispeedy.recovery",
    "com.fruitmobile.app.backup", "com.extrastudio.contactbackup.pro", "appbackup.restore.hp", "com.contacts.backup.sim.phone.number.transfer.restore",
    "com.imyfone.dp.anyrecovery", "com.allbackup", "com.simplifieditproducts.ub4in1", "com.katyayini.appbackup", "com.cloud.phone.backup.restoredata",
    "com.easeus.mobisaver", "com.prosoftnet.android.ibackup.activity"
  ],
  "secure cloud storage backup": [
    "com.dropbox.android", "com.mycloud.storage.photo.video.space", "com.pcloud.pcloud", "ru.mail.cloud", "com.microsoft.skydrive",
    "com.s3.drive.file.explorer.storage.cloud.manager", "com.sync.mobileapp", "com.google.android.apps.subscriptions.red", "com.dubox.drive",
    "mega.privacy.android.app", "me.proton.android.drive", "com.cloud.backup.restore.data"
  ],
  "cloud backup": [
    "cloud.storage.backup.restore", "com.dropbox.android", "com.microsoft.skydrive", "com.google.android.apps.subscriptions.red",
    "com.google.android.apps.cloudconsole", "com.cloud.backup.restore.data", "com.dubox.drive", "com.pcloud.pcloud", "com.genie9.gcloudbackup",
    "ru.mail.cloud", "org.swiftapps.swiftbackup", "mega.privacy.android.app", "com.genie9.intelli", "com.mobisystems.mobidrive",
    "me.proton.android.drive"
  ],
  "cloud photos": [
    "ru.mail.cloud", "com.google.android.apps.photos", "com.amazon.clouddrive.photos", "com.dropbox.android", "com.pcloud.pcloud",
    "com.microsoft.skydrive", "io.ente.photos", "com.pikcloud.pikpak", "ru.yandex.disk"
  ],
  "private cloud storage": [
    "com.dropbox.android", "com.pcloud.pcloud", "com.microsoft.skydrive", "me.proton.android.drive", "ru.mail.cloud",
    "com.s3.drive.file.explorer.storage.cloud.manager", "com.dubox.drive", "mega.privacy.android.app", "com.icedrive.app", "com.mobisystems.mobidrive",
    "com.google.android.apps.subscriptions.red", "io.filen.app", "pro.denet.storage", "com.google.android.apps.cloudconsole"
  ],
  "backup photos and videos": [
    "com.google.android.apps.photos", "com.amazon.clouddrive.photos", "ru.mail.cloud", "com.dropbox.android", "com.microsoft.skydrive",
    "io.ente.photos", "org.swiftapps.swiftbackup", "com.kii.safe", "com.google.android.apps.photosgo", "com.cloud.backup.restore.data"
  ],
  "data backup": [
    "com.google.android.apps.subscriptions.red", "org.swiftapps.swiftbackup", "com.dropbox.android", "com.microsoft.skydrive",
    "com.cloud.backup.restore.data", "com.katyayini.appbackup.pro", "com.dubox.drive", "com.ttxapps.autosync", "com.prosoftnet.android.idriveonline",
    "com.mobisystems.mobidrive", "ru.mail.cloud", "com.easeus.mobisaver", "com.pcloud.pcloud", "io.ente.photos", "com.google.android.apps.photos",
    "com.backupify.cloudbackup", "mega.privacy.android.app", "me.proton.android.drive", "com.infinite.cloudbackup", "com.rerware.android.MyBackupPro",
    "jrbeetroots.phonebackup", "com.s3.drive.file.explorer.storage.cloud.manager", "com.riteshsahu.SMSBackupRestore",
    "com.simplifieditproducts.ub4in1", "com.google.android.apps.docs", "io.filen.app", "com.genie9.gcloudbackup", "com.mediamushroom.copymydata",
    "com.icedrive.app", "com.prosoftnet.android.ibackup.activity"
  ],
  "cloud drive app": [
    "ru.mail.cloud", "com.dropbox.android", "com.microsoft.skydrive", "com.google.android.apps.docs", "com.totaldrive.my.ts", "com.dubox.drive",
    "mega.privacy.android.app", "com.google.android.apps.subscriptions.red", "me.proton.android.drive", "com.google.android.apps.cloudconsole",
    "com.pcloud.pcloud", "com.mobisystems.mobidrive", "com.s3.drive.file.explorer.storage.cloud.manager", "com.icedrive.app",
    "com.cloud.backup.restore.data"
  ],
  "secure cloud storage": [
    "com.dropbox.android", "com.pcloud.pcloud", "com.microsoft.skydrive", "com.s3.drive.file.explorer.storage.cloud.manager",
    "me.proton.android.drive", "ru.mail.cloud", "mega.privacy.android.app", "com.dubox.drive", "com.icedrive.app",
    "com.google.android.apps.subscriptions.red", "io.filen.app", "com.mobisystems.mobidrive", "com.tresorit.mobile"
  ],
  "data backup and restore": [
    "com.cloud.backup.restore.data", "com.riteshsahu.SMSBackupRestore", "com.katyayini.appbackup.pro", "org.swiftapps.swiftbackup",
    "com.backupify.cloudbackup", "com.rerware.android.MyBackupPro", "com.infinite.cloudbackup", "jrbeetroots.phonebackup", "com.ppn.backuprestore",
    "com.dropbox.android", "backup.restore.contacts.sms", "com.mobispeedy.recovery", "com.genie9.gcloudbackup", "com.imyfone.dp.anyrecovery",
    "com.riteshsahu.SMSBackupRestorePro", "com.easeus.mobisaver", "com.simplifieditproducts.ub4in1", "com.prosoftnet.android.ibackup.activity",
    "com.touchfield.appbackuprestore", "com.gilapps.smsshare2", "com.simpler.backup", "com.wondershare.drfoneapp", "appbackup.restore.hp",
    "com.ttxapps.autosync", "com.cloud.phone.backup.restoredata", "mobi.infolife.appbackup", "com.imyfone.dback", "com.smart.backup.restoree",
    "all.backup.restore", "com.recovereverything.app"
  ],
  "100gb cloud storage": [
    "com.dropbox.android", "com.mobisystems.mobidrive", "mega.privacy.android.app", "com.cloudstorage.cloudbackup.drivebackup", "com.dubox.drive",
    "com.cloudstorageapp.cloudbackup.storagespace.databackup", "com.fazconapps.backup.restore.data", "com.fazconapps.cloudstorage.pro",
    "me.proton.android.drive", "com.clouddrive.storage.cloudbackup.restore.datatransfer.smartshare",
    "com.s3.drive.file.explorer.storage.cloud.manager"
  ],
  "cloud storage backup drive": [
    "com.appseen.contacts.sharing.app", "com.backup.and.restore.all.apps.photo.backup", "com.dropbox.android",
    "com.cloudstorage.backupapp.storagespace.mycloud.clouldbackup", "com.mycloud.storage.photo.video.space", "me.proton.android.drive",
    "com.google.android.apps.docs", "com.pcloud.pcloud", "com.microsoft.skydrive", "com.google.android.apps.subscriptions.red",
    "com.cloud.storage.extrastorage.gbsfreespace", "com.cloud.backup.restore.data", "ru.mail.cloud", "com.dubox.drive"
  ],
  "data restore": [
    "com.cloud.backup.restore.data", "com.wondershare.drfoneapp", "com.katyayini.appbackup.pro", "com.mobispeedy.recovery", "com.easeus.mobisaver",
    "com.riteshsahu.SMSBackupRestore", "com.imyfone.dp.anyrecovery", "com.filesrecovery.prodatarestrore", "org.swiftapps.swiftbackup",
    "com.ppn.backuprestore", "backup.restore.contacts.sms", "com.backupify.cloudbackup", "com.recovereverything.app", "com.smart.file.recover",
    "com.infinite.cloudbackup", "com.rerware.android.MyBackupPro", "com.defianttech.diskdigger", "com.riteshsahu.SMSBackupRestorePro",
    "com.imyfone.dback", "com.toolrecovery.restorerecoverydata", "com.touchfield.appbackuprestore", "com.tenorshare.recovery",
    "file.recovery.allrecovery.restore.photo.audio.video.doc.archive", "jrbeetroots.phonebackup", "restore.recover.deleted.photo.file",
    "com.defianttech.diskdiggerpro", "com.genie9.gcloudbackup", "com.photoandvideo.recoveryfilepro", "com.bitcraft.allrecoveryfiles",
    "com.restorelostfiles.dback.pro"
  ]
}
```

## Large data files (structure in the research index)

- [research/free-gb-offer-analysis/atc-creatives-Mapidirections-0.json](../../research/free-gb-offer-analysis/atc-creatives-Mapidirections-0.json) · 63 KB
- [research/free-gb-offer-analysis/atc-creatives-MindByte-0.json](../../research/free-gb-offer-analysis/atc-creatives-MindByte-0.json) · 63 KB
- [research/free-gb-offer-analysis/atc-creatives-MindByte-1.json](../../research/free-gb-offer-analysis/atc-creatives-MindByte-1.json) · 64 KB
- [research/free-gb-offer-analysis/atc-scan.json](../../research/free-gb-offer-analysis/atc-scan.json) · 133 KB
- [research/free-gb-offer-analysis/reviews.json](../../research/free-gb-offer-analysis/reviews.json) · 805 KB
- [research/google-ads-assets/serp_rows.json](../../research/google-ads-assets/serp_rows.json) · 119 KB

Raw response caches (not listed file by file): `research/aso-pipeline/`, `research/aso-pipeline/cache/`.
