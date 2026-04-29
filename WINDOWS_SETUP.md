# Windows Setup Guide

Complete guide for setting up the Workflow Management Tool on Windows 10/11.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (One-Click Setup)](#quick-start)
3. [Manual Setup](#manual-setup)
4. [Common Issues & Solutions](#common-issues--solutions)
5. [VS Code Configuration](#vs-code-configuration)
6. [PowerShell Tips](#powershell-tips)

## 🔧 Prerequisites

### 1. Install Node.js (Optional but Recommended)

**Option A: Using Installer**
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the LTS version (18+ recommended)
3. Run the installer
4. Accept the license agreement
5. Click "Next" through the default installation options
6. Click "Install"
7. After installation, restart your computer

**Option B: Using Chocolatey**
```powershell
# If you have Chocolatey installed
choco install nodejs-lts
```

**Verify Installation:**
```powershell
node --version
# Should show v18.x.x or higher
npm --version
```

### 2. Install Bun (Recommended)

**Option A: Using PowerShell (Easy)**
```powershell
# Open PowerShell as Administrator
powershell -c "irm bun.sh/install.ps1 | iex"
```

**Option B: Manual Installation**
1. Download from [bun.sh](https://bun.sh/)
2. Extract the ZIP file
3. Add to PATH (optional)
4. Restart terminal

**Verify Installation:**
```powershell
bun --version
# Should show version number
```

### 3. Install Git (Required for cloning)

1. Go to [git-scm.com](https://git-scm.com/)
2. Download Windows installer
3. Run installer with default settings
4. Restart terminal

**Verify Installation:**
```powershell
git --version
```

### 4. Install a Code Editor (Recommended)

**VS Code (Recommended)**
1. Download from [code.visualstudio.com](https://code.visualstudio.com/)
2. Install with default options
3. During installation, check "Add to PATH"

**Optional Extensions:**
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

## 🚀 Quick Start (One-Click Setup)

### Using Batch File

1. **Double-click** `start.bat` in the project root
2. The script will:
   - ✅ Install all dependencies
   - ✅ Set up the database
   - ✅ Seed sample data
   - ✅ Start WebSocket service
   - ✅ Start the development server

### Using PowerShell Script

1. **Right-click** `start.ps1`
2. Select "Run with PowerShell"
3. Or open PowerShell and run:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\start.ps1
   ```

## 📦 Manual Setup

### Step 1: Navigate to Project

```powershell
# Navigate to your project directory
cd C:\Users\YourUsername\Documents\my-project

# Or wherever you extracted the project
```

### Step 2: Install Dependencies

**Using Bun (Recommended):**
```powershell
bun install
```

**Using npm:**
```powershell
npm install
```

### Step 3: Setup Database

**Using Bun:**
```powershell
bun run db:push
```

**Using npm:**
```powershell
npx prisma db push
```

**Expected Output:**
```
🚀 Your database is now in sync with your Prisma schema. Done in 50ms

Running generate...
✔ Generated Prisma Client
```

### Step 4: Seed Database (Optional but Recommended)

**Using Bun:**
```powershell
bun run db:seed
```

**Using npm:**
```powershell
npx tsx prisma/seed.ts
```

**Expected Output:**
```
Starting database seed...
✓ Created users
✓ Created teams
✓ Created workflows
✓ Created tasks
✓ Created notifications
✅ Database seed completed successfully!
```

### Step 5: Start Development Server

**Using Bun:**
```powershell
bun run dev
```

**Using npm:**
```powershell
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.1.3 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.1.X:3000
- Environments:   .env

✓ Ready in 967ms
```

### Step 6: Start WebSocket Service

Open a **new terminal window** and run:

```powershell
cd mini-services\workflow-socket
bun install  # First time only
bun run dev
```

**Expected Output:**
```
🚀 Workflow WebSocket service running on port 3003
```

## 🌐 Accessing the Application

Once both servers are running:

1. **Open your browser** (Chrome, Edge, Firefox, etc.)
2. Navigate to: **http://localhost:3000**
3. The application will load with the dark theme

**Available Endpoints:**
- Main Application: http://localhost:3000
- API Routes: http://localhost:3000/api/*
- WebSocket Service: http://localhost:3003

## 🐛 Common Issues & Solutions

### Issue 1: "bun" command not found

**Symptoms:**
```
'bun' is not recognized as an internal or external command
```

**Solutions:**

**Option A: Add Bun to PATH temporarily**
```powershell
$env:Path += ";C:\Users\$env:USERNAME\.bun\bin"
bun --version
```

**Option B: Use full path**
```powershell
C:\Users\$env:USERNAME\.bun\bin\bun.exe install
```

**Option C: Restart PowerShell**
- Close all PowerShell windows
- Open new PowerShell window
- Try `bun --version` again

### Issue 2: Port already in use

**Symptoms:**
```
Port 3000 is already in use
```

**Solutions:**

**Option A: Find and kill the process**
```powershell
# Find process on port 3000
netstat -ano | findstr ":3000"

# Output example: TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING    12345
# The number at the end is the PID

# Kill the process (replace 12345 with actual PID)
taskkill /PID 12345 /F
```

**Option B: Use different port**
```powershell
# In next.config.ts or use env variable
set PORT=3001
npm run dev
```

### Issue 3: PowerShell Execution Policy Error

**Symptoms:**
```
running scripts is disabled on this system
```

**Solutions:**

**Option A: Bypass for current session**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\start.ps1
```

**Option B: Allow RemoteSigned scripts**
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

**Option C: Run as Administrator**
- Right-click PowerShell
- Select "Run as Administrator"

### Issue 4: Database lock error

**Symptoms:**
```
Error: Database is locked
```

**Solutions:**

**Option A: Kill all processes and restart**
```powershell
# Kill all Node/Bun processes
Get-Process node | Stop-Process -Force
Get-Process bun | Stop-Process -Force

# Then start fresh
bun run db:push
```

**Option B: Delete database and recreate**
```powershell
# Navigate to db folder
cd db

# Delete database file
del custom.db

# Recreate
cd ..
bun run db:push
bun run db:seed
```

### Issue 5: Module not found errors

**Symptoms:**
```
Error: Cannot find module 'xyz'
```

**Solutions:**

**Option A: Clear cache and reinstall**
```powershell
# Remove node_modules
Remove-Item -Recurse -Force node_modules

# Clear Bun cache (if using Bun)
bun pm cache rm

# Reinstall
bun install
```

**Option B: Delete package-lock and reinstall**
```powershell
Remove-Item package-lock.json -Force
Remove-Item node_modules -Recurse -Force
bun install
```

### Issue 6: Windows Firewall blocking connections

**Symptoms:**
- Cannot access localhost:3000
- Connection refused errors

**Solutions:**

**Option A: Allow Node.js through Firewall**
1. Open Windows Security
2. Go to "Firewall & network protection"
3. Click "Allow an app through firewall"
4. Click "Change settings"
5. Find "Node.js" and check both boxes
6. If not found, click "Allow another app"
7. Browse to node.exe location
8. Check both "Private" and "Public"

**Option B: Temporarily disable firewall (NOT recommended for development only)
```powershell
# Run as Administrator
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False
```

## ⚙️ VS Code Configuration

### Recommended Settings

**settings.json:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.eol": "\n",
  "terminal.integrated.defaultProfile.windows": "PowerShell"
}
```

### Useful VS Code Extensions

1. **ESLint**
   - Lints TypeScript/JavaScript code
   - Install: `dbaeumer.vscode-eslint`

2. **Prettier**
   - Code formatting
   - Install: `esbenp.prettier-vscode`

3. **Tailwind CSS IntelliSense**
   - Autocomplete for Tailwind classes
   - Install: `bradlc.vscode-tailwindcss`

4. **TypeScript Vue/React Plugin**
   - Better TypeScript support
   - Install: `vscode-typescript-react`

5. **GitLens**
   - Git supercharged
   - Install: `eamodio.gitlens`

### Running from VS Code

1. Open project folder in VS Code
2. Open integrated terminal (Ctrl + `)
3. Run commands in terminal:
   ```powershell
   bun install
   bun run dev
   ```

## 💡 PowerShell Tips

### Useful Aliases

Add these to your PowerShell profile (`$PROFILE`):

```powershell
# Open profile
notepad $PROFILE

# Add these aliases:
function bun-dev { bun run dev }
function bun-install { bun install }
function bun-seed { bun run db:seed }
function bun-push { bun run db:push }
```

### History Navigation

```powershell
# Show command history
Get-History

# Search history
Get-History | Select-String "bun"
```

### Clear Screen

```powershell
# Clear screen
Clear-Host
# or alias: cls
```

## 📝 Additional Resources

### Learning Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

### Package Managers
- [Bun Documentation](https://bun.sh/docs)
- [npm Documentation](https://docs.npmjs.com/)

### Development Tools
- [VS Code Documentation](https://code.visualstudio.com/docs)
- [Windows Terminal](https://docs.microsoft.com/en-us/windows/terminal/)

## ✅ Verification Checklist

After setup, verify:

- [ ] Bun is installed (`bun --version`)
- [ ] Dependencies are installed (`node_modules` folder exists)
- [ ] Database is set up (`db/custom.db` exists)
- [ ] Dev server runs (http://localhost:3000 works)
- [ ] WebSocket service runs (no errors in terminal)
- [ ] Application loads in browser
- [ ] No console errors in browser DevTools

## 🆘 Need Help?

If you encounter issues not covered here:

1. Check the main [README.md](README.md)
2. Check browser console for errors (F12)
3. Check terminal output for error messages
4. Try clearing cache and reinstalling dependencies
5. Open an issue on the repository

## 📱 Quick Commands Reference

### PowerShell Commands

```powershell
# Install dependencies
bun install

# Setup database
bun run db:push

# Seed database
bun run db:seed

# Start development server
bun run dev

# Start WebSocket service
cd mini-services\workflow-socket
bun run dev

# Run linting
bun run lint

# Build for production
bun run build

# Start production server
bun run start

# Reset database
bun run db:reset
```

### npm Commands (Alternative)

```powershell
# Install dependencies
npm install

# Setup database
npx prisma db push

# Seed database
npx tsx prisma/seed.ts

# Start development server
npm run dev

# Lint code
npm run lint
```

---

## 🎉 You're All Set!

Your Workflow Management Tool is now ready to use on Windows. Enjoy building workflows, managing tasks, and collaborating with your team!

**Next Steps:**
1. Open http://localhost:3000 in your browser
2. Explore the dashboard
3. Create your first workflow
4. Add tasks and start collaborating!
