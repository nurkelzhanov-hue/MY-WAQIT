import type { Lang } from './index'

export const prayerStrings: Record<Lang, { source: string; error: string }> = {
  kaa: {
    source: 'Derek: Aladhan API (Muslim World League, Hanafi Ásir). Jergilikli waqıtlar menen salıstırıp kórıń.',
    error: 'Namaz waqıtların alıp bolmadı. Internetti tekserip, betti qayta ashıń.',
  },
  uz: {
    source: 'Manba: Aladhan API (Muslim World League, Hanafiy Asr). Mahalliy vaqtlar bilan solishtirib koʻring.',
    error: 'Namoz vaqtlarini olib boʻlmadi. Internetni tekshirib, sahifani qayta oching.',
  },
  ru: {
    source: 'Источник: Aladhan API (Muslim World League, аср по ханафитскому мазхабу). Сверьте с местным расписанием.',
    error: 'Не удалось получить время намаза. Проверьте интернет и откройте страницу заново.',
  },
}
