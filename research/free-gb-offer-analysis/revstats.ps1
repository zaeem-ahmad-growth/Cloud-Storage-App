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
