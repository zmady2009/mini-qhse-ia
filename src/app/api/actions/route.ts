import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { suggestPriorityAndDueDate } from "@/lib/claude"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const actions = await prisma.action.findMany({
      where: { organizationId: session.user.organizationId },
      include: { assignedTo: { select: { id: true, name: true } } },
      orderBy: { dueDate: "asc" },
    })

    return NextResponse.json(actions)
  } catch (error) {
    console.error("GET actions error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, domain, priority, dueDate, assignedToId } = body

    // Check subscription limits for free tier
    if (session.user.subscriptionTier === 'free') {
      const actionCount = await prisma.action.count({
        where: { organizationId: session.user.organizationId }
      })
      if (actionCount >= 5) {
        return NextResponse.json(
          { error: "Limit reached. Upgrade to Pro for unlimited actions." },
          { status: 403 }
        )
      }
    }

    const action = await prisma.action.create({
      data: {
        title,
        description,
        domain,
        priority,
        dueDate: new Date(dueDate),
        assignedToId,
        organizationId: session.user.organizationId!,
        createdById: session.user.id!,
      },
      include: { assignedTo: { select: { id: true, name: true } } },
    })

    return NextResponse.json(action)
  } catch (error) {
    console.error("POST action error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { id, status, completedAt } = body

    const action = await prisma.action.update({
      where: { 
        id,
        organizationId: session.user.organizationId 
      },
      data: { 
        status,
        completedAt: completedAt ? new Date(completedAt) : null 
      },
    })

    return NextResponse.json(action)
  } catch (error) {
    console.error("PATCH action error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
