import {
  Bell,
  ChevronRight,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings2,
  SlidersHorizontal,
  User,
} from 'lucide-react'
import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  initialHabits,
  plannerWeeks,
  settingsDefaults,
  yearlyMonthly,
  topHabitsYear,
} from '../data/mockData'
import { habitPercent, tierFromPercent } from '../utils/progress'
import { clearAppState, loadAppState, saveAppState } from '../utils/storage'
import AddHabitModal from './AddHabitModal'
import HabitTable from './HabitTable'
import KPIcards from './KPIcards'
import Sidebar from './Sidebar'
import WeeklyHabits from './WeeklyHabits'

const AnnualDashboard = lazy(() => import('./AnnualDashboard'))
const Charts = lazy(() => import('./Charts'))
const HeatmapGrid = lazy(() => import('./HeatmapGrid'))
const MonthView = lazy(() => import('./MonthView'))
const Planner = lazy(() => import('./Planner'))
const SidePanels = lazy(() => import('./SidePanels'))
const SettingsPanel = lazy(() => import('./SettingsPanel'))

const monthsFull = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function distributionFromHabits(habits) {
  const counts = { green: 0, yellow: 0, orange: 0, red: 0 }
  habits.forEach((h) => {
    const completed = h.days.reduce((a, b) => a + b, 0)
    const pct = habitPercent(completed, h.goal)
    counts[tierFromPercent(pct)] += 1
  })
  return [
    { name: 'On track (80%+)', value: counts.green, fill: '#22c55e' },
    { name: 'Solid (60–79%)', value: counts.yellow, fill: '#eab308' },
    { name: 'Needs focus (40–59%)', value: counts.orange, fill: '#f97316' },
    { name: 'At risk (<40%)', value: counts.red, fill: '#ef4444' },
  ]
}

function cloneHabits(h) {
  return h.map((x) => ({ ...x, days: [...x.days] }))
}

function newHabit({ name, type, goal }) {
  return {
    name,
    type,
    goal,
    streak: 0,
    days: Array.from({ length: 31 }, () => 0),
  }
}

function resetHabitProgress(h) {
  return { ...h, streak: 0, days: Array.from({ length: 31 }, () => 0) }
}

function calcDailyPercent(habits, dayIndex) {
  if (!habits.length) return 0
  const done = habits.reduce((acc, h) => acc + (h.days[dayIndex] ? 1 : 0), 0)
  return Math.round((done / habits.length) * 100)
}

function Placeholder({ title, subtitle }) {
  return (
    <div className="glass-panel flex min-h-[420px] flex-col items-center justify-center rounded-2xl p-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/15 ring-1 ring-white/10">
        <SlidersHorizontal className="h-7 w-7 text-sky-300" aria-hidden />
      </div>
      <h2 className="font-heading text-2xl font-semibold text-app-primary">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-app-muted">{subtitle}</p>
    </div>
  )
}

function LoadingPanel() {
  return (
    <div className="glass-panel rounded-2xl p-8">
      <div className="h-5 w-48 animate-pulse rounded bg-white/10" />
      <div className="mt-3 h-4 w-72 animate-pulse rounded bg-white/5" />
      <div className="mt-8 h-48 animate-pulse rounded-xl bg-white/[0.04]" />
    </div>
  )
}

