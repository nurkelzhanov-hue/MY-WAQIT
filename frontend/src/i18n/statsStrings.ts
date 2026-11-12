import type { Lang } from './index'

export type StatsStrings = {
  title: string
  tabStats: string
  tabGoals: string
  tabAwards: string
  total: string
  done: string
  missed: string
  rate: string
  weekTitle: string
  monthTitle: string
  monthTotal: string
  noData: string
  goalTitle: string
  goalLine: (n: number) => string
  goalDays: (a: number, b: number) => string
  dailyTitle: string
  dailyProgress: (a: number, b: number) => string
  dailyEmpty: string
  dailyGoal: string
  streakLabel: string
  bannerDone: string
  bannerLeft: (n: number) => string
  awardsTitle: string
  awardsOpen: (a: number, b: number) => string
  awards: { id: string; name: string; desc: string }[]
  backLabel: string
}

const AWARD_IDS = ['d1', 'd10', 'd50', 'd100', 's3', 's7', 's21']

export const statsStrings: Record<Lang, StatsStrings> = {
  kaa: {
    title: 'Statistika hám maqsetler',
    tabStats: 'Statistika',
    tabGoals: 'Maqsetler',
    tabAwards: 'Jetiskenlikler',
    total: 'Barlıq reje',
    done: 'Orınlanǵan',
    missed: 'Orınlanbaǵan',
    rate: 'Orınlanıw dárejesi',
    weekTitle: 'Háptelik orınlanıw',
    monthTitle: 'Aylıq nátiyje',
    monthTotal: 'Jalpı reje',
    noData: 'Ele reje joq',
    goalTitle: 'Aylıq maqset',
    goalLine: (n) => `Kúnde keminde ${n} rejeni orınlaw`,
    goalDays: (a, b) => `${a} / ${b} kún`,
    dailyTitle: 'Kúnlik maqset',
    dailyProgress: (a, b) => `${a} / ${b} orınlanǵan`,
    dailyEmpty: 'Búgin rejeler joq',
    dailyGoal: 'Kúnine reje sanı',
    streakLabel: 'Ketpek ketlik kún',
    bannerDone: 'Búgingi maqset orınlandı. Jaraysız!',
    bannerLeft: (n) => `Búgingi maqsetke taǵı ${n} reje qaldı`,
    awardsTitle: 'Jetiskenlikler',
    awardsOpen: (a, b) => `${a} / ${b} ashıldı`,
    awards: [
      { id: 'd1', name: 'Birinshi qádem', desc: '1 rejeni orınlań' },
      { id: 'd10', name: 'Jaqsı bastaw', desc: '10 rejeni orınlań' },
      { id: 'd50', name: 'Sabırlı', desc: '50 rejeni orınlań' },
      { id: 'd100', name: 'Júzlik', desc: '100 rejeni orınlań' },
      { id: 's3', name: '3 kún izbe-iz', desc: '3 kún izbe-iz reje orınlań' },
      { id: 's7', name: 'Hápte intizamı', desc: '7 kún izbe-iz reje orınlań' },
      { id: 's21', name: '21 kún', desc: '21 kún izbe-iz reje orınlań' },
    ],
    backLabel: 'Artqa',
  },
  uz: {
    title: 'Statistika va maqsadlar',
    tabStats: 'Statistika',
    tabGoals: 'Maqsadlar',
    tabAwards: 'Yutuqlar',
    total: 'Jami reja',
    done: 'Bajarilgan',
    missed: 'Bajarilmagan',
    rate: 'Bajarilish darajasi',
    weekTitle: 'Haftalik bajarilish',
    monthTitle: 'Oylik natija',
    monthTotal: 'Jami reja',
    noData: 'Hali reja yoʻq',
    goalTitle: 'Oylik maqsad',
    goalLine: (n) => `Kuniga kamida ${n} ta rejani bajarish`,
    goalDays: (a, b) => `${a} / ${b} kun`,
    dailyTitle: 'Kunlik maqsad',
    dailyProgress: (a, b) => `${a} / ${b} bajarilgan`,
    dailyEmpty: 'Bugun rejalar yoʻq',
    dailyGoal: 'Kuniga rejalar soni',
    streakLabel: 'Ketma-ket kunlar',
    bannerDone: 'Bugungi maqsad bajarildi. Barakalla!',
    bannerLeft: (n) => `Bugungi maqsadgacha yana ${n} ta reja qoldi`,
    awardsTitle: 'Yutuqlar',
    awardsOpen: (a, b) => `${a} / ${b} ochildi`,
    awards: [
      { id: 'd1', name: 'Birinchi qadam', desc: '1 ta rejani bajaring' },
      { id: 'd10', name: 'Yaxshi boshlanish', desc: '10 ta rejani bajaring' },
      { id: 'd50', name: 'Sabrli', desc: '50 ta rejani bajaring' },
      { id: 'd100', name: 'Yuzlik', desc: '100 ta rejani bajaring' },
      { id: 's3', name: '3 kun ketma-ket', desc: '3 kun ketma-ket reja bajaring' },
      { id: 's7', name: 'Hafta intizomi', desc: '7 kun ketma-ket reja bajaring' },
      { id: 's21', name: '21 kun', desc: '21 kun ketma-ket reja bajaring' },
    ],
    backLabel: 'Orqaga',
  },
  ru: {
    title: 'Статистика и цели',
    tabStats: 'Статистика',
    tabGoals: 'Цели',
    tabAwards: 'Достижения',
    total: 'Всего планов',
    done: 'Выполнено',
    missed: 'Не выполнено',
    rate: 'Уровень выполнения',
    weekTitle: 'Выполнение за неделю',
    monthTitle: 'Итог месяца',
    monthTotal: 'Всего планов',
    noData: 'Пока нет планов',
    goalTitle: 'Цель на месяц',
    goalLine: (n) => `Минимум в день: ${n}`,
    goalDays: (a, b) => `${a} / ${b} дн.`,
    dailyTitle: 'Цель на день',
    dailyProgress: (a, b) => `${a} / ${b} выполнено`,
    dailyEmpty: 'Сегодня планов нет',
    dailyGoal: 'Планов в день',
    streakLabel: 'Дней подряд',
    bannerDone: 'Цель на сегодня выполнена. Отлично!',
    bannerLeft: (n) => `До цели на сегодня осталось планов: ${n}`,
    awardsTitle: 'Достижения',
    awardsOpen: (a, b) => `${a} / ${b} открыто`,
    awards: [
      { id: 'd1', name: 'Первый шаг', desc: 'Выполните 1 план' },
      { id: 'd10', name: 'Хорошее начало', desc: 'Выполните 10 планов' },
      { id: 'd50', name: 'Терпеливый', desc: 'Выполните 50 планов' },
      { id: 'd100', name: 'Сотня', desc: 'Выполните 100 планов' },
      { id: 's3', name: '3 дня подряд', desc: 'Выполняйте планы 3 дня подряд' },
      { id: 's7', name: 'Дисциплина недели', desc: 'Выполняйте планы 7 дней подряд' },
      { id: 's21', name: '21 день', desc: 'Выполняйте планы 21 день подряд' },
    ],
    backLabel: 'Назад',
  },
}

export { AWARD_IDS }
