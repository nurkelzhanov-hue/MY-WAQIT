import { daysInMonth, sameDay, weekdayOf, type Ymd } from '../../utils/datetime'

type Props = {
  year: number
  month: number
  selected: Ymd
  today: Ymd
  hasTasks: (day: number) => boolean
  onSelect: (day: number) => void
}

export default function MonthGrid({ year, month, selected, today, hasTasks, onSelect }: Props) {
  const blanks = weekdayOf(year, month, 1)
  const total = daysInMonth(year, month)

  const cells: (number | null)[] = [
    ...Array.from({ length: blanks }, () => null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ]

  return (
    <div className="month-grid">
      {cells.map((day, index) => {
        if (day === null) {
          return <span key={`blank-${index}`} />
        }
        const date: Ymd = { year, month, day }
        const classes =
          'day-cell' +
          (sameDay(date, selected) ? ' selected' : '') +
          (sameDay(date, today) ? ' today' : '')
        return (
          <button key={day} className={classes} onClick={() => onSelect(day)}>
            {day}
            {hasTasks(day) && <span className="day-dot" />}
          </button>
        )
      })}
    </div>
  )
}
