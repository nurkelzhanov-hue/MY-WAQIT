import { useNavigate } from 'react-router-dom'
import { CalendarDays, Landmark, Plus, Sparkles } from 'lucide-react'
import { useLang } from '../../hooks/useLang'

export default function QuickTiles() {
  const { t } = useLang()
  const navigate = useNavigate()

  const tiles = [
    { to: '/new-task', label: t.home.newTask, icon: <Plus size={22} strokeWidth={3} />, plus: true },
    { to: '/ai', label: t.ai.title, icon: <Sparkles size={30} />, plus: false },
    { to: '/calendar', label: t.home.calendar, icon: <CalendarDays size={30} />, plus: false },
    { to: '/prayer', label: t.prayer.title, icon: <Landmark size={30} />, plus: false },
  ]

  return (
    <div className="hp-tiles">
      {tiles.map(({ to, label, icon, plus }) => (
        <button key={to} className="hp-tile" onClick={() => navigate(to)}>
          {plus ? <span className="hp-plus">{icon}</span> : <span className="hp-tile-icon">{icon}</span>}
          <span className="hp-tile-label">{label}</span>
        </button>
      ))}
    </div>
  )
}
