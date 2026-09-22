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
