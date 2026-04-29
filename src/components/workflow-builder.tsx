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
        return 'bg-green-500'
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
    <div ref={setNodeRef} style={style}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="p-4">
            <div className="flex items-center gap-3">
              <motion.div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
              >
                <GripVertical className="w-5 h-5 text-muted-foreground" />
              </motion.div>

              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`}
              />

              <div className="flex-1 min-w-0">
                <CardTitle className="text-base">{task.title}</CardTitle>
                {task.description && (
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {task.description}
                  </p>
                )}
              </div>

              <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleExpand(task.id)}
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
              >
                <Edit2 className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
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
                      <span className="text-muted-foreground">Status:</span>{' '}
                      <Badge variant="secondary">{task.status}</Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Priority:</span>{' '}
                      <Badge variant="outline">{task.priority}</Badge>
                    </div>
                    {task.assignee && (
                      <div>
                        <span className="text-muted-foreground">Assignee:</span>{' '}
                        <span>{task.assignee}</span>
                      </div>
                    )}
                    {task.dueDate && (
                      <div>
                        <span className="text-muted-foreground">Due Date:</span>{' '}
                        <span>
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
        <label className="text-sm font-medium">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter task title"
          autoFocus
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter task description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Status</label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Priority</label>
          <Select
            value={formData.priority}
            onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Assignee</label>
          <Input
            value={formData.assignee || ''}
            onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
            placeholder="Enter assignee"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Due Date</label>
          <Input
            type="date"
            value={formData.dueDate || ''}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit">
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
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-2xl font-bold">{workflow.name}</h2>
          {workflow.description && (
            <p className="text-muted-foreground mt-1">{workflow.description}</p>
          )}
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>Create a new task for this workflow</DialogDescription>
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
                  <p className="text-muted-foreground mb-4">No tasks yet</p>
                  <Button onClick={() => setShowAddDialog(true)}>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update task details</DialogDescription>
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
