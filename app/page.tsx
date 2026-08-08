import { supabase } from './lib/supabase'

export default async function Home() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)

  return (
    <main className="min-h-screen bg-[#1a0f0a]">
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-[#d4af6a] tracking-[0.4em] text-xs mb-4">— COMING SOON —</p>
        <h1 className="text-[#f5e6d3] font-serif text-5xl font-light tracking-tight">
          Bite Baithak
        </h1>
        <p className="text-[#f5e6d3] opacity-40 text-sm mt-4 italic mb-16">
          Every bite deserves a baithak.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        <p className="text-[#d4af6a] tracking-[0.3em] text-xs mb-8 text-center">— OUR PRODUCTS —</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products?.map((p) => (
            <div key={p.id} className="border border-[#d4af6a]/20 p-6 rounded-sm hover:border-[#d4af6a]/60 transition-colors">
              <div className="w-full h-40 bg-[#2a1508] rounded-sm mb-4 flex items-center justify-center">
                <span className="text-[#d4af6a] opacity-30 text-xs tracking-widest">PHOTO SOON</span>
              </div>
              <p className="text-[#d4af6a] text-xs tracking-[0.3em] mb-2">{p.category.toUpperCase()}</p>
              <h2 className="text-[#f5e6d3] font-serif text-xl mb-2">{p.name}</h2>
              <p className="text-[#f5e6d3] opacity-50 text-xs mb-4 leading-relaxed">{p.description}</p>
              <p className="text-[#d4af6a] font-light text-lg">₹{p.price}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}