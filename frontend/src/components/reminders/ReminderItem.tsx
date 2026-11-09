import { Bell, Check } from 'lucide-react'

type Props = {
  title: string
  subtitle: string
  control: 'check' | 'switch'
  on: boolean
  onToggle: () => void
}

export default function ReminderItem({ title, subtitle, control, on, onToggle }: Props) {
  return (
    <div className={'reminder-item' + (control === 'check' && on ? ' done' : '')}>
      <span className="reminder-icon">
        <Bell size={18} />
      </span>
      <div className="reminder-info">
        <p className="reminder-title">{title}</p>
        <p className="reminder-sub">{subtitle}</p>
      </div>
      {control === 'check' ? (
        <button className="reminder-check" onClick={onToggle} aria-label={title}>
          {on && <Check size={14} />}
        </button>
      ) : (
        <button
          role="switch"
          aria-checked={on}
          className={'switch' + (on ? ' on' : '')}
          onClick={onToggle}
          aria-label={title}
        >
          <span className="switch-knob" />
        </button>
      )}
    </div>
  )
}
