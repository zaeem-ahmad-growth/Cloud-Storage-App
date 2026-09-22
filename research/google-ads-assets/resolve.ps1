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
