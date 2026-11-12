import { createContext } from 'react'
import type { Task } from './taskTypes'
import type { Ymd } from '../utils/datetime'

export type TasksApi = {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'doneDates'>) => void
  removeTask: (id: string) => void
  toggleDone: (id: string, day: Ymd) => void
  tasksOn: (day: Ymd) => Task[]
}

export const TasksContext = createContext<TasksApi | null>(null)
