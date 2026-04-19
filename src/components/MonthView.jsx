import { Calendar, Trophy } from 'lucide-react'
import { useMemo } from 'react'
import { habitPercent, tierFromPercent, tierGradients } from '../utils/progress'

function dayPctForIndex(habits, dayIdx) {
  const total = habits.length || 1
  const done = habits.reduce((a, h) => a + (h.days[dayIdx] ? 1 : 0), 0)
  return Math.round((done / total) * 100)
}

function intensityFromPct(pct) {
  const t = tierFromPercent(pct)
  if (t === 'green') return 'bg-emerald-400/40 ring-emerald-400/25'
  if (t === 'yellow') return 'bg-amber-400/30 ring-amber-400/20'
  if (t === 'orange') return 'bg-orange-400/30 ring-orange-400/20'
  return 'bg-red-400/25 ring-red-400/20'
}

export default function MonthView({ monthLabel, habits }) {
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i), [])

  const bestDay = useMemo(() => {
    let best = { day: 1, pct: -1 }
    days.forEach((di) => {
      const pct = dayPctForIndex(habits, di)
      if (pct > best.pct) best = { day: di + 1, pct }
    })
    return best
  }, [days, habits])

  const monthPct = useMemo(() => {
    const total = habits.reduce((a, h) => a + h.days.length, 0) || 1
    const done = habits.reduce((a, h) => a + h.days.reduce((x, y) => x + y, 0), 0)
    return habitPercent(done, total)
  }, [habits])

  const tier = tierFromPercent(monthPct)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass-panel rounded-2xl p-6 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-xl font-semibold text-app-primary">
                {monthLabel} view
              </h2>
              <p className="mt-1 text-sm text-app-muted">
                Calendar drill-down with daily intensity and top habits.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-app-muted ring-1 ring-app-border/70">
              <Calendar className="h-4 w-4 text-emerald-300" aria-hidden />
              31 days
            </span>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-2">
            {days.map((di) => {
              const pct = dayPctForIndex(habits, di)
              return (
                <div
                  key={di}
                  className={[
                    'group relative aspect-square rounded-2xl p-3 ring-1 transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)]',
                    intensityFromPct(pct),
                  ].join(' ')}
                  title={`Day ${di + 1} · ${pct}%`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[11px] font-semibold text-app-primary/90">
                      {di + 1}
                    </span>
                    <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-semibold text-app-primary/90">
                      {pct}%
                    </span>
                  </div>
                  <div className="absolute inset-x-3 bottom-3 h-1.5 overflow-hidden rounded-full bg-black/15">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: tierGradients[tierFromPercent(pct)] }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-heading text-base font-semibold text-app-primary">Month score</h3>
              <p className="mt-1 text-xs text-app-muted">Overall completion density</p>
            </div>
            <Trophy className="h-5 w-5 text-amber-300" aria-hidden />
          </div>

          <p className="font-heading mt-5 text-4xl font-semibold text-app-primary">{monthPct}%</p>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-app-bg ring-1 ring-app-border">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${monthPct}%`, background: tierGradients[tier] }}
            />
          </div>

          <div className="mt-6 rounded-2xl border border-app-border/70 bg-app-bg/50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-app-muted">Best day</p>
            <p className="mt-1 text-sm font-semibold text-app-primary">
              Day {bestDay.day}{' '}
              <span className="font-mono text-xs text-emerald-300">({bestDay.pct}%)</span>
            </p>
            <p className="mt-2 text-xs text-app-muted">
              Use this pattern: replicate the environment and time window.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <h3 className="font-heading text-base font-semibold text-app-primary">Habit breakdown</h3>
        <p className="mt-1 text-xs text-app-muted">Completion vs goal for this month</p>
        <ul className="mt-5 space-y-3">
          {habits.map((h) => {
            const done = h.days.reduce((a, b) => a + b, 0)
            const pct = habitPercent(done, h.goal)
            const t = tierFromPercent(pct)
            return (
              <li
                key={h.name}
                className="rounded-2xl border border-app-border/70 bg-app-bg/50 px-5 py-4 transition hover:border-white/10"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-app-primary">{h.name}</p>
                    <p className="mt-1 text-xs text-app-muted">
                      {done}/{h.goal} completed
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-xs font-semibold text-app-primary">
                    {pct}%
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-app-card ring-1 ring-app-border">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: tierGradients[t] }} />
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

