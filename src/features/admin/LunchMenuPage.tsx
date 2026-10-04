import { safeImageUrl } from '../../lib/imageUrls'
import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { intlLocales, type PublicLocale } from '../../lib/i18n/locales'
import { adminRequest, message } from './api'
import { AdminImageField } from './AdminImageField'
import { confirmDiscard, useDirtyGuard, useLoad } from './hooks'
import { useAdminLanguage } from './languageContext'
import { Checkbox, DeleteDialog, Field, LoadError, Loading, Notice, PageHeading } from './shared'
import { TranslationEditor } from './TranslationEditor'
import { collectTranslations, makeTranslationDraft } from './translationDraft'
import type { Day, LunchInput, LunchItem } from './types'

const base = '/api/admin/lunch-menu/items'
const days: Day[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

export function LunchMenuPage() {
  const resource = useLoad(() => adminRequest<LunchItem[]>(base))
  if (resource.loading) return <Loading />
  if (resource.error) return <LoadError error={resource.error} retry={resource.refresh} />
  return <LunchContent initial={resource.data!} />
}

function LunchContent({ initial }: { initial: LunchItem[] }) {
  const { t, locale } = useAdminLanguage()
  const [items, setItems] = useState(initial)
  const [selectedDay, setSelectedDay] = useState<Day>('MONDAY')
  const [editing, setEditing] = useState<LunchItem | 'new' | null>(null)
  const [deleting, setDeleting] = useState<LunchItem | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const dayTabs = useRef<(HTMLButtonElement | null)[]>([])
  const returnFocus = useRef<string>('admin-add-lunch')
  const price = new Intl.NumberFormat(intlLocales[locale], { style: 'currency', currency: 'EUR' })
  const dayLabel = (day: Day) => t[day.toLowerCase() as Lowercase<Day>]
  const openEditor = (item: LunchItem | 'new', focusId: string) => {
    returnFocus.current = focusId; setEditing(item); window.scrollTo(0, 0)
  }
  const closeEditor = () => {
    setEditing(null)
    requestAnimationFrame(() => document.getElementById(returnFocus.current)?.focus({ preventScroll: true }))
  }
  const remove = async () => {
    if (!deleting || busy) return
    setBusy(true); setDeleteError(null)
    try {
      await adminRequest<void>(`${base}/${deleting.id}`, { method: 'DELETE' })
      setItems(current => current.filter(item => item.id !== deleting.id))
      setDeleting(null); setNotice(t.lunchDeleted)
    } catch (error) { setDeleteError(message(error)) } finally { setBusy(false) }
  }
  const onDayKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = days.indexOf(selectedDay)
    const next = event.key === 'ArrowRight' ? (current + 1) % 7 : event.key === 'ArrowLeft' ? (current + 6) % 7 : event.key === 'Home' ? 0 : event.key === 'End' ? 6 : -1
    if (next >= 0) { event.preventDefault(); setSelectedDay(days[next]); dayTabs.current[next]?.focus() }
  }
  if (editing) return <><PageHeading kicker={t.lunchMenu} title={editing === 'new' ? t.newLunchItem : t.editLunchItem} description={t.lunchEditorHint} />
    <LunchForm key={editing === 'new' ? 'new' : editing.id} initial={editing === 'new' ? null : editing} defaultDay={selectedDay} onCancel={closeEditor}
      onSaved={item => { setItems(current => [...current.filter(row => row.id !== item.id), item]); setSelectedDay(item.dayOfWeek); closeEditor(); setNotice(t.lunchSaved) }} /></>
  const group = items.filter(item => item.dayOfWeek === selectedDay).sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id)
  return <><PageHeading kicker={t.whatServe} title={t.lunchMenu} description={t.lunchDescription} action={<button id="admin-add-lunch" type="button" className="admin-button" onClick={() => openEditor('new', 'admin-add-lunch')}>{t.addLunchItem}</button>} />
    <Notice text={notice} kind="success" />
    {items.length === 0 && <p className="admin-muted">{t.noLunchItems}</p>}
    <section className="admin-section" aria-label={t.lunchMenu}>
      <div className="admin-lunch-tabs" role="tablist" aria-label={t.lunchDay} onKeyDown={onDayKeys}>
        {days.map((day, index) => <button type="button" role="tab" key={day} ref={node => { dayTabs.current[index] = node }} id={`admin-lunch-tab-${day}`}
          aria-controls="admin-lunch-panel" aria-selected={selectedDay === day} tabIndex={selectedDay === day ? 0 : -1}
          onClick={() => setSelectedDay(day)}>{dayLabel(day)} <span>{items.filter(item => item.dayOfWeek === day).length}</span></button>)}
      </div>
      <div id="admin-lunch-panel" role="tabpanel" aria-labelledby={`admin-lunch-tab-${selectedDay}`} tabIndex={0}>
        <div className="admin-menu-group-heading"><h2>{dayLabel(selectedDay)}</h2><span>{group.length}</span></div>
        {group.length === 0 ? <div className="admin-empty"><p>{t.noLunchDayItems}</p></div> : <div className="admin-list">{group.map(item => <div className="admin-list-row admin-product-row" key={item.id}>
          <div className="admin-product-main"><strong lang="lt">{item.name}</strong><span className="admin-product-meta"><span className="admin-price">{price.format(item.priceEur)}</span><span>{t.order} {item.displayOrder}</span>{item.imageUrl && <span>{t.hasImage}</span>}</span>
            <span className="admin-badges">{!item.active && <span className="admin-badge quiet">{t.hidden}</span>}{!item.available && <span className="admin-badge warning">{t.soldOut}</span>}{item.active && item.available && <span className="admin-badge quiet">{t.visible}</span>}</span></div>
          <div className="admin-actions"><button id={`admin-lunch-${item.id}`} type="button" className="admin-text-button" onClick={() => openEditor(item, `admin-lunch-${item.id}`)}>{t.edit}</button>
            <button type="button" className="admin-text-button danger-text" onClick={() => { setDeleteError(null); setDeleting(item) }}>{t.delete}</button></div>
        </div>)}</div>}
      </div>
    </section>
    {deleting && <DeleteDialog name={deleting.name} onCancel={() => setDeleting(null)} onDelete={remove} busy={busy} error={deleteError} />}
  </>
}

