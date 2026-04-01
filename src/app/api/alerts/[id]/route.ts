import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const alert = await prisma.alert.findUnique({
      where: { id: params.id },
      include: {
        assignedTo: {
          select: { name: true, email: true },
        },
        qrCode: {
          select: { name: true, location: true },
        },
      },
    })

    if (!alert) {
      return NextResponse.json({ error: "Alerte non trouvée" }, { status: 404 })
    }

    return NextResponse.json(alert)
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
