import { useEffect, useState } from 'react'
import { getZonedNow, type ZonedNow } from '../utils/datetime'

export function useNow(timeZone: string): ZonedNow {
  const [now, setNow] = useState<ZonedNow>(() => getZonedNow(timeZone))

  useEffect(() => {
    const id = setInterval(() => setNow(getZonedNow(timeZone)), 15000)
    return () => clearInterval(id)
  }, [timeZone])

  return now
}
