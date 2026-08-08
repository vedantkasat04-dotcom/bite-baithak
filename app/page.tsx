import { supabase } from './lib/supabase'
import Navbar from './components/Navbar'
import BoxScene from './components/BoxScene'

export default async function Home() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)

  return (
    <>
      <Navbar />
      <BoxScene />
      <main className="bg-[#1a0f0a] relative z-10">
        <div id="products" className="max-w-5xl mx-auto px-6 py-24">
          <p className="text-[#d4af6a] tracking-[0.4em] text-xs mb-3 text-center">OUR PRODUCTS</p>
          <h2 className="text-[#f5e6d3] font-serif text-3xl font-light text-center mb-16">The Baithak Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products?.map((p) => (
              <div key={p.id} className="group border border-[#d4af6a]/20 p-6 rounded-sm hover:border-[#d4af6a]/60 transition-all duration-300 hover:-translate-y-1">
                <div className="w-full h-44 bg-[#2a1508] rounded-sm mb-5 flex items-center justify-center overflow-hidden">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover"/>
                  ) : (
                    <span className="text-[#d4af6a] opacity-30 text-xs tracking-widest">PHOTO SOON</span>
                  )}
                </div>
                <p className="text-[#d4af6a] text-xs tracking-[0.3em] mb-2">{p.category.toUpperCase()}</p>
                <h3 className="text-[#f5e6d3] font-serif text-xl mb-2">{p.name}</h3>
                <p className="text-[#f5e6d3] opacity-50 text-xs mb-5 leading-relaxed">{p.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[#d4af6a] font-light text-lg">Rs.{p.price}</p>
                  <button className="text-xs tracking-[0.2em] border border-[#d4af6a]/40 text-[#d4af6a] px-4 py-2 hover:bg-[#d4af6a] hover:text-[#1a0f0a] transition-all duration-300">ADD TO CART</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-[#d4af6a]/10 py-8 text-center">
          <p className="text-[#d4af6a] font-serif italic text-sm opacity-60">Every bite deserves a baithak.</p>
        </div>
      </main>
    </>
  )
}
