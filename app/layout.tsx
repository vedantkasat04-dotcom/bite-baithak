import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { inter, instrument, caveat } from './lib/fonts'
import Nav from './components/Nav'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Loader from './components/Loader'
import CookieCursor from './components/CookieCursor'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://bitebaithak.com'),
  title: {
    default: 'Bite Baithak — Every Bite Deserves a Baithak',
    template: '%s · Bite Baithak',
  },
  description:
    'Small-batch cookies and savouries in pure desi ghee. Twenty flavours, baked in Bangalore, shipped across India.',
  openGraph: {
    title: 'Bite Baithak — Every Bite Deserves a Baithak',
    description:
      'Small-batch cookies and savouries in pure desi ghee. Twenty flavours, baked in Bangalore.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrument.variable} ${caveat.variable}`}
    >
      <body className="antialiased bg-paper text-ink">
        <Loader />
        <CookieCursor />
        <Nav />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--color-milk)',
              border: '1px solid rgba(27, 15, 8, 0.10)',
              color: 'var(--color-ink)',
              boxShadow: 'var(--shadow-card)',
              borderRadius: '14px',
            },
          }}
        />
      </body>
    </html>
  )
}
