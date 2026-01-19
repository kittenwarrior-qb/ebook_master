@echo off
REM ============================================
REM Backup Supabase PostgreSQL Database
REM ============================================
REM Requirements: PostgreSQL client tools
REM Download: https://www.postgresql.org/download/windows/
REM ============================================

cd /d "%~dp0.."

REM Load environment variables
for /f "tokens=1,2 delims==" %%a in ('type .env ^| findstr /v "^#"') do set %%a=%%b

REM Create backup filename with timestamp
set TIMESTAMP=%date:~-4,4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set BACKUP_FILE=backups\database_backup_%TIMESTAMP%.sql

echo ============================================
echo Creating database backup...
echo ============================================
echo Host: %DB_HOST%
echo Database: %DB_DATABASE%
echo Output: %BACKUP_FILE%
echo ============================================
echo.

REM Set password for pg_dump
set PGPASSWORD=%DB_PASSWORD%

REM Run pg_dump
pg_dump -h %DB_HOST% -p %DB_PORT% -U %DB_USERNAME% -d %DB_DATABASE% -F p -f %BACKUP_FILE%

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo Backup successful!
    echo File: %BACKUP_FILE%
    echo ============================================
    
    REM Get file size
    for %%A in (%BACKUP_FILE%) do set SIZE=%%~zA
    echo Size: %SIZE% bytes
    echo.
    
    REM List recent backups
    echo Recent backups:
    dir /B /O-D backups\database_backup_*.sql | findstr /N "^" | findstr "^[1-5]:"
) else (
    echo.
    echo ============================================
    echo Backup FAILED!
    echo ============================================
    echo.
    echo Make sure PostgreSQL client tools are installed.
    echo Download from: https://www.postgresql.org/download/windows/
    echo.
    echo Or use Supabase Dashboard:
    echo https://supabase.com/dashboard
    echo Project ^> Settings ^> Database ^> Backups
    echo ============================================
)

echo.
pause
