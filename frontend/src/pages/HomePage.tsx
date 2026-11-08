import PagePlaceholder from '../components/PagePlaceholder'
import { useLang } from '../hooks/useLang'

export default function HomePage() {
  const { t } = useLang()
  return <PagePlaceholder title={t.nav.home} />
}
