import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import { useNow } from '../hooks/useNow'
import { useTasks } from '../hooks/useTasks'
import { DEFAULT_TIMEZONE } from '../utils/config'
import { addDays, sameDay, toIso, weekdayOf, type Ymd } from '../utils/datetime'
import { isDoneOn, weekOf } from '../data/taskTypes'
import MonthGrid from '../components/calendar/MonthGrid'
import TaskRow from '../components/tasks/TaskRow'
import './calendar.css'
import './calendar-new.css'

type Mode = 'month' | 'week' | 'day'

export default function CalendarPage() {
  const { t } = useLang()
  const navigate = useNavigate()
  const now = useNow(DEFAULT_TIMEZONE)
  const { tasksOn, toggleDone, removeTask } = useTasks()
  const today: Ymd = { year: now.year, month: now.month, day: now.day }

  const [mode, setMode] = useState<Mode>('month')
  const [view, setView] = useState({ year: today.year, month: today.month })
  const [selected, setSelected] = useState<Ymd>(today)

  const shiftMonth = (delta: number) => {
    setView((v) => {
      const index = v.year * 12 + (v.month - 1) + delta
      return { year: Math.floor(index / 12), month: (index % 12) + 1 }
    })
  }

  const shiftSelected = (days: number) => {
    const next = addDays(selected, days)
    setSelected(next)
    setView({ year: next.year, month: next.month })
  }

  const label = (d: Ymd) => `${d.day} ${t.monthsTitle[d.month - 1]} ${d.year}`
  const week = weekOf(selected)
  const dayTasks = tasksOn(selected)

  const modes: { key: Mode; text: string }[] = [
    { key: 'month', text: t.calendar.month },
    { key: 'week', text: t.calendar.week },
    { key: 'day', text: t.calendar.day },
  ]

  return (
    <section className="calendar-page">
      <header className="calendar-header">
        <span className="calendar-header-icon">
          <CalendarDays size={20} />
        </span>
        <h1 className="calendar-title">{t.nav.calendar}</h1>
      </header>

      <div className="cal-tabs">
        {modes.map((m) => (
          <button
            key={m.key}
            className={'cal-tab' + (mode === m.key ? ' active' : '')}
            onClick={() => setMode(m.key)}
          >
            {m.text}
          </button>
        ))}
      </div>

      {mode === 'month' && (
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
            hasTasks={(day) => tasksOn({ year: view.year, month: view.month, day }).length > 0}
            onSelect={(day) => setSelected({ year: view.year, month: view.month, day })}
          />
        </div>
      )}

      {mode === 'week' && (
        <div className="card calendar-card">
          <div className="month-nav">
            <button className="month-arrow" onClick={() => shiftSelected(-7)} aria-label="previous">
              <ChevronLeft size={20} />
            </button>
            <span className="month-name">
              {week[0].day} {t.monthsTitle[week[0].month - 1]} – {week[6].day} {t.monthsTitle[week[6].month - 1]}
            </span>
            <button className="month-arrow" onClick={() => shiftSelected(7)} aria-label="next">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="week-strip">
            {week.map((d, i) => (
              <button
                key={toIso(d)}
                className={'week-day' + (sameDay(d, selected) ? ' selected' : '') + (sameDay(d, today) ? ' today' : '')}
                onClick={() => setSelected(d)}
              >
                <span className="week-name">{t.weekdaysShort[i]}</span>
                <span className="week-num">{d.day}</span>
                {tasksOn(d).length > 0 && <span className="day-dot static" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'day' && (
        <div className="card calendar-card">
          <div className="month-nav">
            <button className="month-arrow" onClick={() => shiftSelected(-1)} aria-label="previous">
              <ChevronLeft size={20} />
            </button>
            <span className="month-name">{label(selected)}</span>
            <button className="month-arrow" onClick={() => shiftSelected(1)} aria-label="next">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="selected-bar">
        <span className="selected-day">{selected.day}</span>
        <span className="selected-text">
          {t.monthsTitle[selected.month - 1]} {selected.year},{' '}
          {t.weekdays[weekdayOf(selected.year, selected.month, selected.day)]}
        </span>
        <button
          className="add-button"
          onClick={() => navigate(`/new-task?date=${toIso(selected)}`)}
          aria-label={t.home.newTask}
        >
          <Plus size={20} />
        </button>
      </div>

      {dayTasks.length === 0 ? (
        <p className="muted calendar-empty">{t.calendar.noTasks}</p>
      ) : (
        <div className="task-list">
          {dayTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              done={isDoneOn(task, selected)}
              reminderText={t.home.reminderBefore(task.reminderMinutes)}
              onToggle={() => toggleDone(task.id, selected)}
              onRemove={() => removeTask(task.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