export default function Dashboard() {
  const stored = loadAppState()
  const [active, setActive] = useState('dashboard')
  const [habits, setHabits] = useState(() => {
    if (stored?.habits && Array.isArray(stored.habits)) return cloneHabits(stored.habits)
    // Default: keep the demo habit list, but start at 0 progress.
    return cloneHabits(initialHabits).map(resetHabitProgress)
  })
  const [profileName, setProfileName] = useState(() => {
    if (typeof stored?.profileName === 'string' && stored.profileName.trim().length >= 2) {
      return stored.profileName.trim()
    }
    return 'Sanja'
  })
  const [mobileNav, setMobileNav] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const notifRef = useRef(null)
  const profileRef = useRef(null)

  const onToggleDay = useCallback((habitIndex, dayIndex) => {
    setHabits((prev) => {
      const next = cloneHabits(prev)
      const row = next[habitIndex]
      row.days[dayIndex] = row.days[dayIndex] ? 0 : 1
      return next
    })
  }, [])

  const onAddHabit = useCallback(({ name, type, goal }) => {
    setHabits((prev) => {
      const next = cloneHabits(prev)
      const exists = next.some((h) => h.name.toLowerCase() === name.toLowerCase())
      const finalName = exists ? `${name} ${next.length + 1}` : name
      next.push(newHabit({ name: finalName, type, goal }))
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    clearAppState()
    setHabits([])
    setActive('dashboard')
  }, [])

  const resetProgress = useCallback(() => {
    setHabits((prev) => cloneHabits(prev).map(resetHabitProgress))
    setActive('dashboard')
  }, [])

  useEffect(() => {
    saveAppState({ habits, profileName })
  }, [habits, profileName])

  useEffect(() => {
    const openAdd = () => setAddOpen(true)
    const clear = () => clearAll()
    const reset = () => resetProgress()
    window.addEventListener('habitos:add-habit', openAdd)
    window.addEventListener('habitos:clear-all', clear)
    window.addEventListener('habitos:reset-progress', reset)
    return () => {
      window.removeEventListener('habitos:add-habit', openAdd)
      window.removeEventListener('habitos:clear-all', clear)
      window.removeEventListener('habitos:reset-progress', reset)
    }
  }, [clearAll, resetProgress])

  useEffect(() => {
    const onOutsideClick = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', onOutsideClick)
    return () => document.removeEventListener('mousedown', onOutsideClick)
  }, [])

  const pieData = useMemo(() => {
    return distributionFromHabits(habits)
  }, [habits])

  const dashboardMetrics = useMemo(() => {
    const habitCount = habits.length
    if (!habitCount) {
      const zeroTrend = { value: 0, trend: 0 }
      return {
        kpi: {
          momentum: { ...zeroTrend, label: 'Momentum' },
          daily: { ...zeroTrend, label: 'Daily Progress' },
          weekly: { ...zeroTrend, label: 'Weekly Progress' },
          monthly: { ...zeroTrend, label: 'Monthly Progress' },
        },
        dailyTrend: Array.from({ length: 31 }, (_, i) => ({ day: i + 1, progress: 0 })),
        weeklyBars: Array.from({ length: 4 }, (_, i) => ({
          week: `Week ${i + 1}`,
          score: 0,
        })),
        heatGrid: Array.from({ length: 7 }, () => Array.from({ length: 18 }, () => 0)),
        activity: {
          activeDays: 0,
          bestDay: '-',
          avgCompletion: 0,
          focusBlocks: 0,
        },
      }
    }

    const totalGoal = habits.reduce((acc, h) => acc + h.goal, 0)
    const totalDone = habits.reduce(
      (acc, h) => acc + h.days.reduce((sum, d) => sum + d, 0),
      0,
    )

    const dailyNow = calcDailyPercent(habits, 30)
    const dailyPrev = calcDailyPercent(habits, 29)
    const weeklyNow = Math.round(
      [24, 25, 26, 27, 28, 29, 30].reduce((acc, idx) => acc + calcDailyPercent(habits, idx), 0) / 7,
    )
    const weeklyPrev = Math.round(
      [17, 18, 19, 20, 21, 22, 23].reduce((acc, idx) => acc + calcDailyPercent(habits, idx), 0) / 7,
    )
    const monthly = habitPercent(totalDone, totalGoal || 1)

    const dailyTrend = Array.from({ length: 31 }, (_, i) => ({
      day: i + 1,
      progress: calcDailyPercent(habits, i),
    }))

    const weeklyRanges = [
      [0, 6],
      [7, 13],
      [14, 20],
      [21, 27],
    ]
    const weeklyBars = weeklyRanges.map(([start, end], i) => {
      let sum = 0
      let count = 0
      for (let day = start; day <= end; day += 1) {
        sum += calcDailyPercent(habits, day)
        count += 1
      }
      return { week: `Week ${i + 1}`, score: count ? Math.round(sum / count) : 0 }
    })

    const dayTotals = Array.from({ length: 31 }, (_, i) =>
      habits.reduce((acc, h) => acc + (h.days[i] ? 1 : 0), 0),
    )
    const activeDays = dayTotals.filter((n) => n > 0).length
    const bestDayIndex = dayTotals.reduce(
      (best, cur, idx) => (cur > dayTotals[best] ? idx : best),
      0,
    )
    const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    const heatGrid = Array.from({ length: 7 }, (_, row) =>
      Array.from({ length: 18 }, (_, col) => {
        const dayIdx = col * 2 + row - 5
        if (dayIdx < 0 || dayIdx >= 31) return 0
        const pct = calcDailyPercent(habits, dayIdx)
        if (pct === 0) return 0
        if (pct < 25) return 1
        if (pct < 50) return 2
        if (pct < 80) return 3
        return 4
      }),
    )

    return {
      kpi: {
        momentum: { value: monthly, trend: monthly - weeklyPrev, label: 'Momentum' },
        daily: { value: dailyNow, trend: dailyNow - dailyPrev, label: 'Daily Progress' },
        weekly: { value: weeklyNow, trend: weeklyNow - weeklyPrev, label: 'Weekly Progress' },
        monthly: { value: monthly, trend: monthly - weeklyNow, label: 'Monthly Progress' },
      },
      dailyTrend,
      weeklyBars,
      heatGrid,
      activity: {
        activeDays,
        bestDay: names[bestDayIndex % 7],
        avgCompletion: monthly,
        focusBlocks: Math.round(totalDone / 2),
      },
    }
  }, [habits])

  const monthIndex = active.startsWith('month-') ? Number(active.replace('month-', '')) : null
  const monthLabel =
    monthIndex != null && !Number.isNaN(monthIndex) ? monthsFull[monthIndex] : null

  const titleForRoute = () => {
    if (active === 'dashboard') return 'Dashboard'
    if (active === 'planner') return 'Planner'
    if (active === 'annual') return 'Annual report'
    if (active === 'settings') return 'Settings'
    if (monthLabel) return monthLabel
    return 'Dashboard'
  }

  return (
    <div className="flex min-h-screen bg-app-bg">
      <AddHabitModal open={addOpen} onClose={() => setAddOpen(false)} onCreate={onAddHabit} />
      <Sidebar
        active={active}
        onNavigate={setActive}
        mobileOpen={mobileNav}
        onCloseMobile={() => setMobileNav(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <header className="sticky top-0 z-30 border-b border-app-border/80 bg-app-bg/80 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-app-border bg-app-card/60 text-app-primary lg:hidden"
              onClick={() => setMobileNav(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-app-muted">
                Overview
              </p>
              <h1 className="font-heading truncate text-xl font-semibold tracking-tight text-app-primary sm:text-2xl">
                {titleForRoute()}
              </h1>
            </div>

            <div className="hidden max-w-md flex-1 px-4 md:block lg:max-w-lg">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
                <input
                  type="search"
                  placeholder="Search habits, tags, or insights…"
                  className="w-full rounded-xl border border-app-border bg-app-card/70 py-2.5 pl-10 pr-3 text-sm text-app-primary outline-none ring-emerald-500/0 transition placeholder:text-app-muted/70 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/20"
                />
              </label>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="hidden items-center gap-2 rounded-xl border border-app-border bg-app-card/60 px-3 py-2 text-sm font-semibold text-app-primary transition hover:border-white/15 hover:bg-white/[0.06] md:inline-flex"
              >
                <Plus className="h-4 w-4 text-emerald-300" aria-hidden />
                Add habit
              </button>
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications((v) => !v)
                    setShowProfileMenu(false)
                  }}
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-app-border bg-app-card/60 text-app-muted transition hover:border-white/15 hover:text-app-primary"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-app-card" />
                </button>
                {showNotifications && (
                  <div className="glass-panel absolute right-0 top-12 z-40 w-[320px] rounded-2xl p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-heading text-sm font-semibold text-app-primary">
                        Notifications
                      </h3>
                      <button
                        type="button"
                        className="text-xs font-semibold text-emerald-300"
                        onClick={() => setShowNotifications(false)}
                      >
                        Mark all read
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {[
                        'Gym habit dropped below target yesterday',
                        'Weekly progress climbed by 6%',
                        'Reminder: log your evening habits',
                      ].map((item) => (
                        <li
                          key={item}
                          className="rounded-xl border border-app-border/70 bg-app-bg/50 px-3 py-2 text-xs text-app-primary"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu((v) => !v)
                    setShowNotifications(false)
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-app-border bg-gradient-to-br from-emerald-500/25 to-sky-500/20 text-app-primary ring-1 ring-white/10 transition hover:ring-emerald-400/30"
                  aria-label="Profile"
                >
                  <User className="h-5 w-5" />
                </button>
                {showProfileMenu && (
                  <div className="glass-panel absolute right-0 top-12 z-40 w-[260px] rounded-2xl p-3">
                    <div className="mb-2 rounded-xl border border-app-border/70 bg-app-bg/50 p-3">
                      <p className="text-sm font-semibold text-app-primary">{profileName}</p>
                      <p className="text-xs text-app-muted">Pro plan · habitos.app</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActive('settings')
                        setShowProfileMenu(false)
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-app-primary transition hover:bg-white/[0.06]"
                    >
                      Account settings
                      <Settings2 className="h-4 w-4 text-app-muted" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new Event('habitos:reset-progress'))
                        setShowProfileMenu(false)
                      }}
                      className="mt-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-app-primary transition hover:bg-white/[0.06]"
                    >
                      Reset progress
                      <ChevronRight className="h-4 w-4 text-app-muted" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new Event('habitos:clear-all'))
                        setShowProfileMenu(false)
                      }}
                      className="mt-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-red-200 transition hover:bg-red-500/10"
                    >
                      Clear all data
                      <LogOut className="h-4 w-4 text-red-300" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-app-border/60 px-4 pb-3 md:hidden">
            <label className="relative mt-1 block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
              <input
                type="search"
                placeholder="Search…"
                className="w-full rounded-xl border border-app-border bg-app-card/70 py-2.5 pl-10 pr-3 text-sm text-app-primary outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/20"
              />
            </label>
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-app-border bg-app-card/60 px-3 py-2 text-sm font-semibold text-app-primary transition hover:border-white/15 hover:bg-white/[0.06]"
            >
              <Plus className="h-4 w-4 text-emerald-300" aria-hidden />
              Add habit
            </button>
          </div>
        </header>

        <main className="flex-1 space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          {active === 'dashboard' && (
            <>
              <KPIcards data={dashboardMetrics.kpi} />
              <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
                <div className="space-y-6 min-w-0">
                  <HabitTable habits={habits} onToggleDay={onToggleDay} />
                  <WeeklyHabits habits={habits} />
                  <Suspense fallback={<LoadingPanel />}>
                    <Charts
                      dailyTrend={dashboardMetrics.dailyTrend}
                      weeklyBars={dashboardMetrics.weeklyBars}
                      pieData={pieData}
                    />
                  </Suspense>
                  <Suspense fallback={<LoadingPanel />}>
                    <HeatmapGrid grid={dashboardMetrics.heatGrid} />
                  </Suspense>
                </div>
                <Suspense fallback={<LoadingPanel />}>
                  <SidePanels habits={habits} activity={dashboardMetrics.activity} />
                </Suspense>
              </div>
            </>
          )}

          {active === 'annual' && (
            <Suspense fallback={<LoadingPanel />}>
              <AnnualDashboard yearlyMonthly={yearlyMonthly} topHabitsYear={topHabitsYear} />
            </Suspense>
          )}

          {active === 'planner' && (
            <Suspense fallback={<LoadingPanel />}>
              <Planner plannerWeeks={plannerWeeks} />
            </Suspense>
          )}

          {active === 'settings' && (
            <Suspense fallback={<LoadingPanel />}>
              <SettingsPanel
                defaults={settingsDefaults}
                profileName={profileName}
                onProfileNameChange={setProfileName}
              />
            </Suspense>
          )}

          {monthLabel && (
            <Suspense fallback={<LoadingPanel />}>
              <MonthView monthLabel={monthLabel} habits={habits} />
            </Suspense>
          )}
        </main>
      </div>
    </div>
  )
}
