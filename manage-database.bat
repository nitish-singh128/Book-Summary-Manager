@echo off
echo ====================================
echo   Database Manager - Book Summary Manager
echo ====================================
echo.
echo This script manages database files for the project
echo.

set "downloadsFolder=%USERPROFILE%\Downloads"
set "projectDbFolder=%~dp0database"

echo Downloads folder: %downloadsFolder%
echo Project database folder: %projectDbFolder%
echo.

REM Create database folder if it doesn't exist
if not exist "%projectDbFolder%" (
    echo Creating database folder: %projectDbFolder%
    mkdir "%projectDbFolder%"
    echo.
)

REM Check for database files in Downloads
set /a dbCount=0
for %%f in ("%downloadsFolder%\users_database.xlsx") do (
    if exist "%%f" (
        set /a dbCount+=1
    )
)

if %dbCount% equ 0 (
    echo No Excel database files found in Downloads folder.
    echo.
    echo Excel database files should be named: users_database.xlsx
    echo These are created automatically when you register users.
    echo Use saveToProjectFolder() in browser console to download them.
    echo.
    
    REM Check if database already exists in project folder
    if exist "%projectDbFolder%\users_database.xlsx" (
        echo ✅ Excel database found in project folder: %projectDbFolder%\users_database.xlsx
        echo.
        echo You can load this in the browser using: uploadDatabase()
        echo.
    ) else (
        echo No Excel database file found in project folder either.
        echo Register some users first, then use saveToProjectFolder() to download.
        echo.
    )
    
    pause
    exit /b 0
)

echo Found %dbCount% database file(s) in Downloads:
echo.

REM Move database files from Downloads to project folder
for %%f in ("%downloadsFolder%\users_database.xlsx") do (
    if exist "%%f" (
        echo Moving: %%~nxf
        
        REM Backup existing database if it exists
        if exist "%projectDbFolder%\users_database.xlsx" (
            echo   Creating backup of existing Excel database...
            copy "%projectDbFolder%\users_database.xlsx" "%projectDbFolder%\users_database_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.xlsx" >nul
            echo   Backup created: users_database_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.xlsx
        )
        
        REM Move new database file
        move "%%f" "%projectDbFolder%\" >nul
        if errorlevel 1 (
            echo   ERROR: Failed to move %%~nxf
        ) else (
            echo   SUCCESS: Excel database moved to project folder
            echo   Location: %projectDbFolder%\users_database.xlsx
        )
        echo.
    )
)

echo ====================================
echo Database management completed!
echo.
echo Excel database location: %projectDbFolder%\users_database.xlsx
echo.
echo Next steps:
echo 1. Open your web application
echo 2. Open browser console (F12)
echo 3. Type: uploadDatabase()
echo 4. Select the database file from: %projectDbFolder%
echo 5. Your registered users will be available for login
echo.
pause 