'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  Bell,
  Settings,
  Plus,
  Search,
  Users,
  Clock,
  TrendingUp,
  MoreHorizontal,
  Play,
  Edit,
  Trash2,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { WorkflowBuilder } from '@/components/workflow-builder'
import { TimelineView } from '@/components/timeline-view'
import { NotificationCenter } from '@/components/notification-center'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

interface Workflow {
  id: string
  name: string
  description?: string
  status: 'draft' | 'active' | 'archived'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  teamId?: string
  team?: { id: string; name: string }
  createdBy: { id: string; name: string; email: string }
  tasks: Task[]
}

interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high'
  order: number
  dueDate?: string
  completedAt?: string
  workflowId: string
  assignee?: { id: string; name: string; email: string; avatar?: string }
  workflow?: { id: string; name: string }
}

interface Activity {
  id: string
  action: string
  user: string
  task: string
  time: string
}

type ViewMode = 'dashboard' | 'workflows' | 'tasks' | 'timeline' | 'team' | 'settings'
type SelectedWorkflowView = 'overview' | 'builder' | 'timeline'

export default function WorkflowManagementTool() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [selectedWorkflowView, setSelectedWorkflowView] = useState<SelectedWorkflowView>('overview')
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Create workflow dialog
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'draft' as 'draft' | 'active' | 'archived',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [workflowsRes, tasksRes, usersRes] = await Promise.all([
        fetch('/api/workflows'),
        fetch('/api/tasks'),
        fetch('/api/users'),
      ])

      if (workflowsRes.ok) {
        const workflowsData = await workflowsRes.json()
        setWorkflows(workflowsData)
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json()
        setTasks(tasksData)
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
        // Set first user as current user (simulated auth)
        if (usersData.length > 0) {
          setCurrentUser(usersData[0])
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWorkflow = async () => {
    if (!newWorkflow.name.trim() || !currentUser) return

    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newWorkflow.name,
          description: newWorkflow.description,
          priority: newWorkflow.priority,
          status: newWorkflow.status,
          createdById: currentUser.id,
          tasks: [],
        }),
      })

      if (response.ok) {
        const createdWorkflow = await response.json()
        setWorkflows([createdWorkflow, ...workflows])
        setShowCreateDialog(false)
        setNewWorkflow({
          name: '',
          description: '',
          priority: 'medium',
          status: 'draft',
        })
      }
    } catch (error) {
      console.error('Error creating workflow:', error)
    }
  }

  const handleUpdateWorkflow = async (updatedWorkflow: Workflow) => {
    try {
      const response = await fetch(`/api/workflows/${updatedWorkflow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updatedWorkflow.name,
          description: updatedWorkflow.description,
          status: updatedWorkflow.status,
          priority: updatedWorkflow.priority,
          tasks: updatedWorkflow.tasks,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setWorkflows((prev) =>
          prev.map((w) => (w.id === data.id ? data : w))
        )
        if (selectedWorkflow?.id === data.id) {
          setSelectedWorkflow(data)
        }
      }
    } catch (error) {
      console.error('Error updating workflow:', error)
    }
  }

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return

    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setWorkflows((prev) => prev.filter((w) => w.id !== workflowId))
        if (selectedWorkflow?.id === workflowId) {
          setSelectedWorkflow(null)
          setViewMode('workflows')
        }
      }
    } catch (error) {
      console.error('Error deleting workflow:', error)
    }
  }

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)))
        setWorkflows((prev) =>
          prev.map((w) => ({
            ...w,
            tasks: w.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
          }))
        )
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId))
        if (selectedWorkflow) {
          setSelectedWorkflow({
            ...selectedWorkflow,
            tasks: selectedWorkflow.tasks.filter((t) => t.id !== taskId),
          })
        }
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' as ViewMode },
    { icon: FolderKanban, label: 'Workflows', id: 'workflows' as ViewMode, count: workflows.length },
    { icon: CheckSquare, label: 'My Tasks', id: 'tasks' as ViewMode, count: tasks.filter((t) => t.assignee?.id === currentUser?.id).length },
    { icon: Calendar, label: 'Timeline', id: 'timeline' as ViewMode },
    { icon: Users, label: 'Team', id: 'team' as ViewMode, count: users.length },
    { icon: Settings, label: 'Settings', id: 'settings' as ViewMode },
  ]

  const filteredWorkflows = workflows.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const myTasks = tasks.filter((t) => t.assignee?.id === currentUser?.id)
  const filteredMyTasks = myTasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'in_progress':
        return 'bg-emerald-500'
      case 'draft':
      case 'todo':
        return 'bg-slate-500'
      case 'review':
        return 'bg-amber-500'
      case 'completed':
        return 'bg-blue-500'
      case 'archived':
        return 'bg-zinc-600'
      default:
        return 'bg-slate-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-amber-500'
      case 'low':
        return 'bg-emerald-500'
      default:
        return 'bg-slate-500'
    }
  }

  const calculateProgress = (workflow: Workflow) => {
    if (workflow.tasks.length === 0) return 0
    const completed = workflow.tasks.filter((t) => t.status === 'completed').length
    return Math.round((completed / workflow.tasks.length) * 100)
  }

  const stats = {
    totalWorkflows: workflows.length,
    activeTasks: tasks.filter((t) => t.status === 'in_progress').length,
    teamMembers: users.length,
    completionRate: tasks.length > 0
      ? Math.round((tasks.filter((t) => t.status === 'completed').length / tasks.length) * 100)
      : 0,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Render specific view
  if (viewMode === 'workflows' && selectedWorkflow) {
    return (
      <div className="min-h-screen bg-zinc-950 flex">
        {/* Sidebar */}
        <Sidebar
          items={sidebarItems}
          activeItem={viewMode}
          onSelect={setViewMode}
          currentUser={currentUser}
          onBack={() => setSelectedWorkflow(null)}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-0">
          {selectedWorkflowView === 'builder' && (
            <WorkflowBuilder workflow={selectedWorkflow} onUpdate={handleUpdateWorkflow} />
          )}
          {selectedWorkflowView === 'timeline' && (
            <TimelineView
              data={{
                workflowId: selectedWorkflow.id,
                workflowName: selectedWorkflow.name,
                tasks: selectedWorkflow.tasks,
              }}
            />
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <Sidebar
        items={sidebarItems}
        activeItem={viewMode}
        onSelect={setViewMode}
        currentUser={currentUser}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm px-6 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Search workflows, tasks, team members..."
                className="pl-10 bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-emerald-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {currentUser && <NotificationCenter userId={currentUser.id} />}
          </div>
        </header>

        {/* Content Area */}
        <ScrollArea className="flex-1">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {viewMode === 'dashboard' && (
              <DashboardView
                workflows={filteredWorkflows}
                tasks={tasks}
                stats={stats}
                users={users}
                currentUser={currentUser}
                onSelectWorkflow={(w) => {
                  setSelectedWorkflow(w)
                  setSelectedWorkflowView('builder')
                  setViewMode('workflows')
                }}
                onOpenCreateDialog={() => setShowCreateDialog(true)}
              />
            )}

            {viewMode === 'workflows' && (
              <WorkflowsView
                workflows={filteredWorkflows}
                users={users}
                onSelectWorkflow={(w) => {
                  setSelectedWorkflow(w)
                  setSelectedWorkflowView('builder')
                }}
                onDeleteWorkflow={handleDeleteWorkflow}
                onOpenCreateDialog={() => setShowCreateDialog(true)}
              />
            )}

            {viewMode === 'tasks' && (
              <TasksView
                tasks={filteredMyTasks}
                onUpdateTask={handleUpdateTask}
                currentUser={currentUser}
              />
            )}

            {viewMode === 'timeline' && (
              <TimelineListView workflows={workflows} />
            )}

            {viewMode === 'team' && (
              <TeamView users={users} />
            )}

            {viewMode === 'settings' && (
              <SettingsView currentUser={currentUser} />
            )}
          </div>
        </ScrollArea>
      </main>

      {/* Create Workflow Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Set up a new workflow to organize your tasks and processes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter workflow name"
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
                value={newWorkflow.name}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter workflow description"
                className="bg-zinc-800 border-zinc-700 text-zinc-100 resize-none"
                rows={3}
                value={newWorkflow.description}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newWorkflow.priority}
                  onValueChange={(value: any) => setNewWorkflow({ ...newWorkflow, priority: value })}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newWorkflow.status}
                  onValueChange={(value: any) => setNewWorkflow({ ...newWorkflow, status: value })}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateWorkflow} className="bg-emerald-600 hover:bg-emerald-700">
              Create Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Sidebar Component
function Sidebar({
  items,
  activeItem,
  onSelect,
  currentUser,
  onBack,
}: {
  items: any[]
  activeItem: ViewMode
  onSelect: (item: ViewMode) => void
  currentUser: User | null
  onBack?: () => void
}) {
  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-900 flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <FolderKanban className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-zinc-100">WorkflowPro</h1>
            <p className="text-xs text-zinc-500">Manage with ease</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-1">
          {items.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                activeItem === item.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 border-zinc-700">
                  {item.count}
                </Badge>
              )}
            </motion.button>
          ))}
        </nav>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t border-zinc-800">
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="w-full mb-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          >
            <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Workflows
          </Button>
        )}
        {currentUser && (
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors">
            <Avatar>
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback className="bg-emerald-600 text-white">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-zinc-200 truncate">{currentUser.name}</p>
              <p className="text-xs text-zinc-500 truncate">{currentUser.email}</p>
            </div>
            <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">
              {currentUser.role}
            </Badge>
          </div>
        )}
      </div>
    </aside>
  )
}

// Dashboard View
function DashboardView({
  workflows,
  tasks,
  stats,
  users,
  currentUser,
  onSelectWorkflow,
  onOpenCreateDialog,
}: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Workflows', value: stats.totalWorkflows, icon: FolderKanban, color: 'text-emerald-400' },
          { label: 'Active Tasks', value: stats.activeTasks, icon: CheckSquare, color: 'text-amber-400' },
          { label: 'Team Members', value: stats.teamMembers, icon: Users, color: 'text-blue-400' },
          { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: TrendingUp, color: 'text-purple-400' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700/50 transition-all hover:shadow-lg hover:shadow-zinc-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-zinc-100">{stat.value}</div>
                  <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList className="bg-zinc-900/50 border border-zinc-800">
          <TabsTrigger value="workflows" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            Workflows
          </TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            My Tasks
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            Recent Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-100">Active Workflows</h3>
            <Button onClick={onOpenCreateDialog} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              New Workflow
            </Button>
          </div>

          {workflows.length === 0 ? (
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-12 text-center">
                <FolderKanban className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
                <p className="text-zinc-400 mb-4">No workflows yet</p>
                <Button onClick={onOpenCreateDialog} className="bg-emerald-600 hover:bg-emerald-700">
                  Create Your First Workflow
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {workflows.map((workflow: Workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  onSelect={() => onSelectWorkflow(workflow)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks">
          <TaskList tasks={tasks.filter((t: Task) => t.assignee?.id === currentUser?.id)} />
        </TabsContent>

        <TabsContent value="activity">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-8 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
              <p className="text-zinc-400">Activity tracking coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

// Workflow Card Component
function WorkflowCard({ workflow, onSelect }: { workflow: Workflow; onSelect: () => void }) {
  const progress = workflow.tasks.length > 0
    ? Math.round((workflow.tasks.filter((t) => t.status === 'completed').length / workflow.tasks.length) * 100)
    : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      case 'draft': return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
      case 'archived': return 'text-zinc-500 bg-zinc-600/10 border-zinc-600/20'
      default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-amber-500'
      case 'low': return 'bg-emerald-500'
      default: return 'bg-zinc-500'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        onClick={onSelect}
        className="bg-zinc-900/50 border-zinc-800 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 transition-all cursor-pointer group"
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-lg text-zinc-100 group-hover:text-emerald-400 transition-colors">
                  {workflow.name}
                </CardTitle>
                <Badge variant="outline" className={getStatusColor(workflow.status)}>
                  {workflow.status}
                </Badge>
              </div>
              {workflow.description && (
                <CardDescription className="text-zinc-500">{workflow.description}</CardDescription>
              )}
            </div>
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(workflow.priority)}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Progress</span>
              <span className="text-zinc-300 font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between text-sm text-zinc-500">
              <span>{workflow.tasks.filter((t) => t.status === 'completed').length}/{workflow.tasks.length} completed</span>
              {workflow.team && <span>{workflow.team.name}</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Workflows View
function WorkflowsView({ workflows, users, onSelectWorkflow, onDeleteWorkflow, onOpenCreateDialog }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-100">All Workflows</h2>
        <Button onClick={onOpenCreateDialog} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          New Workflow
        </Button>
      </div>

      {workflows.length === 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-12 text-center">
            <FolderKanban className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
            <p className="text-zinc-400 mb-4">No workflows found</p>
            <Button onClick={onOpenCreateDialog} className="bg-emerald-600 hover:bg-emerald-700">
              Create Your First Workflow
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {workflows.map((workflow: Workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onSelect={() => onSelectWorkflow(workflow)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Tasks View
function TasksView({ tasks, onUpdateTask, currentUser }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-100">My Tasks</h2>
      <TaskList tasks={tasks} onUpdateTask={onUpdateTask} />
    </div>
  )
}

// Task List Component
function TaskList({ tasks, onUpdateTask }: { tasks: Task[]; onUpdateTask?: (id: string, updates: Partial<Task>) => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'text-emerald-400'
      case 'review': return 'text-amber-400'
      case 'completed': return 'text-blue-400'
      default: return 'text-zinc-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20'
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      case 'low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
    }
  }

  if (tasks.length === 0) {
    return (
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-12 text-center">
          <CheckSquare className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
          <p className="text-zinc-400">No tasks found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700/50 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-zinc-100">{task.title}</h4>
                    {task.workflow && (
                      <p className="text-sm text-zinc-500 mt-1">{task.workflow.name}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      {task.dueDate && (
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(task.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={task.status}
                    onValueChange={(value) => onUpdateTask?.(task.id, { status: value as any })}
                  >
                    <SelectTrigger className="w-32 bg-zinc-800/50 border-zinc-700 text-zinc-100 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  {task.assignee && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={task.assignee.avatar} />
                      <AvatarFallback className="bg-zinc-700 text-zinc-300 text-xs">
                        {task.assignee.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

// Timeline List View
function TimelineListView({ workflows }: { workflows: Workflow[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-100">Timeline Overview</h2>

      {workflows.length === 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
            <p className="text-zinc-400">No workflows to display</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {workflows.map((workflow, index) => (
            <motion.div
              key={workflow.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-zinc-100">{workflow.name}</CardTitle>
                  <CardDescription className="text-zinc-500">{workflow.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {workflow.tasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-2 rounded hover:bg-zinc-800/50">
                        <div className={`w-2 h-2 rounded-full ${
                          task.status === 'completed' ? 'bg-emerald-500' :
                          task.status === 'in_progress' ? 'bg-amber-500' :
                          'bg-zinc-600'
                        }`} />
                        <span className="flex-1 text-sm text-zinc-300">{task.title}</span>
                        <Badge variant="outline" className="text-zinc-400 border-zinc-700">
                          {task.status}
                        </Badge>
                      </div>
                    ))}
                    {workflow.tasks.length > 5 && (
                      <p className="text-sm text-zinc-500 text-center pt-2">
                        +{workflow.tasks.length - 5} more tasks
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// Team View
function TeamView({ users }: { users: User[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-100">Team Members</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-emerald-600 text-white text-lg">
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-zinc-100 truncate">{user.name}</h4>
                    <p className="text-sm text-zinc-500 truncate">{user.email}</p>
                    <Badge variant="outline" className="mt-2 border-zinc-700 text-zinc-400">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Settings View
function SettingsView({ currentUser }: { currentUser: User | null }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-100">Settings</h2>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100">Profile</CardTitle>
          <CardDescription className="text-zinc-500">
            Manage your account settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={currentUser?.avatar} />
              <AvatarFallback className="bg-emerald-600 text-white text-2xl">
                {currentUser?.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Change Avatar
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              defaultValue={currentUser?.name}
              className="bg-zinc-800/50 border-zinc-700 text-zinc-100"
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              defaultValue={currentUser?.email}
              className="bg-zinc-800/50 border-zinc-700 text-zinc-100"
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Input
              defaultValue={currentUser?.role}
              className="bg-zinc-800/50 border-zinc-700 text-zinc-100"
              disabled
            />
          </div>

          <Button className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}
