import { Check, Users } from 'lucide-react'

type Props = {
  title: string
  time: string
  reminderText?: string
  done: boolean
  onToggle: () => void
}

export default function TaskCard({ title, time, reminderText, done, onToggle }: Props) {
  return (
    <div className={'task-card' + (done ? ' done' : '')}>
      <div className="task-icon">
        <Users size={20} />
      </div>
      <div className="task-info">
        <div className="task-row">
          <span className="task-title">{title}</span>
          <span className="task-time">{time}</span>
        </div>
        {reminderText && <p className="task-reminder">{reminderText}</p>}
      </div>
      <button className="task-check" onClick={onToggle} aria-label={title}>
        {done && <Check size={16} />}
      </button>
    </div>
  )
}
