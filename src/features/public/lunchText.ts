import type { PublicLocale } from '../../lib/i18n/locales'

export const lunchText: Record<PublicLocale, { title: string; nav: string; intro: string; empty: string; today: string; call: string; retry: string; error: string }> = {
  lt: { title: 'Pietų meniu', nav: 'Pietūs', intro: 'Dienos pietūs pagal savaitės dieną.', empty: 'Šiai dienai pietų pasiūlymų nėra.', today: 'Šiandien', call: 'Skambinti', retry: 'Bandyti dar kartą', error: 'Pietų meniu nepavyko įkelti.' },
  en: { title: 'Lunch menu', nav: 'Lunch menu', intro: 'Weekday lunch, made fresh at Gio’s.', empty: 'No lunch offers listed for this day.', today: 'Today', call: 'Call us', retry: 'Try again', error: 'The lunch menu could not be loaded.' },
  ru: { title: 'Обеденное меню', nav: 'Обеды', intro: 'Обеденные блюда по дням недели.', empty: 'На этот день обеденных предложений нет.', today: 'Сегодня', call: 'Позвонить', retry: 'Повторить', error: 'Не удалось загрузить обеденное меню.' },
  ka: { title: 'სადილის მენიუ', nav: 'სადილი', intro: 'სადილის შეთავაზებები კვირის დღეების მიხედვით.', empty: 'ამ დღისთვის სადილის შეთავაზებები არ არის.', today: 'დღეს', call: 'დაგვირეკეთ', retry: 'ხელახლა ცდა', error: 'სადილის მენიუ ვერ ჩაიტვირთა.' },
}
