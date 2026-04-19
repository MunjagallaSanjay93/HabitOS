import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const tooltipStyle = {
  backgroundColor: 'rgba(17, 24, 39, 0.95)',
  border: '1px solid #1f2937',
  borderRadius: '12px',
  fontSize: '12px',
  color: '#e5e7eb',
  boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
}

function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={tooltipStyle} className="px-3 py-2">
      {label != null && <p className="mb-1 text-app-muted">{label}</p>}
      {payload.map((p) => (
        <p key={p.dataKey} className="font-medium text-app-primary">
          {p.name}: {typeof p.value === 'number' ? `${p.value}%` : p.value}
        </p>
      ))}
    </div>
  )
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const p = payload[0]
  return (
    <div style={tooltipStyle} className="px-3 py-2">
      <p className="text-app-primary">{p.name}</p>
      <p className="text-app-muted">Habits: {p.value}</p>
    </div>
  )
}

export default function Charts({ dailyTrend, weeklyBars, pieData }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="glass-panel rounded-2xl p-5 lg:col-span-2">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-heading text-base font-semibold text-app-primary">
              Daily progress trend
            </h3>
            <p className="text-xs text-app-muted">Blended completion across all habits</p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-500/25">
            April
          </span>
        </div>
        <div className="h-[260px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyTrend} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1f2937" strokeDasharray="3 6" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={{ stroke: '#1f2937' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                width={32}
              />
              <Tooltip content={<DarkTooltip />} />
              <Line
                type="monotone"
                dataKey="progress"
                name="Progress"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#4ade80', stroke: '#14532d' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel flex flex-col rounded-2xl p-5">
        <h3 className="font-heading text-base font-semibold text-app-primary">
          Weekly performance
        </h3>
        <p className="mb-2 text-xs text-app-muted">Score by calendar week</p>
        <div className="min-h-[200px] flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyBars} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#1f2937" strokeDasharray="3 6" vertical={false} />
              <XAxis
                dataKey="week"
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                axisLine={{ stroke: '#1f2937' }}
                tickLine={false}
              />
              <YAxis hide domain={[0, 100]} />
              <Tooltip content={<DarkTooltip />} />
              <Bar dataKey="score" name="Score" radius={[8, 8, 0, 0]}>
                {weeklyBars.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      ['#22c55e', '#38bdf8', '#a78bfa', '#f97316'][i % 4]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-5 lg:col-span-3">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="font-heading text-base font-semibold text-app-primary">
              Progress distribution
            </h3>
            <p className="text-xs text-app-muted">Where your habits sit vs monthly goals</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:justify-center">
          <div className="h-[220px] w-full max-w-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={3}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} stroke="rgba(15,23,42,0.9)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '12px', color: '#9ca3af', paddingTop: 8 }}
                  formatter={(value) => <span className="text-app-muted">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
