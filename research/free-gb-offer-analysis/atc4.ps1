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
