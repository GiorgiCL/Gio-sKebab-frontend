import { useState } from 'react'
import type { PublicLocale } from '../../lib/i18n/locales'
import { adminRequest, message } from './api'
import { confirmDiscard, useDirtyGuard, useLoad } from './hooks'
import { useAdminLanguage } from './languageContext'
import { Checkbox, DeleteDialog, Field, LoadError, Loading, Notice, PageHeading } from './shared'
import { TranslationEditor } from './TranslationEditor'
import { collectTranslations, makeTranslationDraft } from './translationDraft'
import type { Promotion, PromotionInput } from './types'

export function PromotionsPage() {
  const resource = useLoad(() => adminRequest<Promotion[]>('/api/admin/promotions'))
  if (resource.loading) return <Loading />
  if (resource.error) return <LoadError error={resource.error} retry={resource.refresh} />
  return <PromotionsContent initial={resource.data ?? []} />
}

function PromotionsContent({ initial }: { initial: Promotion[] }) {
  const { t } = useAdminLanguage()
  const [rows, setRows] = useState(initial)
  const [editing, setEditing] = useState<Promotion | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Promotion | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const sorted = [...rows].sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id)
  const remove = async () => {
    if (!deleting || busy) return
    setBusy(true); setError(null)
    try { await adminRequest<void>(`/api/admin/promotions/${deleting.id}`, { method: 'DELETE' }); setRows(current => current.filter(row => row.id !== deleting.id)); setDeleting(null); setNotice(t.promotionDeleted) }
    catch (error) { setError(message(error)) } finally { setBusy(false) }
  }
  if (editing) return <><PageHeading kicker={t.promotions} title={editing === 'new' ? t.newPromotion : t.editPromotion} description={t.promotionEditorHint} />
    <PromotionForm key={editing === 'new' ? 'new' : editing.id} initial={editing === 'new' ? null : editing} onCancel={() => setEditing(null)}
      onSaved={value => { setRows(current => [...current.filter(row => row.id !== value.id), value]); setEditing(null); setNotice(t.promotionSaved) }} /></>
  return <><PageHeading kicker={t.currentOffers} title={t.promotions} description={t.promotionsDescription} action={<button type="button" className="admin-button" onClick={() => setEditing('new')}>{t.addPromotion}</button>} />
    <p className="admin-info">{t.timezoneInfo}{rows[0]?.timeZone ? ` (${rows[0].timeZone})` : ''}</p><Notice text={notice} kind="success" />
    {rows.length === 0 && <div className="admin-empty"><h2>{t.noPromotions}</h2><p>{t.noPromotionsHint}</p></div>}
    <div className="admin-list">{sorted.map(row => <div className="admin-list-row" key={row.id}><div><strong lang="lt">{row.title}</strong><span>{t.order} {row.displayOrder} · {row.active ? t.active : t.inactive}{row.startsAt ? ` · ${t.from} ${formatLocal(row.startsAt)}` : ''}{row.endsAt ? ` · ${t.until} ${formatLocal(row.endsAt)}` : ''}</span>{row.description && <p lang="lt">{row.description}</p>}</div>
      <div className="admin-actions"><button type="button" className="admin-text-button" onClick={() => setEditing(row)}>{t.edit}</button><button type="button" className="admin-text-button danger-text" onClick={() => { setError(null); setDeleting(row) }}>{t.delete}</button></div></div>)}</div>
    {deleting && <DeleteDialog name={deleting.title} onCancel={() => setDeleting(null)} onDelete={remove} busy={busy} error={error} />}
  </>
}

function PromotionForm({ initial, onCancel, onSaved }: { initial: Promotion | null; onCancel: () => void; onSaved: (value: Promotion) => void }) {
  const { t } = useAdminLanguage()
  const baseline = { active: initial?.active ?? true, startsAt: initial?.startsAt ?? null, endsAt: initial?.endsAt ?? null, displayOrder: initial?.displayOrder ?? 0 }
  const initialDraft = makeTranslationDraft({ first: initial?.title ?? '', second: initial?.description ?? '' }, {
    en: { first: initial?.translations.en?.title ?? '', second: initial?.translations.en?.description ?? '' },
    ru: { first: initial?.translations.ru?.title ?? '', second: initial?.translations.ru?.description ?? '' },
    ka: { first: initial?.translations.ka?.title ?? '', second: initial?.translations.ka?.description ?? '' },
  })
  const [shared, setShared] = useState(baseline)
  const [draft, setDraft] = useState(initialDraft)
  const [contentLocale, setContentLocale] = useState<PublicLocale>('lt')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dirty = JSON.stringify({ shared, draft }) !== JSON.stringify({ shared: baseline, draft: initialDraft })
  useDirtyGuard(dirty)
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (busy) return
    if (!draft.lt.first.trim()) { setContentLocale('lt'); setError(t.lithuanianRequired); return }
    if (shared.startsAt && shared.endsAt && shared.endsAt < shared.startsAt) { setError(t.endInvalid); return }
    setBusy(true); setError(null)
    const body: PromotionInput = { ...shared, title: draft.lt.first.trim(), description: draft.lt.second.trim() || null,
      translations: collectTranslations(draft, (title, description) => ({ title, description })) }
    try { onSaved(await adminRequest<Promotion>(initial ? `/api/admin/promotions/${initial.id}` : '/api/admin/promotions', { method: initial ? 'PUT' : 'POST', body })) }
    catch (error) { setError(message(error)) } finally { setBusy(false) }
  }
  return <form className="admin-inline-form" onSubmit={submit}><TranslationEditor draft={draft} onChange={setDraft} selected={contentLocale} onSelect={setContentLocale} firstLabel={t.title} secondLabel={t.descriptionOptional} secondMax={500} requiredSecond={false} />
    <div className="admin-fields"><Field label={t.startsAt} hint={t.startsHint}><input type="datetime-local" value={shared.startsAt?.slice(0, 16) ?? ''} onChange={event => setShared(current => ({ ...current, startsAt: event.target.value || null }))} /></Field>
      <Field label={t.endsAt} hint={t.endsHint}><input type="datetime-local" value={shared.endsAt?.slice(0, 16) ?? ''} onChange={event => setShared(current => ({ ...current, endsAt: event.target.value || null }))} /></Field>
      <Field label={t.order} hint={t.orderHint}><input required type="number" min="0" step="1" value={shared.displayOrder} onChange={event => setShared(current => ({ ...current, displayOrder: Number(event.target.value) }))} /></Field></div>
    <Checkbox label={t.active} hint={t.promotionActiveHint} checked={shared.active} onChange={active => setShared(current => ({ ...current, active }))} />
    <Notice text={error} /><div className="admin-actions"><button type="button" className="admin-button secondary" onClick={() => { if (confirmDiscard(dirty)) onCancel() }}>{t.cancel}</button><button type="submit" className="admin-button" disabled={busy || !dirty}>{busy ? t.saving : t.savePromotion}</button></div>
  </form>
}
function formatLocal(value: string) { return value.replace('T', ' ').slice(0, 16) }
