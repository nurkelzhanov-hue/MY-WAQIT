import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CalendarCheck, ChevronRight, Crown, Flame, Globe, LogOut, Target, Trash2, User } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import { useNow } from '../hooks/useNow'
import { useTasks } from '../hooks/useTasks'
import { LANGUAGE_NAMES } from '../i18n'
import { DEFAULT_TIMEZONE } from '../utils/config'
import { getTelegramUser } from '../utils/telegramUser'
import { computeStats } from '../data/stats'
import { loadDemoSub } from '../data/subscription'
import AppHeader from '../components/AppHeader'
import ProfileRow from '../components/profile/ProfileRow'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import './profile.css'
import './profile-new.css'
import { asset } from '../utils/assets'

export default function ProfilePage() {
  const { t, lang, resetLang } = useLang()
  const navigate = useNavigate()
  const now = useNow(DEFAULT_TIMEZONE)
  const { tasks, tasksOn } = useTasks()
  const [showDelete, setShowDelete] = useState(false)

  const today = { year: now.year, month: now.month, day: now.day }
  const stats = computeStats(tasks, today, tasksOn(today))
  const isPro = loadDemoSub() !== null
  const tg = getTelegramUser()
  const displayName = tg ? [tg.firstName, tg.lastName].filter(Boolean).join(' ') || t.profile.guestName : t.profile.guestName

  // For now this clears only what is stored in this browser (language and tasks).
  // Deleting server-side data is connected together with the database.
  const handleDelete = () => {
    setShowDelete(false)
    try {
      localStorage.removeItem('waqit_tasks_v1')
    } catch {
      // ignore
    }
    resetLang()
    window.location.assign(asset('welcome'))
  }

  return (
    <section className="profile-page">
      <AppHeader subtitle={t.profile.subtitle} />

      <div className="pf-hero">
        <img className="pf-hero-art" src={asset('img/profile-banner-wide.webp')} alt="" />
        <span className="pf-avatar">
          <User size={44} />
        </span>
        <div className="pf-who">
          <p className="pf-name">{displayName}</p>
          <p className="pf-role">{tg?.username ? `@${tg.username}` : t.profile.roleUser}</p>
          <button className="pf-plan" onClick={() => navigate('/tariff')}>
            <Crown size={15} /> {isPro ? 'PRO' : 'FREE'} <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="pf-stats" role="button" tabIndex={0} onClick={() => navigate('/stats')} onKeyDown={(e) => e.key === 'Enter' && navigate('/stats')}>
        <div className="pf-stat">
          <CalendarCheck size={26} className="gold" />
          <span className="pf-stat-num">{stats.totalDone}</span>
          <span className="pf-stat-label">{t.profile.statDone}</span>
        </div>
        <div className="pf-stat">
          <Target size={26} className="gold" />
          <span className="pf-stat-num">{stats.todayRate}%</span>
          <span className="pf-stat-label">{t.profile.statRate}</span>
        </div>
        <div className="pf-stat">
          <Flame size={26} className="gold" />
          <span className="pf-stat-num">{stats.streak}</span>
          <span className="pf-stat-label">{t.profile.statStreak}</span>
        </div>
      </div>

      <div className="profile-list">
        <ProfileRow
          icon={<Crown size={24} />}
          label={t.profile.subscription}
          sub={t.profile.subscriptionSub}
          onClick={() => navigate('/tariff')}
        />
        <ProfileRow
          icon={<Bell size={24} />}
          label={t.profile.settings}
          sub={t.profile.remindersSub}
          onClick={() => navigate('/reminders')}
        />
        <ProfileRow
          icon={<Globe size={24} />}
          label={t.profile.language}
          value={lang ? LANGUAGE_NAMES[lang] : ''}
          onClick={() => navigate('/language')}
        />
        <ProfileRow
          icon={<Trash2 size={24} />}
          label={t.profile.deleteData}
          onClick={() => setShowDelete(true)}
        />
        <ProfileRow
          icon={<LogOut size={24} />}
          label={t.profile.logout}
          danger
          showChevron={false}
          onClick={() => navigate('/welcome')}
        />
      </div>

      <p style={{textAlign:'center',fontSize:12,opacity:.5}} onClick={() => navigate('/debug')}>diagnostika</p>

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
