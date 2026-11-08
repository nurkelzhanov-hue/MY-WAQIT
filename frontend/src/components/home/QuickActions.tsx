import { useNavigate } from 'react-router-dom'
import { CalendarDays, Landmark, Plus, Sparkles } from 'lucide-react'
import { useLang } from '../../hooks/useLang'

export default function QuickActions() {
  const { t } = useLang()
  const navigate = useNavigate()

  const actions = [
    { to: '/new-task', label: t.home.newTask, Icon: Plus },
    { to: '/calendar', label: t.home.calendar, Icon: CalendarDays },
    { to: '/ai', label: t.home.ai, Icon: Sparkles },
    { to: '/prayer', label: t.home.prayer, Icon: Landmark },
  ]

  return (
    <div className="quick-actions">
      {actions.map(({ to, label, Icon }) => (
        <button key={to} className="quick-action" onClick={() => navigate(to)}>
          <span className="quick-icon">
            <Icon size={24} />
          </span>
          <span className="quick-label">{label}</span>
        </button>
      ))}
    </div>
  )
}
