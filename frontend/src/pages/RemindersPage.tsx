import { useState } from 'react'
import { Bell } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import { shiftTime } from '../utils/datetime'
import { useNow } from '../hooks/useNow'
import { useTasks } from '../hooks/useTasks'
import { DEFAULT_TIMEZONE } from '../utils/config'
import { isDoneOn } from '../data/taskTypes'
import ReminderItem from '../components/reminders/ReminderItem'
import './reminders.css'

type Tab = 'all' | 'daily' | 'prayer'

const DAILY_SUMMARY_TIME = '08:00'

export default function RemindersPage() {
  const { t } = useLang()
  const [tab, setTab] = useState<Tab>('all')
  const now = useNow(DEFAULT_TIMEZONE)
  const { tasksOn, toggleDone } = useTasks()
  const today = { year: now.year, month: now.month, day: now.day }
  const todayTasks = tasksOn(today)
  const [dailyOn, setDailyOn] = useState(true)
  const [prayerOn, setPrayerOn] = useState<boolean[]>([true, true, true, true, true])

  const tabs: { id: Tab; label: string }[] = [
    { id: 'all', label: t.reminders.tabAll },
    { id: 'daily', label: t.reminders.tabDaily },
    { id: 'prayer', label: t.reminders.tabPrayer },
  ]

  const togglePrayer = (index: number) => {
    setPrayerOn((prev) => prev.map((value, i) => (i === index ? !value : value)))
  }

  const showTasks = tab === 'all'
  const showDaily = tab === 'all' || tab === 'daily'
  const showPrayer = tab === 'all' || tab === 'prayer'

  return (
    <section className="reminders-page">
      <header className="reminders-header">
        <span className="reminders-header-icon">
          <Bell size={20} />
        </span>
        <h1 className="reminders-title">{t.nav.reminders}</h1>
      </header>

      <div className="tabs">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            className={'tab' + (tab === id ? ' active' : '')}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {showTasks && (
        <div className="reminder-group">
          <h2 className="group-title">
            {t.reminders.today} ({todayTasks.length})
          </h2>
          {todayTasks.length === 0 && <p className="muted">{t.calendar.noTasks}</p>}
          {todayTasks.map((task) => (
            <ReminderItem
              key={task.id}
              title={task.title}
              subtitle={`${shiftTime(task.time, -task.reminderMinutes)} (${t.home.reminderBefore(task.reminderMinutes)})`}
              control="check"
              on={isDoneOn(task, today)}
              onToggle={() => toggleDone(task.id, today)}
            />
          ))}
        </div>
      )}

      {showDaily && (
        <div className="reminder-group">
          <h2 className="group-title">{t.reminders.tabDaily}</h2>
          <ReminderItem
            title={t.reminders.dailySummary}
            subtitle={`${t.newTask.repeatOptions.daily}, ${DAILY_SUMMARY_TIME}`}
            control="switch"
            on={dailyOn}
            onToggle={() => setDailyOn((v) => !v)}
          />
        </div>
      )}

      {showPrayer && (
        <div className="reminder-group">
          <h2 className="group-title">{t.reminders.tabPrayer}</h2>
          {t.prayer.names.map((name, index) => (
            <ReminderItem
              key={name}
              title={name}
              subtitle={t.reminders.prayerAtTime}
              control="switch"
              on={prayerOn[index]}
              onToggle={() => togglePrayer(index)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
