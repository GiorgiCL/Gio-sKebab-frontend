import { allergenIds, allergenText, type AllergenInfo, type AllergenStatus } from '../../lib/allergens'
import { useAdminLanguage } from './languageContext'
import { Checkbox, Field } from './shared'

export function AllergenEditor({ value, onChange, disabled }: { value: AllergenInfo; onChange: (value: AllergenInfo) => void; disabled: boolean }) {
  const { locale } = useAdminLanguage()
  const t = allergenText[locale]
  return <fieldset className="admin-shared-section admin-allergens" disabled={disabled}>
    <legend>{t.title}</legend><p className="admin-muted">{t.hint} <a href="https://eur-lex.europa.eu/eli/reg/2011/1169/oj" target="_blank" rel="noopener noreferrer">EU 1169/2011 · II</a></p>
    <Field label={t.state}><select value={value.status} onChange={event => {
      const status = event.target.value as AllergenStatus
      onChange({ status, allergens: status === 'VERIFIED_WITH_ALLERGENS' ? value.allergens : [] })
    }}><option value="NOT_VERIFIED">{t.notVerified}</option><option value="VERIFIED_WITH_ALLERGENS">{t.withAllergens}</option><option value="VERIFIED_NONE_IDENTIFIED">{t.noneIdentified}</option></select></Field>
    {value.status === 'VERIFIED_WITH_ALLERGENS' && <fieldset className="admin-allergen-options"><legend>{t.selection}</legend>
      {allergenIds.map(id => <Checkbox key={id} label={t.names[id]} checked={value.allergens.includes(id)} onChange={checked => onChange({ ...value, allergens: allergenIds.filter(code => code === id ? checked : value.allergens.includes(code)) })} />)}
    </fieldset>}
  </fieldset>
}
