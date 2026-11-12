import type { PlanId } from './plans'

// DEMO ONLY: the subscription is stored in this browser until real payments (Payme/Click) and the
// backend are connected. A demo activation is not a payment.
const KEY = 'waqit_demo_plan_v1'

export type DemoSub = { planId: PlanId; until: string } // until = ISO date-time

export function loadDemoSub(): DemoSub | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const sub = JSON.parse(raw) as DemoSub
    return new Date(sub.until).getTime() > Date.now() ? sub : null
  } catch {
    return null
  }
}

export function activateDemo(planId: PlanId, months: number): DemoSub {
  const until = new Date()
  until.setMonth(until.getMonth() + months)
  const sub = { planId, until: until.toISOString() }
  try {
    localStorage.setItem(KEY, JSON.stringify(sub))
  } catch {
    // ignore
  }
  return sub
}

export function clearDemo(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
