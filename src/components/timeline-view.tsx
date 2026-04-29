'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
        return 'bg-emerald-500'
      case 'review':
        return 'bg-amber-500'
      case 'completed':
        return 'bg-blue-500'
      default:
        return 'bg-zinc-600'
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      case 'review':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      case 'completed':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      default:
        return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400'
      case 'medium':
        return 'text-amber-400'
      case 'low':
        return 'text-emerald-400'
      default:
        return 'text-zinc-500'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 bg-red-500/10 border-red-500/20'
      case 'medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      case 'low':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      default:
        return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
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
      <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm space-y-4 shrink-0 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">{data.workflowName}</h2>
            <CardDescription className="mt-1 text-zinc-500">
              Timeline View • {data.tasks.length} tasks total
            </CardDescription>
          </div>
          <Select value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
            <SelectTrigger className="w-[180px] bg-zinc-800/50 border-zinc-700 text-zinc-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="timeline" className="text-zinc-100">Timeline View</SelectItem>
              <SelectItem value="list" className="text-zinc-100">List View</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-100">{Math.round(progress)}%</div>
              <Progress value={progress} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-100">{completedTasks}</div>
              <p className="text-xs text-zinc-500 mt-1">of {data.tasks.length} tasks</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-100">
                {data.tasks.filter((t) => t.status === 'in_progress').length}
              </div>
              <p className="text-xs text-zinc-500 mt-1">tasks active</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-100">
                {data.tasks.filter((t) => t.priority === 'high').length}
              </div>
              <p className="text-xs text-zinc-500 mt-1">needs attention</p>
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
                  className="relative pl-8 pb-6 border-l-2 border-zinc-800"
                >
                  {/* Timeline Node */}
                  <div
                    className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full ${getStatusColor(task.status)} border-2 border-zinc-950`}
                  />

                  {/* Task Card */}
                  <Card className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700/50 hover:shadow-lg hover:shadow-zinc-900/20 transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <StatusIcon className="w-5 h-5 mt-0.5 text-zinc-500" />
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base text-zinc-100">{task.title}</CardTitle>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Badge variant="outline" className={getStatusBadge(task.status)}>
                                {task.status.replace('_', ' ')}
                              </Badge>
                              <Badge variant="outline" className={getPriorityBadge(task.priority)}>
                                {task.priority}
                              </Badge>
                              {task.dueDate && (
                                <span className="text-xs text-zinc-500 flex items-center gap-1">
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
                            <AvatarFallback className="bg-emerald-600 text-white">
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
                          className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
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
                        <p className="text-sm text-zinc-500">{task.description}</p>
                        {task.assignee && (
                          <div className="flex items-center gap-2 mt-3 text-sm text-zinc-500">
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
                  <Card className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700/50 hover:shadow-lg hover:shadow-zinc-900/20 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <StatusIcon className="w-5 h-5 text-zinc-500 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-zinc-100">{task.title}</h4>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <Badge variant="outline" className={getStatusBadge(task.status)}>
                                {task.status.replace('_', ' ')}
                              </Badge>
                              <Badge variant="outline" className={getPriorityBadge(task.priority)}>
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          {task.dueDate && (
                            <span className="text-xs text-zinc-500 flex items-center gap-1">
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
              )
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
