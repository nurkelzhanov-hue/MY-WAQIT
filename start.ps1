# MY WAQIT: start the Telegram bot (the app itself is hosted on GitHub Pages).
# Usage (PowerShell):  powershell -ExecutionPolicy Bypass -File D:\my-waqit\start.ps1
# The bot token is never printed.

$ErrorActionPreference = 'Stop'
$root = 'D:\my-waqit'
$envFile = Join-Path $root 'bot\.env'
$webAppUrl = 'https://nurkelzhanov-hue.github.io/MY-WAQIT/'

Write-Host '1/3 Stopping the old bot (if running)...'
Get-CimInstance Win32_Process -Filter "Name='python.exe'" |
    Where-Object { $_.CommandLine -like '*my-waqit\bot*main.py*' } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

Write-Host "2/3 Setting WEBAPP_URL: $webAppUrl"
(Get-Content $envFile) -replace '^WEBAPP_URL=.*', "WEBAPP_URL=$webAppUrl" | Set-Content $envFile

Write-Host '3/3 Starting the bot in a new window...'
Start-Process powershell -ArgumentList '-NoExit','-Command',"cd $root\bot; .\venv\Scripts\python.exe main.py"

Write-Host ''
Write-Host 'Done. In Telegram open @my_waqit_bot, send /start and press the button in the NEW message.'
Write-Host 'Do not close the bot window. The app itself works even while the computer is off, but the bot answers only while this window is open.'
