# Copy desktop "롤 프로게이머" photos -> players/{key}.jpg, center-square 512 crop. Korean read from UTF8 map file (ASCII script).
Add-Type -AssemblyName PresentationCore, WindowsBase
Add-Type -AssemblyName System.Drawing
$dst = "c:\Users\san84\nolza\public\images\tests\lck\players"
$lines = Get-Content "c:\Users\san84\nolza\scripts\lck-map.txt" -Encoding UTF8
$folder = $null; $map = @{}
function NFC($s) { return $s.Normalize([Text.NormalizationForm]::FormC) }
foreach ($ln in $lines) {
  if ($ln -match '^\s*$') { continue }
  if ($ln -like 'DIR=*') { $folder = $ln.Substring(4).Trim(); continue }
  $kv = $ln -split '=', 2
  if ($kv.Count -eq 2) { $map[(NFC ($kv[0].Trim()))] = $kv[1].Trim() }
}
Write-Output "folder: $folder"
Write-Output "map entries: $($map.Count)"

function Save-SquareJpg($srcPath, $outPath) {
  $s = [System.IO.File]::OpenRead($srcPath)
  try {
    $d = [System.Windows.Media.Imaging.BitmapDecoder]::Create($s, [System.Windows.Media.Imaging.BitmapCreateOptions]::PreservePixelFormat, [System.Windows.Media.Imaging.BitmapCacheOption]::OnLoad)
    $f = $d.Frames[0]; $w = $f.PixelWidth; $h = $f.PixelHeight; $side = [Math]::Min($w, $h)
    $crop = New-Object System.Windows.Media.Imaging.CroppedBitmap($f, (New-Object System.Windows.Int32Rect([int](($w - $side) / 2), [int](($h - $side) / 2), $side, $side)))
    $sc = 512.0 / $side
    $tb = New-Object System.Windows.Media.Imaging.TransformedBitmap($crop, (New-Object System.Windows.Media.ScaleTransform($sc, $sc)))
    $e = New-Object System.Windows.Media.Imaging.JpegBitmapEncoder; $e.QualityLevel = 90
    $e.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($tb))
    $o = [System.IO.File]::Open($outPath, 'Create'); try { $e.Save($o) } finally { $o.Close() }
    return "${w}x${h}"
  } finally { $s.Close() }
}

$files = Get-ChildItem $folder -File | Where-Object { $_.Extension -match '(?i)\.(jpe?g|png|webp)$' }
$used = @{}; $unmatched = @()
foreach ($fi in $files) {
  $base = NFC $fi.BaseName
  if ($map.ContainsKey($base)) {
    $key = $map[$base]
    try {
      $sz = Save-SquareJpg $fi.FullName (Join-Path $dst "$key.jpg")
      $used[$key] = $true
      Write-Output ("$($fi.Name)  ->  $key.jpg   (src $sz)")
    } catch { Write-Output ("$($fi.Name)  ->  $key  ERROR $($_.Exception.Message)") }
  } else { $unmatched += $fi.Name }
}
if ($unmatched.Count) { Write-Output ("UNMATCHED FILES: " + ($unmatched -join ', ')) }
$missingKeys = @(); foreach ($k in $map.Values) { if (-not $used.ContainsKey($k)) { $missingKeys += $k } }
if ($missingKeys.Count) { Write-Output ("KEYS WITH NO SOURCE: " + ($missingKeys -join ', ')) }
Write-Output ("copied: $($used.Count)/25; players jpgs now: " + (Get-ChildItem $dst -Filter *.jpg).Count)

# 5x5 contact sheet
$rows = @(@("khan","kiin","marin","smeb","zeus"),@("canyon","score","ambition","peanut","bengi"),@("chovy","faker","pawn","zeka","showmaker"),@("imp","ruler","bang","deft","pray"),@("madlife","corejj","keria","mata","wolf"))
$cell=210;$pad=14;$labelH=28;$cw=$cell+$pad;$ch=$cell+$labelH+$pad;$W=$cw*5+$pad;$H=$ch*5+$pad
$sheet=New-Object System.Drawing.Bitmap $W,$H;$sg=[System.Drawing.Graphics]::FromImage($sheet)
$sg.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic;$sg.Clear([System.Drawing.Color]::FromArgb(10,16,28))
$font=New-Object System.Drawing.Font("Consolas",12,[System.Drawing.FontStyle]::Bold);$fmt=New-Object System.Drawing.StringFormat;$fmt.Alignment=[System.Drawing.StringAlignment]::Center
$gold=New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(200,170,110));$white=New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White);$mb=New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(40,30,30))
for($ri=0;$ri -lt 5;$ri++){for($ci=0;$ci -lt 5;$ci++){$k=$rows[$ri][$ci];$x=$pad+$ci*$cw;$y=$pad+$ri*$ch;$f=Join-Path $dst "$k.jpg"
  if(Test-Path $f){$im=[System.Drawing.Image]::FromFile($f);$sg.DrawImage($im,$x,$y,$cell,$cell);$im.Dispose()}
  else{$sg.FillRectangle($mb,$x,$y,$cell,$cell);$sg.DrawString("MISSING",$font,$white,(New-Object System.Drawing.RectangleF($x,($y+$cell/2-10),$cell,20)),$fmt)}
  $sg.DrawString($k,$font,$gold,(New-Object System.Drawing.RectangleF($x,($y+$cell+3),$cell,$labelH)),$fmt)}}
$sg.Dispose();$sd="c:\Users\san84\nolza\.tmp-lck-sheet";New-Item -ItemType Directory -Force $sd|Out-Null
$sheet.Save((Join-Path $sd "contact.png"),[System.Drawing.Imaging.ImageFormat]::Png);$sheet.Dispose()
Write-Output "SHEET: $sd\contact.png"
