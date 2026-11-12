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
    appSubtitle: string
    planned: string
    goalsTitle: string
    goalsProgress: (done: number, total: number) => string
    goals: string[]
  }
  prayer: {
    title: string
    names: string[] // Fajr, Dhuhr, Asr, Maghrib, Isha
    location: string
    remindersLabel: string
    settings: string
    pendingNote: string
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
    category: string
    categories: { personal: string; work: string; study: string; sport: string; other: string }
  }
  ai: {
    title: string
    intro: string
    bannerSub: string
    chipAddTask: string
    chipToday: string
    chipTomorrow: string
    chipPrayer: string
    placeholder: string
    voicePrompt: string
    pendingReply: string
    send: string
    voice: string
    cancel: string
    confirm: string
  }
  reminders: {
    tabAll: string
    tabDaily: string
    tabPrayer: string
    today: string
    dailySummary: string
    prayerAtTime: string
  }
  profile: {
    guestName: string
    personalInfo: string
    settings: string
    language: string
    location: string
    timezone: string
    deleteData: string
    logout: string
    deleteQuestion: string
    deleteConfirm: string
    cancel: string
  }
  months: string[]
  monthsTitle: string[] // month names used as headings
  weekdaysShort: string[] // Monday first
  calendar: {
    noTasks: string
    month: string
    week: string
    day: string
    done: string
  }
  weekdays: string[] // Monday first
  demoTasks: string[] // temporary sample data until the database is connected
}
