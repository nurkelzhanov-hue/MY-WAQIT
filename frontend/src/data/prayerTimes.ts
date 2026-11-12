import { pad2, type Ymd } from '../utils/datetime'

// Prayer times for No'kis, Qaraqalpaqstan, calculated from the sun's position.
// No network is needed and the result is the same offline.
// The parameters below were fitted to the official No'kis table of 13.11.2026
// (Tań 06:25, Pesin 12:45, Ásir 16:00, Sham 17:46, Qúptan 19:02).
// They are only validated for that one day: compare other dates with the official
// table and adjust here if the difference is more than a minute or two.
export const PRAYER_LAT = 42.4602
export const PRAYER_LNG = 59.6156
export const PRAYER_UTC_OFFSET_HOURS = 5 // Asia/Tashkent, no daylight saving

export const PRAYER_PARAMS = {
  fajrAngle: 15.7, // degrees below the horizon
  ishaAngle: 14.8,
  sunsetAngle: 0.833, // standard sunrise/sunset
  asrShadowFactor: 2, // Hanafi
  dhuhrMinutes: -1,
  asrMinutes: -1,
  maghribMinutes: 3,
}

export type PrayerDay = string[] // Fajr, Dhuhr, Asr, Maghrib, Isha as HH:MM

const rad = (d: number) => (d * Math.PI) / 180
const deg = (r: number) => (r * 180) / Math.PI

function dayOfYear(d: Ymd): number {
  const start = Date.UTC(d.year, 0, 0)
  return Math.round((Date.UTC(d.year, d.month - 1, d.day) - start) / 86400000)
}

function fmt(minutes: number): string {
  const total = Math.round(minutes)
  const m = ((total % 1440) + 1440) % 1440
  return `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`
}

// Minutes after solar noon at which the sun reaches the given altitude (degrees).
function hourOffset(declination: number, altitude: number): number {
  const lat = rad(PRAYER_LAT)
  const cos =
    (Math.sin(rad(altitude)) - Math.sin(lat) * Math.sin(declination)) /
    (Math.cos(lat) * Math.cos(declination))
  if (cos < -1 || cos > 1) return NaN
  return deg(Math.acos(cos)) * 4
}

export function calcPrayerDay(day: Ymd): PrayerDay | null {
  const n = dayOfYear(day)
  const g = ((2 * Math.PI) / 365) * (n - 1)
  const eqTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(g) -
      0.032077 * Math.sin(g) -
      0.014615 * Math.cos(2 * g) -
      0.040849 * Math.sin(2 * g))
  const dec =
    0.006918 -
    0.399912 * Math.cos(g) +
    0.070257 * Math.sin(g) -
    0.006758 * Math.cos(2 * g) +
    0.000907 * Math.sin(2 * g) -
    0.002697 * Math.cos(3 * g) +
    0.00148 * Math.sin(3 * g)
  const noon = 720 - 4 * PRAYER_LNG - eqTime + PRAYER_UTC_OFFSET_HOURS * 60

  const p = PRAYER_PARAMS
  const asrAltitude = deg(Math.atan(1 / (p.asrShadowFactor + Math.tan(Math.abs(rad(PRAYER_LAT) - dec)))))
  const fajr = noon - hourOffset(dec, -p.fajrAngle)
  const dhuhr = noon + p.dhuhrMinutes
  const asr = noon + hourOffset(dec, asrAltitude) + p.asrMinutes
  const maghrib = noon + hourOffset(dec, -p.sunsetAngle) + p.maghribMinutes
  const isha = noon + hourOffset(dec, -p.ishaAngle)

  const all = [fajr, dhuhr, asr, maghrib, isha]
  return all.some((x) => Number.isNaN(x)) ? null : all.map(fmt)
}
