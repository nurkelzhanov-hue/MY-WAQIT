import { NavLink } from 'react-router-dom'
import { Bell, CalendarDays, House, Sparkles, User } from 'lucide-react'
import { useLang } from '../hooks/useLang'

export default function BottomNav() {
  const { t } = useLang()

  const items = [
    { to: '/', label: t.nav.home, Icon: House, end: true },
    { to: '/calendar', label: t.nav.calendar, Icon: CalendarDays, end: false },
    { to: '/ai', label: t.nav.ai, Icon: Sparkles, end: false },
    { to: '/reminders', label: t.nav.reminders, Icon: Bell, end: false },
    { to: '/profile', label: t.nav.profile, Icon: User, end: false },
  ]

  return (
    <nav className="bottom-nav">
      {items.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
        >
          <Icon size={22} strokeWidth={2} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
