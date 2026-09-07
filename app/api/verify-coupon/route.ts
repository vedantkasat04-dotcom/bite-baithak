import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  const { code } = await req.json()
  const { data } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code)
    .eq('used', false)
    .single()

  if (!data) return NextResponse.json({ valid: false, error: 'Invalid or already used coupon' })
  return NextResponse.json({ valid: true, discount_pct: data.discount_pct, min_order: data.min_order })
}
