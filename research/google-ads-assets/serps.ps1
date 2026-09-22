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
