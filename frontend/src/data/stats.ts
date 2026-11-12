import { addDays, toIso, type Ymd } from '../utils/datetime'
import { isDoneOn, type Task } from './taskTypes'

export type Stats = {
  totalDone: number
  todayRate: number // 0-100
  streak: number
}

export function computeStats(tasks: Task[], today: Ymd, todayTasks: Task[]): Stats {
  const totalDone = tasks.reduce((sum, t) => sum + t.doneDates.length, 0)

  const doneToday = todayTasks.filter((t) => isDoneOn(t, today)).length
  const todayRate = todayTasks.length === 0 ? 0 : Math.round((doneToday / todayTasks.length) * 100)

  const doneDays = new Set<string>()
  tasks.forEach((t) => t.doneDates.forEach((d) => doneDays.add(d)))
  // A streak counts consecutive days with at least one completed task.
  // If nothing is done yet today, the streak is still alive from yesterday.
  let cursor = doneDays.has(toIso(today)) ? today : addDays(today, -1)
  let streak = 0
  while (doneDays.has(toIso(cursor))) {
    streak += 1
    cursor = addDays(cursor, -1)
  }

  return { totalDone, todayRate, streak }
}
