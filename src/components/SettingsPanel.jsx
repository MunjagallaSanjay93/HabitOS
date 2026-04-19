import { Bell, Eye, Gauge, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'

function Toggle({ label, description, value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex w-full items-start justify-between gap-4 rounded-2xl border border-app-border/70 bg-app-bg/50 px-5 py-4 text-left transition hover:border-white/10 hover:bg-white/[0.03]"
      aria-pressed={value}
    >
      <span className="min-w-0">
        <p className="text-sm font-semibold text-app-primary">{label}</p>
        <p className="mt-1 text-xs text-app-muted">{description}</p>
      </span>
      <span
        className={[
          'relative mt-1 h-6 w-11 shrink-0 rounded-full ring-1 transition',
          value
            ? 'bg-emerald-500/25 ring-emerald-500/30'
            : 'bg-white/[0.05] ring-app-border/80',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full shadow transition-all',
            value
              ? 'left-6 bg-emerald-300 shadow-[0_0_18px_rgba(34,197,94,0.25)]'
              : 'left-1 bg-white/60',
          ].join(' ')}
        />
      </span>
    </button>
  )
}

function Section({ icon, title, subtitle, children }) {
  const IconComp = icon
  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-app-border/70">
          <IconComp className="h-5 w-5 text-emerald-300" aria-hidden />
        </div>
        <div>
          <h2 className="font-heading text-lg font-semibold text-app-primary">{title}</h2>
          <p className="mt-1 text-sm text-app-muted">{subtitle}</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">{children}</div>
    </div>
  )
}

export default function SettingsPanel({ defaults, profileName, onProfileNameChange }) {
  const [s, setS] = useState({ ...defaults })
  const [nameInput, setNameInput] = useState(profileName ?? '')

  const motionNote = useMemo(
    () => (s.reducedMotion ? 'Animations minimized.' : 'Full premium motion enabled.'),
    [s.reducedMotion],
  )

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Section
        icon={Eye}
        title="Appearance"
        subtitle="Dark mode is the default. Tune density and motion."
      >
        <div className="rounded-2xl border border-app-border/70 bg-app-bg/50 px-5 py-4">
          <p className="text-sm font-semibold text-app-primary">Profile name</p>
          <p className="mt-1 text-xs text-app-muted">This name is shown in the profile menu.</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              maxLength={32}
              placeholder="Enter your name"
              className="min-w-[220px] flex-1 rounded-xl border border-app-border bg-app-card/70 px-3 py-2 text-sm text-app-primary outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="button"
              onClick={() => {
                const cleaned = nameInput.trim().replace(/\s+/g, ' ')
                if (cleaned.length >= 2) onProfileNameChange?.(cleaned)
              }}
              className="rounded-xl border border-app-border bg-app-card/60 px-4 py-2 text-sm font-semibold text-app-primary transition hover:border-white/15 hover:bg-white/[0.06]"
            >
              Save name
            </button>
          </div>
        </div>
        <Toggle
          label="Compact mode"
          description="Tighter spacing for data-heavy sessions."
          value={s.compactMode}
          onChange={(v) => setS((p) => ({ ...p, compactMode: v }))}
        />
        <Toggle
          label="Reduced motion"
          description={motionNote}
          value={s.reducedMotion}
          onChange={(v) => setS((p) => ({ ...p, reducedMotion: v }))}
        />
        <Toggle
          label="Highlight streaks"
          description="Make streaks pop across tables and panels."
          value={s.highlightStreaks}
          onChange={(v) => setS((p) => ({ ...p, highlightStreaks: v }))}
        />
      </Section>

      <Section
        icon={Bell}
        title="Reminders"
        subtitle="Mock preferences for a future notifications system."
      >
        <div className="rounded-2xl border border-app-border/70 bg-app-bg/50 px-5 py-4">
          <p className="text-sm font-semibold text-app-primary">Daily check-in time</p>
          <p className="mt-1 text-xs text-app-muted">When you’ll get a reminder to track habits.</p>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="time"
              value={s.reminderTime}
              onChange={(e) => setS((p) => ({ ...p, reminderTime: e.target.value }))}
              className="rounded-xl border border-app-border bg-app-card/70 px-3 py-2 text-sm text-app-primary outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/20"
            />
            <span className="text-xs text-app-muted">Local time</span>
          </div>
        </div>
        <Toggle
          label="Show weekends"
          description="Include weekends in monthly summaries."
          value={s.showWeekends}
          onChange={(v) => setS((p) => ({ ...p, showWeekends: v }))}
        />
      </Section>

      <Section
        icon={Gauge}
        title="Performance"
        subtitle="Production UX safeguards already included."
      >
        <div className="rounded-2xl border border-app-border/70 bg-app-bg/50 px-5 py-4">
          <p className="text-sm font-semibold text-app-primary">Bundle optimization</p>
          <p className="mt-1 text-xs text-app-muted">
            Charts and side panels are lazy-loaded, and vendor chunks are split.
          </p>
          <p className="mt-3 text-xs text-emerald-300">
            Ready for heavy analytics without blocking first paint.
          </p>
        </div>
      </Section>

      <Section
        icon={ShieldCheck}
        title="Safety"
        subtitle="Defensive UI patterns for a smoother experience."
      >
        <div className="rounded-2xl border border-app-border/70 bg-app-bg/50 px-5 py-4">
          <p className="text-sm font-semibold text-app-primary">Runtime error boundary</p>
          <p className="mt-1 text-xs text-app-muted">
            Prevents full-screen crashes and provides a graceful recovery UI.
          </p>
        </div>
      </Section>

      <div className="glass-panel rounded-2xl p-6 xl:col-span-2">
        <h2 className="font-heading text-lg font-semibold text-app-primary">Data</h2>
        <p className="mt-1 text-sm text-app-muted">
          This app stores habits locally in your browser.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-app-border/70 bg-app-bg/50 p-5">
          <div>
            <p className="text-sm font-semibold text-app-primary">Reset progress to 0</p>
            <p className="mt-1 text-xs text-app-muted">
              Keeps your habits, but clears all checkmarks and streaks.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('habitos:reset-progress'))}
            className="rounded-xl border border-app-border bg-app-card/60 px-4 py-2 text-sm font-semibold text-app-primary transition hover:border-white/15 hover:bg-white/[0.06]"
          >
            Reset progress
          </button>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <div>
            <p className="text-sm font-semibold text-app-primary">Clear everything</p>
            <p className="mt-1 text-xs text-app-muted">
              Deletes all habits and resets the dashboard to a clean slate.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('habitos:clear-all'))}
            className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/15"
          >
            Clear everything
          </button>
        </div>
      </div>
    </div>
  )
}

