import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { organization: true },
    })

    if (!user?.organizationId) {
      return NextResponse.json({ error: "Organisation non trouvée" }, { status: 404 })
    }

    const alerts = await prisma.alert.findMany({
      where: { organizationId: user.organizationId },
      include: {
        assignedTo: {
          select: { name: true, email: true },
        },
        qrCode: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(alerts)
  } catch (error) {
    console.error("Erreur lors de la récupération des alertes:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
