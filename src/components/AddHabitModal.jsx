import { Plus, X } from 'lucide-react'
import { useMemo, useState } from 'react'

function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-app-muted">
        {label}
      </span>
      <input
        {...props}
        className="mt-2 w-full rounded-xl border border-app-border bg-app-card/70 px-3 py-2.5 text-sm text-app-primary outline-none placeholder:text-app-muted/70 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/20"
      />
    </label>
  )
}

function Select({ label, children, ...props }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-app-muted">
        {label}
      </span>
      <select
        {...props}
        className="mt-2 w-full rounded-xl border border-app-border bg-app-card/70 px-3 py-2.5 text-sm text-app-primary outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/20"
      >
        {children}
      </select>
    </label>
  )
}

export default function AddHabitModal({ open, onClose, onCreate }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('daily')
  const [goal, setGoal] = useState('25')

  const cleaned = useMemo(() => name.trim().replace(/\s+/g, ' '), [name])
  const parsedGoal = Number(goal)
  const goalOk = Number.isFinite(parsedGoal) && parsedGoal >= 1 && parsedGoal <= 31
  const nameOk = cleaned.length >= 2 && cleaned.length <= 32
  const canCreate = nameOk && goalOk

  const close = () => {
    onClose?.()
  }

  const create = () => {
    if (!canCreate) return
    onCreate?.({
      name: cleaned,
      type,
      goal: Math.round(parsedGoal),
    })
    setName('')
    setType('daily')
    setGoal('25')
    close()
  }

  if (!open) return null

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        aria-label="Close"
        onClick={close}
      />
      <div className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2">
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg font-semibold text-app-primary">Add habit</h2>
              <p className="mt-1 text-sm text-app-muted">
                Create a new habit and start tracking immediately.
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-app-border bg-app-card/60 text-app-muted transition hover:border-white/15 hover:text-app-primary"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gym"
              autoFocus
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Type" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </Select>
              <Input
                label="Goal (1–31)"
                inputMode="numeric"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="25"
              />
            </div>

            {!nameOk && name.length > 0 && (
              <p className="text-xs text-red-300">Name must be 2–32 characters.</p>
            )}
            {!goalOk && (
              <p className="text-xs text-red-300">Goal must be a number between 1 and 31.</p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={close}
              className="rounded-xl border border-app-border bg-app-card/60 px-4 py-2 text-sm font-semibold text-app-primary transition hover:border-white/15 hover:bg-white/[0.06]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={create}
              disabled={!canCreate}
              className={[
                'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition',
                canCreate
                  ? 'bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-500/30 hover:bg-emerald-500/25'
                  : 'bg-white/[0.04] text-app-muted ring-1 ring-app-border/70',
              ].join(' ')}
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add habit
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

