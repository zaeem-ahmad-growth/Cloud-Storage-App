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
