@echo off
title MEDATHON Launcher
cd /d "%~dp0"

echo.
echo   MEDATHON - Starting Smart Healthcare Platform
echo   --------------------------------------------
echo.

REM Stop any old Node server on port 3000
echo   Checking port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo   Stopping old process PID %%a
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul

REM Install deps if needed
if not exist "node_modules\" (
    echo   Installing dependencies...
    call npm install
    if errorlevel 1 goto :fail
)

REM Setup database if missing
if not exist "dev.db" (
    echo   Setting up database...
    call npm run db:push
    if errorlevel 1 goto :fail
    call npm run db:seed
    if errorlevel 1 goto :fail
)

echo   Starting server...
start "MEDATHON Server" cmd /k "cd /d %~dp0 && npm run dev"

echo   Waiting for server...
set /a tries=0
:waitloop
set /a tries+=1
if %tries% gtr 40 goto :openanyway
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if %errorlevel% equ 0 goto :openbrowser
timeout /t 1 /nobreak >nul
goto :waitloop

:openbrowser
echo   Opening browser...
start "" "http://localhost:3000"
echo.
echo   MEDATHON is running at http://localhost:3000
echo   Keep the "MEDATHON Server" window open.
echo.
pause
exit /b 0

:openanyway
echo   Opening browser (server may still be loading)...
start "" "http://localhost:3000"
echo.
echo   If the page does not load, wait 10 seconds and refresh.
echo   Or check the "MEDATHON Server" window for errors.
echo.
pause
exit /b 0

:fail
echo.
echo   ERROR: Something went wrong. Try running these manually:
echo     npm install
echo     npm run db:push
echo     npm run dev
echo.
pause
exit /b 1
