@echo off
title ShopHub - Stop All Services
color 0C
cls

echo.
echo  ============================================================
echo     Stopping ShopHub Services
echo  ============================================================
echo.

REM ---- Stop Node.js backend ----
echo  [1/3] Stopping Node.js backend...
taskkill /F /IM node.exe 2>nul
if errorlevel 1 (
    echo        No Node.js process found.
) else (
    echo        Node.js stopped.
)

REM ---- Stop XAMPP (Apache + MySQL) ----
echo  [2/3] Stopping XAMPP (Apache + MySQL)...
if exist "C:\xampp\xampp_stop.exe" (
    start "" /min "C:\xampp\xampp_stop.exe"
    timeout /t 5 /nobreak >nul
    echo        XAMPP stopped.
) else (
    echo        XAMPP stop executable not found.
    echo        Please close XAMPP Control Panel manually.
)

echo.
echo  ============================================================
echo     All ShopHub services stopped.
echo  ============================================================
echo.
pause
exit