import { NavLink } from 'react-router-dom'
import { Bell, CalendarDays, House, Sparkles, User } from 'lucide-react'
import { kaa } from '../i18n/kaa'

const items = [
  { to: '/', label: kaa.nav.home, Icon: House, end: true },
  { to: '/calendar', label: kaa.nav.calendar, Icon: CalendarDays, end: false },
  { to: '/ai', label: kaa.nav.ai, Icon: Sparkles, end: false },
  { to: '/reminders', label: kaa.nav.reminders, Icon: Bell, end: false },
  { to: '/profile', label: kaa.nav.profile, Icon: User, end: false },
]

export default function BottomNav() {
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
