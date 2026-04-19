export function habitPercent(completed, goal) {
  if (!goal) return 0
  return Math.min(100, Math.round((completed / goal) * 100))
}

/** @returns {'green'|'yellow'|'orange'|'red'} */
export function tierFromPercent(pct) {
  if (pct >= 80) return 'green'
  if (pct >= 60) return 'yellow'
  if (pct >= 40) return 'orange'
  return 'red'
}

export const tierGradients = {
  green: 'linear-gradient(90deg, #15803d 0%, #22c55e 45%, #4ade80 100%)',
  yellow: 'linear-gradient(90deg, #a16207 0%, #eab308 50%, #fde047 100%)',
  orange: 'linear-gradient(90deg, #c2410c 0%, #f97316 50%, #fb923c 100%)',
  red: 'linear-gradient(90deg, #b91c1c 0%, #ef4444 50%, #f87171 100%)',
}

export const tierRing = {
  green: 'ring-emerald-500/30',
  yellow: 'ring-amber-500/30',
  orange: 'ring-orange-500/30',
  red: 'ring-red-500/30',
}

export function computeStreakFromDays(days) {
  let streak = 0
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i]) streak += 1
    else break
  }
  return streak
}
