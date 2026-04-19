import { Activity, CalendarDays, Flame, TrendingDown, TrendingUp, Zap } from 'lucide-react'
import { tierFromPercent } from '../utils/progress'

const cards = [
  { key: 'momentum', icon: Flame, k: 'momentum' },
  { key: 'daily', icon: Zap, k: 'daily' },
  { key: 'weekly', icon: Activity, k: 'weekly' },
  { key: 'monthly', icon: CalendarDays, k: 'monthly' },
]

function accentForPct(pct) {
  const t = tierFromPercent(pct)
  if (t === 'green') return 'from-emerald-500/20 to-emerald-400/5 text-emerald-400'
  if (t === 'yellow') return 'from-amber-500/20 to-amber-400/5 text-amber-300'
  if (t === 'orange') return 'from-orange-500/20 to-orange-400/5 text-orange-400'
  return 'from-red-500/20 to-red-400/5 text-red-400'
}

export default function KPIcards({ data }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, icon, k }) => {
        const ItemIcon = icon
        const item = data[k]
        const trendUp = item.trend >= 0
        const accent = accentForPct(item.value)
        return (
          <div
            key={key}
            className="glass-panel group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
          >
            <div
              className={[
                'pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br opacity-40 blur-2xl transition-opacity duration-300 group-hover:opacity-70',
                accent.split(' ').slice(0, 2).join(' '),
              ].join(' ')}
            />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-app-muted">
                  {item.label}
                </p>
                <p className="font-heading mt-2 text-3xl font-semibold tracking-tight text-app-primary">
                  {item.value}
                  <span className="text-lg font-medium text-app-muted">%</span>
                </p>
              </div>
              <div
                className={[
                  'flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ring-white/5',
                  accent,
                ].join(' ')}
              >
                <ItemIcon className="h-5 w-5" aria-hidden />
              </div>
            </div>
            <div className="relative mt-4 flex items-center gap-2 text-xs">
              {trendUp ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" aria-hidden />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-400" aria-hidden />
              )}
              <span className={trendUp ? 'text-emerald-400' : 'text-red-400'}>
                {trendUp ? '+' : ''}
                {item.trend}% vs last period
              </span>
              <span className="text-app-muted">· rolling</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
