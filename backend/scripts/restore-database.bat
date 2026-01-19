@echo off
REM ============================================
REM Restore Supabase PostgreSQL Database
REM ============================================

cd /d "%~dp0.."

REM Load environment variables
for /f "tokens=1,2 delims==" %%a in ('type .env ^| findstr /v "^#"') do set %%a=%%b

echo ============================================
echo Available backups:
echo ============================================
dir /B /O-D backups\database_backup_*.sql | findstr /N "^"
echo ============================================
echo.

set /p BACKUP_FILE="Enter backup filename (or press Ctrl+C to cancel): "

if not exist "backups\%BACKUP_FILE%" (
    echo Error: Backup file not found!
    pause
    exit /b 1
)

echo.
echo ============================================
echo WARNING: This will restore the database!
echo ============================================
echo Host: %DB_HOST%
echo Database: %DB_DATABASE%
echo Backup: backups\%BACKUP_FILE%
echo ============================================
echo.
set /p CONFIRM="Type 'YES' to confirm: "

if not "%CONFIRM%"=="YES" (
    echo Restore cancelled.
    pause
    exit /b 0
)

echo.
echo Restoring database...

REM Set password for psql
set PGPASSWORD=%DB_PASSWORD%

REM Run restore
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USERNAME% -d %DB_DATABASE% -f backups\%BACKUP_FILE%

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo Restore successful!
    echo ============================================
) else (
    echo.
    echo ============================================
    echo Restore FAILED!
    echo ============================================
)

echo.
pause
