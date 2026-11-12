# MY WAQIT LOCAL TEST MODE: build + local server + tunnel + bot (for testing code before pushing to GitHub).
# Usage:  powershell -ExecutionPolicy Bypass -File D:\my-waqit\start-local.ps1
# NOTE: this rewrites WEBAPP_URL to a temporary tunnel address. Run start.ps1 afterwards to switch back to GitHub Pages.
#        -> write the tunnel URL into bot\.env -> start the bot.
# The bot token is never printed.

$ErrorActionPreference = 'Stop'
$root = 'D:\my-waqit'
$cf   = 'C:\Users\z\tools\cloudflared.exe'
$envFile = Join-Path $root 'bot\.env'

Write-Host '1/6 Stopping old processes...'
Get-Process cloudflared -ErrorAction SilentlyContinue | Stop-Process -Force
Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
Get-CimInstance Win32_Process -Filter "Name='python.exe'" |
    Where-Object { $_.CommandLine -like '*my-waqit\bot*main.py*' } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

Write-Host '2/6 Building frontend...'
Push-Location (Join-Path $root 'frontend')
npm run build
if ($LASTEXITCODE -ne 0) { Pop-Location; throw 'Frontend build failed. Fix the errors above and run again.' }
Pop-Location

Write-Host '3/6 Starting frontend server (127.0.0.1:5173)...'
Start-Process powershell -ArgumentList '-NoExit','-Command',"cd $root\frontend; npm run preview -- --host 127.0.0.1 --port 5173 --strictPort"

Write-Host '4/6 Starting tunnel...'
Start-Process $cf -ArgumentList 'tunnel','--url','http://127.0.0.1:5173','--metrics','127.0.0.1:20241' -WindowStyle Minimized

$hostname = $null
for ($i = 0; $i -lt 30 -and -not $hostname; $i++) {
    Start-Sleep -Seconds 2
    try { $hostname = (Invoke-RestMethod 'http://127.0.0.1:20241/quicktunnel' -TimeoutSec 3).hostname } catch { }
}
if (-not $hostname) { throw 'Could not get the tunnel address. Check the tunnel window.' }

Write-Host "5/6 Writing WEBAPP_URL: https://$hostname"
(Get-Content $envFile) -replace '^WEBAPP_URL=.*', "WEBAPP_URL=https://$hostname" | Set-Content $envFile

Write-Host '6/6 Starting bot...'
Start-Process powershell -ArgumentList '-NoExit','-Command',"cd $root\bot; .\venv\Scripts\python.exe main.py"

Start-Sleep -Seconds 4
$ok = Test-NetConnection 127.0.0.1 -Port 5173 -InformationLevel Quiet -WarningAction SilentlyContinue
Write-Host ''
Write-Host "Frontend server reachable: $ok"
Write-Host "Public address: https://$hostname"
Write-Host 'Now open Telegram -> @my_waqit_bot -> send /start -> press the button in the NEW message.'
Write-Host 'Do not close the opened windows.'
