import { useState } from 'react'
import { intlLocales, type PublicLocale } from '../../lib/i18n/locales'
import { adminRequest, ApiError, message } from './api'
import { confirmDiscard, useDirtyGuard, useLoad } from './hooks'
import { useAdminLanguage } from './languageContext'
import { Checkbox, DeleteDialog, Field, LoadError, Loading, Notice, PageHeading } from './shared'
import { TranslationEditor } from './TranslationEditor'
import { collectTranslations, makeTranslationDraft } from './translationDraft'
import type { Category, CategoryInput, Item, ItemInput } from './types'

const base = '/api/admin/menu' as const

export function MenuPage() {
  const resource = useLoad(async () => {
    const [categories, items] = await Promise.all([adminRequest<Category[]>(`${base}/categories`), adminRequest<Item[]>(`${base}/items`)])
    return { categories, items }
  })
  if (resource.loading) return <Loading />
  if (resource.error) return <LoadError error={resource.error} retry={resource.refresh} />
  return <MenuContent initial={resource.data!} />
}

function MenuContent({ initial }: { initial: { categories: Category[]; items: Item[] } }) {
  const { t, locale } = useAdminLanguage()
  const [categories, setCategories] = useState(initial.categories)
  const [items, setItems] = useState(initial.items)
  const [categoryEdit, setCategoryEdit] = useState<Category | 'new' | null>(null)
  const [itemEdit, setItemEdit] = useState<Item | 'new' | null>(null)
  const [deleting, setDeleting] = useState<{ type: 'category' | 'item'; id: number; name: string } | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const sortedCategories = [...categories].sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id)
  const sortedItems = [...items].sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id)
  const price = new Intl.NumberFormat(intlLocales[locale], { style: 'currency', currency: 'EUR' })
  const remove = async () => {
    if (!deleting || busy) return
    setBusy(true); setDeleteError(null)
    try {
      await adminRequest<void>(`${base}/${deleting.type === 'item' ? 'items' : 'categories'}/${deleting.id}`, { method: 'DELETE' })
      if (deleting.type === 'item') setItems(current => current.filter(item => item.id !== deleting.id))
      else setCategories(current => current.filter(category => category.id !== deleting.id))
      setNotice(deleting.type === 'item' ? t.itemDeleted : t.categoryDeleted); setDeleting(null)
    } catch (error) {
      setDeleteError(error instanceof ApiError && error.status === 409 && deleting.type === 'category' ? t.categoryConflict : message(error))
    } finally { setBusy(false) }
  }
  if (categoryEdit) return <><PageHeading kicker={`${t.menu} / ${t.categories}`} title={categoryEdit === 'new' ? t.newCategory : t.editCategory} description={t.categoryEditorHint} />
    <CategoryForm key={categoryEdit === 'new' ? 'new' : categoryEdit.id} initial={categoryEdit === 'new' ? null : categoryEdit}
      onCancel={() => setCategoryEdit(null)} onSaved={value => { setCategories(current => [...current.filter(row => row.id !== value.id), value]); setCategoryEdit(null); setNotice(t.categorySaved) }} /></>
  if (itemEdit) return <><PageHeading kicker={`${t.menu} / ${t.items}`} title={itemEdit === 'new' ? t.newItem : t.editItem} description={t.itemEditorHint} />
    <ItemForm key={itemEdit === 'new' ? 'new' : itemEdit.id} initial={itemEdit === 'new' ? null : itemEdit} categories={sortedCategories}
      onCancel={() => setItemEdit(null)} onSaved={value => { setItems(current => [...current.filter(row => row.id !== value.id), value]); setItemEdit(null); setNotice(t.itemSaved) }} /></>
  return <><PageHeading kicker={t.whatServe} title={t.menu} description={t.menuDescription} /><Notice text={notice} kind="success" />
    <section className="admin-section"><div className="admin-section-header"><div><h2>{t.categories}</h2><p className="admin-muted">{t.categoriesHint}</p></div><button className="admin-button secondary" type="button" onClick={() => setCategoryEdit('new')}>{t.addCategory}</button></div>
      {categories.length === 0 && <div className="admin-empty"><h3>{t.noCategories}</h3><p>{t.noCategoriesHint}</p></div>}
      <div className="admin-list">{sortedCategories.map(category => <div className="admin-list-row" key={category.id}><div><strong lang="lt">{category.name}</strong><span>{t.order} {category.displayOrder} · {category.active ? t.visible : t.hidden} · {items.filter(item => item.categoryId === category.id).length} {t.itemsCount}</span></div>
        <div className="admin-actions"><button type="button" className="admin-text-button" onClick={() => setCategoryEdit(category)}>{t.edit}</button><button type="button" className="admin-text-button danger-text" onClick={() => { setDeleteError(null); setDeleting({ type: 'category', id: category.id, name: category.name }) }}>{t.delete}</button></div></div>)}</div>
    </section>
    <section className="admin-section"><div className="admin-section-header"><div><h2>{t.items}</h2><p className="admin-muted">{t.itemsHint}</p></div><button className="admin-button secondary" type="button" disabled={categories.length === 0} onClick={() => setItemEdit('new')}>{t.addItem}</button></div>
      {items.length === 0 && <div className="admin-empty"><h3>{t.noItems}</h3><p>{t.noItemsHint}</p></div>}
      {sortedCategories.map(category => { const group = sortedItems.filter(item => item.categoryId === category.id); return group.length ? <div className="admin-menu-group" key={category.id}><h3 lang="lt">{category.name}</h3><div className="admin-list">{group.map(item => <div className="admin-list-row" key={item.id}><div><strong><span lang="lt">{item.name}</span> <span className="admin-price">{price.format(item.priceEur)}</span></strong><span>{t.order} {item.displayOrder} · {item.active ? item.available ? t.visible : t.soldOut : t.hidden}{item.featured ? ` · ${t.featured}` : ''}</span></div>
        <div className="admin-actions"><button type="button" className="admin-text-button" onClick={() => setItemEdit(item)}>{t.edit}</button><button type="button" className="admin-text-button danger-text" onClick={() => { setDeleteError(null); setDeleting({ type: 'item', id: item.id, name: item.name }) }}>{t.delete}</button></div></div>)}</div></div> : null })}
    </section>
    {deleting && <DeleteDialog name={deleting.name} onCancel={() => setDeleting(null)} onDelete={remove} busy={busy} error={deleteError} />}
  </>
}

