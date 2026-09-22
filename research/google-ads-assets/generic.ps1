$ErrorActionPreference = 'Stop'
$sp = "C:\Users\HP\AppData\Local\Temp\claude\C--Users-HP\989e82b5-54b9-4cbd-8e7d-b6b07fc76f06\scratchpad"
$old = "C:\Users\HP\AppData\Local\Temp\claude\C--Users-HP\148ec70d-5bcf-4059-9a87-dec996069a0b\scratchpad\aso\data.json"
$d = Get-Content $old -Raw -Encoding UTF8 | ConvertFrom-Json
function Norm([string]$s) { $x = $s.ToLower().Replace('&', ' and '); $x = [regex]::Replace($x, '[^a-z0-9]+', ' '); return $x.Trim() }
function Near([string]$s) { $t = (Norm $s) -split ' ' | Where-Object { $_ -and $_ -notin 'and', 'app', 'apps', 'the', 'for', 'to', 'your', 'my', 'a' }; return ($t -join ' ') }
function Fmt($n) { if ($n -ge 1e9) { '{0:0.#}B' -f ($n / 1e9) } elseif ($n -ge 1e6) { '{0:0.#}M' -f ($n / 1e6) } elseif ($n -ge 1e3) { '{0:0.#}K' -f ($n / 1e3) } else { "$n" } }

# corpus: 522 board apps + every details page fetched live on 21 Sep
$corp = @{}
foreach ($a in $d.apps) { $corp[$a[0]] = [pscustomobject]@{ id = $a[0]; t = [string]$a[1]; dev = [string]$a[2]; i = [int64]$a[3]; b = $a[8]; cat = $a[9]; comp = $a[10] } }
foreach ($f in Get-ChildItem "$sp\det" -Filter *.html) {
  $id = $f.BaseName; if ($corp.ContainsKey($id)) { continue }
  $h = [IO.File]::ReadAllText($f.FullName)
  $t = [System.Net.WebUtility]::HtmlDecode([regex]::Match($h, '<meta property="og:title" content="([^"]*?)( - Apps on Google Play)?"').Groups[1].Value)
  $m = [regex]::Match($h, '\["([\d,]+\+)",(\d+),(\d+),"[^"]*"\]')
  $corp[$id] = [pscustomobject]@{ id = $id; t = $t; dev = ''; i = $(if ($m.Success) { [int64]$m.Groups[3].Value } else { 0 }); b = 0; cat = ''; comp = 0 }
}
$all = $corp.Values
"corpus: {0} app titles" -f $all.Count

"=== A. How widely each keyword is shared in app titles (non-big-brand developers only)"
"phrase | titles | distinct developers | at 1M+ | at 100K+ | of your 11 competitors | biggest third-party title"
$phrases = 'cloud storage', 'cloud drive', 'cloud backup', 'drive backup', 'backup and restore', 'cloud storage drive', 'cloud storage backup', 'storage backup', 'data backup', 'phone backup', 'photo backup', 'secure cloud storage', 'secure cloud', 'private cloud', 'cloud vault', 'secure vault', 'data restore', 'file storage', 'photo storage'
foreach ($p in $phrases) {
  $hits = $all | Where-Object { $_.b -ne 1 -and (' ' + (Norm $_.t) + ' ').Contains(' ' + $p + ' ') }
  $devs = @($hits | ForEach-Object { if ($_.dev) { $_.dev } else { $_.id } } | Sort-Object -Unique).Count
  $top = $hits | Sort-Object i -Descending | Select-Object -First 1
  "{0} | {1} | {2} | {3} | {4} | {5} | {6}" -f $p, @($hits).Count, $devs, @($hits | Where-Object { $_.i -ge 1e6 }).Count, @($hits | Where-Object { $_.i -ge 1e5 }).Count, @($hits | Where-Object { $_.comp -eq 1 }).Count, $(if ($top) { "$($top.t) [$(Fmt $top.i)]" } else { '' })
}

"=== A2. Most shared 2- and 3-word phrases in cloud-niche titles (auto-extracted, by distinct developer)"
$grams = @{}
foreach ($a in ($all | Where-Object { $_.cat -eq 'cloud' -and $_.b -ne 1 })) {
  $w = (Norm $a.t) -split ' ' | Where-Object { $_ }
  $seen = @{}
  foreach ($n in 2, 3) { for ($i = 0; $i + $n -le $w.Count; $i++) { $g = ($w[$i..($i + $n - 1)] -join ' '); if (-not $seen.ContainsKey($g)) { $seen[$g] = 1; if (-not $grams.ContainsKey($g)) { $grams[$g] = New-Object System.Collections.Generic.HashSet[string] }; [void]$grams[$g].Add($a.dev) } } }
}
$grams.GetEnumerator() | Where-Object { $_.Key -notmatch '^(and|for|the|of|to) | (and|for|the|of|to)$' } | Sort-Object { $_.Value.Count } -Descending | Select-Object -First 22 | ForEach-Object { "   {0} : {1} developers" -f $_.Key, $_.Value.Count }

"=== B. Exact full titles shared by 2+ apps (whole corpus)"
$dups = $all | Group-Object { Norm $_.t } | Where-Object { $_.Count -ge 2 -and $_.Name }
"{0} of {1} distinct titles are shared by more than one app" -f @($dups).Count, @($all | Group-Object { Norm $_.t }).Count
$dups | Sort-Object Count -Descending | ForEach-Object { "   '{0}' x{1}: {2}" -f $_.Group[0].t, $_.Count, (($_.Group | ForEach-Object { "$($_.dev) [$(Fmt $_.i)]" }) -join ' ; ') }

"=== C. Candidate headlines vs every known title"
$exact = @{}; $near = @{}
foreach ($a in $all) { $k = Norm $a.t; if ($k) { if (-not $exact.ContainsKey($k)) { $exact[$k] = @() }; $exact[$k] += $a }; $k2 = Near $a.t; if ($k2) { if (-not $near.ContainsKey($k2)) { $near[$k2] = @() }; $near[$k2] += $a } }
foreach ($h in (Get-Content "$sp\candidates.txt" -Encoding UTF8 | Where-Object { $_.Trim() })) {
  $e = $exact[(Norm $h)]; $n = $near[(Near $h)]
  $status = $(if ($e) { 'EXACT TITLE' } elseif ($n) { 'NEAR TITLE ' } else { 'clear      ' })
  $who = $(if ($e) { $e } elseif ($n) { $n } else { @() })
  "{0} {1,2} | {2} {3}" -f $status, $h.Length, $h, $(if ($who) { '<= ' + (($who | ForEach-Object { "$($_.t) [$(Fmt $_.i)]" }) -join ' ; ') } else { '' })
}
