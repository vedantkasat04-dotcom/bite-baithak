'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from 'framer-motion'
import { RefreshCw, RotateCw, ShoppingBasket, Trophy } from 'lucide-react'

type Flavour = { name: string; slug: string }

const FLAVOURS: Flavour[] = [
  { name: 'Jam Roll', slug: 'jam-roll' },
  { name: 'Nankhatai', slug: 'nankhatai' },
  { name: 'Tooty Fruity', slug: 'tooty-fruity' },
  { name: 'Mix Dry Fruits', slug: 'mix-dry-fruits' },
  { name: 'Double Chocolate', slug: 'double-chocolate' },
  { name: 'Cashew', slug: 'cashew' },
]

const PAIRS = FLAVOURS.length
const COLUMNS = 4
const BEST_SCORE_KEY = 'bb_memory_best'

/** Beat between the jade match flash and the cards leaving for the basket. */
const MATCH_HOLD = 400
const FLIGHT = 700
const UNFLIP_DELAY = 800

type Card = { id: string; slug: string; name: string }

type Flight = {
  id: string
  slug: string
  name: string
  from: { x: number; y: number }
  to: { x: number; y: number }
  size: number
}

/** Two of each flavour in a fixed order. The first render — server and
 *  client — uses this order and the shuffle lands on mount; randomising
 *  during render would build a different tree on each side and trip a
 *  hydration mismatch. */
function buildDeck(): Card[] {
  return FLAVOURS.flatMap(({ name, slug }) => [
    { id: `${slug}-a`, slug, name },
    { id: `${slug}-b`, slug, name },
  ])
}

/** Fisher-Yates, on a copy — the caller's array is never mutated. */
function shuffle(deck: Card[]): Card[] {
  const cards = [...deck]
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return cards
}

/** Where a card sits before it is dealt. Derived from its grid position so
 *  all twelve converge on one point off the top-right of the board and read
 *  as a single deck being dealt out, rather than a uniform slide. */
function dealOrigin(index: number) {
  const col = index % COLUMNS
  const row = Math.floor(index / COLUMNS)
  return {
    x: (COLUMNS - 1 - col) * 132 + 150,
    y: -row * 132 - 150,
  }
}

/** Quadratic bezier — one control point lifted above the straight line is
 *  all it takes to make the flight to the basket read as an arc. */
function quad(t: number, p0: number, p1: number, p2: number) {
  const inv = 1 - t
  return inv * inv * p0 + 2 * inv * t * p1 + t * t * p2
}

const CONFETTI_COLORS = [
  'var(--color-claret)',
  'var(--color-turmeric)',
  'var(--color-jade)',
  'var(--color-rose)',
  'var(--color-cocoa)',
]

/** Index-derived rather than Math.random so a burst is stable across
 *  re-renders and never reshuffles itself mid-animation. */
const CONFETTI = Array.from({ length: 16 }, (_, i) => ({
  left: `${4 + i * 6}%`,
  drift: `${(i % 5) * 18 - 36}px`,
  spin: `${180 + (i % 4) * 120}deg`,
  delay: `${(i % 8) * 70}ms`,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
}))

const CRUMBS = Array.from({ length: 8 }, (_, i) => ({
  left: `${8 + i * 11}%`,
  top: `${35 + (i % 4) * 16}%`,
  size: i % 3 === 0 ? 5 : 3,
  drift: `${(i % 3) * 10 - 10}px`,
  duration: `${9 + (i % 4) * 2.5}s`,
  delay: `${i * 1.3}s`,
  color: i % 2 === 0 ? 'var(--color-turmeric)' : 'var(--color-cocoa)',
}))

/* ── Flying cookie ────────────────────────────────────────────────────── */

