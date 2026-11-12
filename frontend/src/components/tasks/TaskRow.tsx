import { Check, Trash2 } from 'lucide-react'
import { CATEGORY_META } from './categoryMeta'
import type { Task } from '../../data/taskTypes'
import './tasks.css'

type Props = {
  task: Task
  done: boolean
  reminderText: string
  onToggle: () => void
  onRemove?: () => void
}

export default function TaskRow({ task, done, reminderText, onToggle, onRemove }: Props) {
  const meta = CATEGORY_META[task.category]
  const Icon = meta.icon
  return (
    <div className={'trow' + (done ? ' done' : '')}>
      <span className="trow-bar" style={{ background: meta.color }} />
      <span className="trow-icon" style={{ color: meta.color }}>
        <Icon size={20} />
      </span>
      <div className="trow-info">
        <div className="trow-top">
          <span className="trow-title">{task.title}</span>
          <span className="trow-time">{task.time}</span>
        </div>
        <p className="trow-sub">{reminderText}</p>
      </div>
      {onRemove && (
        <button className="trow-del" onClick={onRemove} aria-label="delete">
          <Trash2 size={17} />
        </button>
      )}
      <button className="trow-check" onClick={onToggle} aria-label={task.title}>
        {done && <Check size={16} />}
      </button>
    </div>
  )
}
