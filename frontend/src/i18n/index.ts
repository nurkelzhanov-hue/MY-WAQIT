import { kaa } from './kaa'
import { uz } from './uz'
import { ru } from './ru'
import type { Strings } from './types'

export type Lang = 'kaa' | 'uz' | 'ru'

export const dictionaries: Record<Lang, Strings> = { kaa, uz, ru }

const STORAGE_KEY = 'waqit_lang'

export function loadLang(): Lang | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'kaa' || value === 'uz' || value === 'ru' ? value : null
  } catch {
    return null
  }
}

export function saveLang(lang: Lang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // storage may be unavailable; the choice then lasts until reload
  }
}
