import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create users with Indian names
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: '4mt22ai002@mite.ac.in' },
      update: {},
      create: {
        email: '4mt22ai002@mite.ac.in',
        name: 'Abhiram T A',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=abhiram',
      },
    }),
    prisma.user.upsert({
      where: { email: 'priya.sharma@example.com' },
      update: {},
      create: {
        email: 'priya.sharma@example.com',
        name: 'Priya Sharma',
        role: 'member',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
      },
    }),
    prisma.user.upsert({
      where: { email: 'rahul.verma@example.com' },
      update: {},
      create: {
        email: 'rahul.verma@example.com',
        name: 'Rahul Verma',
        role: 'member',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
      },
    }),
    prisma.user.upsert({
      where: { email: 'ananya.patel@example.com' },
      update: {},
      create: {
        email: 'ananya.patel@example.com',
        name: 'Ananya Patel',
        role: 'member',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ananya',
      },
    }),
    prisma.user.upsert({
      where: { email: 'arjun.reddy@example.com' },
      update: {},
      create: {
        email: 'arjun.reddy@example.com',
        name: 'Arjun Reddy',
        role: 'member',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun',
      },
    }),
    prisma.user.upsert({
      where: { email: 'kavya.nair@example.com' },
      update: {},
      create: {
        email: 'kavya.nair@example.com',
        name: 'Kavya Nair',
        role: 'member',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kavya',
      },
    }),
    prisma.user.upsert({
      where: { email: 'vikram.singh@example.com' },
      update: {},
      create: {
        email: 'vikram.singh@example.com',
        name: 'Vikram Singh',
        role: 'member',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram',
      },
    }),
    prisma.user.upsert({
      where: { email: 'meena.kumar@example.com' },
      update: {},
      create: {
        email: 'meena.kumar@example.com',
        name: 'Meena Kumar',
        role: 'member',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meena',
      },
    }),
  ])

  console.log('✓ Created users')

  // Create teams with Indian team names
  const teams = await Promise.all([
    prisma.team.upsert({
      where: { id: 'team-1' },
      update: {},
      create: {
        id: 'team-1',
        name: 'Product Development',
        description: 'Software development and product engineering team',
      },
    }),
    prisma.team.upsert({
      where: { id: 'team-2' },
      update: {},
      create: {
        id: 'team-2',
        name: 'Engineering',
        description: 'Core engineering and technical infrastructure',
      },
    }),
    prisma.team.upsert({
      where: { id: 'team-3' },
      update: {},
      create: {
        id: 'team-3',
        name: 'Digital Marketing',
        description: 'Digital campaigns and brand management',
      },
    }),
    prisma.team.upsert({
      where: { id: 'team-4' },
      update: {},
      create: {
        id: 'team-4',
        name: 'Quality Assurance',
        description: 'Testing and quality control team',
      },
    }),
  ])

  console.log('✓ Created teams')

  // Create workflows
  const workflows = await Promise.all([
    prisma.workflow.create({
      data: {
        name: 'Product Development Workflow',
        description: 'Complete workflow for software product development lifecycle',
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
        name: 'Digital Campaign',
        description: 'Digital marketing campaign execution and tracking',
        status: 'draft',
        priority: 'high',
        teamId: 'team-3',
        createdById: users[4].id,
      },
    }),
    prisma.workflow.create({
      data: {
        name: 'Sprint Planning',
        description: 'Agile sprint planning and task allocation',
        status: 'active',
        priority: 'medium',
        teamId: 'team-2',
        createdById: users[1].id,
      },
    }),
    prisma.workflow.create({
      data: {
        name: 'Testing Workflow',
        description: 'Software testing and quality assurance process',
        status: 'active',
        priority: 'high',
        teamId: 'team-4',
        createdById: users[6].id,
      },
    }),
  ])

  console.log('✓ Created workflows')

  // Create tasks
  const tasks = await Promise.all([
    // Product Development Workflow tasks
    prisma.task.create({
      data: {
        title: 'Design system architecture',
        description: 'Create scalable architecture for the new software system',
        status: 'in_progress',
        priority: 'high',
        order: 0,
        dueDate: new Date('2025-01-20'),
        workflowId: workflows[0].id,
        createdById: users[0].id,
        assigneeId: users[1].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Create API documentation',
        description: 'Write comprehensive documentation for all API endpoints',
        status: 'todo',
        priority: 'medium',
        order: 1,
        dueDate: new Date('2025-01-22'),
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
        dueDate: new Date('2025-01-16'),
        workflowId: workflows[0].id,
        createdById: users[0].id,
        assigneeId: users[2].id,
        completedAt: new Date('2025-01-16'),
      },
    }),
    prisma.task.create({
      data: {
        title: 'Configure database',
        description: 'Set up and optimize database for performance',
        status: 'todo',
        priority: 'high',
        order: 3,
        dueDate: new Date('2025-01-24'),
        workflowId: workflows[0].id,
        createdById: users[0].id,
        assigneeId: users[3].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Build user dashboard',
        description: 'Develop responsive user dashboard interface',
        status: 'in_progress',
        priority: 'medium',
        order: 4,
        dueDate: new Date('2025-01-25'),
        workflowId: workflows[0].id,
        createdById: users[0].id,
        assigneeId: users[5].id,
      },
    }),

    // Code Review Process tasks
    prisma.task.create({
      data: {
        title: 'Review authentication module',
        description: 'Review and approve the authentication feature implementation',
        status: 'review',
        priority: 'high',
        order: 0,
        dueDate: new Date('2025-01-18'),
        workflowId: workflows[1].id,
        createdById: users[2].id,
        assigneeId: users[3].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Review API endpoints',
        description: 'Review RESTful API implementation and documentation',
        status: 'todo',
        priority: 'medium',
        order: 1,
        dueDate: new Date('2025-01-20'),
        workflowId: workflows[1].id,
        createdById: users[2].id,
        assigneeId: users[2].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Set up CI/CD pipeline',
        description: 'Configure automated testing and deployment pipeline',
        status: 'in_progress',
        priority: 'high',
        order: 2,
        dueDate: new Date('2025-01-22'),
        workflowId: workflows[1].id,
        createdById: users[2].id,
        assigneeId: users[0].id,
      },
    }),

    // Digital Campaign tasks
    prisma.task.create({
      data: {
        title: 'Create social media graphics',
        description: 'Design promotional graphics for social media platforms',
        status: 'completed',
        priority: 'medium',
        order: 0,
        dueDate: new Date('2025-01-16'),
        workflowId: workflows[2].id,
        createdById: users[4].id,
        assigneeId: users[4].id,
        completedAt: new Date('2025-01-16'),
      },
    }),
    prisma.task.create({
      data: {
        title: 'Write blog content',
        description: 'Create engaging blog posts about the product launch',
        status: 'todo',
        priority: 'high',
        order: 1,
        dueDate: new Date('2025-01-26'),
        workflowId: workflows[2].id,
        createdById: users[4].id,
        assigneeId: users[5].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Launch email campaign',
        description: 'Execute email marketing campaign to target audience',
        status: 'todo',
        priority: 'high',
        order: 2,
        dueDate: new Date('2025-01-28'),
        workflowId: workflows[2].id,
        createdById: users[4].id,
        assigneeId: users[4].id,
      },
    }),

    // Sprint Planning tasks
    prisma.task.create({
      data: {
        title: 'Define sprint objectives',
        description: 'Set clear goals and deliverables for the sprint',
        status: 'completed',
        priority: 'high',
        order: 0,
        dueDate: new Date('2025-01-15'),
        workflowId: workflows[3].id,
        createdById: users[1].id,
        assigneeId: users[1].id,
        completedAt: new Date('2025-01-15'),
      },
    }),
    prisma.task.create({
      data: {
        title: 'Assign sprint tasks',
        description: 'Distribute tasks among team members',
        status: 'in_progress',
        priority: 'high',
        order: 1,
        dueDate: new Date('2025-01-18'),
        workflowId: workflows[3].id,
        createdById: users[1].id,
        assigneeId: users[1].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Conduct sprint review',
        description: 'Review completed work and gather feedback',
        status: 'completed',
        priority: 'medium',
        order: 2,
        dueDate: new Date('2025-01-17'),
        workflowId: workflows[3].id,
        createdById: users[1].id,
        assigneeId: users[6].id,
        completedAt: new Date('2025-01-17'),
      },
    }),

    // Testing Workflow tasks
    prisma.task.create({
      data: {
        title: 'Create test cases',
        description: 'Develop comprehensive test cases for all features',
        status: 'in_progress',
        priority: 'high',
        order: 0,
        dueDate: new Date('2025-01-19'),
        workflowId: workflows[4].id,
        createdById: users[6].id,
        assigneeId: users[7].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Perform unit testing',
        description: 'Execute unit tests for individual components',
        status: 'todo',
        priority: 'high',
        order: 1,
        dueDate: new Date('2025-01-21'),
        workflowId: workflows[4].id,
        createdById: users[6].id,
        assigneeId: users[7].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Integration testing',
        description: 'Test integration between different modules',
        status: 'todo',
        priority: 'high',
        order: 2,
        dueDate: new Date('2025-01-23'),
        workflowId: workflows[4].id,
        createdById: users[6].id,
        assigneeId: users[6].id,
      },
    }),
  ])

  console.log('✓ Created tasks')

  // Create notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        title: 'Task assigned',
        message: 'You have been assigned to "Design system architecture"',
        type: 'task_assigned',
        userId: users[1].id,
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        title: 'Workflow updated',
        message: 'Product Development Workflow progress updated to 60%',
        type: 'workflow_updated',
        userId: users[0].id,
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        title: 'New comment',
        message: 'Ananya commented on "Review authentication module"',
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
    prisma.notification.create({
      data: {
        title: 'New task assigned',
        message: 'You have been assigned to "Create test cases"',
        type: 'task_assigned',
        userId: users[7].id,
        isRead: false,
      },
    }),
  ])

  console.log('✓ Created notifications')

  console.log('✅ Database seed completed successfully!')
  console.log('👤 Admin user: Abhiram T A (4mt22ai002@mite.ac.in)')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
