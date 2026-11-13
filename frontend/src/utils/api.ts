// Calls to the MY WAQIT backend. Every request is authorised with the Telegram initData.
const TG_KEY = 'waqit_tg_data'

export const API_URL: string = String(import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

type TelegramWindow = Window & { Telegram?: { WebApp?: { initData?: string } } }

export function getInitData(): string | null {
  try {
    const fromSdk = (window as TelegramWindow).Telegram?.WebApp?.initData
    if (fromSdk) return fromSdk
    const hash = window.location.hash.replace(/^#/, '')
    const raw = new URLSearchParams(hash).get('tgWebAppData')
    if (raw) {
      sessionStorage.setItem(TG_KEY, raw)
      return raw
    }
    return sessionStorage.getItem(TG_KEY)
  } catch {
    return null
  }
}

// Sync works only inside Telegram (a verified user exists) and when the API address is set.
export function isSyncAvailable(): boolean {
  return API_URL !== '' && getInitData() !== null
}

export class ApiError extends Error {
  constructor(public status: number) {
    super(`API error ${status}`)
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const initData = getInitData()
  if (!API_URL || !initData) throw new ApiError(0)
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `tma ${initData}`,
      ...(init.headers ?? {}),
    },
  })
  if (!res.ok) throw new ApiError(res.status)
  return (await res.json()) as T
}
