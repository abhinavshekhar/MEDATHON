$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

Write-Host ""
Write-Host "  MEDATHON - Starting Smart Healthcare Platform" -ForegroundColor Cyan
Write-Host "  --------------------------------------------" -ForegroundColor DarkGray
Write-Host ""

$connections = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
foreach ($conn in $connections) {
    $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
    if ($proc -and $proc.ProcessName -match "node") {
        Write-Host "  Stopping old server on port 3000 (PID $($proc.Id))..." -ForegroundColor Yellow
        Stop-Process -Id $proc.Id -Force
        Start-Sleep -Seconds 2
    }
}

if (-not (Test-Path "node_modules")) {
    Write-Host "  Installing dependencies..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path "dev.db")) {
    Write-Host "  Setting up database..." -ForegroundColor Yellow
    npm run db:push
    npm run db:seed
}

Write-Host "  Starting dev server on http://localhost:3000" -ForegroundColor Green
Start-Process cmd -ArgumentList "/k", "cd /d `"$ProjectRoot`" && npm run dev"

$ready = $false
for ($i = 0; $i -lt 40; $i++) {
    Start-Sleep -Seconds 1
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -eq 200) {
            $ready = $true
            break
        }
    } catch {
        # still starting
    }
}

if ($ready) {
    Start-Process "http://localhost:3000"
    Write-Host "  Browser opened at http://localhost:3000" -ForegroundColor Green
} else {
    Start-Process "http://localhost:3000"
    Write-Host "  Server still loading - browser opened, refresh if needed." -ForegroundColor Yellow
}

Write-Host ""
