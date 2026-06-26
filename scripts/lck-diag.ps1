# Diagnose stale LCK player photos. ASCII script; Korean read from UTF8 map.
# For each key: compare on-disk players/{key}.jpg against RE-PROCESSING the current
# desktop source (center-square 512). Signals: mtime delta + mean pixel diff (MAD).
Add-Type -AssemblyName PresentationCore, WindowsBase
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

function Load-Bgra($path, $doCrop) {
  $s = [System.IO.File]::OpenRead($path)
  try {
    $d = [System.Windows.Media.Imaging.BitmapDecoder]::Create($s, [System.Windows.Media.Imaging.BitmapCreateOptions]::PreservePixelFormat, [System.Windows.Media.Imaging.BitmapCacheOption]::OnLoad)
    $f = $d.Frames[0]; $ow = $f.PixelWidth; $oh = $f.PixelHeight
    $img = $f
    if ($doCrop) {
      $side = [Math]::Min($ow, $oh)
      $crop = New-Object System.Windows.Media.Imaging.CroppedBitmap($f, (New-Object System.Windows.Int32Rect([int](($ow - $side) / 2), [int](($oh - $side) / 2), $side, $side)))
      $sc = 512.0 / $side
      $img = New-Object System.Windows.Media.Imaging.TransformedBitmap($crop, (New-Object System.Windows.Media.ScaleTransform($sc, $sc)))
    }
    $conv = New-Object System.Windows.Media.Imaging.FormatConvertedBitmap
    $conv.BeginInit(); $conv.Source = $img; $conv.DestinationFormat = [System.Windows.Media.PixelFormats]::Bgra32; $conv.EndInit()
    $w = $conv.PixelWidth; $h = $conv.PixelHeight; $stride = $w * 4
    $buf = New-Object byte[] ($stride * $h)
    $conv.CopyPixels($buf, $stride, 0)
    return @{ W = $w; H = $h; OW = $ow; OH = $oh; Buf = $buf }
  } finally { $s.Close() }
}

function MAD($a, $b) {
  if ($a.Length -ne $b.Length) { return -1.0 }
  $sum = 0.0; $n = $a.Length
  for ($i = 0; $i -lt $n; $i++) { $diff = [Math]::Abs([int]$a[$i] - [int]$b[$i]); $sum += $diff }
  return [Math]::Round($sum / $n, 2)
}

function SHA8($path) { return (Get-FileHash $path -Algorithm SHA256).Hash.Substring(0, 8).ToLower() }

# index desktop sources by NFC basename
$srcByBase = @{}
Get-ChildItem $folder -File | Where-Object { $_.Extension -match '(?i)\.(jpe?g|png|webp)$' } | ForEach-Object { $srcByBase[(NFC $_.BaseName)] = $_ }

$ordered = @("khan","kiin","marin","smeb","zeus","canyon","score","ambition","peanut","bengi","chovy","faker","pawn","zeka","showmaker","imp","ruler","bang","deft","pray","madlife","corejj","keria","mata","wolf")
# reverse map key->korean
$keyToKo = @{}; foreach ($k in $map.Keys) { $keyToKo[$map[$k]] = $k }

$stale = @(); $usedBases = @{}
"{0,-10} {1,-9} {2,-13} {3,-7} {4,-8} {5,-8} {6,-6} {7}" -f "key","srcRes","srcMTime","diskSHA","dskMT>src","srcMT","MAD","verdict"
"--------------------------------------------------------------------------------------------"
foreach ($key in $ordered) {
  $ko = $keyToKo[$key]
  $src = $srcByBase[$ko]
  $diskPath = Join-Path $dst "$key.jpg"
  if (-not $src) { "{0,-10} {1}" -f $key, "NO SOURCE FILE for '$ko'"; continue }
  $usedBases[$ko] = $true
  if (-not (Test-Path $diskPath)) { "{0,-10} {1}" -f $key, "NO DISK FILE"; $stale += $key; continue }
  $proc = Load-Bgra $src.FullName $true
  $disk = Load-Bgra $diskPath $false
  $mad = MAD $disk.Buf $proc.Buf
  $diskMT = (Get-Item $diskPath).LastWriteTime
  $srcMT = $src.LastWriteTime
  $srcNewer = $srcMT -gt $diskMT
  $verdict = if ($mad -lt 0) { "SIZE-DIFF($($disk.W)x$($disk.H) vs $($proc.W)x$($proc.H))" } elseif ($mad -ge 6.0) { "STALE (content differs)" } elseif ($srcNewer) { "stale? srcNewer,lowMAD" } else { "OK match" }
  if ($verdict -like "STALE*" -or $verdict -like "*srcNewer*" -or $verdict -like "SIZE*") { $stale += $key }
  "{0,-10} {1,-9} {2,-13} {3,-7} {4,-8} {5,-8} {6,-6} {7}" -f $key, ("$($proc.OW)x$($proc.OH)"), $srcMT.ToString("MM-dd HH:mm"), (SHA8 $diskPath), $srcNewer, $diskMT.ToString("HH:mm"), $mad, $verdict
}
"--------------------------------------------------------------------------------------------"
# orphan sources not consumed by any key
$orphans = @()
foreach ($b in $srcByBase.Keys) { if (-not $map.ContainsKey($b)) { $orphans += "$b ($($srcByBase[$b].Name))" } }
if ($orphans.Count) { "ORPHAN SOURCES (in folder, not in map): " + ($orphans -join ' | ') } else { "ORPHAN SOURCES: none" }
$staleMsg = if ($stale.Count) { $stale -join ', ' } else { "none - all 25 match current source" }
"STALE/SUSPECT KEYS: " + $staleMsg
