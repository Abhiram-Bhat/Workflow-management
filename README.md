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
- **Dark Mode Support**: Built-in theme switching capabilities
- **Smooth Animations**: Framer Motion transitions for a polished UX
- **Type Safety**: Full TypeScript implementation

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
- **Bun** - Fast JavaScript runtime and package manager

## 📦 Project Structure

```
/home/z/my-project/
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

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-project
```

2. Install dependencies:
```bash
bun install
```

3. Set up the database:
```bash
bun run db:push
```

4. Seed the database with sample data:
```bash
bun run db:seed
```

5. Start the development server:
```bash
bun run dev
```

6. Start the WebSocket service (in a separate terminal):
```bash
cd mini-services/workflow-socket
bun run dev
```

7. Open your browser and navigate to the preview panel

## 📝 Available Scripts

- `bun run dev` - Start Next.js development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
- `bun run db:push` - Push database schema to SQLite
- `bun run db:generate` - Generate Prisma client
- `bun run db:migrate` - Run database migrations
- `bun run db:reset` - Reset database
- `bun run db:seed` - Seed database with sample data

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
The application uses Tailwind CSS color variables:
- Primary: Primary color for main actions
- Secondary: Secondary color for emphasis
- Muted: Muted color for less prominent elements
- Accent: Accent color for highlights

### Components
All UI components are from shadcn/ui library, providing:
- Consistent design patterns
- Accessibility features
- Responsive layouts
- Dark mode support

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `bun run lint` to check code quality
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

---

Built with ❤️ using modern web technologies
