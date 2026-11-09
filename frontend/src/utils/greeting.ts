type Greetings = {
  greetingMorning: string
  greetingDay: string
  greetingEvening: string
}

export function pickGreeting(hour: number, g: Greetings): string {
  if (hour >= 5 && hour < 12) return g.greetingMorning
  if (hour >= 12 && hour < 18) return g.greetingDay
  return g.greetingEvening
}
