import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image_url: string | null
  category: string
  in_stock: boolean
}