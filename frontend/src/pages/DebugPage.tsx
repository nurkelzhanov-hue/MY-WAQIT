import { useState } from 'react'
import { API_URL, getInitData } from '../utils/api'

export default function DebugPage() {
  const [log, setLog] = useState<string[]>([])
  const add = (s: string) => setLog((l) => [...l, s])
  const initData = getInitData()

  async function test(path: string) {
    add(`> ${path} ...`)
    try {
      const res = await fetch(`${API_URL}${path}`, {
        headers: initData ? { Authorization: `tma ${initData}` } : {},
      })
      const text = (await res.text()).slice(0, 200)
      add(`${path}: ${res.status} ${text}`)
    } catch (e) {
      add(`${path}: ERROR ${String(e)}`)
    }
  }

  return (
    <section style={{ padding: 16, fontSize: 14 }}>
      <h2>Diagnostika</h2>
      <p>API_URL: <b>{API_URL || '(bos!)'}</b></p>
      <p>Telegram initData: <b>{initData ? `bar (${initData.length} belgi)` : 'JOQ'}</b></p>
      <p>localStorage dirty: <b>{(() => { try { return localStorage.getItem('waqit_sync_dirty_v1') ?? 'null' } catch { return 'err' } })()}</b></p>
      <p>localStorage synced: <b>{(() => { try { return localStorage.getItem('waqit_synced_v1') ?? 'null' } catch { return 'err' } })()}</b></p>
      <button onClick={() => test('/api/health')} style={{ margin: 4, padding: 8 }}>Test /api/health</button>
      <button onClick={() => test('/api/tasks')} style={{ margin: 4, padding: 8 }}>Test /api/tasks</button>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{log.join('\n')}</pre>
    </section>
  )
}
