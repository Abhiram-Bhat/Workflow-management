# Workflow Management Tool - Windows PowerShell Startup Script
# This script sets up and starts the application on Windows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Workflow Management Tool - Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Bun is installed
$bunExists = Get-Command bun -ErrorAction SilentlyContinue
if (-not $bunExists) {
    Write-Host "[ERROR] Bun is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Bun from: https://bun.sh/" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Function to run command with error checking
function Invoke-Command {
    param(
        [string]$Command,
        [string]$StepNumber,
        [string]$StepName,
        [switch]$Optional = $false
    )
    
    Write-Host "[$StepNumber/5] $StepName..." -ForegroundColor Green
    
    $output = Invoke-Expression $Command 2>&1
    
    if ($LASTEXITCODE -ne 0 -and -not $Optional) {
        Write-Host "[ERROR] Failed: $StepName" -ForegroundColor Red
        Write-Host "$output" -ForegroundColor Yellow
        Write-Host ""
        if (-not $Optional) {
            Read-Host "Press Enter to exit"
            exit 1
        } else {
            Write-Host "[WARNING] Continuing despite error..." -ForegroundColor Yellow
        }
    } elseif ($LASTEXITCODE -ne 0) {
        Write-Host "[WARNING] $StepName had issues, but continuing..." -ForegroundColor Yellow
    }
    
    Start-Sleep -Milliseconds 500
}

# Install dependencies
Invoke-Command "bun install" "1" "Installing dependencies"

# Setup database
Invoke-Command "bun run db:push" "2" "Setting up database"

# Seed database (optional)
Invoke-Command "bun run db:seed" "3" "Seeding database with sample data" -Optional

# Start WebSocket service in new window
Write-Host "[4/5] Starting WebSocket service..." -ForegroundColor Green
$wsScript = "cd mini-services\workflow-socket; bun run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $wsScript -WindowStyle Normal
Start-Sleep -Seconds 3

# Start main development server
Write-Host "[5/5] Starting Next.js development server..." -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Application is starting..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Main App:    http://localhost:3000" -ForegroundColor Green
Write-Host "WebSocket:    http://localhost:3003" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Yellow
Write-Host ""

bun run dev
