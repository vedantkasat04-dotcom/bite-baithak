'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Field, Input, Textarea, Select } from '../components/ui/Field'
import { Button } from '../components/ui/Button'

/** No form backend is connected yet. These handlers acknowledge the
 *  submission without implying it was stored or emailed anywhere — wire
 *  them to a route handler, Formspree, or Supabase table before launch. */
function useStubSubmit(message: string) {
  const [pending, setPending] = useState(false)

  return {
    pending,
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      // Captured now: currentTarget is nulled once the handler returns.
      const form = e.currentTarget
      setPending(true)
      setTimeout(() => {
        setPending(false)
        form.reset()
        toast.success(message)
      }, 500)
    },
  }
}

export function CorporateForm() {
  const { pending, onSubmit } = useStubSubmit(
    'Enquiry received — we’ll reply within one working day.'
  )

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <Field label="Your name" htmlFor="corp-name">
        <Input id="corp-name" name="name" required autoComplete="name" />
      </Field>

      <Field label="Company" htmlFor="corp-company">
        <Input id="corp-company" name="company" required autoComplete="organization" />
      </Field>

      <Field label="Work email" htmlFor="corp-email">
        <Input id="corp-email" name="email" type="email" required autoComplete="email" />
      </Field>

      <Field label="Phone" htmlFor="corp-phone">
        <Input id="corp-phone" name="phone" type="tel" required autoComplete="tel" />
      </Field>

      <Field label="Occasion" htmlFor="corp-occasion">
        <Select id="corp-occasion" name="occasion" defaultValue="diwali">
          <option value="diwali">Diwali / festive</option>
          <option value="client">Client gifting</option>
          <option value="onboarding">Employee onboarding</option>
          <option value="event">Event or conference</option>
          <option value="other">Something else</option>
        </Select>
      </Field>

      <Field label="Quantity" htmlFor="corp-qty" hint="Minimum 25 boxes.">
        <Input
          id="corp-qty"
          name="quantity"
          type="number"
          min={25}
          defaultValue={25}
          required
        />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Anything we should know" htmlFor="corp-notes">
          <Textarea
            id="corp-notes"
            name="notes"
            rows={4}
            placeholder="Delivery city, target date, branding requirements…"
          />
        </Field>
      </div>

      <label className="flex items-start gap-3 text-sm text-ink-soft sm:col-span-2">
        <input
          type="checkbox"
          name="branding"
          className="mt-0.5 h-4 w-4 shrink-0 accent-claret"
        />
        I’d like custom-branded sleeves or a printed insert.
      </label>

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? 'Sending…' : 'Request a quote'}
        </Button>
      </div>
    </form>
  )
}

export function ContactForm() {
  const { pending, onSubmit } = useStubSubmit('Thanks — message received.')

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <Field label="Your name" htmlFor="c-name">
        <Input id="c-name" name="name" required autoComplete="name" />
      </Field>

      <Field label="Email" htmlFor="c-email">
        <Input id="c-email" name="email" type="email" required autoComplete="email" />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Message" htmlFor="c-message">
          <Textarea id="c-message" name="message" rows={5} required />
        </Field>
      </div>

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? 'Sending…' : 'Send message'}
        </Button>
      </div>
    </form>
  )
}
