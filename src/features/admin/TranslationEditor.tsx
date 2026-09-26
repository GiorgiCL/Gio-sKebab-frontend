import { localeNames, publicLocales, type PublicLocale } from '../../lib/i18n/locales'
import { useAdminLanguage } from './languageContext'
import { Field } from './shared'
import type { TranslationDraft, TextDraft } from './translationDraft'

export function TranslationEditor({ draft, onChange, selected, onSelect, firstLabel, secondLabel, secondMax = 1000, firstMax = 160, requiredSecond = true }: {
  draft: TranslationDraft; onChange: (draft: TranslationDraft) => void; selected: PublicLocale; onSelect: (locale: PublicLocale) => void; firstLabel: string; secondLabel?: string; secondMax?: number; firstMax?: number; requiredSecond?: boolean
}) {
  const { t } = useAdminLanguage()
  const update = (key: keyof TextDraft, value: string) => onChange({ ...draft, [selected]: { ...draft[selected], [key]: value } })
  const missing = selected !== 'lt' && !draft[selected].first.trim() && (!secondLabel || !draft[selected].second.trim())
  const partial = selected !== 'lt' && !missing && (!draft[selected].first.trim() || Boolean(secondLabel && !draft[selected].second.trim()))
  return <section className="admin-translation-editor" aria-label={t.contentLanguage}>
    <div className="admin-translation-heading"><h2>{t.contentLanguage}</h2><p>{t.translationHint}</p></div>
    <div className="admin-translation-tabs" role="group" aria-label={t.contentLanguage}>
      {publicLocales.map(locale => { const emptyLocale = locale !== 'lt' && !draft[locale].first.trim() && (!secondLabel || !draft[locale].second.trim()); return <button key={locale} type="button" aria-pressed={selected === locale} aria-label={`${locale.toUpperCase()}${emptyLocale ? ` — ${t.missingTranslation}` : ''}`} className={selected === locale ? 'active' : ''} onClick={() => onSelect(locale)}>
        {locale.toUpperCase()}{emptyLocale && <span className="admin-translation-dot" aria-hidden="true" />}
      </button> })}
    </div>
    <div className="admin-translation-panel" aria-label={`${localeNames[selected]} — ${t.contentLanguage}`}>
      {missing && <p className="admin-translation-status">{t.missingTranslation}</p>}
      {partial && <p className="admin-translation-status">{t.partialTranslation}</p>}
      <div className="admin-fields"><Field label={firstLabel}><input autoFocus lang={selected} required={selected === 'lt'} maxLength={firstMax} value={draft[selected].first} onChange={event => update('first', event.target.value)} /></Field>
        {selected !== 'lt' && !draft[selected].first.trim() && draft.lt.first.trim() && <p className="admin-fallback">{t.fallbackHint} <span lang="lt">{draft.lt.first}</span></p>}
        {secondLabel && <><Field label={secondLabel}><textarea lang={selected} required={selected === 'lt' && requiredSecond} maxLength={secondMax} rows={3} value={draft[selected].second} onChange={event => update('second', event.target.value)} /></Field>
          {selected !== 'lt' && !draft[selected].second.trim() && draft.lt.second.trim() && <p className="admin-fallback">{t.fallbackHint} <span lang="lt">{draft.lt.second}</span></p>}</>}
      </div>
    </div>
  </section>
}
