@echo off
title User Management System 
color 0A

echo ════════════════════════════════════════════════════
echo      USER MANAGEMENT SYSTEM
echo ════════════════════════════════════════════════════
echo.

:: ============================================
:: CHECK NODE.JS
:: ============================================

echo [1] Checking Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js found!
echo.

:: ============================================
:: CHECK MONGODB
:: ============================================

echo [2] Checking MongoDB...
mongosh --eval "db.runCommand({ping: 1})" >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] MongoDB is not running!
    echo Please start MongoDB service or open MongoDB Compass.
    echo.
) else (
    echo ✅ MongoDB is running!
)
echo.

:: ============================================
:: INSTALL DEPENDENCIES IF NEEDED
:: ============================================

if not exist "node_modules" (
    echo [3] Installing dependencies...
    call npm install
    echo.
) else (
    echo [3] Dependencies already installed.
    echo.
)

:: ============================================
:: CREATE LOGS FOLDER
:: ============================================

if not exist "logs" mkdir logs
if not exist "backend\logs" mkdir backend\logs

:: ============================================
:: START BACKEND SERVER
:: ============================================

echo [4] Starting Backend Server...
echo Backend will run on: http://localhost:5000
echo.
start "Backend Server" cmd /k "npm run dev"

:: Wait for backend to start
timeout /t 3 /nobreak >nul

:: ============================================
:: START FRONTEND SERVER
:: ============================================

echo [5] Starting Frontend Server...
echo Frontend will run on: http://localhost:3000
echo.
start "Frontend Server" cmd /k "npx http-server frontend -p 3000"

:: Wait for frontend to start
timeout /t 3 /nobreak >nul

:: ============================================
:: OPEN BROWSER - ONLY ONCE
:: ============================================

echo [6] Opening browser...
timeout /t 2 /nobreak >nul

:: Open browser only once
start "" "http://localhost:3000"

:: ============================================
:: SHOW COMPLETION MESSAGE
:: ============================================

echo.
echo ════════════════════════════════════════════════════
echo ✅ ALL SERVICES STARTED SUCCESSFULLY!
echo ════════════════════════════════════════════════════
echo.
echo  🌐 Frontend:  http://localhost:3000
echo  🚀 Backend:   http://localhost:5000
echo  📊 Logs:      logs\app.log
echo.
echo  If browser doesn't open automatically,
echo  manually go to: http://localhost:3000
echo.
echo ════════════════════════════════════════════════════
echo  Press any key to close this window
echo  (Servers will keep running in their windows)
echo ════════════════════════════════════════════════════
echo.

pause
