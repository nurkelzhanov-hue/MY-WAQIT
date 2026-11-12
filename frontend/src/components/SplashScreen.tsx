import { useEffect, useState } from 'react'
import { useLang } from '../hooks/useLang'
import { asset } from '../utils/assets'
import HourglassAnimated from './HourglassAnimated'
import '../pages/screens.css'
import './splash.css'

const MIN_MS = 3200 // long enough to see the sand run and the glass start to turn
const MAX_MS = 4800 // never block the app longer than this, even if an image is slow

type Props = { onDone: () => void }

// Loading screen shown when the app opens: same look as the welcome page,
// with a living hourglass (sand flows, glass turns over) while the app is getting ready.
export default function SplashScreen({ onDone }: Props) {
  const { t } = useLang()
  const [imageReady, setImageReady] = useState(false)
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
    if (imageReady && minPassed) onDone()
  }, [imageReady, minPassed, onDone])

  return (
    <div className="welcome splash">
      <div className="stars" />
      <div className="welcome-main">
        <div className="splash-hourglass-wrap">
          <HourglassAnimated />
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
      <img
        className="skyline"
        src={asset('img/welcome-skyline.webp')}
        alt=""
        onLoad={() => setImageReady(true)}
        onError={() => setImageReady(true)}
      />
    </div>
  )
}
