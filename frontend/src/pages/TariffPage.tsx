import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Crown } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import AppHeader from '../components/AppHeader'
import { PLANS, formatPrice } from '../data/plans'
import { activateDemo, clearDemo, loadDemoSub } from '../data/subscription'
import './tariff.css'

const MODULES = [
  'AI Smart Planner',
  'Habit Tracker',
  'Focus Mode',
  'Family & Team',
  'Location Reminder',
  'Notes & Files',
  'Finance Reminder',
  'AI Reports',
]

export default function TariffPage() {
  const { t } = useLang()
  const navigate = useNavigate()
  const [sub, setSub] = useState(() => loadDemoSub())
  const tf = t.tariff

  const monthsLabel = (m: number) => tf.months(m)

  return (
    <section className="tariff-page">
      <AppHeader subtitle={tf.title} left="back" onLeft={() => navigate(-1)} />

      <div className="tf-current">
        <Crown size={22} className="gold" />
        <span>
          {tf.current}: <strong>{sub ? 'PRO' : 'FREE'}</strong>
          {sub && <span className="tf-until"> ({tf.until} {new Date(sub.until).toLocaleDateString()})</span>}
        </span>
      </div>

      <div className="tf-card">
        <h2 className="tf-name">FREE</h2>
        <ul className="tf-list">
          {tf.freeFeatures.map((f) => (
            <li key={f}>
              <Check size={16} className="gold" /> {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="tf-card pro">
        <h2 className="tf-name">PRO</h2>
        <p className="tf-sub">{tf.proIntro}</p>
        <ul className="tf-list">
          {MODULES.map((m) => (
            <li key={m}>
              <Check size={16} className="gold" /> {m} <span className="tf-soon">{tf.soon}</span>
            </li>
          ))}
        </ul>

        <div className="tf-plans">
          {PLANS.map((p) => (
            <button
              key={p.id}
              className={'tf-plan' + (sub?.planId === p.id ? ' active' : '')}
              onClick={() => setSub(activateDemo(p.id, p.months))}
            >
              <span className="tf-plan-months">{monthsLabel(p.months)}</span>
              <span className="tf-plan-price">
                {formatPrice(p.price)} {tf.currency}
              </span>
            </button>
          ))}
        </div>

        <p className="tf-demo">{tf.demoNote}</p>
        {sub && (
          <button
            className="tf-reset"
            onClick={() => {
              clearDemo()
              setSub(null)
            }}
          >
            {tf.resetDemo}
          </button>
        )}
      </div>
    </section>
  )
}
