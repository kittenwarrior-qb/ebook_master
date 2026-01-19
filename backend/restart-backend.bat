@echo off
REM ============================================
REM Restart Backend Server
REM ============================================

cd /d "%~dp0"

echo ============================================
echo Stopping any existing backend process...
echo ============================================

REM Kill any process on port 3001
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do (
    echo Killing process %%a
    taskkill /F /PID %%a 2>nul
)

echo.
echo ============================================
echo Starting backend server...
echo ============================================
echo.

REM Start backend
npm run start:dev

pause
