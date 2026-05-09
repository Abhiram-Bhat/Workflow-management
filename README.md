# Workflow Management Tool

A comprehensive, production-ready workflow management application built with Next.js 16, TypeScript, and modern web technologies. Inspired by Walmart Labs' Concord, this tool helps teams and organizations streamline their processes by organizing tasks, tracking progress, and facilitating real-time collaboration.

## 🚀 Features

### Core Functionality
- **Dashboard Overview**: Visualize all workflows, tasks, and team metrics at a glance
- **Workflow Builder**: Create and manage workflows with an intuitive drag-and-drop interface
- **Task Management**: Comprehensive task assignment, tracking, and status updates
- **Timeline View**: Visualize workflow progress and task timelines
- **Real-time Updates**: Live collaboration using WebSocket connections
- **Notification System**: Stay informed with push notifications for task assignments and updates
- **Team Management**: Organize users into teams and track member activities
- **Progress Tracking**: Monitor completion rates and task statistics

### Advanced Features
- **Drag-and-Drop Interface**: Reorder tasks and workflow steps with @dnd-kit
- **Role-Based Access Control**: Admin and member roles with different permissions
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Dark Mode**: Built-in dark theme with zinc color palette
- **Smooth Animations**: Framer Motion transitions for a polished UX
- **Type Safety**: Full TypeScript implementation
- **Cross-Platform**: Works on Windows, macOS, and Linux

## 🖥️ Platform Support

### Windows
- ✅ Fully compatible with Windows 10/11
- ✅ Tested with Windows PowerShell and Command Prompt
- ✅ Works with Git Bash, WSL2, and WSL
- ✅ Node.js 18+ and npm support

### macOS
- ✅ Fully compatible with macOS 10.15+
- ✅ Native Terminal support
- ✅ Homebrew package manager support

### Linux
- ✅ Fully compatible with major Linux distributions
- ✅ Bash, Zsh, and Fish shell support

## 🛠️ Technology Stack

### Core Framework
- **Next.js 16** - React framework with App Router
- **TypeScript 5** - Type-safe development
- **React 19** - Latest React features

### Styling & UI
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible component library
- **Lucide Icons** - Modern icon set
- **Framer Motion** - Smooth animations and transitions

### State Management & Data
- **Prisma ORM** - Database toolkit with SQLite
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management
- **@dnd-kit** - Drag-and-drop functionality

### Real-time & API
- **Socket.io** - WebSocket implementation
- **Next.js API Routes** - Backend API endpoints

### Development Tools
- **ESLint** - Code linting
- **tsx** - TypeScript execution and watch mode

## 📁 Project Structure

```
my-project/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── workflows/          # Workflow API endpoints
│   │   │   │   ├── [id]/           # Individual workflow operations
│   │   │   │   └── route.ts        # Workflow CRUD operations
│   │   │   ├── tasks/              # Task API endpoints
│   │   │   │   ├── [id]/           # Individual task operations
│   │   │   │   └── route.ts        # Task CRUD operations
│   │   │   ├── users/              # User API endpoints
│   │   │   │   └── route.ts        # User CRUD operations
│   │   │   ├── notifications/      # Notification API endpoints
│   │   │   │   ├── [id]/           # Individual notification operations
│   │   │   │   ├── mark-all-read/  # Mark all as read endpoint
│   │   │   │   └── route.ts        # Notification CRUD operations
│   │   │   └── route.ts            # Root API route
│   │   ├── components/
│   │   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── workflow-builder.tsx # Drag-and-drop workflow editor
│   │   │   ├── timeline-view.tsx   # Timeline visualization component
│   │   │   └── notification-center.tsx # Notification management
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── lib/                    # Utility functions
│   │   │   ├── db.ts               # Prisma client
│   │   │   └── utils.ts            # Helper functions
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Main dashboard page
│   │   └── globals.css             # Global styles
│   └── ...
├── mini-services/
│   └── workflow-socket/            # WebSocket service
│       ├── index.ts                # Socket.io server
│       └── package.json
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── seed.ts                     # Database seed script
├── db/                             # SQLite database files
├── components.json                 # shadcn/ui configuration
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
└── package.json                    # Project dependencies
```

