import { useEffect, useState } from 'react'
import { fetchPrayerDay, loadCachedDay, type PrayerDay } from '../data/prayerTimes'
import { DEFAULT_TIMEZONE } from '../utils/config'
import type { Ymd } from '../utils/datetime'

export type PrayerState = { times: PrayerDay | null; status: 'loading' | 'ready' | 'error' }

export function usePrayerTimes(day: Ymd): PrayerState {
  const { year, month, day: d } = day
  const [state, setState] = useState<PrayerState>(() => {
    const cached = loadCachedDay(day)
    return cached ? { times: cached, status: 'ready' } : { times: null, status: 'loading' }
  })

  useEffect(() => {
    const target = { year, month, day: d }
    const cached = loadCachedDay(target)
    if (cached) {
      setState({ times: cached, status: 'ready' })
      return
    }
    setState({ times: null, status: 'loading' })
    const ctrl = new AbortController()
    fetchPrayerDay(target, DEFAULT_TIMEZONE, ctrl.signal)
      .then((times) => setState({ times, status: 'ready' }))
      .catch((err) => {
        if (!ctrl.signal.aborted) {
          console.warn(err)
          setState({ times: null, status: 'error' })
        }
      })
    return () => ctrl.abort()
  }, [year, month, d])

  return state
}
