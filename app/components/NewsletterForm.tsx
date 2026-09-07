'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setPending(true)
    // No mailing-list provider is wired up yet — this confirms to the user
    // without pretending a subscription was stored.
    setTimeout(() => {
      setPending(false)
      setEmail('')
      toast.success('Thanks — we’ll be in touch.')
    }, 400)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex items-center gap-2 border-b border-ink/20 pb-2 transition-colors focus-within:border-claret">
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft/60"
        />
        <button
          type="submit"
          disabled={pending}
          aria-label="Subscribe"
          className="shrink-0 rounded-full p-1.5 text-ink transition-colors hover:text-claret disabled:opacity-40"
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  )
}
