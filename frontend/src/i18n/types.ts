export type Strings = {
  nav: {
    home: string
    calendar: string
    ai: string
    reminders: string
    profile: string
  }
  placeholder: string
  welcome: {
    tagline: string
    telegramLogin: string
  }
  language: {
    title: string
    continue: string
  }
  home: {
    greetingMorning: string
    greetingDay: string
    greetingEvening: string
    today: string
    newTask: string
    calendar: string
    ai: string
    prayer: string
    todayTasks: string
    viewAll: string
    reminderBefore: (minutes: number) => string
  }
  prayer: {
    title: string
  }
  months: string[]
  monthsTitle: string[] // month names used as headings
  weekdaysShort: string[] // Monday first
  calendar: {
    noTasks: string
  }
  weekdays: string[] // Monday first
  demoTasks: string[] // temporary sample data until the database is connected
}
