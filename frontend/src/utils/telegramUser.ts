// Reads the Telegram user (display only) from the launch parameters Telegram puts into the URL hash.
// It is captured once at load time because routing can remove the hash later.
// NOTE: this data is not verified here. Server-side validation of initData is added with the backend.

export type TelegramUser = {
  firstName: string
  lastName: string
  username: string
}

function readOnce(): TelegramUser | null {
  try {
    const hash = window.location.hash.replace(/^#/, '')
    const raw = new URLSearchParams(hash).get('tgWebAppData')
    if (raw) {
      sessionStorage.setItem('waqit_tg_data', raw)
    }
    const data = raw ?? sessionStorage.getItem('waqit_tg_data')
    if (!data) return null
    const userJson = new URLSearchParams(data).get('user')
    if (!userJson) return null
    const u = JSON.parse(userJson)
    return {
      firstName: String(u.first_name ?? ''),
      lastName: String(u.last_name ?? ''),
      username: String(u.username ?? ''),
    }
  } catch {
    return null
  }
}

const cached = readOnce()

export function getTelegramUser(): TelegramUser | null {
  return cached
}
