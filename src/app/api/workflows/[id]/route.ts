import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workflow = await db.workflow.findUnique({
      where: { id: params.id },
      include: {
        tasks: {
          orderBy: {
            order: 'asc',
          },
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        team: true,
      },
    })

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(workflow)
  } catch (error) {
    console.error('Error fetching workflow:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflow' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, status, priority, tasks } = body

    // Update workflow basic info
    const workflow = await db.workflow.update({
      where: { id: params.id },
      data: {
        name,
        description,
        status,
        priority,
      },
      include: {
        tasks: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    // Update tasks if provided
    if (tasks && Array.isArray(tasks)) {
      // Delete existing tasks
      await db.task.deleteMany({
        where: { workflowId: params.id },
      })

      // Create new tasks
      if (tasks.length > 0) {
        await db.task.createMany({
          data: tasks.map((task: any) => ({
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            order: task.order,
            dueDate: task.dueDate ? new Date(task.dueDate) : null,
            workflowId: params.id,
            createdById: workflow.createdById,
            assigneeId: task.assigneeId || null,
          })),
        })
      }

      // Return updated workflow with tasks
      const updatedWorkflow = await db.workflow.findUnique({
        where: { id: params.id },
        include: {
          tasks: {
            orderBy: {
              order: 'asc',
            },
            include: {
              assignee: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
        },
      })

      return NextResponse.json(updatedWorkflow)
    }

    return NextResponse.json(workflow)
  } catch (error) {
    console.error('Error updating workflow:', error)
    return NextResponse.json(
      { error: 'Failed to update workflow' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.workflow.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Workflow deleted successfully' })
  } catch (error) {
    console.error('Error deleting workflow:', error)
    return NextResponse.json(
      { error: 'Failed to delete workflow' },
      { status: 500 }
    )
  }
}
