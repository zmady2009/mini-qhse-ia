import { createMonerooPayment } from "@/lib/moneroo"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

const PRICES = {
  pro: 15000,
  business: 45000
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { planTier, paymentMethod } = await req.json()
    
    if (!PRICES[planTier as keyof typeof PRICES]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const org = await prisma.organization.findUnique({
      where: { id: session.user.organizationId }
    })

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    const amount = PRICES[planTier as keyof typeof PRICES]

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        organizationId: session.user.organizationId!,
        amount,
        currency: 'XOF',
        paymentMethod,
        planTier,
        status: 'pending'
      }
    })

    // Create Moneroo payment
    const monerooPayment = await createMonerooPayment({
      amount,
      description: `Abonnement ${planTier.toUpperCase()} - Mini QHSE IA`,
      customerEmail: session.user.email!,
      customerName: session.user.name || undefined,
      metadata: {
        paymentId: payment.id,
        organizationId: session.user.organizationId!,
        planTier
      },
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`
    })

    // Update payment with Moneroo reference
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        monerooTransactionId: monerooPayment.id,
        monerooReference: monerooPayment.reference
      }
    })

    return NextResponse.json({
      paymentUrl: monerooPayment.payment_url,
      reference: monerooPayment.reference
    })
  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    )
  }
}
