import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = body

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest('hex')

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Save order to Supabase
    const { data: order } = await supabase
      .from('orders')
      .insert({
        ...orderData,
        razorpay_order_id,
        razorpay_payment_id,
        status: 'paid',
      })
      .select()
      .single()

    // Mark coupon as used if applicable
    if (orderData.coupon_code) {
      await supabase
        .from('coupons')
        .update({ used: true, used_at: new Date().toISOString() })
        .eq('code', orderData.coupon_code)
    }

    // Send confirmation email
    await resend.emails.send({
      from: 'Bite Baithak <onboarding@resend.dev>',
      to: orderData.email,
      subject: `Order confirmed — ${razorpay_order_id}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FBF5EA; padding: 40px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; color: #1B0F08; margin: 0;">Bite <em>Baithak</em></h1>
            <p style="color: #6B3A1E; font-size: 12px; letter-spacing: 0.3em; margin-top: 4px;">SMALL BATCH · BAKED FRESH</p>
          </div>

          <div style="background: white; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
            <h2 style="color: #1B0F08; font-size: 22px; margin-top: 0;">Your order is confirmed! 🎉</h2>
            <p style="color: #6B3A1E;">Hi ${orderData.name}, thank you for your order. We're baking your cookies fresh and will dispatch within 48 hours.</p>

            <div style="border-top: 1px solid #EDD9B0; margin: 24px 0;"></div>

            <h3 style="color: #1B0F08; font-size: 16px;">Order Summary</h3>
            ${orderData.items.map((item: { name: string; quantity: number; price: number }) => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #1B0F08;">
                <span>${item.name} × ${item.quantity}</span>
                <span>₹${item.price * item.quantity}</span>
              </div>
            `).join('')}

            <div style="border-top: 1px solid #EDD9B0; margin: 16px 0;"></div>

            ${orderData.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; color: #2D5F4E; padding: 4px 0;">
                <span>Discount (${orderData.coupon_code})</span>
                <span>−₹${orderData.discount}</span>
              </div>
            ` : ''}

            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #1B0F08; padding: 8px 0;">
              <span>Total</span>
              <span>₹${orderData.total}</span>
            </div>
          </div>

          <div style="background: white; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
            <h3 style="color: #1B0F08; font-size: 16px; margin-top: 0;">Delivery Address</h3>
            <p style="color: #6B3A1E; margin: 0;">
              ${orderData.name}<br>
              ${orderData.address}<br>
              ${orderData.city}, ${orderData.state} — ${orderData.pincode}<br>
              📞 ${orderData.phone}
            </p>
          </div>

          <div style="text-align: center; color: #6B3A1E; font-size: 12px;">
            <p>Questions? WhatsApp us or reply to this email.</p>
            <p style="margin-top: 16px; color: #C49030; font-style: italic;">"Every bite deserves a baithak."</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true, order })
  } catch (err) {
    console.error('Verify payment error:', err)
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 })
  }
}
