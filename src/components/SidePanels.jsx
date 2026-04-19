import { Award, BarChart2, Flame } from 'lucide-react'
import { computeStreakFromDays, habitPercent, tierFromPercent } from '../utils/progress'

function rankBadge(i) {
  const colors = [
    'from-amber-400/30 text-amber-200 ring-amber-400/30',
    'from-zinc-300/20 text-zinc-200 ring-zinc-400/25',
    'from-orange-400/25 text-orange-200 ring-orange-400/25',
  ]
  const cls = colors[i] ?? 'from-app-border/40 text-app-muted ring-app-border/60'
  return (
    <span
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[11px] font-bold ring-1 ${cls}`}
    >
      {i + 1}
    </span>
  )
}

export default function SidePanels({ habits, activity }) {
  const enriched = habits.map((h) => {
    const completed = h.days.reduce((a, b) => a + b, 0)
    const pct = habitPercent(completed, h.goal)
    const streak = computeStreakFromDays(h.days)
    return { ...h, completed, pct, streak }
  })

  const topByPct = [...enriched].sort((a, b) => b.pct - a.pct).slice(0, 5)
  const topStreaks = [...enriched].sort((a, b) => b.streak - a.streak).slice(0, 10)

  return (
    <div className="flex flex-col gap-4">
      <div className="glass-panel rounded-2xl p-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/25">
            <BarChart2 className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <h3 className="font-heading text-sm font-semibold text-app-primary">Top 5 habits</h3>
            <p className="text-[11px] text-app-muted">Sorted by monthly %</p>
          </div>
        </div>
        <ul className="space-y-2">
          {topByPct.map((h, i) => (
            <li
              key={h.name}
              className="flex items-center gap-3 rounded-xl border border-transparent px-1 py-1.5 transition-colors hover:border-app-border/80 hover:bg-white/[0.02]"
            >
              {rankBadge(i)}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-app-primary">{h.name}</p>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-app-bg ring-1 ring-app-border">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
                    style={{ width: `${h.pct}%` }}
                  />
                </div>
              </div>
              <span
                className={[
                  'shrink-0 font-mono text-xs font-semibold',
                  tierFromPercent(h.pct) === 'green'
                    ? 'text-emerald-400'
                    : tierFromPercent(h.pct) === 'yellow'
                      ? 'text-amber-300'
                      : tierFromPercent(h.pct) === 'orange'
                        ? 'text-orange-400'
                        : 'text-red-400',
                ].join(' ')}
              >
                {h.pct}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-panel rounded-2xl p-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/25">
            <Flame className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <h3 className="font-heading text-sm font-semibold text-app-primary">Top streaks</h3>
            <p className="text-[11px] text-app-muted">Current run (days)</p>
          </div>
        </div>
        <ul className="max-h-[280px] space-y-1.5 overflow-y-auto scrollbar-thin pr-1">
          {topStreaks.map((h, i) => (
            <li
              key={h.name}
              className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm hover:bg-white/[0.03]"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="w-5 shrink-0 text-center font-mono text-[11px] text-app-muted">
                  {i + 1}
                </span>
                <span className="truncate text-app-primary">{h.name}</span>
              </span>
              <span className="shrink-0 font-mono text-xs font-semibold text-amber-300">
                {h.streak}d
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-panel rounded-2xl p-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/25">
            <Award className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <h3 className="font-heading text-sm font-semibold text-app-primary">Activity summary</h3>
            <p className="text-[11px] text-app-muted">This month</p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-app-bg/60 p-3 ring-1 ring-app-border/80">
            <dt className="text-[11px] text-app-muted">Active days</dt>
            <dd className="font-heading mt-1 text-lg font-semibold text-app-primary">
              {activity.activeDays}
            </dd>
          </div>
          <div className="rounded-xl bg-app-bg/60 p-3 ring-1 ring-app-border/80">
            <dt className="text-[11px] text-app-muted">Best weekday</dt>
            <dd className="font-heading mt-1 text-lg font-semibold text-sky-300">
              {activity.bestDay}
            </dd>
          </div>
          <div className="rounded-xl bg-app-bg/60 p-3 ring-1 ring-app-border/80">
            <dt className="text-[11px] text-app-muted">Avg completion</dt>
            <dd className="font-heading mt-1 text-lg font-semibold text-emerald-300">
              {activity.avgCompletion}%
            </dd>
          </div>
          <div className="rounded-xl bg-app-bg/60 p-3 ring-1 ring-app-border/80">
            <dt className="text-[11px] text-app-muted">Focus blocks</dt>
            <dd className="font-heading mt-1 text-lg font-semibold text-app-primary">
              {activity.focusBlocks}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
