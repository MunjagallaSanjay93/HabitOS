import { habitPercent, tierFromPercent, tierGradients } from '../utils/progress'

function weekSlices(days) {
  const chunks = []
  for (let w = 0; w < 4; w++) {
    const start = w * 7
    const slice = days.slice(start, start + 7)
    const done = slice.reduce((a, b) => a + b, 0)
    chunks.push({ done, total: slice.length })
  }
  return chunks
}

export default function WeeklyHabits({ habits }) {
  const byWeek = [0, 0, 0, 0].map(() => ({ done: 0, total: 0 }))
  habits.forEach((h) => {
    const chunks = weekSlices(h.days)
    chunks.forEach((c, i) => {
      byWeek[i].done += c.done
      byWeek[i].total += c.total
    })
  })

  const totals = byWeek.map((w) => {
    const pct = habitPercent(w.done, w.total || 1)
    return { ...w, pct }
  })

  const monthPct = habitPercent(
    totals.reduce((a, t) => a + t.done, 0),
    totals.reduce((a, t) => a + t.total, 0) || 1,
  )

  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-heading text-base font-semibold text-app-primary">
            Weekly rhythm
          </h3>
          <p className="text-xs text-app-muted">Aggregated check-ins · Week 1–4</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wide text-app-muted">Month total</p>
          <p className="font-heading text-2xl font-semibold text-app-primary">{monthPct}%</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {totals.map((t, i) => {
          const tier = tierFromPercent(t.pct)
          return (
            <div
              key={i}
              className="rounded-xl border border-app-border/80 bg-app-bg/50 p-4 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.03]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-app-primary">Week {i + 1}</span>
                <span className="font-mono text-xs text-app-muted">
                  {t.done}/{t.total}
                </span>
              </div>
              <p className="mt-2 font-heading text-xl font-semibold text-app-primary">{t.pct}%</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-app-card ring-1 ring-app-border">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${t.pct}%`,
                    background: tierGradients[tier],
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
