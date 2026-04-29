import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

const PORT = 3003
const httpServer = createServer()

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

interface WorkflowUpdate {
  workflowId: string
  type: 'created' | 'updated' | 'deleted' | 'task_added' | 'task_updated' | 'task_deleted'
  data: any
}

// Store active rooms (workflows)
const activeWorkflows = new Set<string>()

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  // Join a workflow room
  socket.on('join_workflow', (workflowId: string) => {
    socket.join(`workflow:${workflowId}`)
    activeWorkflows.add(workflowId)
    console.log(`Client ${socket.id} joined workflow: ${workflowId}`)
  })

  // Leave a workflow room
  socket.on('leave_workflow', (workflowId: string) => {
    socket.leave(`workflow:${workflowId}`)
    console.log(`Client ${socket.id} left workflow: ${workflowId}`)
  })

  // Listen for workflow updates and broadcast to the room
  socket.on('workflow_update', (update: WorkflowUpdate) => {
    console.log(`Workflow update received: ${update.type} for ${update.workflowId}`)
    io.to(`workflow:${update.workflowId}`).emit('workflow_update', update)
  })

  // Task update events
  socket.on('task_update', (data: { workflowId: string; type: string; taskData: any }) => {
    console.log(`Task update received: ${data.type} for workflow ${data.workflowId}`)
    io.to(`workflow:${data.workflowId}`).emit('task_update', data)
  })

  // User presence (typing, online status, etc.)
  socket.on('user_presence', (data: { workflowId: string; userId: string; status: string }) => {
    socket.to(`workflow:${data.workflowId}`).emit('user_presence', data)
  })

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
  })
})

httpServer.listen(PORT, () => {
  console.log(`🚀 Workflow WebSocket service running on port ${PORT}`)
})
