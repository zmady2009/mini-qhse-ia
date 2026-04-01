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

    const action = await prisma.action.findUnique({
      where: { id: params.id },
      include: {
        assignedTo: {
          select: { name: true, email: true },
        },
        createdBy: {
          select: { name: true, email: true },
        },
      },
    })

    if (!action) {
      return NextResponse.json({ error: "Action non trouvée" }, { status: 404 })
    }

    return NextResponse.json(action)
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, domain, priority, status, dueDate } = body

    const action = await prisma.action.update({
      where: { id: params.id },
      data: {
        title,
        description,
        domain,
        priority,
        status,
        dueDate: new Date(dueDate),
        completedAt: status === "completed" ? new Date() : null,
      },
    })

    return NextResponse.json(action)
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    await prisma.action.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
