# Regenerate the 5x5 LCK contact sheet from the ON-DISK players/*.jpg (what the site serves).
Add-Type -AssemblyName System.Drawing
$dst = "c:\Users\san84\nolza\public\images\tests\lck\players"
$rows = @(@("khan","kiin","marin","smeb","zeus"),@("canyon","score","ambition","peanut","bengi"),@("chovy","faker","pawn","zeka","showmaker"),@("imp","ruler","bang","deft","pray"),@("madlife","corejj","keria","mata","wolf"))
$cell=210;$pad=14;$labelH=28;$cw=$cell+$pad;$ch=$cell+$labelH+$pad;$W=$cw*5+$pad;$H=$ch*5+$pad
$sheet=New-Object System.Drawing.Bitmap $W,$H;$sg=[System.Drawing.Graphics]::FromImage($sheet)
$sg.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic;$sg.Clear([System.Drawing.Color]::FromArgb(10,16,28))
$font=New-Object System.Drawing.Font("Consolas",12,[System.Drawing.FontStyle]::Bold);$fmt=New-Object System.Drawing.StringFormat;$fmt.Alignment=[System.Drawing.StringAlignment]::Center
$gold=New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(200,170,110));$white=New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White);$mb=New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(40,30,30))
for($ri=0;$ri -lt 5;$ri++){for($ci=0;$ci -lt 5;$ci++){$k=$rows[$ri][$ci];$x=$pad+$ci*$cw;$y=$pad+$ri*$ch;$f=Join-Path $dst "$k.jpg"
  if(Test-Path $f){$by=[System.IO.File]::ReadAllBytes($f);$ms=New-Object System.IO.MemoryStream(,$by);$im=[System.Drawing.Image]::FromStream($ms);$sg.DrawImage($im,$x,$y,$cell,$cell);$im.Dispose();$ms.Dispose()}
  else{$sg.FillRectangle($mb,$x,$y,$cell,$cell);$sg.DrawString("MISSING",$font,$white,(New-Object System.Drawing.RectangleF($x,($y+$cell/2-10),$cell,20)),$fmt)}
  $sg.DrawString($k,$font,$gold,(New-Object System.Drawing.RectangleF($x,($y+$cell+3),$cell,$labelH)),$fmt)}}
$sg.Dispose();$sd="c:\Users\san84\nolza\.tmp-lck-sheet";New-Item -ItemType Directory -Force $sd|Out-Null
$out=Join-Path $sd "contact-v2.png"
$sheet.Save($out,[System.Drawing.Imaging.ImageFormat]::Png);$sheet.Dispose()
Write-Output "SHEET: $out"
