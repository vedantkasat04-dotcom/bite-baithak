'use client'

import { useEffect } from 'react'
import { Button, ButtonLink } from './components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container-bb flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="accent text-2xl text-claret">Something broke</p>

      <h1 className="serif mt-3 max-w-[22ch] text-4xl leading-[1.02] text-ink md:text-6xl">
        That didn’t come out of the oven right.
      </h1>

      <p className="mt-6 max-w-[42ch] text-base leading-relaxed text-ink-soft">
        An unexpected error stopped this page from loading. Try again — and if
        it keeps happening, let us know.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button onClick={reset} size="lg">
          Try again
        </Button>
        <ButtonLink href="/" size="lg" variant="outline">
          Back home
        </ButtonLink>
      </div>
    </div>
  )
}
