import { Briefcase, Dumbbell, GraduationCap, Sparkles, User, type LucideIcon } from 'lucide-react'
import type { Category } from '../../data/taskTypes'

export const CATEGORY_ORDER: Category[] = ['personal', 'work', 'study', 'sport', 'other']

export const CATEGORY_META: Record<Category, { icon: LucideIcon; color: string }> = {
  personal: { icon: User, color: '#27b6ff' },
  work: { icon: Briefcase, color: '#a78bfa' },
  study: { icon: GraduationCap, color: '#34d399' },
  sport: { icon: Dumbbell, color: '#f4b43f' },
  other: { icon: Sparkles, color: '#f472b6' },
}
