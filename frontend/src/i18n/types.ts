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
  newTask: {
    taskName: string
    taskNamePlaceholder: string
    description: string
    date: string
    time: string
    reminder: string
    reminderOptions: {
      m5: string
      m10: string
      m15: string
      m30: string
      h1: string
      d1: string
      custom: string
    }
    customMinutes: string
    repeat: string
    repeatOptions: {
      none: string
      daily: string
      weekly: string
      monthly: string
      yearly: string
      weekdays: string
    }
    location: string
    note: string
    save: string
    titleRequired: string
    back: string
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
