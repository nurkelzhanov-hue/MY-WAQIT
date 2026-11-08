import type { Strings } from './types'

export const ru: Strings = {
  nav: {
    home: 'Главная',
    calendar: 'Календарь',
    ai: 'AI',
    reminders: 'Напоминания',
    profile: 'Профиль',
  },
  placeholder: 'Эта страница будет сделана на следующем шаге.',
  welcome: {
    tagline: 'Ваш AI-помощник по времени и планам',
    telegramLogin: 'Войти через Telegram',
  },
  language: {
    title: 'Выберите язык',
    continue: 'Продолжить',
  },
  home: {
    greetingMorning: 'Доброе утро!',
    greetingDay: 'Добрый день!',
    greetingEvening: 'Добрый вечер!',
    today: 'Сегодня',
    newTask: 'Новый план',
    calendar: 'Календарь',
    ai: 'AI',
    prayer: 'Намаз',
    todayTasks: 'Планы на сегодня',
    viewAll: 'Все',
    reminderBefore: (minutes) => `Напоминание за ${minutes} мин`,
  },
  prayer: {
    title: 'Время намаза',
  },
  months: [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ],
  weekdays: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
  demoTasks: ['Личная встреча', 'Подготовка к занятию', 'Спорт'],
}
