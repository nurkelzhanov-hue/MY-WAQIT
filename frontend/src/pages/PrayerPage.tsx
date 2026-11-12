import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Landmark,
  MapPin,
  Moon,
  Settings,
  Sun,
  SunMedium,
  Sunrise,
  Sunset,
} from 'lucide-react'
import { useLang } from '../hooks/useLang'
import Switch from '../components/ui/Switch'
import './prayer.css'

const ICONS = [Sunrise, Sun, SunMedium, Sunset, Moon]

// Prayer times are not hardcoded: they will come from a verified API in a later stage.
const times: (string | null)[] = [null, null, null, null, null]

export default function PrayerPage() {
  const { t } = useLang()
  const navigate = useNavigate()
  const [remindersOn, setRemindersOn] = useState(true)

  return (
    <section className="prayer-page">
      <header className="prayer-header">
        <span className="prayer-header-icon">
          <Landmark size={20} />
        </span>
        <h1 className="prayer-title">{t.prayer.title}</h1>
      </header>

      <div className="location-row">
        <MapPin size={18} />
        <span className="location-name">{t.prayer.location}</span>
      </div>

      <div className="prayer-list">
        {t.prayer.names.map((name, index) => {
          const Icon = ICONS[index]
          return (
            <div key={name} className="prayer-row">
              <span className="prayer-icon">
                <Icon size={20} />
              </span>
              <span className="prayer-name">{name}</span>
              <span className="prayer-time">{times[index] ?? '--:--'}</span>
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
