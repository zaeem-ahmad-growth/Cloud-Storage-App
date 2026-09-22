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
