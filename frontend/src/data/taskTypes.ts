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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUuid(value: string): boolean {
  return UUID_RE.test(value)
}

// Task ids are UUIDs so that the same task has the same id on this device and on the server.
export function makeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}
