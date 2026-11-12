import { addDays, compareYmd, fromIso, toIso, weekdayOf, type Ymd } from '../utils/datetime'

export type Category = 'personal' | 'work' | 'study' | 'sport' | 'other'
export type Repeat = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'weekdays'

export type Task = {
  id: string
  title: string
  description: string
  date: string // YYYY-MM-DD (first occurrence)
  time: string // HH:MM
  reminderMinutes: number
  repeat: Repeat
  repeatDays: number[] // 0 = Monday ... 6 = Sunday
  category: Category
  location: string
  note: string
  doneDates: string[] // dates (YYYY-MM-DD) on which it was completed
}

const STORAGE_KEY = 'waqit_tasks_v1'

export function occursOn(task: Task, day: Ymd): boolean {
  const start = fromIso(task.date)
  if (compareYmd(day, start) < 0) return false
  switch (task.repeat) {
    case 'none':
      return compareYmd(day, start) === 0
    case 'daily':
      return true
    case 'weekly':
      return weekdayOf(day.year, day.month, day.day) === weekdayOf(start.year, start.month, start.day)
    case 'monthly':
      return day.day === start.day
    case 'yearly':
      return day.day === start.day && day.month === start.month
    case 'weekdays':
      return task.repeatDays.includes(weekdayOf(day.year, day.month, day.day))
  }
}

export function isDoneOn(task: Task, day: Ymd): boolean {
  return task.doneDates.includes(toIso(day))
}

export function weekOf(day: Ymd): Ymd[] {
  const monday = addDays(day, -weekdayOf(day.year, day.month, day.day))
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Task[]) : []
  } catch {
    return []
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // storage unavailable: tasks stay in memory for this session
  }
}

export function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
