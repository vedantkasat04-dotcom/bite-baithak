import { ButtonLink } from './components/ui/Button'

export default function NotFound() {
  return (
    <div className="container-bb flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      {/* A cookie with a bite taken out — the bite is a mask, so it stays
          crisp at any size and needs no asset. */}
      <svg
        width="132"
        height="132"
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden
        className="mb-10"
      >
        <defs>
          <mask id="bite">
            <rect width="120" height="120" fill="white" />
            <circle cx="97" cy="26" r="21" fill="black" />
          </mask>
        </defs>

        <circle
          cx="58"
          cy="60"
          r="46"
          fill="#C49030"
          mask="url(#bite)"
        />
        <circle cx="44" cy="48" r="6" fill="#3B2117" />
        <circle cx="70" cy="70" r="5" fill="#3B2117" />
        <circle cx="48" cy="78" r="4.5" fill="#3B2117" />
        <circle cx="76" cy="45" r="3.5" fill="#3B2117" />
        <circle cx="33" cy="64" r="3.5" fill="#3B2117" />
        <circle cx="60" cy="58" r="4" fill="#3B2117" />
      </svg>

      <p className="accent text-2xl text-claret">Error 404</p>

      <h1 className="serif mt-3 max-w-[20ch] text-4xl leading-[1.02] text-ink md:text-7xl">
        This baithak doesn’t exist.
      </h1>

      <p className="mt-6 max-w-[42ch] text-base leading-relaxed text-ink-soft">
        The page you were looking for has moved, or was never here. The cookies,
        however, are exactly where you left them.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" size="lg">
          Back home
        </ButtonLink>
        <ButtonLink href="/shop" size="lg" variant="outline">
          Shop the collection
        </ButtonLink>
      </div>
    </div>
  )
}
