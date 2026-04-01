import { chatWithClaude } from "@/lib/claude"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check AI credits
    const org = await prisma.organization.findUnique({
      where: { id: session.user.organizationId }
    })

    if (!org || org.aiCreditsRemaining <= 0) {
      return NextResponse.json(
        { error: "No AI credits remaining. Please upgrade your plan." },
        { status: 403 }
      )
    }

    const { message } = await req.json()

    // Get organization context
    const context = {
      sector: org.sector,
      organizationName: org.name,
    }

    const result = await chatWithClaude(message, context)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Decrement credits
    await prisma.organization.update({
      where: { id: session.user.organizationId },
      data: { aiCreditsRemaining: { decrement: 1 } }
    })

    // Save conversation
    await prisma.aiConversation.create({
      data: {
        organizationId: session.user.organizationId!,
        userId: session.user.id!,
        messages: JSON.stringify([
          { role: 'user', content: message, timestamp: new Date() },
          { role: 'assistant', content: result.response, timestamp: new Date() }
        ]),
        tokensUsed: 1
      }
    })

    return NextResponse.json({
      response: result.response,
      creditsRemaining: org.aiCreditsRemaining - 1
    })
  } catch (error) {
    console.error("AI chat error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
