import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { dictionaries, LANGUAGE_NAMES, type Lang } from '../i18n'
import { useLang } from '../hooks/useLang'
import Flag from '../components/art/Flag'
import './screens.css'

const CODES: Lang[] = ['kaa', 'uz', 'ru']

export default function LanguagePage() {
  const { lang, setLang } = useLang()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Lang>(lang ?? 'kaa')
  const text = dictionaries[selected]

  const handleContinue = () => {
    setLang(selected)
    navigate('/', { replace: true })
  }

  return (
    <div className="welcome language">
      <div className="stars" />
      <div className="language-top">
        <img className="lang-icon" src="/img/lang-icon.webp" alt="" />
        <h1 className="screen-title">{text.language.title}</h1>
      </div>

      <div className="lang-list">
        {CODES.map((code) => (
          <button
            key={code}
            className={'lang-option' + (selected === code ? ' selected' : '')}
            onClick={() => setSelected(code)}
          >
            <span className="lang-flag">
              <Flag code={code} />
            </span>
            <span className="lang-name">{LANGUAGE_NAMES[code]}</span>
            {selected === code && (
              <span className="lang-check">
                <Check size={20} strokeWidth={3} />
              </span>
            )}
          </button>
        ))}
      </div>

      <img className="skyline skyline-lang" src="/img/lang-skyline.webp" alt="" />

      <div className="screen-footer">
        <button className="btn-gold btn-icon" onClick={handleContinue}>
          {text.language.continue}
          <ArrowRight size={22} />
        </button>
      </div>
    </div>
  )
}