function CategoryForm({ initial, onCancel, onSaved }: { initial: Category | null; onCancel: () => void; onSaved: (value: Category) => void }) {
  const { t } = useAdminLanguage()
  const baseline = { displayOrder: initial?.displayOrder ?? 0, active: initial?.active ?? true }
  const initialDraft = makeTranslationDraft({ first: initial?.name ?? '', second: '' }, {
    en: { first: initial?.translations.en?.name ?? '' }, ru: { first: initial?.translations.ru?.name ?? '' }, ka: { first: initial?.translations.ka?.name ?? '' },
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
    setBusy(true); setError(null)
    const body: CategoryInput = { ...shared, name: draft.lt.first.trim(), translations: collectTranslations(draft, name => ({ name })) }
    try { onSaved(await adminRequest<Category>(initial ? `${base}/categories/${initial.id}` : `${base}/categories`, { method: initial ? 'PUT' : 'POST', body })) }
    catch (error) { setError(message(error)) } finally { setBusy(false) }
  }
  return <form className="admin-inline-form" onSubmit={submit}><TranslationEditor draft={draft} onChange={setDraft} selected={contentLocale} onSelect={setContentLocale} firstLabel={t.name} />
    <Field label={t.order} hint={t.orderHint}><input type="number" min="0" step="1" required value={shared.displayOrder} onChange={event => setShared(current => ({ ...current, displayOrder: Number(event.target.value) }))} /></Field>
    <Checkbox label={t.active} hint={t.categoryActiveHint} checked={shared.active} onChange={active => setShared(current => ({ ...current, active }))} />
    <Notice text={error} /><div className="admin-actions"><button type="button" className="admin-button secondary" onClick={() => { if (confirmDiscard(dirty)) onCancel() }}>{t.cancel}</button><button type="submit" className="admin-button" disabled={busy || !dirty}>{busy ? t.saving : t.saveCategory}</button></div>
  </form>
}

function ItemForm({ initial, categories, onCancel, onSaved }: { initial: Item | null; categories: Category[]; onCancel: () => void; onSaved: (value: Item) => void }) {
  const { t } = useAdminLanguage()
  type SharedItem = Omit<ItemInput, 'name' | 'description' | 'priceEur' | 'translations'> & { priceEur: string }
  const baseline: SharedItem = initial ? { categoryId: initial.categoryId, priceEur: String(initial.priceEur), active: initial.active, available: initial.available, featured: initial.featured, imageUrl: initial.imageUrl, displayOrder: initial.displayOrder } :
    { categoryId: categories[0].id, priceEur: '', active: true, available: true, featured: false, imageUrl: null, displayOrder: 0 }
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
  const dirty = JSON.stringify({ shared, draft }) !== JSON.stringify({ shared: baseline, draft: initialDraft })
  useDirtyGuard(dirty)
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (busy) return
    if (!draft.lt.first.trim() || !draft.lt.second.trim()) { setContentLocale('lt'); setError(t.lithuanianRequired); return }
    const priceText = shared.priceEur.replace(',', '.')
    if (!/^\d{1,8}(\.\d{1,2})?$/.test(priceText) || Number(priceText) < .01) { setError(t.priceInvalid); return }
    setBusy(true); setError(null)
    const body: ItemInput = { ...shared, priceEur: Number(priceText), imageUrl: shared.imageUrl?.trim() || null,
      name: draft.lt.first.trim(), description: draft.lt.second.trim(),
      translations: collectTranslations(draft, (name, description) => ({ name, description })) }
    try { onSaved(await adminRequest<Item>(initial ? `${base}/items/${initial.id}` : `${base}/items`, { method: initial ? 'PUT' : 'POST', body })) }
    catch (error) { setError(message(error)) } finally { setBusy(false) }
  }
  return <form className="admin-inline-form" onSubmit={submit}><TranslationEditor draft={draft} onChange={setDraft} selected={contentLocale} onSelect={setContentLocale} firstLabel={t.name} secondLabel={t.description} />
    <div className="admin-fields"><Field label={t.category}><select value={shared.categoryId} onChange={event => setShared(current => ({ ...current, categoryId: Number(event.target.value) }))}>{categories.map(category => <option key={category.id} value={category.id}>{category.name}{!category.active ? ` (${t.hidden})` : ''}</option>)}</select></Field>
      <Field label={t.priceEur}><input required type="text" inputMode="decimal" pattern="[0-9]{1,8}([.,][0-9]{1,2})?" value={shared.priceEur} onChange={event => setShared(current => ({ ...current, priceEur: event.target.value }))} placeholder="8,50" /></Field>
      <Field label={t.order} hint={t.itemOrderHint}><input type="number" min="0" step="1" required value={shared.displayOrder} onChange={event => setShared(current => ({ ...current, displayOrder: Number(event.target.value) }))} /></Field>
      <Field label={t.imageUrl} hint={t.imageHint}><input type="url" pattern="https?://.+" maxLength={2048} value={shared.imageUrl ?? ''} onChange={event => setShared(current => ({ ...current, imageUrl: event.target.value }))} /></Field></div>
    <div className="admin-checks"><Checkbox label={t.active} hint={t.itemActiveHint} checked={shared.active} onChange={active => setShared(current => ({ ...current, active }))} />
      <Checkbox label={t.available} hint={t.availableHint} checked={shared.available} onChange={available => setShared(current => ({ ...current, available }))} />
      <Checkbox label={t.featured} hint={t.featuredHint} checked={shared.featured} onChange={featured => setShared(current => ({ ...current, featured }))} /></div>
    <Notice text={error} /><div className="admin-actions"><button type="button" className="admin-button secondary" onClick={() => { if (confirmDiscard(dirty)) onCancel() }}>{t.cancel}</button><button type="submit" className="admin-button" disabled={busy || !dirty}>{busy ? t.saving : t.saveItem}</button></div>
  </form>
}
