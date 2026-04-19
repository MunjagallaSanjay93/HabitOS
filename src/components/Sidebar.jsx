import {
  BarChart3,
  CalendarRange,
  ChevronRight,
  LayoutDashboard,
  Settings,
  Sparkles,
} from 'lucide-react'

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export default function Sidebar({ active, onNavigate, mobileOpen, onCloseMobile }) {
  const item = (id, icon, label, opts = {}) => {
    const isActive = active === id
    return (
      <button
        key={id}
        type="button"
        onClick={() => {
          onNavigate(id)
          onCloseMobile?.()
        }}
        className={[
          'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-white/[0.08] text-app-primary shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]'
            : 'text-app-muted hover:bg-white/[0.04] hover:text-app-primary',
        ].join(' ')}
      >
        <span
          className={[
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors',
            isActive
              ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-400'
              : 'border-app-border bg-app-bg/60 text-app-muted group-hover:border-white/10 group-hover:text-app-primary',
          ].join(' ')}
        >
          {icon}
        </span>
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {opts.chevron && (
          <ChevronRight
            className={[
              'h-4 w-4 shrink-0 transition-transform',
              isActive ? 'translate-x-0.5 text-emerald-400/90' : 'text-app-muted opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100',
            ].join(' ')}
          />
        )}
      </button>
    )
  }

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-app-border bg-app-bg/95 px-4 py-6 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div className="mb-8 flex items-center gap-3 px-1">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/25 to-sky-500/20 ring-1 ring-white/10">
            <Sparkles className="h-5 w-5 text-emerald-400" aria-hidden />
          </div>
          <div>
            <p className="font-heading text-base font-semibold tracking-tight text-app-primary">
              HabitOS
            </p>
            <p className="text-xs text-app-muted">Ultimate dashboard</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto scrollbar-thin pr-1">
          {item('dashboard', <LayoutDashboard className="h-4 w-4" />, 'Dashboard', {
            chevron: true,
          })}
          {item('planner', <CalendarRange className="h-4 w-4" />, 'Planner', { chevron: true })}

          <div className="pt-4">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-app-muted/80">
              Monthly views
            </p>
            <div className="grid max-h-[200px] grid-cols-3 gap-1.5 overflow-y-auto scrollbar-thin pr-1">
              {months.map((m, i) => {
                const id = `month-${i}`
                const isActive = active === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      onNavigate(id)
                      onCloseMobile?.()
                    }}
                    className={[
                      'rounded-lg px-2 py-2 text-center text-xs font-medium transition-all',
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30'
                        : 'bg-app-card/50 text-app-muted hover:bg-white/[0.06] hover:text-app-primary',
                    ].join(' ')}
                  >
                    {m}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-1 border-t border-app-border/80 pt-4">
            {item('annual', <BarChart3 className="h-4 w-4" />, 'Annual Report', {
              chevron: true,
            })}
            {item('settings', <Settings className="h-4 w-4" />, 'Settings')}
          </div>
        </nav>

        <div className="mt-4 rounded-2xl border border-app-border/80 bg-gradient-to-br from-emerald-500/10 via-app-card/80 to-sky-500/5 p-4">
          <p className="font-heading text-sm font-semibold text-app-primary">Pro insight</p>
          <p className="mt-1 text-xs leading-relaxed text-app-muted">
            Consistency beats intensity. Your Tuesday blocks are your strongest lever.
          </p>
        </div>
      </aside>
    </>
  )
}
