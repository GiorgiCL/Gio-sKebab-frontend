import type { PublicLocale } from '../../lib/i18n/locales'

export const businessIdentity = {
  name: 'UAB Sauce me up',
  companyCode: '306635721',
  vatCode: 'LT100017822119',
  registeredOffice: 'Perkūnkiemio g. 19, LT-12120 Vilnius, Lithuania',
  email: 'Saucemeuplt@gmail.com',
  restaurantAddress: 'Savanorių pr. 51, LT-03149 Vilnius',
  phone: '+370 691 82826',
}

// Footer labels are shared; the full legal documents load with their routes.
export const legalNavigation: Record<PublicLocale, { privacy: string; legal: string; navigation: string }> = {
  lt: { privacy: 'Privatumo pranešimas', legal: 'Verslo informacija', navigation: 'Teisinė informacija' },
  en: { privacy: 'Privacy notice', legal: 'Business information', navigation: 'Legal information' },
  ru: { privacy: 'Уведомление о конфиденциальности', legal: 'Информация о компании', navigation: 'Правовая информация' },
  ka: { privacy: 'კონფიდენციალურობის შესახებ', legal: 'ინფორმაცია კომპანიის შესახებ', navigation: 'სამართლებრივი ინფორმაცია' },
}
