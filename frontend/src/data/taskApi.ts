import { apiFetch } from '../utils/api'
import type { Task } from './taskTypes'

export const fetchTasks = () => apiFetch<Task[]>('/api/tasks')

export const upsertTask = (task: Task) =>
  apiFetch<{ ok: boolean }>(`/api/tasks/${task.id}`, { method: 'PUT', body: JSON.stringify(task) })

export const deleteTask = (id: string) => apiFetch<{ ok: boolean }>(`/api/tasks/${id}`, { method: 'DELETE' })

export const setTaskDone = (id: string, day: string, done: boolean) =>
  apiFetch<{ ok: boolean }>(`/api/tasks/${id}/done/${day}`, { method: 'PUT', body: JSON.stringify({ done }) })

export const importTasks = (tasks: Task[]) =>
  apiFetch<{ imported: number }>('/api/tasks/import', { method: 'POST', body: JSON.stringify(tasks) })
