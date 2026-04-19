const levels = [
  'bg-app-border/40',
  'bg-emerald-900/50',
  'bg-emerald-700/55',
  'bg-emerald-500/45',
  'bg-emerald-400/55',
]

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function HeatmapGrid({ grid }) {
  const cols = grid[0]?.length ?? 0

  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="mb-4">
        <h3 className="font-heading text-base font-semibold text-app-primary">Consistency heatmap</h3>
        <p className="text-xs text-app-muted">GitHub-style intensity · last {cols} weeks</p>
      </div>
      <div className="overflow-x-auto scrollbar-thin pb-2">
        <div className="inline-flex min-w-full gap-3">
          <div className="flex flex-col justify-around pt-6 text-[10px] font-medium text-app-muted/90">
            {dayLabels.map((d) => (
              <span key={d} className="h-3 leading-3">
                {d}
              </span>
            ))}
          </div>
          <div
            className="grid flex-1 gap-1"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridTemplateRows: 'repeat(7, minmax(0, 1fr))',
            }}
          >
            {grid.flatMap((row, ri) =>
              row.map((cell, ci) => (
                <div
                  key={`${ri}-${ci}`}
                  title={`${dayLabels[ri]} · intensity ${cell}`}
                  className={[
                    'h-3 w-3 rounded-sm ring-1 ring-black/20 transition-transform duration-150 hover:scale-125 hover:ring-emerald-400/40',
                    levels[cell] ?? levels[0],
                  ].join(' ')}
                />
              )),
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-app-muted">
        <span>Less</span>
        {levels.map((lv, i) => (
          <span key={i} className={`h-3 w-3 rounded-sm ring-1 ring-black/20 ${lv}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
