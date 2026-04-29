import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const workflows = await db.workflow.findMany({
      include: {
        tasks: {
          orderBy: {
            order: 'asc',
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        team: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(workflows)
  } catch (error) {
    console.error('Error fetching workflows:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, status, priority, teamId, createdById, tasks } = body

    const workflow = await db.workflow.create({
      data: {
        name,
        description,
        status: status || 'draft',
        priority: priority || 'medium',
        teamId,
        createdById,
        tasks: tasks
          ? {
              create: tasks.map((task: any, index: number) => ({
                title: task.title,
                description: task.description,
                status: task.status || 'todo',
                priority: task.priority || 'medium',
                order: task.order || index,
                createdById: createdById,
              })),
            }
          : undefined,
      },
      include: {
        tasks: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(workflow, { status: 201 })
  } catch (error) {
    console.error('Error creating workflow:', error)
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    )
  }
}
