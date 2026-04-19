import { Check, Circle, Clock, Plus, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'

function pillClass(tag) {
  const map = {
    Health: 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20',
    Career: 'bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20',
    Learning: 'bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/20',
    Life: 'bg-amber-500/10 text-amber-200 ring-1 ring-amber-500/20',
    Sleep: 'bg-orange-500/10 text-orange-200 ring-1 ring-orange-500/20',
  }
  return map[tag] ?? 'bg-white/[0.04] text-app-muted ring-1 ring-app-border/70'
}

function Stat({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-app-border/70 bg-app-bg/50 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-app-muted">
        {label}
      </p>
      <p className={`font-heading mt-2 text-2xl font-semibold ${accent}`}>{value}</p>
    </div>
  )
}

export default function Planner({ plannerWeeks }) {
  const [weeks, setWeeks] = useState(() =>
    plannerWeeks.map((w) => ({ ...w, items: w.items.map((i) => ({ ...i })) })),
  )

  const totals = useMemo(() => {
    const all = weeks.flatMap((w) => w.items)
    const done = all.filter((x) => x.done).length
    const total = all.length
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 }
  }, [weeks])

  const toggle = (weekIdx, itemId) => {
    setWeeks((prev) =>
      prev.map((w, wi) =>
        wi !== weekIdx
          ? w
          : {
              ...w,
              items: w.items.map((it) => (it.id === itemId ? { ...it, done: !it.done } : it)),
            },
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass-panel rounded-2xl p-6 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-xl font-semibold text-app-primary">Planner</h2>
              <p className="mt-1 text-sm text-app-muted">
                Time-box your habits into outcomes. This is mock data, but the UX is real.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-app-border bg-app-card/60 px-3 py-2 text-sm font-medium text-app-primary transition hover:border-white/15 hover:bg-white/[0.06]"
            >
              <Plus className="h-4 w-4 text-emerald-300" aria-hidden />
              New item
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Stat label="Completion" value={`${totals.pct}%`} accent="text-emerald-300" />
            <Stat label="Done" value={totals.done} accent="text-app-primary" />
            <Stat label="Remaining" value={Math.max(0, totals.total - totals.done)} accent="text-app-muted" />
          </div>

          <div className="mt-6 rounded-2xl border border-app-border/70 bg-gradient-to-br from-emerald-500/10 via-app-card/70 to-sky-500/5 p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                <Sparkles className="h-5 w-5 text-emerald-300" aria-hidden />
              </div>
              <div>
                <p className="font-heading text-sm font-semibold text-app-primary">Planning hint</p>
                <p className="text-xs text-app-muted">
                  Protect your first 90 minutes. Your highest-leverage habits happen early.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <h3 className="font-heading text-base font-semibold text-app-primary">Today</h3>
          <p className="mt-1 text-xs text-app-muted">Focused agenda</p>
          <div className="mt-4 space-y-3">
            {[
              { t: '08:30', label: 'Deep Work · Feature slice', tag: 'Career' },
              { t: '12:10', label: 'Walk · 20 min', tag: 'Health' },
              { t: '18:30', label: 'Gym · Strength', tag: 'Health' },
            ].map((x) => (
              <div
                key={x.t}
                className="flex items-center justify-between gap-3 rounded-2xl border border-app-border/70 bg-app-bg/50 px-4 py-3 transition hover:border-white/10"
              >
                <span className="flex items-center gap-2 text-sm text-app-primary">
                  <Clock className="h-4 w-4 text-app-muted" aria-hidden />
                  <span className="font-mono text-xs text-app-muted">{x.t}</span>
                  <span className="truncate font-medium">{x.label}</span>
                </span>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${pillClass(x.tag)}`}>
                  {x.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {weeks.map((w, wi) => (
          <div key={w.title} className="glass-panel rounded-2xl p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-heading text-base font-semibold text-app-primary">{w.title}</h3>
                <p className="mt-1 text-xs text-app-muted">Click to mark complete</p>
              </div>
              <span className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-app-muted ring-1 ring-app-border/70">
                {w.items.filter((x) => x.done).length}/{w.items.length}
              </span>
            </div>

            <ul className="mt-4 space-y-2">
              {w.items.map((it) => (
                <li key={it.id}>
                  <button
                    type="button"
                    onClick={() => toggle(wi, it.id)}
                    className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-app-border/70 bg-app-bg/50 px-4 py-3 text-left transition hover:border-white/10 hover:bg-white/[0.03]"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={[
                          'flex h-9 w-9 items-center justify-center rounded-xl border transition',
                          it.done
                            ? 'border-emerald-500/35 bg-emerald-500/15 text-emerald-300 shadow-[0_0_14px_rgba(34,197,94,0.18)]'
                            : 'border-app-border bg-app-card/40 text-app-muted group-hover:border-white/15',
                        ].join(' ')}
                      >
                        {it.done ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                      </span>
                      <span className="min-w-0">
                        <p className={`truncate text-sm font-medium ${it.done ? 'text-app-primary' : 'text-app-primary'}`}>
                          {it.label}
                        </p>
                        <p className="mt-0.5 text-[11px] text-app-muted">Outcome-driven weekly plan</p>
                      </span>
                    </span>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${pillClass(it.tag)}`}>
                      {it.tag}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

