import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import { useNow } from '../hooks/useNow'
import { DEFAULT_TIMEZONE } from '../utils/config'
import { sameDay, weekdayOf, type Ymd } from '../utils/datetime'
import { DEMO_REMINDER_MINUTES, DEMO_TIMES } from '../data/demo'
import MonthGrid from '../components/calendar/MonthGrid'
import TaskCard from '../components/home/TaskCard'
import './calendar.css'

export default function CalendarPage() {
  const { t } = useLang()
  const navigate = useNavigate()
  const now = useNow(DEFAULT_TIMEZONE)
  const today: Ymd = { year: now.year, month: now.month, day: now.day }

  const [view, setView] = useState({ year: today.year, month: today.month })
  const [selected, setSelected] = useState<Ymd>(today)
  const [doneIndexes, setDoneIndexes] = useState<number[]>([])

  const shiftMonth = (delta: number) => {
    setView((v) => {
      const index = v.year * 12 + (v.month - 1) + delta
      return { year: Math.floor(index / 12), month: (index % 12) + 1 }
    })
  }

  const toggle = (index: number) => {
    setDoneIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    )
  }

  // Demo tasks exist only for today until the database is connected.
  const showsDemoTasks = sameDay(selected, today)
  const todayInView = view.year === today.year && view.month === today.month

  return (
    <section className="calendar-page">
      <header className="calendar-header">
        <span className="calendar-header-icon">
          <CalendarDays size={20} />
        </span>
        <h1 className="calendar-title">{t.nav.calendar}</h1>
      </header>

      <div className="card calendar-card">
        <div className="month-nav">
          <button className="month-arrow" onClick={() => shiftMonth(-1)} aria-label="previous">
            <ChevronLeft size={20} />
          </button>
          <span className="month-name">
            {t.monthsTitle[view.month - 1]} {view.year}
          </span>
          <button className="month-arrow" onClick={() => shiftMonth(1)} aria-label="next">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="weekday-row">
          {t.weekdaysShort.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>

        <MonthGrid
          year={view.year}
          month={view.month}
          selected={selected}
          today={today}
          hasTasks={(day) => todayInView && day === today.day}
          onSelect={(day) => setSelected({ year: view.year, month: view.month, day })}
        />
      </div>

      <div className="selected-bar">
        <span className="selected-day">{selected.day}</span>
        <span className="selected-text">
          {t.monthsTitle[selected.month - 1]} {selected.year},{' '}
          {t.weekdays[weekdayOf(selected.year, selected.month, selected.day)]}
        </span>
        <button className="add-button" onClick={() => navigate('/new-task')} aria-label={t.home.newTask}>
          <Plus size={20} />
        </button>
      </div>

      {showsDemoTasks ? (
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
      ) : (
        <p className="muted calendar-empty">{t.calendar.noTasks}</p>
      )}
    </section>
  )
}
