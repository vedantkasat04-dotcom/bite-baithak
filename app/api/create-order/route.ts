import Razorpay from 'razorpay'
import { NextResponse } from 'next/server'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
  try {
    const { amount, currency = 'INR', receipt } = await req.json()
    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency,
      receipt,
      payment_capture: true,
    })
    return NextResponse.json(order)
  } catch (err) {
    console.error('Razorpay order error:', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
