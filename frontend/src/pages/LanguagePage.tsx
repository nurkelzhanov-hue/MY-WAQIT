import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { dictionaries, type Lang } from '../i18n'
import { useLang } from '../hooks/useLang'
import './screens.css'

const options: { code: Lang; badge: string; name: string }[] = [
  { code: 'kaa', badge: 'QQ', name: 'Qaraqalpaq tili' },
  { code: 'uz', badge: 'UZ', name: 'Ózbek tili' },
  { code: 'ru', badge: 'RU', name: 'Rus tili' },
]

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
    <div className="screen">
      <h1 className="screen-title">{text.language.title}</h1>
      <div className="lang-list">
        {options.map((o) => (
          <button
            key={o.code}
            className={'lang-option' + (selected === o.code ? ' selected' : '')}
            onClick={() => setSelected(o.code)}
          >
            <span className="lang-badge">{o.badge}</span>
            <span className="lang-name">{o.name}</span>
            {selected === o.code && <Check size={20} />}
          </button>
        ))}
      </div>
      <button className="btn-gold btn-icon" onClick={handleContinue}>
        {text.language.continue}
        <ArrowRight size={18} />
      </button>
    </div>
  )
}
