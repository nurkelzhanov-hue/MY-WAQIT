import { pad2, toIso, type Ymd } from '../utils/datetime'

// No'kis, Qaraqalpaqstan. Times come from the Aladhan API (not hardcoded).
// method=3 is Muslim World League; school=1 is the Hanafi Asr calculation.
// Both must be compared with the local official schedule and adjusted if they differ.
export const PRAYER_LAT = 42.4602
export const PRAYER_LNG = 59.6156
export const PRAYER_METHOD = 3
export const PRAYER_SCHOOL = 1
const CACHE_PREFIX = 'waqit_prayer_v1_'
const KEYS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const

export type PrayerDay = string[] // 5 items: HH:MM

const HHMM = /^(\d{1,2}):(\d{2})/

export function parseTimings(json: unknown): PrayerDay | null {
  const timings = (json as { data?: { timings?: Record<string, unknown> } } | null)?.data?.timings
  if (!timings) return null
  const out: string[] = []
  for (const key of KEYS) {
    const m = typeof timings[key] === 'string' ? HHMM.exec(timings[key] as string) : null
    if (!m) return null
    const h = Number(m[1])
    const min = Number(m[2])
    if (h > 23 || min > 59) return null
    out.push(`${pad2(h)}:${pad2(min)}`)
  }
  return out
}

export function loadCachedDay(day: Ymd): PrayerDay | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + toIso(day))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length === 5 && parsed.every((x) => typeof x === 'string') ? parsed : null
  } catch {
    return null
  }
}

function saveCachedDay(day: Ymd, times: PrayerDay): void {
  try {
    localStorage.setItem(CACHE_PREFIX + toIso(day), JSON.stringify(times))
  } catch {
    // storage unavailable: times stay in memory
  }
}

export async function fetchPrayerDay(day: Ymd, timezone: string, signal?: AbortSignal): Promise<PrayerDay> {
  const date = `${pad2(day.day)}-${pad2(day.month)}-${day.year}`
  const url =
    `https://api.aladhan.com/v1/timings/${date}` +
    `?latitude=${PRAYER_LAT}&longitude=${PRAYER_LNG}` +
    `&method=${PRAYER_METHOD}&school=${PRAYER_SCHOOL}&timezonestring=${encodeURIComponent(timezone)}`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`prayer api ${res.status}`)
  const times = parseTimings(await res.json())
  if (!times) throw new Error('prayer api: unexpected response')
  saveCachedDay(day, times)
  return times
}
