import { useNavigate } from 'react-router-dom'
import { ArrowRight, ListChecks, Plus } from 'lucide-react'
import { useLang } from '../../hooks/useLang'
import { useTasks } from '../../hooks/useTasks'
import { isDoneOn } from '../../data/taskTypes'
import { CATEGORY_META } from '../tasks/categoryMeta'
import type { Ymd } from '../../utils/datetime'

export default function TodayTasksCard({ today }: { today: Ymd }) {
  const { t } = useLang()
  const navigate = useNavigate()
  const { tasksOn } = useTasks()
  const list = tasksOn(today)

  return (
    <div className="hp-card">
      <div className="hp-card-head">
        <span className="hp-card-title">
          <ListChecks size={26} className="gold" />
          {t.home.todayTasks}
        </span>
        <button className="hp-link" onClick={() => navigate('/calendar')}>
          {t.home.viewAll}
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="hp-task-list">
        {list.length === 0 && (
          <button className="hp-task" onClick={() => navigate('/new-task')}>
            <Plus size={22} className="gold" />
            <span className="hp-task-title">{t.calendar.noTasks}</span>
          </button>
        )}
        {list.map((task) => {
          const meta = CATEGORY_META[task.category]
          const Icon = meta.icon
          const done = isDoneOn(task, today)
          return (
            <button key={task.id} className="hp-task" onClick={() => navigate('/calendar')}>
              <span className="hp-task-bar" style={{ background: meta.color }} />
              <span className="hp-task-time">{task.time}</span>
              <Icon size={22} className="gold" />
              <span className="hp-task-title">{task.title}</span>
              <span className="hp-task-status">{done ? t.calendar.done : t.home.planned}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
