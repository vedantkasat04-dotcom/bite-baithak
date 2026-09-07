import SectionHeading from './SectionHeading'
import InstagramGlyph from '../ui/InstagramGlyph'

/* Placeholder tiles until the Instagram feed is wired to real posts.
   Colours are drawn from the product palette so the grid reads as
   deliberate rather than as six empty boxes. */
const TILES = [
  '#5C2E0A',
  '#C49030',
  '#C2456B',
  '#7BA05B',
  '#8B4A2B',
  '#E8873A',
]

export default function InstagramGrid() {
  return (
    <section className="section-bb">
      <div className="container-bb">
        <SectionHeading
          eyebrow="@bitebaithak"
          title="From the counter"
          link={{ href: 'https://instagram.com', label: 'Follow along' }}
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {TILES.map((color, i) => (
            <a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram post ${i + 1}`}
              className="group relative aspect-square overflow-hidden rounded-xl"
              style={{
                background: `radial-gradient(120% 100% at 30% 25%, ${color}dd, ${color})`,
              }}
            >
              <span className="absolute inset-0 grid place-items-center bg-cocoa/0 text-milk opacity-0 transition-all duration-500 group-hover:bg-cocoa/35 group-hover:opacity-100">
                <InstagramGlyph size={20} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
