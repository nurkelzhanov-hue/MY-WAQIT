import PagePlaceholder from '../components/PagePlaceholder'
import { useLang } from '../hooks/useLang'

export default function NewTaskPage() {
  const { t } = useLang()
  return <PagePlaceholder title={t.home.newTask} />
}
