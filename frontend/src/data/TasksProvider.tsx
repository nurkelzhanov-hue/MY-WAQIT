import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { TasksContext, type TasksApi } from './TasksContext'
import { loadTasks, makeId, occursOn, saveTasks, type Task } from './taskTypes'
import { toIso, type Ymd } from '../utils/datetime'

export default function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks())

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = useCallback((task: Omit<Task, 'id' | 'doneDates'>) => {
    setTasks((prev) => [...prev, { ...task, id: makeId(), doneDates: [] }])
  }, [])

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toggleDone = useCallback((id: string, day: Ymd) => {
    const iso = toIso(day)
    setTasks((prev) =>
      prev.map((t) =>
        t.id !== id
          ? t
          : {
              ...t,
              doneDates: t.doneDates.includes(iso)
                ? t.doneDates.filter((d) => d !== iso)
                : [...t.doneDates, iso],
            },
      ),
    )
  }, [])

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
