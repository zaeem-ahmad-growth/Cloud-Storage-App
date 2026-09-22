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
