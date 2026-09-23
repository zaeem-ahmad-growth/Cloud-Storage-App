# Ranks competitor target countries from data already in this repository. No scraping, no network.
#
# Inputs (all collected earlier, dates in the comments):
#   research/free-gb-offer-analysis/sensortower.json  - 21 Sep 2026: each competitor's top-3 download markets,
#                                                       its Sensor Tower monthly downloads and monthly revenue.
#   assets/data.js  PAYLOAD.data.profiles[].perMarket  - 15 Sep 2026: 94-keyword rank board, 4 markets (US, PK, AE, NG).
#   assets/data.js  PAYLOAD.data.probe                 - 15 Sep 2026: 5 head terms x 12 country catalogs.
#
# Two scores per country:
#   dlIndex   - MODELLED. Each app's Sensor Tower monthly downloads are split across its three top markets
#               50/30/20 (Sensor Tower publishes the order, not the split). Normalised to 100.
#               This is an attribution model, not a measurement. It is the weakest number in the table.
#   rankIndex - MEASURED. Competitor top-10 slots on the 94-keyword board where a board exists (US, PK, AE, NG),
#               otherwise competitor placements in the 12-market head-term probe, scaled to the board's range
#               so the two evidence types can share a column. Normalised to 100.
#   score     - the mean of the two, rounded. Countries with a board are measured more deeply than the rest:
#               that bias is real and is stated on the page.

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)

# --- Sensor Tower: monthly downloads and the top-3 markets, 21 Sep 2026 -------------------------------------
$st = Get-Content "$root\research\free-gb-offer-analysis\sensortower.json" -Raw | ConvertFrom-Json
$weights = 0.5, 0.3, 0.2
$dl = @{}
foreach ($a in $st) {
  if (-not $a.top) { continue }
  $markets = @($a.top -split ',' | Where-Object { $_ })
  for ($i = 0; $i -lt $markets.Count -and $i -lt 3; $i++) {
    $cc = $markets[$i].Trim()
    if (-not $dl.ContainsKey($cc)) { $dl[$cc] = 0.0 }
    $dl[$cc] += [double]$a.dl * $weights[$i]
  }
}

# --- 94-keyword board: competitor top-10 slots per market, 15 Sep 2026 -------------------------------------
$raw = Get-Content "$root\assets\data.js" -Raw
$json = $raw.Substring($raw.IndexOf('const PAYLOAD = ') + 16)
$json = $json.Substring(0, $json.LastIndexOf('};') + 1)
$p = $json | ConvertFrom-Json

$board = @{}
foreach ($m in 'US', 'PK', 'AE', 'NG') {
  $slots = 0
  foreach ($c in $p.data.profiles) { $slots += [int]$c.perMarket.$m.top10 }
  $board[$m] = $slots
}

# --- 12-market probe: competitor placements per country, 15 Sep 2026 ---------------------------------------
$probe = @{}
foreach ($row in $p.data.probe) {
  $n = 0
  foreach ($cell in $row.cells) { if ($cell.hits) { $n += @($cell.hits).Count } }
  $probe[$row.gl] = $n
}

# Put probe placements on the board's scale: the busiest probe country (4 placements) maps to the busiest
# board market's slot count, so neither evidence type silently outweighs the other.
$probeMax = ($probe.Values | Measure-Object -Maximum).Maximum
$boardMax = ($board.Values | Measure-Object -Maximum).Maximum
$scale = if ($probeMax -gt 0) { $boardMax / $probeMax } else { 0 }

$countries = @($dl.Keys) + @($board.Keys) + @($probe.Keys) | Sort-Object -Unique
$rows = foreach ($cc in $countries) {
  $rankRaw = if ($board.ContainsKey($cc)) { $board[$cc] } else { [double]$probe[$cc] * $scale }
  [pscustomobject]@{
    cc        = $cc
    dlModel   = [math]::Round(([double]$dl[$cc]), 0)
    stApps    = @($st | Where-Object { $_.top -and ($_.top -split ',') -contains $cc }).Count
    boardT10  = if ($board.ContainsKey($cc)) { $board[$cc] } else { $null }
    probeHits = if ($probe.ContainsKey($cc)) { $probe[$cc] } else { $null }
    rankRaw   = [math]::Round($rankRaw, 1)
  }
}

$dlMax = ($rows | Measure-Object -Property dlModel -Maximum).Maximum
$rkMax = ($rows | Measure-Object -Property rankRaw -Maximum).Maximum
foreach ($r in $rows) {
  $dlIdx = if ($dlMax) { 100 * $r.dlModel / $dlMax } else { 0 }
  $rkIdx = if ($rkMax) { 100 * $r.rankRaw / $rkMax } else { 0 }
  $r | Add-Member dlIndex   ([math]::Round($dlIdx, 1))
  $r | Add-Member rankIndex ([math]::Round($rkIdx, 1))
  $r | Add-Member score     ([math]::Round(($dlIdx + $rkIdx) / 2, 1))
}

$rows | Sort-Object -Property score -Descending |
  Format-Table cc, score, dlIndex, rankIndex, dlModel, stApps, boardT10, probeHits -AutoSize
