/** @typedef {{ name: string; type: string; goal: number; streak: number; days: number[] }} Habit */

const days31 = (pattern) => pattern.split('').map((c) => (c === '1' ? 1 : 0))

/** @type {Habit[]} */
export const initialHabits = [
  {
    name: 'Gym',
    type: 'daily',
    goal: 25,
    streak: 5,
    days: days31('1110111011101110111011101110111'),
  },
  {
    name: 'Deep Work',
    type: 'daily',
    goal: 22,
    streak: 12,
    days: days31('1111110111111011111101111110111'),
  },
  {
    name: 'Read 30m',
    type: 'daily',
    goal: 28,
    streak: 4,
    days: days31('1011101110111011101110111011101'),
  },
  {
    name: 'Meditation',
    type: 'daily',
    goal: 30,
    streak: 18,
    days: days31('1111111111111111111111111111111'),
  },
  {
    name: 'Sleep 7h+',
    type: 'daily',
    goal: 26,
    streak: 2,
    days: days31('1101110110111011101101110110111'),
  },
  {
    name: 'Hydration',
    type: 'daily',
    goal: 31,
    streak: 9,
    days: days31('1111011110111101111011110111101'),
  },
  {
    name: 'Journal',
    type: 'daily',
    goal: 20,
    streak: 3,
    days: days31('1010101110101010111010101110101'),
  },
  {
    name: 'Walk 8k steps',
    type: 'daily',
    goal: 24,
    streak: 6,
    days: days31('1101111011011110110111101101111'),
  },
]

export const kpiData = {
  momentum: { value: 84, trend: 3.2, label: 'Momentum' },
  daily: { value: 72, trend: -1.1, label: 'Daily Progress' },
  weekly: { value: 78, trend: 2.4, label: 'Weekly Progress' },
  monthly: { value: 81, trend: 0.8, label: 'Monthly Progress' },
}

/** Daily aggregate % for line chart (mock trend) */
export const dailyProgressTrend = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  progress: Math.min(
    100,
    Math.round(52 + i * 1.1 + (i % 5) * 3 + (i % 7) * 2),
  ),
}))

export const weeklyPerformance = [
  { week: 'Week 1', score: 74 },
  { week: 'Week 2', score: 81 },
  { week: 'Week 3', score: 69 },
  { week: 'Week 4', score: 88 },
]

export const progressDistribution = [
  { name: 'On track (80%+)', value: 4, fill: '#22c55e' },
  { name: 'Solid (60–79%)', value: 2, fill: '#eab308' },
  { name: 'Needs focus (40–59%)', value: 1, fill: '#f97316' },
  { name: 'At risk (<40%)', value: 1, fill: '#ef4444' },
]

/** GitHub-style heat: weeks as columns, 7 rows — values 0–4 intensity */
export const heatmapWeeks = 18
export const heatmapGrid = Array.from({ length: 7 }, (_, row) =>
  Array.from({ length: heatmapWeeks }, (_, col) => {
    const v = (row + col * 2 + (row * col) % 5) % 5
    return v
  }),
)

export const activitySummary = {
  activeDays: 26,
  bestDay: 'Tuesday',
  avgCompletion: 76,
  focusBlocks: 42,
}

export const plannerWeeks = [
  {
    title: 'This week',
    items: [
      { id: 'p1', label: 'Schedule 3 gym sessions', tag: 'Health', done: true },
      { id: 'p2', label: 'Plan 4 deep-work blocks', tag: 'Career', done: false },
      { id: 'p3', label: 'Prep Sunday grocery list', tag: 'Life', done: true },
      { id: 'p4', label: 'Read 120 pages', tag: 'Learning', done: false },
    ],
  },
  {
    title: 'Next week',
    items: [
      { id: 'p5', label: 'Increase steps target to 9k', tag: 'Health', done: false },
      { id: 'p6', label: 'Ship one portfolio polish', tag: 'Career', done: false },
      { id: 'p7', label: 'Add bedtime wind-down routine', tag: 'Sleep', done: false },
    ],
  },
]

export const settingsDefaults = {
  compactMode: false,
  reducedMotion: false,
  showWeekends: true,
  highlightStreaks: true,
  reminderTime: '08:30',
}

/** Monthly totals for annual view */
export const yearlyMonthly = [
  { month: 'Jan', completed: 186, goal: 220 },
  { month: 'Feb', completed: 172, goal: 200 },
  { month: 'Mar', completed: 198, goal: 220 },
  { month: 'Apr', completed: 164, goal: 210 },
  { month: 'May', completed: 201, goal: 220 },
  { month: 'Jun', completed: 189, goal: 210 },
  { month: 'Jul', completed: 205, goal: 220 },
  { month: 'Aug', completed: 192, goal: 220 },
  { month: 'Sep', completed: 178, goal: 210 },
  { month: 'Oct', completed: 196, goal: 220 },
  { month: 'Nov', completed: 184, goal: 210 },
  { month: 'Dec', completed: 142, goal: 180 },
]

export const topHabitsYear = [
  { name: 'Meditation', pct: 94 },
  { name: 'Hydration', pct: 91 },
  { name: 'Deep Work', pct: 88 },
  { name: 'Gym', pct: 82 },
  { name: 'Read 30m', pct: 79 },
]
