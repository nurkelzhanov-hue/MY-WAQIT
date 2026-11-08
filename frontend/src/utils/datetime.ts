const WEEKDAY_INDEX: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
}

export type Ymd = {
  year: number
  month: number // 1-12
  day: number
}

export type ZonedNow = Ymd & {
  weekday: number // 0 = Monday ... 6 = Sunday
  hour: number
  minute: number
}

export function getZonedNow(timeZone: string, date: Date = new Date()): ZonedNow {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date)

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''

  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    weekday: WEEKDAY_INDEX[get('weekday')] ?? 0,
    hour: Number(get('hour')),
    minute: Number(get('minute')),
  }
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

// Calendar helpers (pure date arithmetic, independent of the viewer's timezone)

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

// 0 = Monday ... 6 = Sunday
export function weekdayOf(year: number, month: number, day: number): number {
  return (new Date(Date.UTC(year, month - 1, day)).getUTCDay() + 6) % 7
}

export function sameDay(a: Ymd, b: Ymd): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day
}
