import { allergenIds, allergenText, type AllergenInfo } from '../../../lib/allergens'
import type { PublicLocale } from '../../../lib/i18n/locales'

export function AllergenDetails({ info, locale }: { info: AllergenInfo | undefined; locale: PublicLocale }) {
  if (!info || info.status === 'NOT_VERIFIED') return null
  const t = allergenText[locale]
  if (info.status === 'VERIFIED_NONE_IDENTIFIED' && info.allergens.length === 0) return <span className="allergen-details">{t.nonePublic}</span>
  const selected = allergenIds.filter(id => info.allergens.includes(id))
  if (info.status !== 'VERIFIED_WITH_ALLERGENS' || selected.length === 0) return null
  return <span className="allergen-details"><strong>{t.contains}: </strong>{selected.map(id => t.names[id]).join('; ')}</span>
}
