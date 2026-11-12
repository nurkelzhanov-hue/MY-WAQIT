import { useEffect, useState, type ReactNode } from 'react'
import { clearLang, dictionaries, loadLang, saveLang, type Lang } from './index'
import { LanguageContext } from './LanguageContext'

type Props = { children: ReactNode }

export default function LanguageProvider({ children }: Props) {
  const [lang, setLangState] = useState<Lang | null>(() => loadLang())

  useEffect(() => {
    document.documentElement.lang = lang ?? 'kaa'
  }, [lang])

  const setLang = (next: Lang) => {
    saveLang(next)
    setLangState(next)
  }

  const resetLang = () => {
    clearLang()
    setLangState(null)
  }

  const t = dictionaries[lang ?? 'kaa']

  return (
    <LanguageContext.Provider value={{ lang, t, setLang, resetLang }}>
      {children}
    </LanguageContext.Provider>
  )
}
