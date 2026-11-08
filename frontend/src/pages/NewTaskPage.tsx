import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import { useNow } from '../hooks/useNow'
import { DEFAULT_TIMEZONE } from '../utils/config'
import { pad2 } from '../utils/datetime'
import Field from '../components/form/Field'
import './newtask.css'

type ReminderChoice = '5' | '10' | '15' | '30' | '60' | '1440' | 'custom'
type RepeatChoice = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'weekdays'

export default function NewTaskPage() {
  const { t } = useLang()
  const navigate = useNavigate()
  const now = useNow(DEFAULT_TIMEZONE)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(() => `${now.year}-${pad2(now.month)}-${pad2(now.day)}`)
  const [time, setTime] = useState('09:00')
  const [reminder, setReminder] = useState<ReminderChoice>('30')
  const [customMinutes, setCustomMinutes] = useState('45')
  const [repeat, setRepeat] = useState<RepeatChoice>('none')
  const [repeatDays, setRepeatDays] = useState<number[]>([])
  const [location, setLocation] = useState('')
  const [note, setNote] = useState('')
  const [showError, setShowError] = useState(false)

  const n = t.newTask

  const reminderOptions: { value: ReminderChoice; label: string }[] = [
    { value: '5', label: n.reminderOptions.m5 },
    { value: '10', label: n.reminderOptions.m10 },
    { value: '15', label: n.reminderOptions.m15 },
    { value: '30', label: n.reminderOptions.m30 },
    { value: '60', label: n.reminderOptions.h1 },
    { value: '1440', label: n.reminderOptions.d1 },
    { value: 'custom', label: n.reminderOptions.custom },
  ]

  const repeatOptions: { value: RepeatChoice; label: string }[] = [
    { value: 'none', label: n.repeatOptions.none },
    { value: 'daily', label: n.repeatOptions.daily },
    { value: 'weekly', label: n.repeatOptions.weekly },
    { value: 'monthly', label: n.repeatOptions.monthly },
    { value: 'yearly', label: n.repeatOptions.yearly },
    { value: 'weekdays', label: n.repeatOptions.weekdays },
  ]

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  const toggleDay = (index: number) => {
    setRepeatDays((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    )
  }

  const handleSave = () => {
    if (title.trim() === '') {
      setShowError(true)
      return
    }
    // Saving to the database is connected in a later stage (task system).
    goBack()
  }

  return (
    <div className="newtask">
      <header className="newtask-header">
        <button className="back-button" onClick={goBack} aria-label={n.back}>
          <ArrowLeft size={22} />
        </button>
        <h1 className="newtask-title">{t.home.newTask}</h1>
      </header>

      <div className="newtask-fields">
        <Field label={n.taskName} error={showError && title.trim() === '' ? n.titleRequired : undefined}>
          <input
            className="input"
            value={title}
            placeholder={n.taskNamePlaceholder}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>

        <Field label={n.description}>
          <textarea
            className="input"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>

        <div className="field-row">
          <Field label={n.date}>
            <input
              className="input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          <Field label={n.time}>
            <input
              className="input"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </Field>
        </div>

        <Field label={n.reminder}>
          <select
            className="input"
            value={reminder}
            onChange={(e) => setReminder(e.target.value as ReminderChoice)}
          >
            {reminderOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        {reminder === 'custom' && (
          <Field label={n.customMinutes}>
            <input
              className="input"
              type="number"
              min={1}
              inputMode="numeric"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
            />
          </Field>
        )}

        <Field label={n.repeat}>
          <select
            className="input"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value as RepeatChoice)}
          >
            {repeatOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        {repeat === 'weekdays' && (
          <div className="weekday-chips">
            {t.weekdaysShort.map((name, index) => (
              <button
                key={name}
                type="button"
                className={'chip' + (repeatDays.includes(index) ? ' selected' : '')}
                onClick={() => toggleDay(index)}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        <Field label={n.location}>
          <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} />
        </Field>

        <Field label={n.note}>
          <textarea className="input" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
      </div>

      <div className="form-footer">
        <button className="btn-gold" onClick={handleSave}>
          {n.save}
        </button>
      </div>
    </div>
  )
}
