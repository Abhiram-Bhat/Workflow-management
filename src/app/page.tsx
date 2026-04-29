'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'

const mockWorkflows = [
  {
    id: '1',
    name: 'Product Launch Workflow',
    status: 'active',
    priority: 'high',
    progress: 65,
    tasks: 12,
    completedTasks: 8,
    team: 'Product Team',
    dueDate: '2025-01-20',
  },
  {
    id: '2',
    name: 'Code Review Process',
    status: 'active',
    priority: 'medium',
    progress: 40,
    tasks: 8,
    completedTasks: 3,
    team: 'Engineering',
    dueDate: '2025-01-25',
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    status: 'draft',
    priority: 'high',
    progress: 0,
    tasks: 15,
    completedTasks: 0,
    team: 'Marketing',
    dueDate: '2025-02-01',
  },
]

const mockTasks = [
  {
    id: '1',
    title: 'Design landing page mockups',
    status: 'in_progress',
    priority: 'high',
    assignee: 'Sarah Johnson',
    dueDate: '2025-01-16',
    workflow: 'Product Launch Workflow',
  },
  {
    id: '2',
    title: 'Write API documentation',
    status: 'todo',
    priority: 'medium',
    assignee: 'Mike Chen',
    dueDate: '2025-01-17',
    workflow: 'Code Review Process',
  },
  {
    id: '3',
    title: 'Review pull request #234',
    status: 'review',
    priority: 'high',
    assignee: 'Emily Davis',
    dueDate: '2025-01-15',
    workflow: 'Code Review Process',
  },
  {
    id: '4',
    title: 'Create social media assets',
    status: 'completed',
    priority: 'low',
    assignee: 'John Smith',
    dueDate: '2025-01-14',
    workflow: 'Marketing Campaign',
  },
]

const mockRecentActivity = [
  {
    id: '1',
    action: 'completed task',
    user: 'Sarah Johnson',
    task: 'Design logo variations',
    time: '10 minutes ago',
  },
  {
    id: '2',
    action: 'created workflow',
    user: 'Mike Chen',
    task: 'Sprint Planning',
    time: '30 minutes ago',
  },
  {
    id: '3',
    action: 'assigned task',
    user: 'Emily Davis',
    task: 'Review analytics dashboard',
    time: '1 hour ago',
  },
  {
    id: '4',
    action: 'commented on',
    user: 'John Smith',
    task: 'API integration',
    time: '2 hours ago',
  },
]

const notifications = [
  { id: '1', title: 'Task assigned', message: 'You have been assigned to "Design landing page"', time: '5m ago', unread: true },
  { id: '2', title: 'Workflow updated', message: 'Product Launch Workflow progress updated to 65%', time: '1h ago', unread: true },
  { id: '3', title: 'New comment', message: 'Emily commented on "Review pull request #234"', time: '2h ago', unread: false },
]

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', count: null },
  { icon: FolderKanban, label: 'Workflows', count: 5 },
  { icon: CheckSquare, label: 'My Tasks', count: 12 },
  { icon: Calendar, label: 'Timeline', count: null },
  { icon: Bell, label: 'Notifications', count: 3 },
  { icon: Users, label: 'Team', count: null },
  { icon: Settings, label: 'Settings', count: null },
]

export default function WorkflowManagementTool() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedSidebar, setSelectedSidebar] = useState('Dashboard')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'in_progress':
        return 'bg-green-500'
      case 'draft':
      case 'todo':
        return 'bg-gray-500'
      case 'review':
        return 'bg-yellow-500'
      case 'completed':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <FolderKanban className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">WorkflowPro</h1>
              <p className="text-xs text-muted-foreground">Manage with ease</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 p-4">
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <motion.button
                key={item.label}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSidebar(item.label)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  selectedSidebar === item.label
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count && (
                  <Badge variant="secondary" className="text-xs">
                    {item.count}
                  </Badge>
                )}
              </motion.button>
            ))}
          </nav>
        </ScrollArea>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">john@example.com</p>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search workflows, tasks, team members..."
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Workflow
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Workflows
                    </CardTitle>
                    <FolderKanban className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground mt-1">+2 this week</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Tasks
                    </CardTitle>
                    <CheckSquare className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">34</div>
                    <p className="text-xs text-muted-foreground mt-1">8 completed today</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Team Members
                    </CardTitle>
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">18</div>
                    <p className="text-xs text-muted-foreground mt-1">5 online now</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Completion Rate
                    </CardTitle>
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">87%</div>
                    <p className="text-xs text-muted-foreground mt-1">+5% from last week</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <Tabs defaultValue="workflows" className="space-y-6">
              <TabsList>
                <TabsTrigger value="workflows">Workflows</TabsTrigger>
                <TabsTrigger value="tasks">My Tasks</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              </TabsList>

              {/* Workflows Tab */}
              <TabsContent value="workflows" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    {mockWorkflows.map((workflow, index) => (
                      <motion.div
                        key={workflow.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                                  <Badge variant="outline" className="text-xs">
                                    {workflow.team}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {workflow.status}
                                  </Badge>
                                </div>
                                <CardDescription>
                                  Due: {new Date(workflow.dueDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </CardDescription>
                              </div>
                              <div className={`w-2 h-2 rounded-full ${getPriorityColor(workflow.priority)}`} />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{workflow.progress}%</span>
                              </div>
                              <Progress value={workflow.progress} className="h-2" />
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Tasks</span>
                                <span>
                                  {workflow.completedTasks}/{workflow.tasks} completed
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Notifications Panel */}
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                          <div className="space-y-4">
                            {notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-3 rounded-lg border ${
                                  notification.unread ? 'bg-muted/50 border-primary/20' : 'border-border'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-primary' : 'bg-muted'}`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">{notification.title}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                      {notification.time}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Tasks Tab */}
              <TabsContent value="tasks">
                <Card>
                  <CardHeader>
                    <CardTitle>My Tasks</CardTitle>
                    <CardDescription>Manage your assigned tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockTasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start gap-4 flex-1">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(task.status)}`}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{task.workflow}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  {task.status}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {task.priority}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Avatar className="shrink-0">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee}`}
                            />
                            <AvatarFallback>
                              {task.assignee
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Recent Activity Tab */}
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Track team progress and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockRecentActivity.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-4"
                        >
                          <Avatar>
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.user}`}
                            />
                            <AvatarFallback>
                              {activity.user
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">
                              <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                              <span className="font-medium">{activity.task}</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}
