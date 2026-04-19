import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { habitPercent, tierFromPercent, tierGradients } from '../utils/progress'

const tipBg = {
  backgroundColor: 'rgba(17, 24, 39, 0.95)',
  border: '1px solid #1f2937',
  borderRadius: '12px',
  fontSize: '12px',
  color: '#e5e7eb',
}

function Tip({ active, payload }) {
  if (!active || !payload?.length) return null
  const p = payload[0]?.payload
  if (!p) return null
  return (
    <div style={tipBg} className="px-3 py-2">
      <p className="font-medium text-app-primary">{p.month}</p>
      <p className="text-app-muted">
        {p.completed} / {p.goal} completions
      </p>
      <p className="mt-1 text-emerald-300">{p.pct}%</p>
    </div>
  )
}

export default function AnnualDashboard({ yearlyMonthly, topHabitsYear }) {
  const data = yearlyMonthly.map((m) => ({
    ...m,
    pct: habitPercent(m.completed, m.goal),
  }))

  const totalDone = yearlyMonthly.reduce((a, m) => a + m.completed, 0)
  const totalGoal = yearlyMonthly.reduce((a, m) => a + m.goal, 0)
  const yearPct = habitPercent(totalDone, totalGoal)
  const remaining = Math.max(0, totalGoal - totalDone)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass-panel rounded-2xl p-6 lg:col-span-2">
          <h2 className="font-heading text-xl font-semibold text-app-primary">Year at a glance</h2>
          <p className="mt-1 text-sm text-app-muted">Monthly completed vs planned (mock year)</p>
          <div className="mt-6 h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#1f2937" strokeDasharray="3 6" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  axisLine={{ stroke: '#1f2937' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<Tip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="completed" name="Completed" radius={[6, 6, 0, 0]}>
                  {data.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        ['#22c55e', '#34d399', '#38bdf8', '#818cf8', '#a78bfa', '#f472b6'][
                          i % 6
                        ]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel flex flex-col justify-between rounded-2xl p-6">
          <div>
            <h3 className="font-heading text-base font-semibold text-app-primary">Totals</h3>
            <p className="mt-1 text-xs text-app-muted">Completed vs remaining (year)</p>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-app-muted">Completed</span>
                <span className="font-mono font-semibold text-emerald-400">{totalDone}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-app-muted">Remaining</span>
                <span className="font-mono font-semibold text-app-primary">{remaining}</span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-app-bg ring-1 ring-app-border">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${yearPct}%`,
                    background: tierGradients[tierFromPercent(yearPct)],
                  }}
                />
              </div>
              <p className="mt-2 text-right font-heading text-2xl font-semibold text-app-primary">
                {yearPct}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="font-heading text-base font-semibold text-app-primary">
            Yearly progress by month
          </h3>
          <p className="text-xs text-app-muted">% of monthly plan achieved</p>
          <ul className="mt-4 space-y-3">
            {data.map((m) => {
              const tier = tierFromPercent(m.pct)
              return (
                <li key={m.month} className="flex items-center gap-3">
                  <span className="w-10 font-mono text-xs text-app-muted">{m.month}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-app-bg ring-1 ring-app-border">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${m.pct}%`,
                        background: tierGradients[tier],
                      }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono text-xs text-app-primary">{m.pct}%</span>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <h3 className="font-heading text-base font-semibold text-app-primary">Top habits of the year</h3>
          <p className="text-xs text-app-muted">Highest sustained performance</p>
          <ol className="mt-4 space-y-3">
            {topHabitsYear.map((h, i) => (
              <li
                key={h.name}
                className="flex items-center justify-between rounded-xl border border-app-border/60 bg-app-bg/40 px-4 py-3 transition-colors hover:border-white/10"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] font-heading text-sm font-bold text-app-muted">
                    {i + 1}
                  </span>
                  <span className="font-medium text-app-primary">{h.name}</span>
                </span>
                <span className="font-mono text-sm font-semibold text-emerald-400">{h.pct}%</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
