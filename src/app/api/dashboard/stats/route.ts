import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { calculateQhseScore } from "@/lib/utils"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orgId = session.user.organizationId

    // Get all actions for the organization
    const actions = await prisma.action.findMany({
      where: { organizationId: orgId },
      include: { assignedTo: { select: { id: true, name: true } } },
      orderBy: { dueDate: "asc" },
    })

    // Get alerts
    const alerts = await prisma.alert.findMany({
      where: { organizationId: orgId }
    })

    // Calculate stats
    const totalActions = actions.length
    const completedActions = actions.filter(a => a.status === 'completed').length
    const overdueActions = actions.filter(a => {
      return a.status !== 'completed' && new Date(a.dueDate) < new Date()
    }).length

    const qhseScore = calculateQhseScore(actions.map(a => ({
      status: a.status,
      dueDate: new Date(a.dueDate),
      completedAt: a.completedAt ? new Date(a.completedAt) : null
    })))

    const totalAlerts = alerts.length
    const pendingAlerts = alerts.filter(a => a.status === 'new' || a.status === 'in_progress').length

    // Recent actions (last 5)
    const recentActions = actions.slice(0, 5)

    return NextResponse.json({
      qhseScore,
      totalActions,
      completedActions,
      overdueActions,
      totalAlerts,
      pendingAlerts,
      recentActions
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
