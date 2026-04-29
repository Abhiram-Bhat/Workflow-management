import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        email: 'john@example.com',
        name: 'John Doe',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      },
    }),
    prisma.user.upsert({
      where: { email: 'sarah@example.com' },
      update: {},
      create: {
        email: 'sarah@example.com',
        name: 'Sarah Johnson',
        role: 'member',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      },
    }),
    prisma.user.upsert({
      where: { email: 'mike@example.com' },
      update: {},
      create: {
        email: 'mike@example.com',
        name: 'Mike Chen',
        role: 'member',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      },
    }),
    prisma.user.upsert({
      where: { email: 'emily@example.com' },
      update: {},
      create: {
        email: 'emily@example.com',
        name: 'Emily Davis',
        role: 'member',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
      },
    }),
    prisma.user.upsert({
      where: { email: 'alex@example.com' },
      update: {},
      create: {
        email: 'alex@example.com',
        name: 'Alex Turner',
        role: 'member',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      },
    }),
  ])

  console.log('✓ Created users')

  // Create teams
  const teams = await Promise.all([
    prisma.team.upsert({
      where: { id: 'team-1' },
      update: {},
      create: {
        id: 'team-1',
        name: 'Product Team',
        description: 'Responsible for product development and launches',
      },
    }),
    prisma.team.upsert({
      where: { id: 'team-2' },
      update: {},
      create: {
        id: 'team-2',
        name: 'Engineering',
        description: 'Core engineering and development',
      },
    }),
    prisma.team.upsert({
      where: { id: 'team-3' },
      update: {},
      create: {
        id: 'team-3',
        name: 'Marketing',
        description: 'Marketing campaigns and brand management',
      },
    }),
  ])

  console.log('✓ Created teams')

  // Create workflows
  const workflows = await Promise.all([
    prisma.workflow.create({
      data: {
        name: 'Product Launch Workflow',
        description: 'Complete workflow for launching new products',
        status: 'active',
        priority: 'high',
        teamId: 'team-1',
        createdById: users[0].id,
      },
    }),
    prisma.workflow.create({
      data: {
        name: 'Code Review Process',
        description: 'Standard code review and approval workflow',
        status: 'active',
        priority: 'medium',
        teamId: 'team-2',
        createdById: users[2].id,
      },
    }),
    prisma.workflow.create({
      data: {
        name: 'Marketing Campaign',
        description: 'Q1 marketing campaign execution',
        status: 'draft',
        priority: 'high',
        teamId: 'team-3',
        createdById: users[4].id,
      },
    }),
    prisma.workflow.create({
      data: {
        name: 'Sprint Planning',
        description: 'Weekly sprint planning and task assignment',
        status: 'active',
        priority: 'medium',
        teamId: 'team-2',
        createdById: users[1].id,
      },
    }),
  ])

  console.log('✓ Created workflows')

  // Create tasks
  const tasks = await Promise.all([
    // Product Launch Workflow tasks
    prisma.task.create({
      data: {
        title: 'Design landing page mockups',
        description: 'Create responsive mockups for the new product landing page',
        status: 'in_progress',
        priority: 'high',
        order: 0,
        dueDate: new Date('2025-01-16'),
        workflowId: workflows[0].id,
        createdById: users[0].id,
        assigneeId: users[1].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Create product documentation',
        description: 'Write comprehensive documentation for the new features',
        status: 'todo',
        priority: 'medium',
        order: 1,
        dueDate: new Date('2025-01-18'),
        workflowId: workflows[0].id,
        createdById: users[0].id,
        assigneeId: users[2].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Implement user authentication',
        description: 'Set up OAuth and JWT authentication system',
        status: 'completed',
        priority: 'high',
        order: 2,
        dueDate: new Date('2025-01-14'),
        workflowId: workflows[0].id,
        createdById: users[0].id,
        assigneeId: users[2].id,
        completedAt: new Date('2025-01-14'),
      },
    }),
    prisma.task.create({
      data: {
        title: 'Set up analytics dashboard',
        description: 'Configure analytics tracking and dashboard',
        status: 'todo',
        priority: 'medium',
        order: 3,
        dueDate: new Date('2025-01-20'),
        workflowId: workflows[0].id,
        createdById: users[0].id,
        assigneeId: users[3].id,
      },
    }),

    // Code Review Process tasks
    prisma.task.create({
      data: {
        title: 'Review pull request #234',
        description: 'Review authentication feature implementation',
        status: 'review',
        priority: 'high',
        order: 0,
        dueDate: new Date('2025-01-15'),
        workflowId: workflows[1].id,
        createdById: users[2].id,
        assigneeId: users[3].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Write API documentation',
        description: 'Document all API endpoints and response formats',
        status: 'todo',
        priority: 'medium',
        order: 1,
        dueDate: new Date('2025-01-17'),
        workflowId: workflows[1].id,
        createdById: users[2].id,
        assigneeId: users[2].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Set up CI/CD pipeline',
        description: 'Configure automated testing and deployment',
        status: 'in_progress',
        priority: 'high',
        order: 2,
        dueDate: new Date('2025-01-19'),
        workflowId: workflows[1].id,
        createdById: users[2].id,
        assigneeId: users[0].id,
      },
    }),

    // Marketing Campaign tasks
    prisma.task.create({
      data: {
        title: 'Create social media assets',
        description: 'Design graphics for Instagram, Twitter, LinkedIn',
        status: 'completed',
        priority: 'low',
        order: 0,
        dueDate: new Date('2025-01-14'),
        workflowId: workflows[2].id,
        createdById: users[4].id,
        assigneeId: users[4].id,
        completedAt: new Date('2025-01-14'),
      },
    }),
    prisma.task.create({
      data: {
        title: 'Write blog posts',
        description: 'Create 5 blog posts about the new product',
        status: 'todo',
        priority: 'medium',
        order: 1,
        dueDate: new Date('2025-01-22'),
        workflowId: workflows[2].id,
        createdById: users[4].id,
        assigneeId: users[4].id,
      },
    }),

    // Sprint Planning tasks
    prisma.task.create({
      data: {
        title: 'Define sprint goals',
        description: 'Set clear objectives and deliverables for the upcoming sprint',
        status: 'completed',
        priority: 'high',
        order: 0,
        dueDate: new Date('2025-01-13'),
        workflowId: workflows[3].id,
        createdById: users[1].id,
        assigneeId: users[1].id,
        completedAt: new Date('2025-01-13'),
      },
    }),
    prisma.task.create({
      data: {
        title: 'Assign tasks to team members',
        description: 'Distribute tasks based on team capacity and expertise',
        status: 'in_progress',
        priority: 'high',
        order: 1,
        dueDate: new Date('2025-01-16'),
        workflowId: workflows[3].id,
        createdById: users[1].id,
        assigneeId: users[1].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Schedule daily standups',
        description: 'Set up recurring standup meetings for the sprint',
        status: 'completed',
        priority: 'medium',
        order: 2,
        dueDate: new Date('2025-01-14'),
        workflowId: workflows[3].id,
        createdById: users[1].id,
        assigneeId: users[1].id,
        completedAt: new Date('2025-01-14'),
      },
    }),
  ])

  console.log('✓ Created tasks')

  // Create notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        title: 'Task assigned',
        message: 'You have been assigned to "Design landing page mockups"',
        type: 'task_assigned',
        userId: users[1].id,
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        title: 'Workflow updated',
        message: 'Product Launch Workflow progress updated to 65%',
        type: 'workflow_updated',
        userId: users[0].id,
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        title: 'New comment',
        message: 'Emily commented on "Review pull request #234"',
        type: 'comment_added',
        userId: users[2].id,
        isRead: true,
      },
    }),
    prisma.notification.create({
      data: {
        title: 'Task completed',
        message: 'User authentication implementation has been completed',
        type: 'task_completed',
        userId: users[0].id,
        isRead: true,
      },
    }),
  ])

  console.log('✓ Created notifications')

  console.log('✅ Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
