// Plan prices are configuration, not hardcoded in screens. Amounts are in so'm.
// Later these come from the backend (/api/plans); for now they are the defaults.
export type PlanId = 'pro1' | 'pro3' | 'pro12'

export type PlanDef = { id: PlanId; months: number; price: number }

export const PLANS: PlanDef[] = [
  { id: 'pro1', months: 1, price: 29000 },
  { id: 'pro3', months: 3, price: 79000 },
  { id: 'pro12', months: 12, price: 249000 },
]

export function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
