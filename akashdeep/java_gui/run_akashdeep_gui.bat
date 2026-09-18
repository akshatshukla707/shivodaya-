@echo off
title Project Shivodaya - Akashdeep Autonomous Mission Control
cd /d "%~dp0"
echo ========================================================================
echo    LAUNCHING AKASHDEEP AUTONOMOUS MISSION CONTROL GUI (JAVA SWING)     
echo ========================================================================
echo Target: ipn:3.1 (Mars Base) ^| DTN BPv7 ^| Cryptographic Marker: 'Bhaarat'
echo.
java -cp "bin;bin/*;." Main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] Direct classpath launch failed. Retrying with root directory...
    java Main
)
pause
