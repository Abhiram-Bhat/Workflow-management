@echo off
REM Workflow Management Tool - Windows Startup Script
REM This script sets up and starts the application on Windows

echo ========================================
echo Workflow Management Tool - Setup
echo ========================================
echo.

REM Check if Bun is installed
where bun >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Bun is not installed or not in PATH
    echo Please install Bun from: https://bun.sh/
    echo.
    pause
    exit /b 1
)

echo [1/5] Installing dependencies...
bun install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [2/5] Setting up database...
bun run db:push
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to setup database
    pause
    exit /b 1
)

echo [3/5] Seeding database with sample data...
bun run db:seed
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Failed to seed database (optional)
)

echo [4/5] Starting WebSocket service...
start "Workflow WebSocket Service" cmd /k "cd mini-services\workflow-socket && bun run dev"
timeout /t 3 /nobreak >nul

echo [5/5] Starting Next.js development server...
echo.
echo ========================================
echo Application is starting...
echo ========================================
echo.
echo Main App:    http://localhost:3000
echo WebSocket:    http://localhost:3003
echo.
echo Press Ctrl+C to stop the servers
echo.

bun run dev

pause
