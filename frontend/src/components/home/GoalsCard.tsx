import { useState } from 'react'
import { Check, Target } from 'lucide-react'
import { useLang } from '../../hooks/useLang'

const RADIUS = 24
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// Goals are sample data for now; they will come from the database later.
export default function GoalsCard() {
  const { t } = useLang()
  const [done, setDone] = useState<number[]>([0, 1])
  const total = t.home.goals.length
  const percent = Math.round((done.length / total) * 100)

  const toggle = (index: number) => {
    setDone((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="hp-card">
      <div className="hp-goals-head">
        <div>
          <p className="hp-card-title">
            <Target size={26} className="gold" />
            {t.home.goalsTitle}
          </p>
          <p className="hp-goals-progress">{t.home.goalsProgress(done.length, total)}</p>
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
        {t.home.goals.map((title, index) => (
          <button key={index} className="hp-goal" onClick={() => toggle(index)}>
            <span className={'hp-goal-check' + (done.includes(index) ? ' done' : '')}>
              {done.includes(index) && <Check size={16} strokeWidth={3} />}
            </span>
            <span className="hp-goal-title">{title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
