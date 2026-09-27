import { useId, useRef } from 'react'
import { publicLocales, type PublicLocale } from '../../lib/i18n/locales'
import { useAdminLanguage } from './languageContext'
import { Field } from './shared'
import type { TranslationDraft, TextDraft } from './translationDraft'

export function TranslationEditor({ draft, onChange, selected, onSelect, firstLabel, secondLabel, secondMax = 1000, firstMax = 160, requiredSecond = true }: {
  draft: TranslationDraft; onChange: (draft: TranslationDraft) => void; selected: PublicLocale; onSelect: (locale: PublicLocale) => void; firstLabel: string; secondLabel?: string; secondMax?: number; firstMax?: number; requiredSecond?: boolean
}) {
  const { t } = useAdminLanguage()
  const id = useId()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const update = (key: keyof TextDraft, value: string) => onChange({ ...draft, [selected]: { ...draft[selected], [key]: value } })
  const missing = selected !== 'lt' && !draft[selected].first.trim() && (!secondLabel || !draft[selected].second.trim())
  const partial = selected !== 'lt' && !missing && (!draft[selected].first.trim() || Boolean(secondLabel && draft.lt.second.trim() && !draft[selected].second.trim()))
  return <section className="admin-translation-editor" aria-label={t.publicContent}>
    <div className="admin-translation-heading"><h2>{t.publicContent}</h2><p>{t.translationHint}</p></div>
    <p className="admin-translation-label">{t.contentLanguage}</p>
    <div className="admin-translation-tabs" role="tablist" aria-label={t.contentLanguage} onKeyDown={event => {
      const current = publicLocales.indexOf(selected)
      const next = event.key === 'ArrowRight' ? (current + 1) % publicLocales.length : event.key === 'ArrowLeft' ? (current + publicLocales.length - 1) % publicLocales.length : event.key === 'Home' ? 0 : event.key === 'End' ? publicLocales.length - 1 : -1
      if (next >= 0) { event.preventDefault(); onSelect(publicLocales[next]); tabs.current[next]?.focus() }
    }}>
      {publicLocales.map((locale, index) => { const emptyLocale = locale !== 'lt' && !draft[locale].first.trim() && (!secondLabel || !draft[locale].second.trim()); return <button key={locale} ref={node => { tabs.current[index] = node }} id={`${id}-tab-${locale}`} type="button" role="tab" aria-selected={selected === locale} aria-controls={`${id}-panel`} tabIndex={selected === locale ? 0 : -1} aria-label={`${locale.toUpperCase()}${emptyLocale ? ` — ${t.missingTranslation}` : ''}`} className={selected === locale ? 'active' : ''} onClick={() => onSelect(locale)}>
        {locale.toUpperCase()}{emptyLocale && <span className="admin-translation-dot" aria-hidden="true" />}
      </button> })}
    </div>
    <div className="admin-translation-panel" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${selected}`}>
      {selected === 'lt' && <p className="admin-translation-status source">{t.lithuanianSource}</p>}
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
