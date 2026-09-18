@echo off
title Project Shivodaya - Earth Operations Control Center
cd /d "%~dp0earth_control_center\bin"
echo ========================================================================
echo    LAUNCHING PROJECT SHIVODAYA EARTH CONTROL CENTER JAVA GUI          
echo ========================================================================
echo Connecting to Deep-Space Ground Stations (NASA, ISRO, ESA)...
echo.
java -cp ".;..\lib\*;..\..\akashdeep\java_gui\bin" earthcontrol.EarthControlCenterUI
pause
