import { useEffect, useState } from 'react'
import { useLang } from '../hooks/useLang'
import { asset } from '../utils/assets'
import '../pages/screens.css'
import './splash.css'

const MIN_MS = 1700 // show the splash at least this long so the hourglass visibly turns
const MAX_MS = 4500 // never block the app longer than this, even if an image is slow

type Props = { onDone: () => void }

// Loading screen shown when the app opens: same look as the welcome page,
// with the hourglass turning while the app is getting ready.
export default function SplashScreen({ onDone }: Props) {
  const { t } = useLang()
  const [logoReady, setLogoReady] = useState(false)
  const [minPassed, setMinPassed] = useState(false)

  useEffect(() => {
    const min = window.setTimeout(() => setMinPassed(true), MIN_MS)
    const max = window.setTimeout(onDone, MAX_MS)
    return () => {
      window.clearTimeout(min)
      window.clearTimeout(max)
    }
  }, [onDone])

  useEffect(() => {
    if (logoReady && minPassed) onDone()
  }, [logoReady, minPassed, onDone])

  return (
    <div className="welcome splash">
      <div className="stars" />
      <div className="welcome-main">
        <div className="welcome-logo">
          <img
            className="splash-hourglass"
            src={asset('img/welcome-logo.webp')}
            alt=""
            onLoad={() => setLogoReady(true)}
            onError={() => setLogoReady(true)}
          />
        </div>
        <h1 className="brand">MY WAQIT</h1>
        <div className="brand-divider">
          <span />
          <i />
          <span />
        </div>
        <p className="tagline">{t.welcome.tagline}</p>
        <div className="splash-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
      <img className="skyline" src={asset('img/welcome-skyline.webp')} alt="" />
    </div>
  )
}