function FlyingCookie({
  flight,
  reduced,
}: {
  flight: Flight
  reduced: boolean
}) {
  const progress = useMotionValue(0)

  const { from, to } = flight
  // Control point above the higher of the two endpoints, so the card lofts
  // over the board instead of sliding flat across it.
  const cx = (from.x + to.x) / 2
  const cy = Math.min(from.y, to.y) - 90

  const x = useTransform(progress, (t) => quad(t, from.x, cx, to.x))
  const y = useTransform(progress, (t) => quad(t, from.y, cy, to.y))
  const scale = useTransform(progress, [0, 0.6, 1], [1, 0.66, 0.14])
  const opacity = useTransform(progress, [0, 0.78, 1], [1, 1, 0])
  const rotate = useTransform(progress, [0, 1], [0, 15])

  useEffect(() => {
    const controls = animate(progress, 1, {
      duration: reduced ? 0.01 : FLIGHT / 1000,
      ease: [0.32, 0, 0.67, 0],
    })
    return () => controls.stop()
  }, [progress, reduced])

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-30 rounded-2xl bg-milk shadow-[0_6px_20px_rgba(59,33,23,0.12)]"
      style={{
        x,
        y,
        scale,
        opacity,
        rotate,
        width: flight.size,
        height: flight.size,
        transformOrigin: 'center',
      }}
    >
      <div className="relative h-[70%] w-full">
        <Image
          src={`/flavours/${flight.slug}.png`}
          alt=""
          width={200}
          height={200}
          sizes="120px"
          className="h-full w-full scale-[1.16] object-contain mix-blend-multiply"
        />
      </div>
      <p className="serif truncate px-1 text-center text-[10px] leading-tight text-ink">
        {flight.name}
      </p>
    </motion.div>
  )
}

/* ── Rolling stat number ──────────────────────────────────────────────── */

