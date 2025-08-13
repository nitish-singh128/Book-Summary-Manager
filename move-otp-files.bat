@echo off
echo ====================================
echo   OTP File Mover - Book Summary Manager
echo ====================================
echo.
echo This script helps move OTP files from Downloads to project folder
echo.

set "downloadsFolder=%USERPROFILE%\Downloads"
set "projectOtpFolder=%~dp0otp_files"

echo Downloads folder: %downloadsFolder%
echo Project OTP folder: %projectOtpFolder%
echo.

REM Check if Downloads folder exists
if not exist "%downloadsFolder%" (
    echo ERROR: Downloads folder not found at %downloadsFolder%
    pause
    exit /b 1
)

REM Check if project OTP folder exists, create if it doesn't
if not exist "%projectOtpFolder%" (
    echo Creating OTP folder: %projectOtpFolder%
    mkdir "%projectOtpFolder%"
    echo.
)

echo Looking for OTP files in Downloads...
echo.

REM Count OTP files in Downloads
set /a count=0
for %%f in ("%downloadsFolder%\otp_*.txt") do (
    if exist "%%f" (
        set /a count+=1
    )
)

if %count% equ 0 (
    echo No OTP files found in Downloads folder.
    echo OTP files should be named: otp_*.txt
    echo.
    pause
    exit /b 0
)

echo Found %count% OTP file(s) in Downloads:
echo.

REM List and move OTP files
for %%f in ("%downloadsFolder%\otp_*.txt") do (
    if exist "%%f" (
        echo Moving: %%~nxf
        move "%%f" "%projectOtpFolder%\" >nul
        if errorlevel 1 (
            echo   ERROR: Failed to move %%~nxf
        ) else (
            echo   SUCCESS: Moved to project folder
        )
        echo.
    )
)

echo ====================================
echo Operation completed!
echo.
echo OTP files are now in: %projectOtpFolder%
echo You can now use the OTP codes for verification.
echo.
pause 