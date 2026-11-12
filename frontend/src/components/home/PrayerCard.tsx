import { useNavigate } from 'react-router-dom'
import { Landmark } from 'lucide-react'
import { useLang } from '../../hooks/useLang'
import { asset } from '../../utils/assets'
import { useNow } from '../../hooks/useNow'
import { usePrayerTimes } from '../../hooks/usePrayerTimes'
import { DEFAULT_TIMEZONE } from '../../utils/config'

// Times come from the Aladhan API (see data/prayerTimes.ts).
export default function PrayerCard() {
  const { t } = useLang()
  const navigate = useNavigate()
  const now = useNow(DEFAULT_TIMEZONE)
  const { times } = usePrayerTimes({ year: now.year, month: now.month, day: now.day })

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
        {t.prayer.names.map((name, i) => (
          <div key={name} className="hp-prayer-item">
            <span className="hp-prayer-name">{name}</span>
            <span className="hp-prayer-time">{times?.[i] ?? '--:--'}</span>
          </div>
        ))}
      </div>
      <img className="hp-prayer-img" src={asset('img/prayer-card.webp')} alt="" />
    </button>
  )
}