function LunchForm({ initial, defaultDay, onCancel, onSaved }: { initial: LunchItem | null; defaultDay: Day; onCancel: () => void; onSaved: (item: LunchItem) => void }) {
  const { t } = useAdminLanguage()
  type Shared = Omit<LunchInput, 'name' | 'description' | 'priceEur' | 'translations'> & { priceEur: string }
  const baseline: Shared = initial ? { dayOfWeek: initial.dayOfWeek, priceEur: String(initial.priceEur), active: initial.active, available: initial.available, displayOrder: initial.displayOrder, imageUrl: initial.imageUrl } :
    { dayOfWeek: defaultDay, priceEur: '', active: true, available: true, displayOrder: 0, imageUrl: null }
  const initialDraft = makeTranslationDraft({ first: initial?.name ?? '', second: initial?.description ?? '' }, {
    en: { first: initial?.translations.en?.name ?? '', second: initial?.translations.en?.description ?? '' },
    ru: { first: initial?.translations.ru?.name ?? '', second: initial?.translations.ru?.description ?? '' },
    ka: { first: initial?.translations.ka?.name ?? '', second: initial?.translations.ka?.description ?? '' },
  })
  const [shared, setShared] = useState(baseline)
  const [draft, setDraft] = useState(initialDraft)
  const [contentLocale, setContentLocale] = useState<PublicLocale>('lt')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [removePhoto, setRemovePhoto] = useState(false)
  const [persistedItem, setPersistedItem] = useState<LunchItem | null>(initial)
  const dirty = JSON.stringify({ shared, draft, selectedFile: selectedFile && [selectedFile.name, selectedFile.size, selectedFile.lastModified], removePhoto }) !== JSON.stringify({ shared: baseline, draft: initialDraft, selectedFile: null, removePhoto: false })
  useDirtyGuard(dirty)
  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (busy) return
    if (!draft.lt.first.trim()) { setContentLocale('lt'); setError(t.lithuanianRequired); return }
    const priceText = shared.priceEur.replace(',', '.')
    if (!/^\d{1,8}(\.\d{1,2})?$/.test(priceText) || Number(priceText) < .01) { setError(t.priceInvalid); return }
    const body: LunchInput = { ...shared, priceEur: Number(priceText), imageUrl: safeImageUrl(shared.imageUrl),
      name: draft.lt.first.trim(), description: draft.lt.second.trim() || null,
      translations: collectTranslations(draft, (name, description) => ({ name, description })) }
    setBusy(true); setError(null)
    try {
      let saved = await adminRequest<LunchItem>(persistedItem ? `${base}/${persistedItem.id}` : base, { method: persistedItem ? 'PUT' : 'POST', body })
      setPersistedItem(saved)
      if (selectedFile) {
        const form = new FormData(); form.append('file', selectedFile)
        saved = await adminRequest<LunchItem>(`${base}/${saved.id}/image`, { method: 'POST', body: form })
      } else if (removePhoto && saved.imageUrl) {
        saved = await adminRequest<LunchItem>(`${base}/${saved.id}/image`, { method: 'DELETE' })
      }
      onSaved(saved)
    }
    catch (cause) { setError(message(cause)) } finally { setBusy(false) }
  }
  return <form className="admin-inline-form" onSubmit={submit}>
    <TranslationEditor draft={draft} onChange={setDraft} selected={contentLocale} onSelect={setContentLocale} firstLabel={t.name} secondLabel={t.descriptionOptional} requiredSecond={false} />
    <section className="admin-shared-section" aria-label={t.itemDetails}><h2>{t.itemDetails}</h2><div className="admin-fields">
      <Field label={t.lunchDay}><select value={shared.dayOfWeek} onChange={event => setShared(current => ({ ...current, dayOfWeek: event.target.value as Day }))}>{days.map(day => <option key={day} value={day}>{t[day.toLowerCase() as Lowercase<Day>]}</option>)}</select></Field>
      <Field label={t.priceEur}><input required type="text" inputMode="decimal" pattern="[0-9]{1,8}([.,][0-9]{1,2})?" value={shared.priceEur} onChange={event => setShared(current => ({ ...current, priceEur: event.target.value }))} placeholder="8,50" /></Field>
      <Field label={t.order} hint={t.itemOrderHint}><input type="number" min="0" step="1" required value={shared.displayOrder} onChange={event => setShared(current => ({ ...current, displayOrder: Number(event.target.value) }))} /></Field>
    </div></section>
    <section className="admin-shared-section" aria-label={t.visibility}><h2>{t.visibility}</h2><div className="admin-checks">
      <Checkbox label={t.active} hint={t.itemActiveHint} checked={shared.active} onChange={active => setShared(current => ({ ...current, active }))} />
      <Checkbox label={t.available} hint={t.availableHint} checked={shared.available} onChange={available => setShared(current => ({ ...current, available }))} />
    </div></section>
    <section className="admin-shared-section" aria-label={t.imageSection}><h2>{t.imageSection}</h2><p className="admin-muted">{t.imageShared}</p>
      <AdminImageField imageUrl={removePhoto ? null : shared.imageUrl} selectedFile={selectedFile} disabled={busy}
        onSelect={file => { setSelectedFile(file); setRemovePhoto(false) }} onRemove={() => { setSelectedFile(null); setRemovePhoto(Boolean(shared.imageUrl)) }} />
    </section>
    <Notice text={error} /><div className="admin-actions admin-editor-actions"><span className="admin-dirty-state" aria-live="polite">{dirty ? t.unsaved : initial ? t.allSaved : ''}</span>
      <button type="button" className="admin-button secondary" onClick={() => { if (confirmDiscard(dirty)) onCancel() }}>{t.cancel}</button>
      <button type="submit" className="admin-button" disabled={busy || !dirty}>{busy ? t.saving : t.saveItem}</button></div>
  </form>
}
