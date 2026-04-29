import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assigneeId = searchParams.get('assigneeId')
    const workflowId = searchParams.get('workflowId')
    const status = searchParams.get('status')

    const where: any = {}

    if (assigneeId) {
      where.assigneeId = assigneeId
    }

    if (workflowId) {
      where.workflowId = workflowId
    }

    if (status) {
      where.status = status
    }

    const tasks = await db.task.findMany({
      where,
      include: {
        workflow: {
          select: {
            id: true,
            name: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        {
          order: 'asc',
        },
        {
          createdAt: 'desc',
        },
      ],
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, status, priority, order, dueDate, workflowId, createdById, assigneeId } = body

    const task = await db.task.create({
      data: {
        title,
        description,
        status: status || 'todo',
        priority: priority || 'medium',
        order: order || 0,
        dueDate: dueDate ? new Date(dueDate) : null,
        workflowId,
        createdById,
        assigneeId,
      },
      include: {
        workflow: {
          select: {
            id: true,
            name: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
