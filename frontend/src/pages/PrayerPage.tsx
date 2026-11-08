import PagePlaceholder from '../components/PagePlaceholder'
import { useLang } from '../hooks/useLang'

export default function PrayerPage() {
  const { t } = useLang()
  return <PagePlaceholder title={t.prayer.title} />
}
