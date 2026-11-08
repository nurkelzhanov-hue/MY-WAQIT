import { createContext } from 'react'
import type { Lang } from './index'
import type { Strings } from './types'

export type LanguageContextValue = {
  lang: Lang | null
  t: Strings
  setLang: (lang: Lang) => void
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)
