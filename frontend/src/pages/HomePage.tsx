import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import { useNow } from '../hooks/useNow'
import { DEFAULT_TIMEZONE } from '../utils/config'
import { pickGreeting } from '../utils/greeting'
import AppHeader from '../components/AppHeader'
import GreetingBanner from '../components/home/GreetingBanner'
import QuickTiles from '../components/home/QuickTiles'
import TodayTasksCard from '../components/home/TodayTasksCard'
import PrayerCard from '../components/home/PrayerCard'
import GoalsCard from '../components/home/GoalsCard'
import './home.css'
import './home-new.css'

export default function HomePage() {
  const { t } = useLang()
  const navigate = useNavigate()
  const now = useNow(DEFAULT_TIMEZONE)

  return (
    <section className="hp">
      <AppHeader
        subtitle={t.home.appSubtitle}
        left="menu"
        onLeft={() => navigate('/profile')}
        right={
          <button className="icon-btn gold has-dot" onClick={() => navigate('/reminders')} aria-label={t.nav.reminders}>
            <Bell size={26} />
            <span className="bell-dot" />
          </button>
        }
      />
      <GreetingBanner greeting={pickGreeting(now.hour, t.home)} now={now} />
      <QuickTiles />
      <TodayTasksCard today={{ year: now.year, month: now.month, day: now.day }} />
      <PrayerCard />
      <GoalsCard />
    </section>
  )
}
