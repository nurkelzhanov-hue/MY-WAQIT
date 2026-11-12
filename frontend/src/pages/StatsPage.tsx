import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, Check, CheckCircle2, ClipboardCheck, Flame, Lock, Minus, Plus, Target, Trophy, XCircle } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import { useNow } from '../hooks/useNow'
import { useTasks } from '../hooks/useTasks'
import { DEFAULT_TIMEZONE } from '../utils/config'
import { computeProgress, loadGoal, saveGoal } from '../data/progress'
import { isDoneOn } from '../data/taskTypes'
import { statsStrings } from '../i18n/statsStrings'
import AppHeader from '../components/AppHeader'
import { CATEGORY_META } from '../components/tasks/categoryMeta'
import './stats.css'

type Tab = 'stats' | 'goals' | 'awards'

function Ring({ percent, size, label, sub }: { percent: number; size: number; label?: string; sub?: string }) {
  const stroke = Math.max(8, Math.round(size / 9))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="st-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(120,160,210,0.2)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#stGold)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(c * Math.min(percent, 100)) / 100} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <defs>
          <linearGradient id="stGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fdd46e" />
            <stop offset="1" stopColor="#e39a27" />
          </linearGradient>
        </defs>
      </svg>
      <div className="st-ring-text">
        <b>{label ?? `${percent}%`}</b>
        {sub && <span>{sub}</span>}
      </div>
    </div>
  )
}

