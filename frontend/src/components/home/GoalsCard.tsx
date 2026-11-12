import { Check, Target } from 'lucide-react'
import { useLang } from '../../hooks/useLang'
import { useNow } from '../../hooks/useNow'
import { useTasks } from '../../hooks/useTasks'
import { isDoneOn } from '../../data/taskTypes'
import { statsStrings } from '../../i18n/statsStrings'
import { DEFAULT_TIMEZONE } from '../../utils/config'

const RADIUS = 24
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// Today's goals are the user's real tasks for today.
export default function GoalsCard() {
  const { t, lang } = useLang()
  const now = useNow(DEFAULT_TIMEZONE)
  const { tasksOn, toggleDone } = useTasks()
  const today = { year: now.year, month: now.month, day: now.day }
  const todayTasks = tasksOn(today)
  const doneCount = todayTasks.filter((x) => isDoneOn(x, today)).length
  const total = todayTasks.length
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100)
  const empty = statsStrings[lang ?? 'kaa'].dailyEmpty

  return (
    <div className="hp-card">
      <div className="hp-goals-head">
        <div>
          <p className="hp-card-title">
            <Target size={26} className="gold" />
            {t.home.goalsTitle}
          </p>
          <p className="hp-goals-progress">{t.home.goalsProgress(doneCount, total)}</p>
        </div>
        <svg width="68" height="68" viewBox="0 0 64 64" aria-label={`${percent}%`}>
          <defs>
            <linearGradient id="goal-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fdd46e" />
              <stop offset="1" stopColor="#e39a27" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6" />
          <circle
            cx="32"
            cy="32"
            r={RADIUS}
            fill="none"
            stroke="url(#goal-grad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(percent / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            transform="rotate(-90 32 32)"
          />
          <text x="32" y="37" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="700">
            {percent}%
          </text>
        </svg>
      </div>

      <div className="hp-goal-list">
        {total === 0 && <p className="hp-goals-progress">{empty}</p>}
        {todayTasks.map((task) => {
          const done = isDoneOn(task, today)
          return (
            <button key={task.id} className="hp-goal" onClick={() => toggleDone(task.id, today)}>
              <span className={'hp-goal-check' + (done ? ' done' : '')}>
                {done && <Check size={16} strokeWidth={3} />}
              </span>
              <span className="hp-goal-title">{task.title}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
