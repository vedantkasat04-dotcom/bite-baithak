import { Inter_Tight, Instrument_Serif, Caveat } from 'next/font/google'

/** Body / UI. */
export const inter = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

/** Display — hero, headings, product names. */
export const instrument = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

/** Accent — handwritten notes and badges. Used sparingly. */
export const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
})
