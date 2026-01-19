@echo off
REM ============================================
REM Cleanup old database backups
REM Keeps only the last 10 backups
REM ============================================

cd /d "%~dp0.."

echo ============================================
echo Cleaning up old backups...
echo ============================================
echo.

REM Count total backups
set COUNT=0
for %%f in (backups\database_backup_*.sql) do set /a COUNT+=1

echo Total backups: %COUNT%
echo Keeping: 10 most recent
echo.

if %COUNT% LEQ 10 (
    echo No cleanup needed.
    pause
    exit /b 0
)

REM Delete old backups (keep last 10)
set /a DELETE_COUNT=%COUNT%-10
echo Deleting %DELETE_COUNT% old backup(s)...
echo.

REM List files to delete
dir /B /O:D backups\database_backup_*.sql | findstr /N "^" | findstr "^[1-%DELETE_COUNT%]:"

echo.
set /p CONFIRM="Proceed with deletion? (Y/N): "

if /i "%CONFIRM%"=="Y" (
    for /f "skip=%DELETE_COUNT%" %%f in ('dir /B /O:D backups\database_backup_*.sql') do (
        REM Keep these files
    )
    
    set COUNTER=0
    for /f %%f in ('dir /B /O:D backups\database_backup_*.sql') do (
        set /a COUNTER+=1
        if !COUNTER! LEQ %DELETE_COUNT% (
            del "backups\%%f"
            echo Deleted: %%f
        )
    )
    
    echo.
    echo Cleanup completed!
) else (
    echo Cleanup cancelled.
)

echo.
pause
