import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  MapPin,
  Moon,
  Settings,
  Sun,
  SunMedium,
  Sunrise,
  Sunset,
} from 'lucide-react'
import { useLang } from '../hooks/useLang'
import { useNow } from '../hooks/useNow'
import { DEFAULT_TIMEZONE } from '../utils/config'
import AppHeader from '../components/AppHeader'
import Switch from '../components/ui/Switch'
import './prayer.css'

const ICONS = [Sunrise, Sun, SunMedium, Sunset, Moon]

// Prayer times are not hardcoded: they will come from a verified API in a later stage.
const times: (string | null)[] = [null, null, null, null, null]

export default function PrayerPage() {
  const { t } = useLang()
  const navigate = useNavigate()
  const now = useNow(DEFAULT_TIMEZONE)
  const [remindersOn, setRemindersOn] = useState(true)
  const [rowOn, setRowOn] = useState<boolean[]>([true, true, true, true, true])
  const dateText = `${now.day} ${t.monthsTitle[now.month - 1]} ${now.year}, ${t.weekdays[now.weekday]}`

  return (
    <section className="prayer-page">
      <AppHeader subtitle={t.prayer.title} left="back" onLeft={() => navigate(-1)} />

      <div className="prayer-hero">
        <img src="/img/prayer-mosque.webp" alt="" />
        <span className="prayer-loc">
          <MapPin size={18} />
          {t.prayer.location}
        </span>
      </div>

      <p className="prayer-date">{dateText}</p>

      <div className="prayer-list">
        {t.prayer.names.map((name, index) => {
          const Icon = ICONS[index]
          return (
            <div key={name} className={'prayer-row' + (index === 0 ? ' first' : '')}>
              <span className="prayer-icon">
                <Icon size={20} />
              </span>
              <span className="prayer-name">{name}</span>
              <span className="prayer-time">{times[index] ?? '--:--'}</span>
              <Switch
                on={rowOn[index]}
                onToggle={() => setRowOn((prev) => prev.map((v, i) => (i === index ? !v : v)))}
                label={name}
              />
            </div>
          )
        })}
      </div>

      <p className="muted prayer-note">{t.prayer.pendingNote}</p>

      <div className="prayer-settings">
        <div className="settings-row">
          <span className="settings-label">{t.prayer.remindersLabel}</span>
          <Switch
            on={remindersOn}
            onToggle={() => setRemindersOn((v) => !v)}
            label={t.prayer.remindersLabel}
          />
        </div>
        <button className="settings-row settings-link" onClick={() => navigate('/profile')}>
          <Settings size={18} />
          <span className="settings-label">{t.prayer.settings}</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  )
}
