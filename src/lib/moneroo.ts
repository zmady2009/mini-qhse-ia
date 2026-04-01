const MONEROO_API_URL = process.env.MONEROO_ENV === 'production' 
  ? 'https://api.moneroo.io/v1' 
  : 'https://api.sandbox.moneroo.io/v1'

export interface CreatePaymentParams {
  amount: number
  currency?: string
  description: string
  customerEmail: string
  customerName?: string
  metadata?: Record<string, any>
  callbackUrl?: string
}

export async function createMonerooPayment(params: CreatePaymentParams) {
  try {
    const response = await fetch(`${MONEROO_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MONEROO_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency || 'XOF',
        description: params.description,
        customer: {
          email: params.customerEmail,
          name: params.customerName,
        },
        metadata: params.metadata,
        callback_url: params.callbackUrl,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Payment creation failed')
    }

    return await response.json()
  } catch (error) {
    console.error('Moneroo payment error:', error)
    throw error
  }
}

export async function verifyMonerooPayment(paymentId: string) {
  try {
    const response = await fetch(`${MONEROO_API_URL}/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.MONEROO_SECRET_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to verify payment')
    }

    return await response.json()
  } catch (error) {
    console.error('Moneroo verify error:', error)
    throw error
  }
}

export const PAYMENT_METHODS = {
  SN: [
    { id: 'wave', name: 'Wave', icon: '💳' },
    { id: 'orange_money_sn', name: 'Orange Money', icon: '📱' },
    { id: 'free_money', name: 'Free Money', icon: '💰' },
  ],
  CI: [
    { id: 'wave', name: 'Wave', icon: '💳' },
    { id: 'orange_money_ci', name: 'Orange Money', icon: '📱' },
    { id: 'moov_money', name: 'Moov Money', icon: '💰' },
    { id: 'mtn_money_ci', name: 'MTN Money', icon: '📲' },
  ],
  BF: [
    { id: 'orange_money_bf', name: 'Orange Money', icon: '📱' },
    { id: 'moov_money_bf', name: 'Moov Money', icon: '💰' },
  ],
  ML: [
    { id: 'orange_money_ml', name: 'Orange Money', icon: '📱' },
    { id: 'moov_money_ml', name: 'Moov Money', icon: '💰' },
  ],
  GN: [
    { id: 'orange_money_gn', name: 'Orange Money', icon: '📱' },
  ],
} as const

export type CountryCode = keyof typeof PAYMENT_METHODS
