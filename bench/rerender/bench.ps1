# RR0 (docs/rerender.feature): bench.sh and change.sh for Windows, in the PowerShell every Windows PC has (5.1), with no
# bash, jq or ffmpeg needed. The same runs and the same run.json / change.json as bench.sh and change.sh:
#   chunked  the six shot compositions as six renders, -P at a time, joined with ffmpeg -c copy when ffmpeg is on PATH,
#            else with raea media concat (which re-encodes); run.json says which
#   one      the "film" composition as one render (before RR1 it holds shot 1's look for all 900 frames)
#   -Note    then change.sh's case: shot 4's NOIR line changed on a copy of shots.tsx, shot 4 rendered again and joined
#            again, and the whole film rendered again
#   powershell -ExecutionPolicy Bypass -File bench\rerender\bench.ps1 -Raea C:\path\raea.exe -Out C:\scratch\rr0 [-P 3] [-Note] [-Keep]
param(
  [Parameter(Mandatory = $true)][string]$Raea,
  [Parameter(Mandatory = $true)][string]$Out,
  [string]$Film = "",
  [int]$P = 3,
  [switch]$Note,
  [switch]$Keep
)
# "Continue": under "Stop", a native command's stderr line (raea's startup trace) is a terminating error; a run is
# judged by its exit code and its APPLIED line instead
$ErrorActionPreference = "Continue"
# PowerShell 5.1 leaves $PSScriptRoot empty in a param's default
if (-not $Film) { $Film = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "film.tsx" }
if (-not (Test-Path $Raea)) { Write-Output "bench: no raea at $Raea"; exit 2 }
New-Item -ItemType Directory -Force -Path $Out | Out-Null
$env:RAEA_SIGN = "0"; $env:RAEA_MARK = "0"; $env:RAEA_EXPORT_CACHE = "0"; $env:RAEA_TIMES = "1"; $env:RAEA_RENDER_STATS = "1"
function Now { [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds() / 1000.0 }
$ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue

# Start ID OUTFILE FILM: one render started, its logs in OUT\ID.{log,err,tsv}
function Start-Render($id, $file, $src) {
  $env:RAEA_STARTUP_TRACE = [string][DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
  $env:RAEA_FRAME_LOG = Join-Path $Out "$id.tsv"
  $p = Start-Process -FilePath $Raea -ArgumentList @("render", "`"$src`"", "--composition", $id, "-o", "`"$file`"") -NoNewWindow -PassThru `
    -RedirectStandardOutput (Join-Path $Out "$id.log") -RedirectStandardError (Join-Path $Out "$id.err")
  $null = $p.Handle  # PowerShell 5.1: without it ExitCode is empty after the wait
  [pscustomobject]@{ id = $id; proc = $p; t0 = (Now); t1 = $null }
}
function Wait-Render($r) {
  $r.proc.WaitForExit()
  $r.t1 = Now
  $text = (Get-Content (Join-Path $Out "$($r.id).log") -Raw) + (Get-Content (Join-Path $Out "$($r.id).err") -Raw)
  Set-Content -Path (Join-Path $Out "$($r.id).all") -Value $text
  if ($r.proc.ExitCode -ne 0 -or $text -notmatch "(?m)^APPLIED") { Write-Output "bench: $($r.id) failed (exit $($r.proc.ExitCode))"; $script:status = 1 }
}
# Stats: one render's numbers, as bench.sh writes them
function Stats($r) {
  $text = Get-Content (Join-Path $Out "$($r.id).all") -Raw
  $times = $null
  $m = [regex]::Match($text, '(?m)^\{"direct".*$'); if ($m.Success) { $times = $m.Value | ConvertFrom-Json }
  $first = $null
  $marks = [regex]::Matches($text, "raea startup:\s+([0-9.]+) ms\s+the fed render's first frame"); if ($marks.Count) { $first = [double]$marks[$marks.Count - 1].Groups[1].Value }
  $log = $null
  $tsv = Join-Path $Out "$($r.id).tsv"
  if (Test-Path $tsv) {
    $rows = @(Import-Csv -Path $tsv -Delimiter "`t")
    $rest = @($rows | Select-Object -Skip 1)
    $mean = { param($k) if ($rest.Count) { [math]::Round((($rest | ForEach-Object { [double]$_.$k }) | Measure-Object -Sum).Sum / $rest.Count, 2) } else { 0 } }
    $log = [ordered]@{ first = [ordered]@{ react = [double]$rows[0].react; sync = [double]$rows[0].sync; gpu = [double]$rows[0].gpu }
      rest_mean = [ordered]@{ react = (& $mean "react"); sync = (& $mean "sync"); gpu = (& $mean "gpu") }; rows = $rows.Count }
  }
  [ordered]@{ id = $r.id; wall_s = [math]::Round($r.t1 - $r.t0, 3); first_frame_ms = $first; frames = $times.frames; encoder = $times.video
    ms_per_frame = $times.times.ms_per_frame; fps_incl_encode = $times.fps_incl_encode; frame_log = $log }
}
function Join-Chunks($files, $dest) {
  # the last render's trace and frame log aren't the join's
  Remove-Item Env:RAEA_STARTUP_TRACE, Env:RAEA_FRAME_LOG -ErrorAction SilentlyContinue
  if ($ffmpeg) {
    $list = Join-Path $Out "list.txt"
    Set-Content -Path $list -Value ($files | ForEach-Object { "file '$($_ -replace '\\', '/')'" })
    & $ffmpeg.Source -y -loglevel error -f concat -safe 0 -i $list -c copy $dest
    "ffmpeg -f concat -c copy"
  } else {
    & $Raea media concat @files -o $dest *> (Join-Path $Out "concat.log")
    "raea media concat"
  }
}

$status = 0
$gpu = (Get-CimInstance Win32_VideoController | Select-Object -First 1).Name
$machine = [ordered]@{ os = "Windows " + [Environment]::OSVersion.Version; gpu = $gpu; host = $env:COMPUTERNAME; raea = ((& $Raea --version 2>$null) | Select-Object -First 1) }

Write-Output "bench: six shot renders, $P at a time"
$t0 = Now
$queue = 1..6; $running = @(); $done = @()
foreach ($k in $queue) {
  while ($running.Count -ge $P) {
    $r = $running | Where-Object { $_.proc.HasExited } | Select-Object -First 1
    if ($r) { Wait-Render $r; $done += $r; $running = @($running | Where-Object { $_ -ne $r }) } else { Start-Sleep -Milliseconds 50 }
  }
  $running += Start-Render "shot-$k" (Join-Path $Out "shot-$k.mp4") $Film
}
foreach ($r in $running) { Wait-Render $r; $done += $r }
$t1 = Now
$files = 1..6 | ForEach-Object { Join-Path $Out "shot-$_.mp4" }
$j0 = Now; $joiner = Join-Chunks $files (Join-Path $Out "film-chunked.mp4"); $j1 = Now
$shots = @($done | Sort-Object id | ForEach-Object { Stats $_ })
$frames_s = 0; $startups = 0
foreach ($s in $shots) { if ($s.frames) { $frames_s += $s.frames * $s.ms_per_frame.wall / 1000 }; if ($s.first_frame_ms) { $startups += $s.first_frame_ms / 1000 } }
$chunked = [ordered]@{ p = $P; renders_s = [math]::Round($t1 - $t0, 3); joiner = $joiner; join_s = [math]::Round($j1 - $j0, 3)
  total_s = [math]::Round($j1 - $t0, 3); startups_s = $startups; frames_s = $frames_s; shots = $shots }
Write-Output "bench: chunked $($chunked.total_s) s (renders $($chunked.renders_s) s, join $($chunked.join_s) s, $joiner)"

Write-Output "bench: the film as one render"
$r = Start-Render "film" (Join-Path $Out "film-one.mp4") $Film; Wait-Render $r
$one = Stats $r
Write-Output "bench: one render $($one.wall_s) s, first frame $($one.first_frame_ms) ms"
$run = [ordered]@{ film = [ordered]@{ frames = 900; width = 1920; height = 1080; fps = 30; shots = 6 }; machine = $machine; chunked = $chunked; one = $one
  one_estimate_s = $frames_s + $shots[0].first_frame_ms / 1000 }
$run | ConvertTo-Json -Depth 8 | Set-Content -Path (Join-Path $Out "run.json")

if ($Note) {
  # change.sh's note, on a copy of film.tsx and shots.tsx
  $noteDir = Join-Path $Out "note"; New-Item -ItemType Directory -Force -Path $noteDir | Out-Null
  $src = Join-Path $noteDir "film.tsx"
  Copy-Item $Film $src
  $shots = Join-Path (Split-Path -Parent $Film) "shots.tsx"
  $text = (Get-Content $shots -Raw) -replace '(?m)^export const NOIR = .*$', 'export const NOIR = { saturation: 0.25, contrast: 1.5, temperature: 0.04, sun: 45000, ambient: 250 };'
  if ($text -notmatch 'saturation: 0.25, contrast: 1.5') { Write-Output "change: shots.tsx's NOIR line wasn't found to change"; exit 1 }
  [IO.File]::WriteAllText((Join-Path $noteDir "shots.tsx"), $text)
  $c0 = Now
  $r = Start-Render "shot-4" (Join-Path $noteDir "shot-4.mp4") $src; Wait-Render $r
  $c1 = Now
  $files = 1..6 | ForEach-Object { if ($_ -eq 4) { Join-Path $noteDir "shot-4.mp4" } else { Join-Path $Out "shot-$_.mp4" } }
  $joiner = Join-Chunks $files (Join-Path $noteDir "film-chunked.mp4")
  $c2 = Now
  $r = Start-Render "film" (Join-Path $noteDir "film-one.mp4") $src; Wait-Render $r
  $c3 = Now
  $change = [ordered]@{ note = "shot 4 (150 of 900 frames): grade and sun"
    chunks = [ordered]@{ shot_s = [math]::Round($c1 - $c0, 3); join_s = [math]::Round($c2 - $c1, 3); total_s = [math]::Round($c2 - $c0, 3); joiner = $joiner }
    film = [ordered]@{ total_s = [math]::Round($c3 - $c2, 3) } }
  $change | ConvertTo-Json -Depth 4 | Set-Content -Path (Join-Path $Out "change.json")
  Write-Output "change: shot 4 again $($change.chunks.shot_s) s + join $($change.chunks.join_s) s; the whole film again $($change.film.total_s) s"
}
if (-not $Keep) { Get-ChildItem -Path $Out -Recurse -Filter *.mp4 | Remove-Item -Force }
Write-Output "bench: $(Join-Path $Out 'run.json')"
exit $status
