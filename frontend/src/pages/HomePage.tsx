import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import { useNow } from '../hooks/useNow'
import { DEFAULT_TIMEZONE } from '../utils/config'
import ClockCard from '../components/home/ClockCard'
import QuickActions from '../components/home/QuickActions'
import TaskCard from '../components/home/TaskCard'
import './home.css'

// Temporary sample times; real tasks come from the database in a later stage.
const DEMO_TIMES = ['11:00', '15:00', '18:30']
const DEMO_REMINDER_MINUTES = 30

export default function HomePage() {
  const { t } = useLang()
  const navigate = useNavigate()
  const now = useNow(DEFAULT_TIMEZONE)
  const [doneIndexes, setDoneIndexes] = useState<number[]>([])

  const greeting =
    now.hour >= 5 && now.hour < 12
      ? t.home.greetingMorning
      : now.hour >= 12 && now.hour < 18
        ? t.home.greetingDay
        : t.home.greetingEvening

  const toggle = (index: number) => {
    setDoneIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    )
  }

  return (
    <section className="home">
      <header className="home-header">
        <h1 className="home-greeting">{greeting}</h1>
        <button className="bell-button" onClick={() => navigate('/reminders')} aria-label={t.nav.reminders}>
          <Bell size={20} />
        </button>
      </header>

      <ClockCard now={now} />
      <QuickActions />

      <div className="section-head">
        <h2 className="section-title">
          {t.home.todayTasks} ({t.demoTasks.length})
        </h2>
        <button className="link-button" onClick={() => navigate('/calendar')}>
          {t.home.viewAll} ›
        </button>
      </div>

      <div className="task-list">
        {t.demoTasks.map((title, index) => (
          <TaskCard
            key={index}
            title={title}
            time={DEMO_TIMES[index]}
            reminderText={t.home.reminderBefore(DEMO_REMINDER_MINUTES)}
            done={doneIndexes.includes(index)}
            onToggle={() => toggle(index)}
          />
        ))}
      </div>
    </section>
  )
}
