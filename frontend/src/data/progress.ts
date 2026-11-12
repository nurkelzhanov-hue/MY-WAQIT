import { addDays, compareYmd, daysInMonth, fromIso, toIso, weekdayOf, type Ymd } from '../utils/datetime'
import { isDoneOn, occursOn, type Task } from './taskTypes'

const GOAL_KEY = 'waqit_goal_v1'
const MAX_DAYS = 800

export function loadGoal(): number {
  try {
    const n = Number(localStorage.getItem(GOAL_KEY))
    return Number.isInteger(n) && n >= 1 && n <= 20 ? n : 3
  } catch {
    return 3
  }
}

export function saveGoal(n: number): void {
  try {
    localStorage.setItem(GOAL_KEY, String(n))
  } catch {
    // storage unavailable: the goal stays for this session only
  }
}

export type DayCount = { planned: number; done: number }

export type Progress = {
  total: number // planned occurrences up to today that are finished or already missed
  done: number
  missed: number
  rate: number // 0-100
  week: (DayCount & { future: boolean })[] // Monday first
  month: { done: number; missed: number; total: number; rate: number }
  goal: { daysReached: number; daysInMonth: number; percent: number; todayDone: number }
  streak: number
  bestStreak: number
}

function pct(a: number, b: number): number {
  return b === 0 ? 0 : Math.round((a / b) * 100)
}

export function computeProgress(tasks: Task[], today: Ymd, goalPerDay: number): Progress {
  const doneOnDay = new Map<string, number>()
  tasks.forEach((t) => t.doneDates.forEach((d) => doneOnDay.set(d, (doneOnDay.get(d) ?? 0) + 1)))

  const count = (day: Ymd): DayCount => {
    let planned = 0
    let done = 0
    for (const t of tasks) {
      if (occursOn(t, day)) {
        planned += 1
        if (isDoneOn(t, day)) done += 1
      }
    }
    return { planned, done }
  }

  // Overall and monthly totals: today counts only for tasks already done.
  let total = 0
  let done = 0
  let missed = 0
  const earliest = tasks.reduce<Ymd | null>((acc, t) => {
    const d = fromIso(t.date)
    return acc === null || compareYmd(d, acc) < 0 ? d : acc
  }, null)
  const monthStart: Ymd = { year: today.year, month: today.month, day: 1 }
  const m = { done: 0, missed: 0 }
  if (earliest) {
    let cursor = compareYmd(earliest, addDays(today, -MAX_DAYS)) < 0 ? addDays(today, -MAX_DAYS) : earliest
    while (compareYmd(cursor, today) <= 0) {
      const c = count(cursor)
      const isToday = compareYmd(cursor, today) === 0
      const miss = isToday ? 0 : c.planned - c.done
      done += c.done
      missed += miss
      if (compareYmd(cursor, monthStart) >= 0) {
        m.done += c.done
        m.missed += miss
      }
      cursor = addDays(cursor, 1)
    }
    total = done + missed
  }

  const monday = addDays(today, -weekdayOf(today.year, today.month, today.day))
  const week = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(monday, i)
    const future = compareYmd(day, today) > 0
    return { ...(future ? { planned: 0, done: 0 } : count(day)), future }
  })

  const dim = daysInMonth(today.year, today.month)
  let daysReached = 0
  for (let d = 1; d <= dim; d++) {
    if ((doneOnDay.get(toIso({ ...today, day: d })) ?? 0) >= goalPerDay) daysReached += 1
  }

  const days = [...doneOnDay.keys()].sort()
  let best = 0
  let run = 0
  let prev: Ymd | null = null
  for (const iso of days) {
    const d = fromIso(iso)
    run = prev && toIso(addDays(prev, 1)) === iso ? run + 1 : 1
    best = Math.max(best, run)
    prev = d
  }
  let cursor = doneOnDay.has(toIso(today)) ? today : addDays(today, -1)
  let streak = 0
  while (doneOnDay.has(toIso(cursor))) {
    streak += 1
    cursor = addDays(cursor, -1)
  }

  const monthTotal = m.done + m.missed
  return {
    total,
    done,
    missed,
    rate: pct(done, total),
    week,
    month: { done: m.done, missed: m.missed, total: monthTotal, rate: pct(m.done, monthTotal) },
    goal: {
      daysReached,
      daysInMonth: dim,
      percent: pct(daysReached, dim),
      todayDone: doneOnDay.get(toIso(today)) ?? 0,
    },
    streak,
    bestStreak: best,
  }
}
