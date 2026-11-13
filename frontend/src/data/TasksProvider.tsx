import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { TasksContext, type TasksApi } from './TasksContext'
import { isUuid, loadTasks, makeId, occursOn, saveTasks, type Task } from './taskTypes'
import { deleteTask, fetchTasks, importTasks, setTaskDone, upsertTask } from './taskApi'
import { isSyncAvailable } from '../utils/api'
import { toIso, type Ymd } from '../utils/datetime'

// Tasks are kept on this device first (instant) and mirrored to the server inside Telegram.
// If a request to the server fails, the device is marked "dirty" and everything is pushed again
// the next time the app opens, comes back online or becomes visible.
const DIRTY_KEY = 'waqit_sync_dirty_v1'
const SYNCED_KEY = 'waqit_synced_v1'

function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function writeFlag(key: string, on: boolean): void {
  try {
    if (on) localStorage.setItem(key, '1')
    else localStorage.removeItem(key)
  } catch {
    // storage unavailable
  }
}

// Tasks created by earlier versions had non-UUID ids; the server needs UUIDs.
function withUuidIds(tasks: Task[]): Task[] {
  return tasks.some((t) => !isUuid(t.id)) ? tasks.map((t) => (isUuid(t.id) ? t : { ...t, id: makeId() })) : tasks
}

export default function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => withUuidIds(loadTasks()))
  const tasksRef = useRef(tasks)
  tasksRef.current = tasks
  const syncing = useRef(false)

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const markFailed = useCallback(() => writeFlag(DIRTY_KEY, true), [])

  const sync = useCallback(async () => {
    if (syncing.current || !isSyncAvailable()) return
    syncing.current = true
    try {
      const startIds = new Set(tasksRef.current.map((t) => t.id))
      if (readFlag(DIRTY_KEY) || !readFlag(SYNCED_KEY)) {
        if (tasksRef.current.length > 0) await importTasks(tasksRef.current)
        writeFlag(SYNCED_KEY, true)
        writeFlag(DIRTY_KEY, false)
      }
      const remote = await fetchTasks()
      // Keep tasks created while the request was running.
      const remoteIds = new Set(remote.map((t) => t.id))
      const added = tasksRef.current.filter((t) => !startIds.has(t.id) && !remoteIds.has(t.id))
      setTasks([...remote, ...added])
    } catch {
      // Offline or server asleep: keep working locally, try again later.
    } finally {
      syncing.current = false
    }
  }, [])

  useEffect(() => {
    void sync()
    const onVisible = () => {
      if (document.visibilityState === 'visible') void sync()
    }
    window.addEventListener('online', sync)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('online', sync)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [sync])

  const addTask = useCallback(
    (task: Omit<Task, 'id' | 'doneDates'>) => {
      const created: Task = { ...task, id: makeId(), doneDates: [] }
      setTasks((prev) => [...prev, created])
      if (isSyncAvailable()) upsertTask(created).catch(markFailed)
    },
    [markFailed],
  )

  const removeTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id))
      if (isSyncAvailable()) deleteTask(id).catch(markFailed)
    },
    [markFailed],
  )

  const toggleDone = useCallback(
    (id: string, day: Ymd) => {
      const iso = toIso(day)
      const current = tasksRef.current.find((t) => t.id === id)
      if (!current) return
      const nowDone = !current.doneDates.includes(iso)
      setTasks((prev) =>
        prev.map((t) =>
          t.id !== id
            ? t
            : { ...t, doneDates: nowDone ? [...t.doneDates, iso] : t.doneDates.filter((d) => d !== iso) },
        ),
      )
      if (isSyncAvailable()) setTaskDone(id, iso, nowDone).catch(markFailed)
    },
    [markFailed],
  )

  const value = useMemo<TasksApi>(
    () => ({
      tasks,
      addTask,
      removeTask,
      toggleDone,
      tasksOn: (day) =>
        tasks.filter((t) => occursOn(t, day)).sort((a, b) => a.time.localeCompare(b.time)),
    }),
    [tasks, addTask, removeTask, toggleDone],
  )

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}
