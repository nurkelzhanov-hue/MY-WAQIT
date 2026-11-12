import { useMemo } from 'react'
import { calcPrayerDay, type PrayerDay } from '../data/prayerTimes'
import type { Ymd } from '../utils/datetime'

export type PrayerState = { times: PrayerDay | null; status: 'ready' | 'error' }

export function usePrayerTimes(day: Ymd): PrayerState {
  const { year, month, day: d } = day
  return useMemo(() => {
    const times = calcPrayerDay({ year, month, day: d })
    return times ? { times, status: 'ready' } : { times: null, status: 'error' }
  }, [year, month, d])
}
