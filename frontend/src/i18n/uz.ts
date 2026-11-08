import type { Strings } from './types'

export const uz: Strings = {
  nav: {
    home: 'Bosh sahifa',
    calendar: 'Kalendar',
    ai: 'AI',
    reminders: 'Eslatmalar',
    profile: 'Profil',
  },
  placeholder: 'Bu sahifa keyingi bosqichda tayyorlanadi.',
  welcome: {
    tagline: 'AI vaqt va reja yordamchingiz',
    telegramLogin: 'Telegram orqali kirish',
  },
  language: {
    title: 'Tilni tanlang',
    continue: 'Davom etish',
  },
  home: {
    greetingMorning: 'Xayrli tong!',
    greetingDay: 'Xayrli kun!',
    greetingEvening: 'Xayrli kech!',
    today: 'Bugun',
    newTask: 'Yangi reja',
    calendar: 'Kalendar',
    ai: 'AI',
    prayer: 'Namoz',
    todayTasks: 'Bugungi rejalar',
    viewAll: 'Barchasi',
    reminderBefore: (minutes) => `${minutes} daqiqa oldin eslatma`,
  },
  prayer: {
    title: 'Namoz vaqtlari',
  },
  months: [
    'yanvar',
    'fevral',
    'mart',
    'aprel',
    'may',
    'iyun',
    'iyul',
    'avgust',
    'sentyabr',
    'oktyabr',
    'noyabr',
    'dekabr',
  ],
  weekdays: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'],
  demoTasks: ['Shaxsiy uchrashuv', 'Darsga tayyorlanish', 'Sport'],
}