## 💻 Windows Setup Guide

### Prerequisites

1. **Install Node.js**:
   - Download from [nodejs.org](https://nodejs.org/)
   - Choose LTS version (18+ recommended)
   - Run installer and follow prompts
   - Verify installation: Open Command Prompt or PowerShell and run:
     ```
     node --version
     npm --version
     ```

2. **Install Git** (if not installed):
   - Download from [git-scm.com](https://git-scm.com/)
   - Run installer with default settings

### Installation Steps (Using npm)

#### Option 1: Quick Setup (Recommended)

1. **Navigate to Project Directory**:
   ```powershell
   # PowerShell
   cd C:\path\to\my-project

   # OR Command Prompt
   cd C:\path\to\my-project
   ```

2. **Install Dependencies and Set Up Database**:
   ```powershell
   # PowerShell or Command Prompt
   npm run setup
   ```

   This command will:
   - Install all npm dependencies
   - Set up the SQLite database
   - Seed the database with sample data

3. **Start Development Server**:
   ```powershell
   npm run dev
   ```

   The server will start at http://localhost:3000

4. **Start WebSocket Service** (Open New Terminal):
   ```powershell
   cd mini-services\workflow-socket
   npm install
   npm run dev
   ```

5. **Access the Application**:
   - Open your browser and go to http://localhost:3000
   - Or use the Preview Panel in your development environment

#### Option 2: Step-by-Step Installation

1. **Navigate to Project Directory**:
   ```powershell
   cd C:\path\to\my-project
   ```

2. **Install Dependencies**:
   ```powershell
   npm install
   ```

3. **Set Up Database**:
   ```powershell
   npm run db:push
   ```

4. **Seed Database with Sample Data** (Optional but Recommended):
   ```powershell
   npm run db:seed
   ```

5. **Start Development Server**:
   ```powershell
   npm run dev
   ```

6. **Start WebSocket Service** (New Terminal Window):
   ```powershell
   cd mini-services\workflow-socket
   npm install
   npm run dev
   ```

### Using Git Bash on Windows

If you prefer Git Bash, the commands are the same as on Linux/macOS:

```bash
cd /c/path/to/my-project
npm run setup
npm run dev

# In another terminal
cd mini-services/workflow-socket
npm install
npm run dev
```

### Using WSL2 (Windows Subsystem for Linux)

1. **Enable WSL2** (if not enabled):
   - Open PowerShell as Administrator
   - Run: `wsl --install`
   - Restart computer

2. **Navigate and Install**:
   ```bash
   # In WSL2 terminal
   cd /mnt/c/Users/YourUsername/path/to/my-project
   npm run setup
   npm run dev

   # In another terminal
   cd mini-services/workflow-socket
   npm install
   npm run dev
   ```

## 🍎 macOS Setup Guide

### Prerequisites
1. **Install Node.js**:
   ```bash
   brew install node
   ```

### Installation
```bash
cd my-project
npm run setup
npm run dev

# In another terminal
cd mini-services/workflow-socket
npm install
npm run dev
```

## 🐧 Linux Setup Guide

### Prerequisites
```bash
# Ubuntu/Debian
sudo apt-get install nodejs npm

# Fedora
sudo dnf install nodejs npm
```

### Installation
```bash
cd my-project
npm run setup
npm run dev

# In another terminal
cd mini-services/workflow-socket
npm install
npm run dev
```

## 📝 Available Scripts

### Using npm (All Platforms)
- `npm run dev` - Start Next.js development server on port 3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run start:win` - Start production server on Windows (sets NODE_ENV)
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema to SQLite
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:reset` - Reset database
- `npm run db:seed` - Seed database with sample data
- `npm run start:socket` - Start WebSocket service
- `npm run setup` - Quick setup: install + db push + seed
- `npm run setup:win` - Same as setup for Windows

## 🗄️ Database Schema

### Models

#### User
- Basic user information (id, email, name, avatar)
- Role-based access (admin, member)
- Relations: assignedTasks, createdWorkflows, createdTasks, comments, notifications

#### Team
- Team management (id, name, description)
- Relations: workflows

#### Workflow
- Workflow definition (id, name, description, status, priority)
- Relations: team, createdBy, tasks, executions

#### Task
- Task details (id, title, description, status, priority, order, dueDate)
- Relations: workflow, createdBy, assignee, comments

#### WorkflowExecution
- Execution tracking (id, workflowId, status, timestamps)
- Relations: workflow

#### Comment
- Task comments (id, content, timestamps)
- Relations: task, user

#### Notification
- User notifications (id, title, message, type, isRead)
- Relations: user

## 🎯 Usage Guide

### Dashboard
- View all workflows, tasks, and team statistics
- Navigate between different sections using the sidebar
- Search for workflows, tasks, or team members
- Access notification center for updates

### Workflow Management
1. **Create Workflow**: Click "New Workflow" button
2. **Add Tasks**: Use drag-and-drop to add and reorder tasks
3. **Edit Tasks**: Click edit icon to modify task details
4. **Assign Tasks**: Select team members for each task
5. **Track Progress**: Monitor workflow completion status

### Timeline View
- Visual representation of workflow tasks
- Switch between timeline and list views
- Filter tasks by status and priority
- Track due dates and completion times

### Notifications
- Receive real-time notifications for task assignments
- Mark notifications as read or delete them
- Filter by type (task_assigned, task_completed, etc.)
- View notification history

## 🔧 API Endpoints

### Workflows
- `GET /api/workflows` - Get all workflows
- `POST /api/workflows` - Create new workflow
- `GET /api/workflows/[id]` - Get workflow by ID
- `PUT /api/workflows/[id]` - Update workflow
- `DELETE /api/workflows/[id]` - Delete workflow

### Tasks
- `GET /api/tasks` - Get all tasks (with optional filters)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Get task by ID
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user

### Notifications
- `GET /api/notifications` - Get notifications (with filters)
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/[id]` - Mark notification as read
- `DELETE /api/notifications/[id]` - Delete notification
- `PUT /api/notifications/mark-all-read` - Mark all notifications as read

## 🔌 WebSocket Events

### Client → Server
- `join_workflow` - Join a workflow room
- `leave_workflow` - Leave a workflow room
- `workflow_update` - Broadcast workflow updates
- `task_update` - Broadcast task updates
- `user_presence` - Update user presence status

### Server → Client
- `workflow_update` - Receive workflow updates
- `task_update` - Receive task updates
- `user_presence` - Receive user presence updates

## 🎨 Design System

### Color Palette
The application uses a dark theme with zinc color palette:

- **Background**: zinc-950 (deep dark)
- **Cards**: zinc-900/50 (semi-transparent dark)
- **Borders**: zinc-800 (subtle dark borders)
- **Primary Text**: zinc-100 (light text)
- **Secondary Text**: zinc-300 (medium text)
- **Muted Text**: zinc-500 (dimmed text)
- **Primary Actions**: emerald-600/700 (green accent)
- **Status Colors**:
  - In Progress: emerald-500
  - Review: amber-500
  - Completed: blue-500
  - To Do: zinc-600
- **Priority Colors**:
  - High: red-500
  - Medium: amber-500
  - Low: emerald-500

### Components
All UI components are from shadcn/ui library, providing:
- Consistent design patterns
- Accessibility features
- Responsive layouts
- Dark mode support (default)

## ⚙️ Configuration

### Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
# Database (SQLite - auto-created)
DATABASE_URL="file:./db/custom.db"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WS_URL="http://localhost:3003"
```

### Windows-Specific Notes

1. **File Paths**: The project uses forward slashes in imports which work cross-platform. Windows automatically handles path separators.

2. **Database File**: The SQLite database is created in the `db/` folder. Windows permissions may require running terminal as Administrator on first run.

3. **Port Availability**: Ensure ports 3000 (Next.js) and 3003 (WebSocket) are not in use:
   ```powershell
   # Check ports
   netstat -ano | findstr ":3000"
   netstat -ano | findstr ":3003"

   # Kill processes if needed
   taskkill /PID <PID> /F
   ```

4. **PowerShell Execution Policy**: If you get execution policy errors:
   ```powershell
   # Allow scripts (temporary)
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

   # Or run bypassed
   powershell -ExecutionPolicy Bypass -File script.ps1
   ```

5. **Git Bash on Windows**: If using Git Bash, commands work the same as on Linux/macOS.

6. **VS Code Integration**: Recommended editor with full TypeScript support and integrated terminal.

7. **Antivirus Software**: Some antivirus software may block Node.js or database operations. Add the project folder to your antivirus exclusions if you encounter issues.

## 🐛 Troubleshooting

### Windows-Specific Issues

#### Issue: "npm" not recognized
**Solution**: Ensure Node.js is installed and added to PATH
```powershell
# Check Node.js installation
node --version
npm --version

# If not found, reinstall Node.js from nodejs.org
```

#### Issue: Port already in use
**Solution**: Kill the process using the port
```powershell
# Find process on port 3000
netstat -ano | findstr ":3000"
# Kill it
taskkill /PID <PID> /F
```

#### Issue: Database lock errors
**Solution**: Close all terminal instances and restart
```powershell
# Kill all Node processes
taskkill /F /IM node.exe
```

#### Issue: Module not found errors
**Solution**: Reinstall dependencies
```powershell
# Clear cache and reinstall
rmdir /s /q node_modules
npm cache clean --force
npm install
```

#### Issue: Firewall blocking connections
**Solution**: Allow Node.js through Windows Firewall
- Go to Windows Security → Firewall & network protection
- Allow an app through firewall → Allow Node.js

#### Issue: "tsx" not found
**Solution**: Install tsx globally or locally
```powershell
# Install globally
npm install -g tsx

# Or it should be installed via package.json
npm install
```

### Common Issues

#### Issue: Dependencies not installing
**Solution**: Clear cache and reinstall
```powershell
# Windows
rmdir /s /q node_modules
npm cache clean --force
npm install

# macOS/Linux
rm -rf node_modules
npm cache clean --force
npm install
```

#### Issue: Database errors
**Solution**: Reset database
```powershell
npm run db:reset
npm run db:seed
```

#### Issue: Build fails with errors
**Solution**: Run lint to check for code issues
```powershell
npm run lint
```

#### Issue: WebSocket not connecting
**Solution**: Ensure the WebSocket service is running on port 3003
```powershell
# Check if service is running
netstat -ano | findstr ":3003"

# Start the service if not running
cd mini-services\workflow-socket
npm run dev
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` to check code quality
5. Submit a pull request

## 📄 License

This project is built for educational and demonstration purposes.

## 🙏 Acknowledgments

- Inspired by [Walmart Labs Concord](https://github.com/walmartlabs/concord)
- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Drag-and-drop powered by [@dnd-kit](https://dndkit.com/)
- Database by [Prisma](https://www.prisma.io/)

## 📞 Support

For questions, issues, or suggestions, please open an issue on the repository.

## 🚀 Quick Start Commands

### Windows (PowerShell)
```powershell
# Quick setup and run
npm run setup
npm run dev

# In another terminal for WebSocket
cd mini-services\workflow-socket
npm install
npm run dev
```

### Windows (Command Prompt)
```cmd
REM Quick setup and run
npm run setup
npm run dev

REM In another terminal for WebSocket
cd mini-services\workflow-socket
npm install
npm run dev
```

### Windows (Git Bash)
```bash
# Quick setup and run
npm run setup
npm run dev

# In another terminal for WebSocket
cd mini-services/workflow-socket
npm install
npm run dev
```

### macOS/Linux
```bash
# Quick setup and run
npm run setup
npm run dev

# In another terminal for WebSocket
cd mini-services/workflow-socket
npm install
npm run dev
```

## 📋 Verification

After following the setup steps, verify your installation:

1. **Check Development Server**:
   - Open http://localhost:3000 in your browser
   - You should see the Workflow Management Tool dashboard

2. **Check WebSocket Service**:
   - The WebSocket service should be running on port 3003
   - Check terminal for "WebSocket server running on port 3003" message

3. **Check Database**:
   - Navigate to the `db/` folder
   - You should see a `.db` file created
   - If you seeded the database, it should contain sample data

4. **Test Functionality**:
   - Create a new workflow
   - Add tasks using drag-and-drop
   - Check the timeline view
   - Verify notifications are working

---
