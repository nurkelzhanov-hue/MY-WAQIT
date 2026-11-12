import { useNavigate } from 'react-router-dom'
import { Landmark } from 'lucide-react'
import { useLang } from '../../hooks/useLang'

// Times are not hardcoded: they will come from a verified API in a later stage.
export default function PrayerCard() {
  const { t } = useLang()
  const navigate = useNavigate()

  return (
    <button className="hp-card hp-prayer" onClick={() => navigate('/prayer')}>
      <div className="hp-prayer-head">
        <Landmark size={30} className="gold" />
        <div>
          <p className="hp-card-title">{t.prayer.title}</p>
          <p className="hp-sub">{t.prayer.location}</p>
        </div>
      </div>
      <div className="hp-prayer-times">
        {t.prayer.names.map((name) => (
          <div key={name} className="hp-prayer-item">
            <span className="hp-prayer-name">{name}</span>
            <span className="hp-prayer-time">--:--</span>
          </div>
        ))}
      </div>
      <img className="hp-prayer-img" src="/img/prayer-card.webp" alt="" />
    </button>
  )
}
