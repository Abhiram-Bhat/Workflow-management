'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, CheckCircle2, Circle, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface TimelineTask {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high'
  assignee?: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  dueDate?: string
  completedAt?: string
  order: number
}

export interface TimelineData {
  workflowId: string
  workflowName: string
  tasks: TimelineTask[]
  startDate?: string
  endDate?: string
}

export function TimelineView({ data }: { data: TimelineData }) {
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline')
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'bg-green-500'
      case 'review':
        return 'bg-yellow-500'
      case 'completed':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle2
      case 'in_progress':
        return Clock
      case 'review':
        return AlertCircle
      default:
        return Circle
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500'
      case 'medium':
        return 'text-yellow-500'
      case 'low':
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  const completedTasks = data.tasks.filter((t) => t.status === 'completed').length
  const progress = (completedTasks / data.tasks.length) * 100

  const toggleExpand = (taskId: string) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev)
      if (next.has(taskId)) {
        next.delete(taskId)
      } else {
        next.add(taskId)
      }
      return next
    })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{data.workflowName}</h2>
            <CardDescription className="mt-1">
              Timeline View • {data.tasks.length} tasks total
            </CardDescription>
          </div>
          <Select value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="timeline">Timeline View</SelectItem>
              <SelectItem value="list">List View</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.round(progress)}%</div>
              <Progress value={progress} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedTasks}</div>
              <p className="text-xs text-muted-foreground mt-1">of {data.tasks.length} tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {data.tasks.filter((t) => t.status === 'in_progress').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">tasks active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {data.tasks.filter((t) => t.priority === 'high').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">needs attention</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Timeline Content */}
      <ScrollArea className="flex-1 p-6">
        {viewMode === 'timeline' ? (
          <div className="space-y-6">
            {data.tasks.map((task, index) => {
              const StatusIcon = getStatusIcon(task.status)
              const isExpanded = expandedTasks.has(task.id)

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-8 pb-6 border-l-2 border-border"
                >
                  {/* Timeline Node */}
                  <div
                    className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full ${getStatusColor(task.status)} border-2 border-background`}
                  />

                  {/* Task Card */}
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <StatusIcon className="w-5 h-5 mt-0.5 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base">{task.title}</CardTitle>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {task.status.replace('_', ' ')}
                              </Badge>
                              <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </Badge>
                              {task.dueDate && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(task.dueDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {task.assignee && (
                          <Avatar className="shrink-0">
                            <AvatarImage src={task.assignee.avatar} />
                            <AvatarFallback>
                              {task.assignee.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleExpand(task.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>

                    {isExpanded && task.description && (
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        {task.assignee && (
                          <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>Assigned to {task.assignee.name}</span>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {data.tasks.map((task, index) => {
              const StatusIcon = getStatusIcon(task.status)

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <StatusIcon className="w-5 h-5 text-muted-foreground shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium">{task.title}</h4>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {task.status.replace('_', ' ')}
                              </Badge>
                              <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          {task.dueDate && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(task.dueDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          )}

                          {task.assignee && (
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={task.assignee.avatar} />
                              <AvatarFallback className="text-xs">
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
              )
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
