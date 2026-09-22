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
