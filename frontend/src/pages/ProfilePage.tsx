import PagePlaceholder from '../components/PagePlaceholder'
import { useLang } from '../hooks/useLang'

export default function ProfilePage() {
  const { t } = useLang()
  return <PagePlaceholder title={t.nav.profile} />
}
