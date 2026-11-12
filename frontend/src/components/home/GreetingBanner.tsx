import { Clock, User } from 'lucide-react'
import { CalendarDays } from 'lucide-react'
import { useLang } from '../../hooks/useLang'
import { pad2, type ZonedNow } from '../../utils/datetime'

type Props = {
  greeting: string
  now: ZonedNow
}

export default function GreetingBanner({ greeting, now }: Props) {
  const { t } = useLang()
  const month = t.months[now.month - 1]

  return (
    <div className="hp-banner">
      <div className="hp-banner-top">
        <span className="hp-avatar">
          <User size={34} />
        </span>
        <p className="hp-greeting">{greeting}</p>
        <span className="hp-time-pill">
          <Clock size={20} />
          {pad2(now.hour)}:{pad2(now.minute)}
        </span>
      </div>
      <p className="hp-date">
        <CalendarDays size={20} />
        {t.home.today}: {now.day} {month} {now.year}, {t.weekdays[now.weekday]}
      </p>
    </div>
  )
}
