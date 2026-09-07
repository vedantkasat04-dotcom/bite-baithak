/** Small colour helpers for the hero_color tile system.
 *  Every product carries a real accent hex, so tiles are composed from
 *  that colour rather than shipping grey placeholder boxes. */

function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)))
}

function parseHex(hex: string): [number, number, number] {
  let h = hex.replace('#', '').trim()
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (h.length !== 6 || Number.isNaN(parseInt(h, 16))) return [139, 30, 44] // claret
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

export function shade(hex: string, amount: number): string {
  const [r, g, b] = parseHex(hex)
  const t = amount < 0 ? 0 : 255
  const p = Math.abs(amount)
  return `rgb(${clamp((t - r) * p + r)} ${clamp((t - g) * p + g)} ${clamp((t - b) * p + b)})`
}

export function alpha(hex: string, a: number): string {
  const [r, g, b] = parseHex(hex)
  return `rgb(${r} ${g} ${b} / ${a})`
}

/** Relative luminance → pick ink or milk for text sitting on the colour. */
export function readableOn(hex: string): string {
  const [r, g, b] = parseHex(hex)
  const srgb = [r, g, b].map((c) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  const L = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
  return L > 0.55 ? 'var(--color-ink)' : 'var(--color-milk)'
}
