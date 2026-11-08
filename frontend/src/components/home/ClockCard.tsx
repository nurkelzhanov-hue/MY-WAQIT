import { useLang } from '../../hooks/useLang'
import { pad2, type ZonedNow } from '../../utils/datetime'

type Props = { now: ZonedNow }

export default function ClockCard({ now }: Props) {
  const { t } = useLang()
  const month = t.months[now.month - 1]

  return (
    <div className="clock-card">
      <p className="clock-date">
        {t.home.today}, {now.day} {month} {now.year}
      </p>
      <p className="clock-time">
        {pad2(now.hour)}:{pad2(now.minute)}
      </p>
      <p className="clock-weekday">{t.weekdays[now.weekday]}</p>
    </div>
  )
}
