param([string]$OutDocx, [string]$OutPdf)
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$blocks = Get-Content "$here\content.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
$R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'

function Esc([string]$s) { return [System.Security.SecurityElement]::Escape($s) }

# "**bold**" markup -> runs
function Runs([string]$text, [string]$extraRpr = '', [bool]$allBold = $false) {
  $parts = $text -split '\*\*'
  $sb = New-Object Text.StringBuilder
  for ($i = 0; $i -lt $parts.Count; $i++) {
    if ($parts[$i] -eq '') { continue }
    $bold = $allBold -or (($i % 2) -eq 1)
    $rpr = $(if ($bold) { '<w:b/>' } else { '' }) + $extraRpr
    [void]$sb.Append('<w:r>')
    if ($rpr) { [void]$sb.Append("<w:rPr>$rpr</w:rPr>") }
    [void]$sb.Append('<w:t xml:space="preserve">' + (Esc $parts[$i]) + '</w:t></w:r>')
  }
  return $sb.ToString()
}
function Para([string]$style, [string]$text, [string]$extraPpr = '') {
  return "<w:p><w:pPr><w:pStyle w:val=`"$style`"/>$extraPpr</w:pPr>" + (Runs $text) + '</w:p>'
}
function Table($b) {
  $widths = @($b.widths); $total = ($widths | Measure-Object -Sum).Sum
  $border = { param($n) "<w:$n w:val=`"single`" w:sz=`"4`" w:space=`"0`" w:color=`"CBD2DC`"/>" }
  $sb = New-Object Text.StringBuilder
  [void]$sb.Append("<w:tbl><w:tblPr><w:tblW w:w=`"$total`" w:type=`"dxa`"/><w:tblBorders>")
  foreach ($n in 'top', 'left', 'bottom', 'right', 'insideH', 'insideV') { [void]$sb.Append((& $border $n)) }
  [void]$sb.Append('</w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="60" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>')
  foreach ($w0 in $widths) { [void]$sb.Append("<w:gridCol w:w=`"$w0`"/>") }
  [void]$sb.Append('</w:tblGrid>')
  # header row
  [void]$sb.Append('<w:tr><w:trPr><w:cantSplit/><w:tblHeader/></w:trPr>')
  for ($c = 0; $c -lt $widths.Count; $c++) {
    [void]$sb.Append("<w:tc><w:tcPr><w:tcW w:w=`"$($widths[$c])`" w:type=`"dxa`"/><w:shd w:val=`"clear`" w:color=`"auto`" w:fill=`"1F3A5F`"/><w:vAlign w:val=`"center`"/></w:tcPr>")
    [void]$sb.Append((Para 'TableHead' ([string]$b.header[$c])))
    [void]$sb.Append('</w:tc>')
  }
  [void]$sb.Append('</w:tr>')
  $ri = 0
  foreach ($row in $b.rows) {
    $fill = $(if (($ri % 2) -eq 1) { 'F4F6F9' } else { 'FFFFFF' }); $ri++
    [void]$sb.Append('<w:tr><w:trPr><w:cantSplit/></w:trPr>')
    for ($c = 0; $c -lt $widths.Count; $c++) {
      [void]$sb.Append("<w:tc><w:tcPr><w:tcW w:w=`"$($widths[$c])`" w:type=`"dxa`"/><w:shd w:val=`"clear`" w:color=`"auto`" w:fill=`"$fill`"/></w:tcPr>")
      [void]$sb.Append((Para 'TableText' ([string]$row[$c])))
      [void]$sb.Append('</w:tc>')
    }
    [void]$sb.Append('</w:tr>')
  }
  [void]$sb.Append('</w:tbl>')
  [void]$sb.Append('<w:p><w:pPr><w:pStyle w:val="TableGap"/></w:pPr></w:p>')
  return $sb.ToString()
}

$body = New-Object Text.StringBuilder
foreach ($b in $blocks) {
  switch ($b.type) {
    'title'    { [void]$body.Append((Para 'Title' $b.text)) }
    'subtitle' { [void]$body.Append((Para 'Subtitle' $b.text)) }
    'meta'     { [void]$body.Append((Para 'Meta' $b.text)) }
    'h1'       { [void]$body.Append((Para 'Heading1' $b.text)) }
    'h1break'  { [void]$body.Append((Para 'Heading1' $b.text '<w:pageBreakBefore/>')) }
    'h2'       { [void]$body.Append((Para 'Heading2' $b.text)) }
    'p'        { [void]$body.Append((Para 'Normal' $b.text)) }
    'note'     { [void]$body.Append((Para 'Note' $b.text)) }
    'bullets'  { foreach ($it in $b.items) { [void]$body.Append((Para 'ListBullet' ([string]$it) '<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>')) } }
    'table'    { [void]$body.Append((Table $b)) }
  }
}
$sect = '<w:sectPr><w:footerReference w:type="default" r:id="rId3"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr>'
$document = "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><w:document xmlns:w=`"$W`" xmlns:r=`"$R`"><w:body>" + $body.ToString() + $sect + '</w:body></w:document>'

