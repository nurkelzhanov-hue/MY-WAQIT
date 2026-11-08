import { useNavigate } from 'react-router-dom'
import { Hourglass, Send } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import './screens.css'

export default function WelcomePage() {
  const { t } = useLang()
  const navigate = useNavigate()

  return (
    <div className="screen">
      <div className="welcome-top">
        <div className="logo-circle">
          <Hourglass size={64} strokeWidth={1.5} />
        </div>
        <h1 className="brand">MY WAQIT</h1>
        <p className="tagline">{t.welcome.tagline}</p>
      </div>
      <button className="btn-gold btn-icon" onClick={() => navigate('/language')}>
        <Send size={18} />
        {t.welcome.telegramLogin}
      </button>
    </div>
  )
}