export default function StatsPage() {
  const { t, lang } = useLang()
  const s = statsStrings[lang ?? 'kaa']
  const navigate = useNavigate()
  const now = useNow(DEFAULT_TIMEZONE)
  const { tasks, tasksOn } = useTasks()
  const [tab, setTab] = useState<Tab>('stats')
  const [goal, setGoal] = useState(loadGoal)

  const today = useMemo(() => ({ year: now.year, month: now.month, day: now.day }), [now.year, now.month, now.day])
  const p = useMemo(() => computeProgress(tasks, today, goal), [tasks, today, goal])
  const todayTasks = tasksOn(today)
  const doneToday = todayTasks.filter((x) => isDoneOn(x, today)).length

  const changeGoal = (delta: number) => {
    const next = Math.min(20, Math.max(1, goal + delta))
    setGoal(next)
    saveGoal(next)
  }

  const awardValue = (id: string): { value: number; target: number } => {
    const n = Number(id.slice(1))
    return id.startsWith('d') ? { value: p.done, target: n } : { value: p.bestStreak, target: n }
  }
  const unlocked = s.awards.filter((a) => {
    const { value, target } = awardValue(a.id)
    return value >= target
  }).length

  const bannerText = goal - p.goal.todayDone <= 0 ? s.bannerDone : s.bannerLeft(goal - p.goal.todayDone)

  const tabs: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
    { id: 'stats', label: s.tabStats, icon: BarChart3 },
    { id: 'goals', label: s.tabGoals, icon: Target },
    { id: 'awards', label: s.tabAwards, icon: Trophy },
  ]

  return (
    <section className="stats-page">
      <AppHeader subtitle={s.title} left="back" onLeft={() => navigate(-1)} />

      <div className="st-tabs" role="tablist">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} role="tab" aria-selected={tab === id} className={'st-tab' + (tab === id ? ' active' : '')} onClick={() => setTab(id)}>
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {tab === 'stats' && (
        <>
          <div className="st-tiles">
            <div className="st-tile">
              <ClipboardCheck size={24} className="gold" />
              <b>{p.total}</b>
              <span>{s.total}</span>
            </div>
            <div className="st-tile">
              <CheckCircle2 size={24} className="green" />
              <b>{p.done}</b>
              <span>{s.done}</span>
            </div>
            <div className="st-tile">
              <XCircle size={24} className="red" />
              <b>{p.missed}</b>
              <span>{s.missed}</span>
            </div>
            <div className="st-tile">
              <Ring percent={p.rate} size={54} />
              <span>{s.rate}</span>
            </div>
          </div>

          <div className="st-two">
            <div className="st-card">
              <h3><BarChart3 size={18} className="gold" /> {s.weekTitle}</h3>
              <div className="st-bars">
                {p.week.map((d, i) => {
                  const rate = d.planned === 0 ? 0 : Math.round((d.done / d.planned) * 100)
                  return (
                    <div key={i} className="st-bar-col">
                      <span className="st-bar-val">{d.planned > 0 ? `${rate}%` : ''}</span>
                      <div className="st-bar-track">
                        <div className={'st-bar-fill' + (d.future ? ' future' : '')} style={{ height: `${rate}%` }} />
                      </div>
                      <span className={'st-bar-day' + (i === now.weekday ? ' today' : '')}>{t.weekdaysShort[i]}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="st-card">
              <h3><Target size={18} className="gold" /> {s.monthTitle}</h3>
              <div className="st-month">
                <Ring percent={p.month.rate} size={96} sub={`${t.monthsTitle[now.month - 1]}`} />
                <ul>
                  <li><i className="dot green" />{s.done}<b>{p.month.done}</b></li>
                  <li><i className="dot red" />{s.missed}<b>{p.month.missed}</b></li>
                  <li><i className="dot grey" />{s.monthTotal}<b>{p.month.total}</b></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="st-card st-goalbar">
            <div className="st-goalbar-head">
              <Target size={30} className="gold" />
              <div>
                <b>{s.goalTitle}</b>
                <span>{s.goalLine(goal)}</span>
              </div>
              <div className="st-goalbar-num">
                <b>{p.goal.percent}%</b>
                <span>{s.goalDays(p.goal.daysReached, p.goal.daysInMonth)}</span>
              </div>
            </div>
            <div className="st-progress"><div style={{ width: `${p.goal.percent}%` }} /></div>
          </div>
        </>
      )}

      {tab === 'goals' && (
        <>
          <div className="st-card">
            <div className="st-row-head">
              <h3><Target size={18} className="gold" /> {s.dailyTitle}</h3>
              <span className="st-gold-text">{s.dailyProgress(doneToday, todayTasks.length)}</span>
            </div>
            {todayTasks.length === 0 ? (
              <p className="st-empty">{s.dailyEmpty}</p>
            ) : (
              <ul className="st-today">
                {todayTasks.map((task) => {
                  const Icon = CATEGORY_META[task.category].icon
                  const done = isDoneOn(task, today)
                  return (
                    <li key={task.id}>
                      <Icon size={20} style={{ color: CATEGORY_META[task.category].color }} />
                      <span>{task.title}</span>
                      <i className={'st-check' + (done ? ' on' : '')}>{done && <Check size={14} />}</i>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="st-two">
            <div className="st-card st-streak">
              <Flame size={40} className="gold" />
              <b>{p.streak}</b>
              <span>{s.streakLabel}</span>
            </div>
            <div className="st-card st-stepper">
              <span>{s.dailyGoal}</span>
              <div>
                <button onClick={() => changeGoal(-1)} aria-label="-"><Minus size={18} /></button>
                <b>{goal}</b>
                <button onClick={() => changeGoal(1)} aria-label="+"><Plus size={18} /></button>
              </div>
            </div>
          </div>

          <div className="st-card st-goalbar">
            <div className="st-goalbar-head">
              <Target size={30} className="gold" />
              <div>
                <b>{s.goalTitle}</b>
                <span>{s.goalLine(goal)}</span>
              </div>
              <div className="st-goalbar-num">
                <b>{p.goal.percent}%</b>
                <span>{s.goalDays(p.goal.daysReached, p.goal.daysInMonth)}</span>
              </div>
            </div>
            <div className="st-progress"><div style={{ width: `${p.goal.percent}%` }} /></div>
          </div>

          <div className="st-banner">
            <Flame size={28} />
            <p>{bannerText}</p>
          </div>
        </>
      )}

      {tab === 'awards' && (
        <div className="st-card">
          <div className="st-row-head">
            <h3><Trophy size={18} className="gold" /> {s.awardsTitle}</h3>
            <span className="st-gold-text">{s.awardsOpen(unlocked, s.awards.length)}</span>
          </div>
          <ul className="st-awards">
            {s.awards.map((a) => {
              const { value, target } = awardValue(a.id)
              const open = value >= target
              return (
                <li key={a.id} className={open ? 'open' : ''}>
                  <span className="st-award-icon">{open ? <Trophy size={22} /> : <Lock size={20} />}</span>
                  <div>
                    <b>{a.name}</b>
                    <span>{a.desc}</span>
                    <div className="st-progress small"><div style={{ width: `${Math.min(100, (value / target) * 100)}%` }} /></div>
                  </div>
                  <em>{Math.min(value, target)} / {target}</em>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </section>
  )
}
