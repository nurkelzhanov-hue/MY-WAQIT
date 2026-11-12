import { useNavigate } from 'react-router-dom'
import { Send } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import './screens.css'
import { asset } from '../utils/assets'

export default function WelcomePage() {
  const { t } = useLang()
  const navigate = useNavigate()

  return (
    <div className="welcome">
      <div className="stars" />
      <div className="welcome-main">
        <div className="welcome-logo">
          <img src={asset('img/welcome-logo.webp')} alt="" />
        </div>
        <h1 className="brand">MY WAQIT</h1>
        <div className="brand-divider">
          <span />
          <i />
          <span />
        </div>
        <p className="tagline">{t.welcome.tagline}</p>
      </div>
      <img className="skyline" src={asset('img/welcome-skyline.webp')} alt="" />
      <div className="screen-footer">
        <button className="btn-gold btn-icon" onClick={() => navigate('/language')}>
          <Send size={22} />
          {t.welcome.telegramLogin}
        </button>
      </div>
    </div>
  )
}
