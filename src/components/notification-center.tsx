'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'task_assigned' | 'task_completed' | 'task_updated' | 'workflow_updated' | 'comment_added' | 'system'
  isRead: boolean
  userId: string
  createdAt: string
}
export function NotificationCenter({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/notifications?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setNotifications(data)
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }

    fetchNotifications()
  }, [userId])

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PUT' })
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'task_assigned':
        return 'bg-blue-500'
      case 'task_completed':
        return 'bg-emerald-500'
      case 'task_updated':
        return 'bg-amber-500'
      case 'workflow_updated':
        return 'bg-purple-500'
      case 'comment_added':
        return 'bg-orange-500'
      case 'system':
        return 'bg-zinc-500'
      default:
        return 'bg-zinc-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task_assigned':
        return '📋'
      case 'task_completed':
        return '✅'
      case 'task_updated':
        return '🔄'
      case 'workflow_updated':
        return '📊'
      case 'comment_added':
        return '💬'
      case 'system':
        return '🔔'
      default:
        return '📌'
    }
  }

  const filteredNotifications = notifications.filter((n) => {
    const readFilter = filter === 'all' || (filter === 'unread' && !n.isRead) || (filter === 'read' && n.isRead)
    const typeFilterMatch = typeFilter === 'all' || n.type === typeFilter
    return readFilter && typeFilterMatch
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 border-zinc-700 bg-zinc-900" align="end">
        <Card className="border-0 shadow-none bg-zinc-900">
          <CardHeader className="pb-3 px-4 pt-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-zinc-100">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800">
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Mark all read
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
                <SelectTrigger className="h-8 text-xs bg-zinc-800/50 border-zinc-700 text-zinc-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="all" className="text-zinc-100">All</SelectItem>
                  <SelectItem value="unread" className="text-zinc-100">Unread</SelectItem>
                  <SelectItem value="read" className="text-zinc-100">Read</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-8 text-xs flex-1 bg-zinc-800/50 border-zinc-700 text-zinc-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="all" className="text-zinc-100">All Types</SelectItem>
                  <SelectItem value="task_assigned" className="text-zinc-100">Task Assigned</SelectItem>
                  <SelectItem value="task_completed" className="text-zinc-100">Task Completed</SelectItem>
                  <SelectItem value="task_updated" className="text-zinc-100">Task Updated</SelectItem>
                  <SelectItem value="workflow_updated" className="text-zinc-100">Workflow Updated</SelectItem>
                  <SelectItem value="comment_added" className="text-zinc-100">Comment Added</SelectItem>
                  <SelectItem value="system" className="text-zinc-100">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
                  <p className="text-zinc-500">No notifications</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <AnimatePresence mode="popLayout">
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className={`p-4 border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors ${
                          !notification.isRead ? 'bg-zinc-800/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-full ${getTypeColor(notification.type)} flex items-center justify-center text-sm shrink-0`}
                          >
                            {getTypeIcon(notification.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-zinc-100">{notification.title}</p>
                                <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-zinc-500 mt-2">
                                  {formatTime(notification.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
