import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Globe, LogOut, MapPin, Settings, Trash2, User } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import { LANGUAGE_NAMES } from '../i18n'
import { DEFAULT_TIMEZONE } from '../utils/config'
import ProfileRow from '../components/profile/ProfileRow'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import './profile.css'

export default function ProfilePage() {
  const { t, lang, resetLang } = useLang()
  const navigate = useNavigate()
  const [showDelete, setShowDelete] = useState(false)

  const locationShort = t.prayer.location.split(',')[0]

  // For now this clears only what is stored in this browser (the chosen language).
  // Deleting server-side data is connected together with the database.
  const handleDelete = () => {
    setShowDelete(false)
    resetLang()
    navigate('/welcome', { replace: true })
  }

  return (
    <section className="profile-page">
      <div className="user-card">
        <span className="user-avatar">
          <User size={30} />
        </span>
        <div className="user-info">
          <p className="user-name">{t.profile.guestName}</p>
          <p className="user-username">@username</p>
        </div>
      </div>

      <div className="profile-list">
        <ProfileRow icon={<User size={18} />} label={t.profile.personalInfo} />
        <ProfileRow
          icon={<Settings size={18} />}
          label={t.profile.settings}
          onClick={() => navigate('/reminders')}
        />
        <ProfileRow
          icon={<Globe size={18} />}
          label={t.profile.language}
          value={lang ? LANGUAGE_NAMES[lang] : ''}
          onClick={() => navigate('/language')}
        />
        <ProfileRow icon={<MapPin size={18} />} label={t.profile.location} value={locationShort} />
        <ProfileRow icon={<Clock size={18} />} label={t.profile.timezone} value={DEFAULT_TIMEZONE} />
        <ProfileRow
          icon={<Trash2 size={18} />}
          label={t.profile.deleteData}
          onClick={() => setShowDelete(true)}
        />
        <ProfileRow
          icon={<LogOut size={18} />}
          label={t.profile.logout}
          danger
          showChevron={false}
          onClick={() => navigate('/welcome')}
        />
      </div>

      {showDelete && (
        <ConfirmDialog
          text={t.profile.deleteQuestion}
          confirmLabel={t.profile.deleteConfirm}
          cancelLabel={t.profile.cancel}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </section>
  )
}
