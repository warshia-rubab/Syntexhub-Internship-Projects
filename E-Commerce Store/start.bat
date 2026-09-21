@echo off
title ShopHub E-Commerce - Launcher
color 0A
cls

echo.
echo  ============================================================
echo     ShopHub - Premium E-Commerce Store
echo     Full-Stack Launcher (XAMPP + Node.js + Browser)
echo  ============================================================
echo.

REM ---- Step 1: Check XAMPP exists ----
if not exist "C:\xampp\xampp_start.exe" (
    echo  [ERROR] XAMPP not found at C:\xampp\
    echo  Please install XAMPP or update the path in this .bat file.
    echo.
    pause
    exit /b 1
)

REM ---- Step 2: Start XAMPP (Apache + MySQL) ----
echo  [1/4] Starting XAMPP (Apache + MySQL)...
start "" /min "C:\xampp\xampp_start.exe"
timeout /t 8 /nobreak >nul

REM ---- Step 3: Wait for MySQL to be ready ----
echo  [2/4] Waiting for MySQL to be ready...
:wait_mysql
tasklist /FI "IMAGENAME eq mysqld.exe" 2>nul | find /I "mysqld.exe" >nul
if errorlevel 1 (
    timeout /t 2 /nobreak >nul
    goto wait_mysql
)
echo        MySQL is ready.

REM ---- Step 4: Start Backend ----
echo  [3/4] Starting Node.js backend...
cd /d "%~dp0backend"
start "ShopHub Backend" cmd /k "npm run dev"

REM ---- Step 5: Wait for backend to start ----
echo        Waiting for backend to be ready...
timeout /t 6 /nobreak >nul

REM ---- Step 6: Open browser ----
echo  [4/4] Opening ShopHub in browser...
start "" http://localhost:5000

echo.
echo  ============================================================
echo     ShopHub is now running!
echo.
echo     URL:      http://localhost:5000
echo     Backend:  Running in "ShopHub Backend" window
echo     Database: Running in XAMPP (MySQL)
echo  ============================================================
echo.
echo  To STOP everything, run stop.bat
echo.
echo  You can close THIS window now.
echo.
timeout /t 5 /nobreak >nul
exit