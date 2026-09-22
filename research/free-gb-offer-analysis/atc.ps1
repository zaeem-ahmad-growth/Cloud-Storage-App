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