function RollingValue({
  value,
  reduced,
}: {
  value: string | number
  reduced: boolean
}) {
  // Reduced motion shortens the roll to nothing rather than rendering a
  // different tree — the server always renders as if motion were allowed, so
  // any structural branch here would be a hydration mismatch.
  return (
    <span className="relative inline-block overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: '0.75em', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-0.75em', opacity: 0 }}
          transition={
            reduced ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
          }
          className="inline-block tabular-nums"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/* ── Stat card ────────────────────────────────────────────────────────── */

function StatCard({
  label,
  icon,
  pulseKey,
  reduced,
  children,
}: {
  label: string
  icon: React.ReactNode
  /** Changing this replays the glow. It keys a sibling overlay rather than
   *  the card itself — remounting the card would restart the digit roll. */
  pulseKey: string | number
  reduced: boolean
  children: React.ReactNode
}) {
  return (
    <div className="relative flex items-center justify-between gap-3 rounded-2xl border border-ink/8 bg-milk px-4 py-3">
      <motion.span
        key={pulseKey}
        aria-hidden
        initial={{ opacity: 0.55 }}
        animate={{ opacity: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.7, ease: 'easeOut' }}
        className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-claret/40"
      />

      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.16em] text-ink-soft">
          {label}
        </p>
        <div className="serif mt-0.5 text-2xl leading-none text-ink">
          {children}
        </div>
      </div>
      <span className="shrink-0 text-claret">{icon}</span>
    </div>
  )
}

/* ── Section ──────────────────────────────────────────────────────────── */

export default function MemoryGame() {
  const reduced = useReducedMotion() ?? false

  const [deck, setDeck] = useState<Card[]>(buildDeck)
  const [round, setRound] = useState(0)
  const [flipped, setFlipped] = useState<number[]>([])
  /** Flavours whose pair has been found — the cards are still on the board,
   *  flashing jade, until their flight to the basket finishes. */
  const [matched, setMatched] = useState<string[]>([])
  /** Flavours that have landed in the basket. Drives the counter, the
   *  progress bar and the win state, so those only move once the cards
   *  visibly arrive. */
  const [collected, setCollected] = useState<string[]>([])
  const [shaking, setShaking] = useState<number[]>([])
  const [flights, setFlights] = useState<Flight[]>([])
  /** Card indices whose ghost is currently in the air. The board slot empties
   *  the instant a flight launches — leaving it filled would show the pair
   *  twice, once in the grid and once mid-arc. */
  const [flying, setFlying] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [alreadyClaimed, setAlreadyClaimed] = useState(false)
  const [bestScore, setBestScore] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)
  const [basketPop, setBasketPop] = useState(0)
  const [spinning, setSpinning] = useState(false)

  const arenaRef = useRef<HTMLDivElement>(null)
  const basketRef = useRef<HTMLSpanElement>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  /** Mirrors `collected.length` so a landing timer can tell it was the last
   *  pair without closing over stale state. */
  const landedRef = useRef(0)

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms))
  }, [])

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])

  // Shuffle once the game reaches the client, and read the stored best. Both
  // have to land after hydration — the deck order must match the server's
  // markup until then, and localStorage does not exist on the server.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see above
    setDeck((current) => shuffle(current))

    const stored = window.localStorage.getItem(BEST_SCORE_KEY)
    const parsed = stored ? Number.parseInt(stored, 10) : Number.NaN
    if (Number.isFinite(parsed)) {
      setBestScore(parsed)
    }
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  const pairsFound = collected.length
  const won = pairsFound === PAIRS
  const progress = (pairsFound / PAIRS) * 100

  /** Called from the landing timer of the final pair, not from an effect —
   *  the move count at that moment is passed in rather than read from state,
   *  which would be one render stale. */
  const recordBest = useCallback((finalMoves: number) => {
    setBestScore((current) => {
      if (current !== null && current <= finalMoves) return current
      window.localStorage.setItem(BEST_SCORE_KEY, String(finalMoves))
      return finalMoves
    })
  }, [])

  const reshuffle = useCallback(() => {
    clearTimers()
    landedRef.current = 0
    setSpinning(true)
    setFlights([])
    setFlying([])
    setFlipped([])
    setMatched([])
    setCollected([])
    setShaking([])
    setMoves(0)
    setLocked(true)
    setRound((r) => r + 1)
    setDeck((current) => shuffle(current))

    // Held until the exit-and-deal animation has played out, so a card
    // cannot be clicked while it is still flying into place.
    later(() => setLocked(false), reduced ? 60 : 900)
    later(() => setSpinning(false), reduced ? 60 : 900)
  }, [clearTimers, later, reduced])

  /** Lifts a matched pair off the board and arcs it into the basket. */
  const sendToBasket = useCallback(
    (indices: number[], slug: string, name: string, movesSoFar: number) => {
      const land = () => {
        landedRef.current += 1
        setCollected((c) => [...c, slug])
        setBasketPop((p) => p + 1)
        if (landedRef.current === PAIRS) recordBest(movesSoFar)
      }

      const arena = arenaRef.current
      const basket = basketRef.current
      // No layout to measure (refs not attached yet) — collect without the
      // flight rather than dropping the pair on the floor.
      if (!arena || !basket) {
        land()
        return
      }

      const arenaBox = arena.getBoundingClientRect()
      const basketBox = basket.getBoundingClientRect()

      const next: Flight[] = []
      for (const i of indices) {
        const el = cardRefs.current[i]
        if (!el) continue
        const box = el.getBoundingClientRect()
        next.push({
          id: `${slug}-${i}-${round}`,
          slug,
          name,
          size: box.width,
          from: { x: box.left - arenaBox.left, y: box.top - arenaBox.top },
          to: {
            x: basketBox.left - arenaBox.left + basketBox.width / 2 - box.width / 2,
            y: basketBox.top - arenaBox.top + basketBox.height / 2 - box.height / 2,
          },
        })
      }

      setFlights((f) => [...f, ...next])
      setFlying((f) => [...f, ...indices])

      // One timer for the pair rather than a per-ghost callback — both
      // ghosts land together and the counter must only tick once.
      later(
        () => {
          setFlights((f) =>
            f.filter((flight) => !next.some((n) => n.id === flight.id))
          )
          land()
        },
        reduced ? 20 : FLIGHT
      )
    },
    [later, reduced, round, recordBest]
  )

  function flip(index: number) {
    if (locked || won) return
    if (flipped.includes(index)) return
    const card = deck[index]
    if (matched.includes(card.slug)) return

    if (flipped.length === 0) {
      setFlipped([index])
      return
    }

    // Second card of the attempt — one attempt is one move, not two.
    const [first] = flipped
    const nextMoves = moves + 1
    setFlipped([first, index])
    setMoves(nextMoves)
    setLocked(true)

    if (deck[first].slug === card.slug) {
      setMatched((m) => [...m, card.slug])
      later(
        () => {
          setFlipped([])
          setLocked(false)
          sendToBasket([first, index], card.slug, card.name, nextMoves)
        },
        reduced ? 20 : MATCH_HOLD
      )
      return
    }

    setShaking([first, index])
    later(() => {
      setShaking([])
      setFlipped([])
      setLocked(false)
    }, reduced ? 20 : UNFLIP_DELAY)
  }

  /* ── Motion variants ──────────────────────────────────────────────── */

  const gridVariants: Variants = {
    enter: { transition: { staggerChildren: reduced ? 0 : 0.04 } },
    exit: {
      transition: { staggerChildren: reduced ? 0 : 0.03, staggerDirection: -1 },
    },
  }

  // One variant set regardless of motion preference. The `initial` values are
  // written into the server HTML, so branching them would desync hydration —
  // reduced motion collapses the durations instead, landing the cards in
  // place with no perceptible travel.
  const cardVariants: Variants = {
    initial: (i: number) => ({
      ...dealOrigin(i),
      opacity: 0,
      scale: 0.6,
      rotate: 10,
    }),
    enter: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: reduced
        ? { duration: 0 }
        : { type: 'spring', stiffness: 240, damping: 22, mass: 0.7 },
    },
    exit: (i: number) => ({
      ...dealOrigin(i),
      opacity: 0,
      scale: 0.6,
      rotate: 10,
      transition: reduced ? { duration: 0 } : { duration: 0.28, ease: 'easeIn' },
    }),
  }

  return (
    <section className="border-t border-ink/10 py-16 md:py-20">
      <div className="container-bb">
        <div
          ref={arenaRef}
          className="relative overflow-hidden rounded-3xl border border-ink/10 bg-milk/40 p-4 md:p-8"
        >
          {/* Ambient crumbs — decorative, behind everything. Always rendered:
              the base opacity is 0 and only the keyframes lift it, so the
              global prefers-reduced-motion rule that neutralises animations
              also hides these, with no markup difference to hydrate. */}
          {CRUMBS.map((crumb, i) => (
            <span
              key={i}
              aria-hidden
              className="pointer-events-none absolute rounded-full"
              style={
                {
                  left: crumb.left,
                  top: crumb.top,
                  width: crumb.size,
                  height: crumb.size,
                  background: crumb.color,
                  opacity: 0,
                  '--bb-crumb-drift': crumb.drift,
                  '--bb-crumb-opacity': 0.2,
                  animation: `bb-crumb-drift ${crumb.duration} linear ${crumb.delay} infinite`,
                } as React.CSSProperties
              }
            />
          ))}

          <div className="relative grid items-center gap-8 lg:grid-cols-[3fr_2fr] lg:gap-12">
            {/* ── Board ────────────────────────────────────────────── */}
            <div className="relative rounded-2xl bg-milk p-4 shadow-[0_2px_16px_rgba(59,33,23,0.06)] md:p-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.ul
                  key={round}
                  variants={gridVariants}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  // 3-up on phones: four columns inside a 390px viewport puts
                  // the cards at ~55px, too small for a cookie and its label.
                  className="mx-auto grid max-w-[540px] grid-cols-3 gap-3 sm:grid-cols-4 md:gap-4"
                >
                  {deck.map((card, i) => {
                    const isCollected =
                      collected.includes(card.slug) || flying.includes(i)
                    const isMatched = matched.includes(card.slug)
                    const isUp = isMatched || flipped.includes(i)
                    const isShaking = shaking.includes(i)

                    return (
                      <motion.li
                        key={card.id}
                        custom={i}
                        variants={cardVariants}
                        className="aspect-square"
                      >
                        {isCollected ? (
                          <div
                            aria-hidden
                            className="h-full w-full rounded-2xl border border-dashed border-ink/10 bg-paper/40"
                          />
                        ) : (
                          <motion.div
                            className="h-full w-full"
                            animate={
                              isShaking && !reduced
                                ? { x: [0, -4, 4, -4, 4, 0] }
                                : { x: 0 }
                            }
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                          >
                            <button
                              type="button"
                              ref={(el) => {
                                cardRefs.current[i] = el
                              }}
                              onClick={() => flip(i)}
                              disabled={isUp || locked}
                              aria-label={isUp ? card.name : 'Face-down card'}
                              className={`bb-card-scene group h-full w-full rounded-2xl shadow-[0_2px_8px_rgba(59,33,23,0.06)] transition-all duration-300 disabled:cursor-default ${
                                isUp
                                  ? ''
                                  : 'hover:-translate-y-1 hover:rotate-[1deg] hover:shadow-[0_6px_20px_rgba(59,33,23,0.12)]'
                              } ${
                                isMatched
                                  ? 'ring-2 ring-jade animate-pulse'
                                  : ''
                              }`}
                            >
                              <motion.div
                                className={`bb-card-inner${isUp ? " is-up" : ""}`}
                                animate={{
                                  rotateY: isUp ? 180 : 0,
                                  scale: reduced ? 1 : [1, 1.05, 1],
                                }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                              >
                                {/* Back — claret gradient, cream wordmark. */}
                                <span className="bb-card-face bb-card-face-back rounded-2xl bg-gradient-to-br from-claret to-claret-dark">
                                  <span
                                    aria-hidden
                                    className="absolute inset-1.5 rounded-xl border border-milk/20"
                                  />
                                  <span className="serif relative px-1 text-center text-[10px] italic leading-tight text-milk/90 md:text-sm">
                                    Bite Baithak
                                  </span>
                                </span>

                                {/* Front — cookie over its name. */}
                                <span
                                  className="bb-card-face bb-card-face-front flex-col rounded-2xl p-1.5"
                                  style={{
                                    background:
                                      'radial-gradient(circle at 50% 38%, #FFFDF6 0%, var(--color-milk) 70%)',
                                  }}
                                >
                                  <motion.div
                                    className="relative h-[68%] w-full"
                                    animate={
                                      reduced ? undefined : { y: [0, -3, 0] }
                                    }
                                    transition={{
                                      duration: 3,
                                      repeat: Infinity,
                                      ease: 'easeInOut',
                                    }}
                                  >
                                    <Image
                                      src={`/flavours/${card.slug}.png`}
                                      alt=""
                                      width={200}
                                      height={200}
                                      sizes="(min-width: 768px) 120px, 90px"
                                      priority={i < 4}
                                      // multiply drops the photos' white
                                      // ground into the card; the scale eats
                                      // the wide margin baked into each shot.
                                      className="h-full w-full scale-[1.16] object-contain mix-blend-multiply"
                                    />
                                  </motion.div>
                                  <span className="serif relative mt-1 line-clamp-2 px-0.5 text-center text-[10px] leading-tight text-ink md:text-sm">
                                    {card.name}
                                  </span>
                                </span>
                              </motion.div>
                            </button>
                          </motion.div>
                        )}
                      </motion.li>
                    )
                  })}
                </motion.ul>
              </AnimatePresence>

              {/* Win celebration — sits over the board only. */}
              <AnimatePresence>
                {won && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden rounded-2xl bg-milk/92 backdrop-blur-sm"
                  >
                    {!reduced &&
                      CONFETTI.map((piece, i) => (
                        <span
                          key={i}
                          aria-hidden
                          className="absolute top-0 h-2.5 w-1.5 rounded-[1px]"
                          style={
                            {
                              left: piece.left,
                              background: piece.color,
                              '--bb-drift': piece.drift,
                              '--bb-spin': piece.spin,
                              animation: `bb-confetti 1400ms var(--ease-out-expo) ${piece.delay} forwards`,
                            } as React.CSSProperties
                          }
                        />
                      ))}

                    <div className="relative px-6 text-center">
                      <p className="serif text-2xl leading-tight text-ink md:text-4xl">
                        {moves <= 9 ? "You cracked it! 🎉" : "Not bad — but not fast enough."}
                      </p>
                      <p className="mt-2 text-sm text-ink-soft">
                        You matched all six in {moves} moves. {moves <= 9 ? "Claim your reward below." : "Complete in 9 moves or fewer to unlock a discount."}
                      </p>
                      {moves <= 9 && (
                        <div className="mt-4 rounded-xl border border-turmeric/40 bg-turmeric/10 px-5 py-3">
                          {couponCode ? (
                            <>
                              <p className="text-xs text-ink-soft mb-1">{alreadyClaimed ? "Previously claimed — still valid!" : "Your one-time reward:"}</p>
                              <p className="serif text-2xl text-ink font-medium tracking-widest">{couponCode}</p>
                              <p className="text-xs text-ink-soft mt-1">10% off on orders above ₹799 · One-time use only</p>
                            </>
                          ) : (
                            <button
                              onClick={claimCoupon}
                              disabled={couponLoading}
                              className="w-full rounded-lg bg-turmeric px-4 py-2 text-sm font-medium text-ink hover:bg-turmeric/80 disabled:opacity-50 transition-colors"
                            >
                              {couponLoading ? "Generating..." : "🎁 Claim 10% off"}
                            </button>
                          )}
                        </div>
                      )}
                      {moves > 9 && (
                        <p className="mt-3 text-xs text-ink-soft">Next time — solve in 9 moves to unlock a discount.</p>
                      )}
                      <motion.button
                        type="button"
                        onClick={reshuffle}
                        animate={reduced ? undefined : { scale: [1, 1.04, 1] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-claret px-6 py-3 text-sm font-medium text-milk transition-colors hover:bg-claret-dark"
                      >
                        Play again
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Sidebar ──────────────────────────────────────────── */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-claret">
                🎮 Step into the Baithak
              </p>
              <h2 className="serif mt-3 text-3xl leading-tight text-ink md:text-4xl">
                Match the flavours
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Flip cards, find the pairs. Fewer moves, bigger flex.
              </p>

              <div className="mt-6 space-y-3">
                <StatCard
                  label="Moves"
                  pulseKey={moves}
                  reduced={reduced}
                  icon={<RotateCw size={18} strokeWidth={1.75} />}
                >
                  <RollingValue value={moves} reduced={reduced} />
                </StatCard>

                <div className="relative">
                  <StatCard
                    label="Pairs Found"
                    pulseKey={pairsFound}
                    reduced={reduced}
                    icon={
                      // Outer span holds the ref and never remounts, so the
                      // flight target stays measurable; the inner one is keyed
                      // to replay the bounce on every landing.
                      <span
                        ref={basketRef}
                        className={`relative inline-flex rounded-full p-1 ${
                          won ? 'ring-2 ring-jade' : ''
                        }`}
                      >
                        <motion.span
                          key={basketPop}
                          className="inline-flex"
                          animate={reduced ? undefined : { scale: [1, 1.25, 1] }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                          <ShoppingBasket size={18} strokeWidth={1.75} />
                        </motion.span>
                      </span>
                    }
                  >
                    <RollingValue value={pairsFound} reduced={reduced} />
                    <span className="text-ink-soft"> / {PAIRS}</span>
                  </StatCard>

                  {/* "+2" pop over the basket. Keyframed rather than wrapped
                      in AnimatePresence — nothing unmounts it, so it has to
                      fade itself out. */}
                  {basketPop > 0 && !reduced && (
                    <motion.span
                      key={basketPop}
                      aria-hidden
                      initial={{ opacity: 0, y: 0, scale: 0.7 }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        y: [0, -16, -22, -32],
                        scale: [0.7, 1, 1, 0.9],
                      }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="pointer-events-none absolute right-4 top-1 text-sm font-medium text-claret"
                    >
                      +2
                    </motion.span>
                  )}

                  {/* Win burst — the real cookies fan out of the basket.
                      Anchored to this wrapper so no measurement is needed. */}
                  {won &&
                    !reduced &&
                    FLAVOURS.map((flavour, i) => {
                      const angle =
                        (i / FLAVOURS.length) * Math.PI * 2 - Math.PI / 2
                      return (
                        // The blend belongs on this span, not the <img>: the
                        // animated transform makes this a stacking context, so
                        // a blend below it composites against an empty group
                        // and the photo's white ground shows as a box. Scale
                        // in and out rather than fade, for the same reason —
                        // opacity below 1 would isolate it too.
                        <motion.span
                          key={flavour.slug}
                          aria-hidden
                          className="pointer-events-none absolute right-5 top-4 z-40 block mix-blend-multiply"
                          initial={{ scale: 0, x: 0, y: 0 }}
                          animate={{
                            scale: [0, 1, 0],
                            x: Math.cos(angle) * 140,
                            y: Math.sin(angle) * 140,
                            rotate: i % 2 === 0 ? 140 : -140,
                          }}
                          transition={{
                            duration: 1.5,
                            delay: i * 0.06,
                            ease: 'easeOut',
                          }}
                        >
                          <Image
                            src={`/flavours/${flavour.slug}.png`}
                            alt=""
                            width={120}
                            height={120}
                            sizes="56px"
                            className="h-14 w-14 object-contain"
                          />
                        </motion.span>
                      )
                    })}
                </div>

                <StatCard
                  label="Best Score"
                  pulseKey={bestScore ?? '—'}
                  reduced={reduced}
                  icon={<Trophy size={18} strokeWidth={1.75} />}
                >
                  <RollingValue value={bestScore ?? '—'} reduced={reduced} />
                </StatCard>
              </div>

              <div className="mt-6">
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                  Cookie Collection
                </p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink/8">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-claret to-turmeric"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>

              <motion.button
                type="button"
                onClick={reshuffle}
                whileHover={reduced ? undefined : { scale: 1.05 }}
                whileTap={reduced ? undefined : { scale: 0.97 }}
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-claret px-6 py-3 text-sm font-medium text-milk transition-colors hover:bg-claret-dark"
              >
                <motion.span
                  className="inline-flex"
                  animate={spinning && !reduced ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 0.9, ease: 'easeInOut' }}
                >
                  <RefreshCw
                    size={15}
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:rotate-90"
                  />
                </motion.span>
                Reshuffle
              </motion.button>
            </div>
          </div>

          {/* Cards in transit to the basket. Positioned against the arena
              rather than the viewport — a transformed ancestor would break
              `fixed`, and everything here is measured in arena space. */}
          {flights.map((flight) => (
            <FlyingCookie key={flight.id} flight={flight} reduced={reduced} />
          ))}
        </div>
      </div>
    </section>
  )
}
