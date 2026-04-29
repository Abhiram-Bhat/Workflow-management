'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Plus,
  GripVertical,
  Trash2,
  Edit2,
  Save,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'

export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high'
  assignee?: string
  dueDate?: string
  order: number
}

export interface Workflow {
  id: string
  name: string
  description?: string
  status: 'draft' | 'active' | 'archived'
  priority: 'low' | 'medium' | 'high'
  tasks: Task[]
}

interface SortableTaskProps {
  task: Task
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
  onToggleExpand: (id: string) => void
  isExpanded: boolean
}

function SortableTask({ task, onDelete, onEdit, onToggleExpand, isExpanded }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-amber-500'
      case 'low':
        return 'bg-emerald-500'
      default:
        return 'bg-zinc-600'
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

  return (
    <div ref={setNodeRef} style={style}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700/50 hover:shadow-lg hover:shadow-zinc-900/20 transition-all">
          <CardHeader className="p-4">
            <div className="flex items-center gap-3">
              <motion.div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-zinc-800/50 rounded"
              >
                <GripVertical className="w-5 h-5 text-zinc-500" />
              </motion.div>

              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`}
              />

              <div className="flex-1 min-w-0">
                <CardTitle className="text-base text-zinc-100">{task.title}</CardTitle>
                {task.description && (
                  <p className="text-sm text-zinc-500 mt-1 truncate">
                    {task.description}
                  </p>
                )}
              </div>

              <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleExpand(task.id)}
                className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(task)}
                className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              >
                <Edit2 className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(task.id)}
                className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pt-0 px-4 pb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-zinc-500">Status:</span>{' '}
                      <Badge variant="outline" className={getStatusBadge(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-zinc-500">Priority:</span>{' '}
                      <Badge variant="outline" className={getPriorityBadge(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    {task.assignee && (
                      <div>
                        <span className="text-zinc-500">Assignee:</span>{' '}
                        <span className="text-zinc-300">{task.assignee}</span>
                      </div>
                    )}
                    {task.dueDate && (
                      <div>
                        <span className="text-zinc-500">Due Date:</span>{' '}
                        <span className="text-zinc-300">
                          {new Date(task.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  )
}

interface TaskFormProps {
  task?: Task
  onSave: (task: Task) => void
  onCancel: () => void
}

function TaskForm({ task, onSave, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState<Partial<Task>>(
    task || {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      order: 0,
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title?.trim()) return

    onSave({
      id: task?.id || `task-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      status: formData.status || 'todo',
      priority: formData.priority || 'medium',
      assignee: formData.assignee,
      dueDate: formData.dueDate,
      order: task?.order || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-zinc-300">Title</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter task title"
          autoFocus
          className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-emerald-500"
        />
      </div>

      <div>
        <Label className="text-zinc-300">Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter task description"
          rows={3}
          className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-emerald-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-zinc-300">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as any })}
          >
            <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-zinc-100 focus-visible:ring-emerald-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="todo" className="text-zinc-100">To Do</SelectItem>
              <SelectItem value="in_progress" className="text-zinc-100">In Progress</SelectItem>
              <SelectItem value="review" className="text-zinc-100">Review</SelectItem>
              <SelectItem value="completed" className="text-zinc-100">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-zinc-300">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
          >
            <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-zinc-100 focus-visible:ring-emerald-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="low" className="text-zinc-100">Low</SelectItem>
              <SelectItem value="medium" className="text-zinc-100">Medium</SelectItem>
              <SelectItem value="high" className="text-zinc-100">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-zinc-300">Assignee</Label>
          <Input
            value={formData.assignee || ''}
            onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
            placeholder="Enter assignee"
            className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-emerald-500"
          />
        </div>

        <div>
          <Label className="text-zinc-300">Due Date</Label>
          <Input
            type="date"
            value={formData.dueDate || ''}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-emerald-500"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </form>
  )
}

export function WorkflowBuilder({ workflow, onUpdate }: { workflow: Workflow; onUpdate: (workflow: Workflow) => void }) {
  const [tasks, setTasks] = useState<Task[]>(workflow.tasks)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        const reorderedTasks = arrayMove(items, oldIndex, newIndex)

        onUpdate({
          ...workflow,
          tasks: reorderedTasks.map((task, index) => ({ ...task, order: index })),
        })

        return reorderedTasks
      })
    }
  }

  const handleAddTask = (newTask: Task) => {
    const updatedTasks = [...tasks, { ...newTask, order: tasks.length }]
    setTasks(updatedTasks)
    setShowAddDialog(false)
    onUpdate({ ...workflow, tasks: updatedTasks })
  }

  const handleUpdateTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    setTasks(updatedTasks)
    setEditingTask(null)
    onUpdate({ ...workflow, tasks: updatedTasks })
  }

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== taskId)
    setTasks(updatedTasks)
    onUpdate({ ...workflow, tasks: updatedTasks })
  }

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
      <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm shrink-0 sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">{workflow.name}</h2>
          {workflow.description && (
            <p className="text-zinc-500 mt-1">{workflow.description}</p>
          )}
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <DialogHeader>
              <DialogTitle className="text-zinc-100">Add New Task</DialogTitle>
              <DialogDescription className="text-zinc-500">
                Create a new task for this workflow
              </DialogDescription>
            </DialogHeader>
            <TaskForm onSave={handleAddTask} onCancel={() => setShowAddDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tasks List */}
      <ScrollArea className="flex-1 p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              <AnimatePresence>
                {tasks.map((task) => (
                  <SortableTask
                    key={task.id}
                    task={task}
                    onDelete={handleDeleteTask}
                    onEdit={setEditingTask}
                    onToggleExpand={toggleExpand}
                    isExpanded={expandedTasks.has(task.id)}
                  />
                ))}
              </AnimatePresence>

              {tasks.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-zinc-500 mb-4">No tasks yet</p>
                  <Button onClick={() => setShowAddDialog(true)} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Task
                  </Button>
                </motion.div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </ScrollArea>

      {/* Edit Task Dialog */}
      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <DialogHeader>
              <DialogTitle className="text-zinc-100">Edit Task</DialogTitle>
              <DialogDescription className="text-zinc-500">
                Update task details
              </DialogDescription>
            </DialogHeader>
            <TaskForm
              task={editingTask}
              onSave={handleUpdateTask}
              onCancel={() => setEditingTask(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
