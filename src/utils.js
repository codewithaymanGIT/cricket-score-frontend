// 76 balls -> "12.4"
export const formatOvers = (balls) => `${Math.floor(balls / 6)}.${balls % 6}`

// Ball number 76 -> "12.4" (the 4th ball of the 13th over)
export const ballLabel = (n) => `${Math.floor((n - 1) / 6)}.${((n - 1) % 6) + 1}`

export const overIndex = (n) => Math.floor((n - 1) / 6)

export const shortName = (name = '') =>
  name.split(' ').map((w) => w[0]).join('').toUpperCase()

export const runRate = (runs, balls) =>
  balls > 0 ? (runs / (balls / 6)).toFixed(2) : '0.00'

export const chipText = (b) => (b.wicket ? 'W' : b.runs === 0 ? '•' : String(b.runs))

export const chipClass = (b) => {
  if (b.wicket) return 'chip chip-w'
  if (b.runs === 4) return 'chip chip-4'
  if (b.runs === 6) return 'chip chip-6'
  if (b.runs === 0) return 'chip chip-dot'
  return 'chip'
}