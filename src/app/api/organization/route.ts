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

    if (!user?.organization) {
      return NextResponse.json({ error: "Organisation non trouvée" }, { status: 404 })
    }

    return NextResponse.json(user.organization)
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user?.organizationId) {
      return NextResponse.json({ error: "Organisation non trouvée" }, { status: 404 })
    }

    const body = await req.json()
    const { name, sector, country } = body

    const organization = await prisma.organization.update({
      where: { id: user.organizationId },
      data: { name, sector, country },
    })

    return NextResponse.json(organization)
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
