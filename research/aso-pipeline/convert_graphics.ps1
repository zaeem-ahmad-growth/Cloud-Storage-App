Add-Type -AssemblyName System.Drawing
$src = 'C:\Users\HP\Documents\Codex\2026-09-10\cre\outputs\cloud-competitor-memory'
$dst = Join-Path $PSScriptRoot 'graphics'
$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }

function Save-Jpeg($inPath, $outPath, $maxLong, $quality) {
    $img = [System.Drawing.Image]::FromFile($inPath)
    try {
        $scale = [Math]::Min(1.0, $maxLong / [Math]::Max($img.Width, $img.Height))
        $w = [int][Math]::Round($img.Width * $scale); $h = [int][Math]::Round($img.Height * $scale)
        $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.Clear([System.Drawing.Color]::White)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.DrawImage($img, 0, 0, $w, $h)
        $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$quality)
        $bmp.Save($outPath, $jpeg, $ep)
        $g.Dispose(); $bmp.Dispose()
    } finally { $img.Dispose() }
}

$count = 0
Get-ChildItem $src -Directory | ForEach-Object {
    $app = $_.Name
    $out = Join-Path $dst $app
    New-Item -ItemType Directory -Force $out | Out-Null
    Get-ChildItem $_.FullName -File | Where-Object { $_.Name -match '^(icon|feature-graphic|screenshot)-\d+\.(png|jpg|jpeg)$' } | ForEach-Object {
        $base = [IO.Path]::GetFileNameWithoutExtension($_.Name)
        if ($_.Name -like 'icon-*') { Copy-Item $_.FullName (Join-Path $out $_.Name) -Force }
        elseif ($_.Name -like 'feature-graphic-*') { Save-Jpeg $_.FullName (Join-Path $out "$base.jpg") 1024 90 }
        else { Save-Jpeg $_.FullName (Join-Path $out "$base.jpg") 1400 84 }
        $count++
    }
}
$all = Get-ChildItem $dst -Recurse -File
"converted $count files -> $($all.Count) outputs, $([Math]::Round(($all | Measure-Object Length -Sum).Sum / 1MB, 1)) MB"
$all | Sort-Object Length -Descending | Select-Object -First 3 | ForEach-Object { "  largest: $($_.Directory.Name)/$($_.Name) $([Math]::Round($_.Length/1KB)) KB" }
