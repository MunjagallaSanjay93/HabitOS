import { Check, Plus } from 'lucide-react'
import { useMemo } from 'react'
import {
  computeStreakFromDays,
  habitPercent,
  tierFromPercent,
  tierGradients,
} from '../utils/progress'

function MiniBar({ pct }) {
  const tier = tierFromPercent(pct)
  return (
    <div className="h-2 w-full max-w-[120px] overflow-hidden rounded-full bg-app-bg ring-1 ring-app-border">
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${pct}%`,
          background: tierGradients[tier],
          boxShadow: '0 0 12px rgba(34,197,94,0.25)',
        }}
      />
    </div>
  )
}

export default function HabitTable({ habits, onToggleDay }) {
  const dayHeaders = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), [])

  return (
    <div className="glass-panel overflow-hidden rounded-2xl">
      <div className="flex flex-col gap-1 border-b border-app-border/80 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold tracking-tight text-app-primary">
            Daily habit tracker
          </h2>
          <p className="mt-1 text-sm text-app-muted">April 2026 · check days as you go</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('habitos:add-habit'))}
            className="inline-flex items-center gap-2 rounded-xl border border-app-border bg-app-card/60 px-3 py-2 text-sm font-semibold text-app-primary transition hover:border-white/15 hover:bg-white/[0.06]"
          >
            <Plus className="h-4 w-4 text-emerald-300" aria-hidden />
            Add habit
          </button>
          <div className="flex items-center gap-2 text-xs text-app-muted">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            Complete
            <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-app-border" />
            Missed
          </div>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        {habits.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <Plus className="h-6 w-6 text-emerald-300" aria-hidden />
            </div>
            <h3 className="font-heading mt-4 text-lg font-semibold text-app-primary">
              No habits yet
            </h3>
            <p className="mt-2 text-sm text-app-muted">
              Start clean and build your system. Add your first habit to begin tracking.
            </p>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('habitos:add-habit'))}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-200 ring-1 ring-emerald-500/30 transition hover:bg-emerald-500/25"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add your first habit
            </button>
          </div>
        ) : (
        <table className="min-w-[1100px] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="text-[11px] font-semibold uppercase tracking-wider text-app-muted">
              <th className="sticky left-0 z-20 bg-app-card/95 px-4 py-3 backdrop-blur">
                Habit
              </th>
              <th className="px-2 py-3">Goal</th>
              {dayHeaders.map((d) => (
                <th key={d} className="px-1 py-3 text-center font-mono text-[10px] text-app-muted/90">
                  {d}
                </th>
              ))}
              <th className="px-3 py-3">Done</th>
              <th className="px-3 py-3">Left</th>
              <th className="min-w-[140px] px-3 py-3">%</th>
              <th className="px-4 py-3 text-right">Streak</th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, hi) => {
              const completed = habit.days.reduce((a, b) => a + b, 0)
              const remaining = Math.max(0, habit.goal - completed)
              const pct = habitPercent(completed, habit.goal)
              const streak = computeStreakFromDays(habit.days)

              return (
                <tr
                  key={habit.name}
                  className="border-t border-app-border/60 transition-colors hover:bg-white/[0.02]"
                >
                  <td className="sticky left-0 z-10 bg-gradient-to-r from-app-card via-app-card to-transparent px-4 py-3 font-medium text-app-primary">
                    <div className="flex flex-col">
                      <span>{habit.name}</span>
                      <span className="text-[11px] font-normal capitalize text-app-muted">
                        {habit.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-3 font-mono text-app-muted">{habit.goal}</td>
                  {habit.days.map((done, di) => (
                    <td key={di} className="px-1 py-2 text-center">
                      <button
                        type="button"
                        aria-pressed={!!done}
                        aria-label={`Toggle ${habit.name} day ${di + 1}`}
                        onClick={() => onToggleDay(hi, di)}
                        className={[
                          'mx-auto flex h-7 w-7 items-center justify-center rounded-lg border text-[0] transition-all duration-200',
                          done
                            ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300 shadow-[0_0_12px_rgba(34,197,94,0.25)]'
                            : 'border-app-border bg-app-bg/80 text-transparent hover:border-white/20 hover:bg-white/[0.04]',
                        ].join(' ')}
                      >
                        <Check className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </td>
                  ))}
                  <td className="px-3 py-3 font-mono text-app-primary">{completed}</td>
                  <td className="px-3 py-3 font-mono text-app-muted">{remaining}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <MiniBar pct={pct} />
                      <span className="w-10 text-right font-mono text-xs text-app-muted">
                        {pct}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex min-w-[2rem] justify-end rounded-lg bg-app-bg/80 px-2 py-1 font-mono text-xs text-amber-300 ring-1 ring-amber-500/20">
                      {streak}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        )}
      </div>
    </div>
  )
}