$font = 'Calibri'
$styles = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="$W">
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="$font" w:hAnsi="$font" w:cs="$font" w:eastAsia="$font"/><w:color w:val="1D2433"/><w:sz w:val="21"/><w:szCs w:val="21"/><w:lang w:val="en-US"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:before="0" w:after="60" w:line="240" w:lineRule="auto"/></w:pPr><w:rPr><w:b/><w:color w:val="1F3A5F"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="80"/></w:pPr><w:rPr><w:color w:val="2F5FA8"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Meta"><w:name w:val="Meta"/><w:basedOn w:val="Normal"/><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="8" w:space="8" w:color="1F3A5F"/></w:pBdr><w:spacing w:after="200"/></w:pPr><w:rPr><w:color w:val="5B6577"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:keepLines/><w:spacing w:before="320" w:after="120"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:color w:val="1F3A5F"/><w:sz w:val="30"/><w:szCs w:val="30"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:keepLines/><w:spacing w:before="200" w:after="100"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:color w:val="2F5FA8"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="ListBullet"><w:name w:val="List Bullet"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="90"/></w:pPr></w:style>
<w:style w:type="paragraph" w:styleId="TableText"><w:name w:val="Table Text"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="0" w:line="252" w:lineRule="auto"/></w:pPr><w:rPr><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="TableHead"><w:name w:val="Table Head"/><w:basedOn w:val="TableText"/><w:pPr><w:keepNext/></w:pPr><w:rPr><w:b/><w:color w:val="FFFFFF"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="TableGap"><w:name w:val="Table Gap"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="60" w:line="120" w:lineRule="exact"/></w:pPr><w:rPr><w:sz w:val="8"/><w:szCs w:val="8"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Note"><w:name w:val="Note"/><w:basedOn w:val="Normal"/><w:rPr><w:i/><w:color w:val="5B6577"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Footer"><w:name w:val="footer"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="0"/><w:jc w:val="center"/></w:pPr><w:rPr><w:color w:val="5B6577"/><w:sz w:val="16"/><w:szCs w:val="16"/></w:rPr></w:style>
</w:styles>
"@
$bullet = [string][char]0x2022
$numbering = "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><w:numbering xmlns:w=`"$W`"><w:abstractNum w:abstractNumId=`"0`"><w:multiLevelType w:val=`"hybridMultilevel`"/><w:lvl w:ilvl=`"0`"><w:start w:val=`"1`"/><w:numFmt w:val=`"bullet`"/><w:lvlText w:val=`"$bullet`"/><w:lvlJc w:val=`"left`"/><w:pPr><w:ind w:left=`"425`" w:hanging=`"283`"/></w:pPr><w:rPr><w:color w:val=`"2F5FA8`"/></w:rPr></w:lvl></w:abstractNum><w:num w:numId=`"1`"><w:abstractNumId w:val=`"0`"/></w:num></w:numbering>"
$fld = { param($t) "<w:r><w:fldChar w:fldCharType=`"begin`"/></w:r><w:r><w:instrText xml:space=`"preserve`"> $t </w:instrText></w:r><w:r><w:fldChar w:fldCharType=`"separate`"/></w:r><w:r><w:t>1</w:t></w:r><w:r><w:fldChar w:fldCharType=`"end`"/></w:r>" }
$footer = "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><w:ftr xmlns:w=`"$W`" xmlns:r=`"$R`"><w:p><w:pPr><w:pStyle w:val=`"Footer`"/></w:pPr><w:r><w:t xml:space=`"preserve`">Cloud Storage: Secure Vault | Google Ads text assets | 21 Sep 2026 | Page </w:t></w:r>" + (& $fld 'PAGE') + '<w:r><w:t xml:space="preserve"> of </w:t></w:r>' + (& $fld 'NUMPAGES') + '</w:p></w:ftr>'
$ctypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>'
$rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>'
$docrels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/></Relationships>'
$core = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Google Ads Text Assets - Cloud Storage: Secure Vault</dc:title><dc:subject>App campaign headlines and descriptions, United States</dc:subject><dcterms:created xsi:type="dcterms:W3CDTF">2026-09-21T00:00:00Z</dcterms:created></cp:coreProperties>'

# every part must be well-formed before it is zipped
foreach ($x in $document, $styles, $numbering, $footer, $ctypes, $rels, $docrels, $core) { $null = [xml]$x }

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
if (Test-Path $OutDocx) { Remove-Item $OutDocx -Force }
$utf8 = New-Object Text.UTF8Encoding($false)
$fs = [IO.File]::Open($OutDocx, [IO.FileMode]::Create)
$zip = New-Object IO.Compression.ZipArchive($fs, [IO.Compression.ZipArchiveMode]::Create)
$parts = [ordered]@{ '[Content_Types].xml' = $ctypes; '_rels/.rels' = $rels; 'docProps/core.xml' = $core; 'word/document.xml' = $document; 'word/styles.xml' = $styles; 'word/numbering.xml' = $numbering; 'word/footer1.xml' = $footer; 'word/_rels/document.xml.rels' = $docrels }
foreach ($k in $parts.Keys) {
  $e = $zip.CreateEntry($k, [IO.Compression.CompressionLevel]::Optimal)
  $s = $e.Open(); $bytes = $utf8.GetBytes([string]$parts[$k]); $s.Write($bytes, 0, $bytes.Length); $s.Dispose()
}
$zip.Dispose(); $fs.Dispose()
"docx written: $OutDocx ({0:N0} bytes)" -f (Get-Item $OutDocx).Length

# Word opens the file strictly (no repair) and exports the matching PDF
$word = New-Object -ComObject Word.Application
$word.Visible = $false; $word.DisplayAlerts = 0
try {
  $doc = $word.Documents.Open($OutDocx, $false, $true, $false, '', '', $false, '', '', 0, 0, $false, $false)
  "pages in Word: " + $doc.ComputeStatistics(2)
  if (Test-Path $OutPdf) { Remove-Item $OutPdf -Force }
  $doc.ExportAsFixedFormat($OutPdf, 17, $false, 0, 0, 0, 0, 0, $true, $true, 1, $true, $true, $false)
  $doc.Close(0)
  "pdf written: $OutPdf ({0:N0} bytes)" -f (Get-Item $OutPdf).Length
} finally { $word.Quit(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($word) }
