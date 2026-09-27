import { useRef, useState } from 'react'
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
  const returnToList = useRef<{ scroll: number; focusId: string } | null>(null)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<number | 'all'>('all')
  const [stateFilter, setStateFilter] = useState<'all' | 'hidden' | 'unavailable' | 'featured'>('all')
  const sortedCategories = [...categories].sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id)
  const sortedItems = [...items].sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id)
  const search = query.trim().toLocaleLowerCase()
  const filteredItems = sortedItems.filter(item => {
    if (categoryFilter !== 'all' && item.categoryId !== categoryFilter) return false
    if (stateFilter === 'hidden' && item.active && categories.find(category => category.id === item.categoryId)?.active) return false
    if (stateFilter === 'unavailable' && item.available) return false
    if (stateFilter === 'featured' && !item.featured) return false
    return !search || [item.name, item.translations.en?.name, item.translations.ru?.name, item.translations.ka?.name].some(name => name?.toLocaleLowerCase().includes(search))
  })
  const price = new Intl.NumberFormat(intlLocales[locale], { style: 'currency', currency: 'EUR' })
  const openEditor = (type: 'category' | 'item', value: Category | Item | 'new', focusId: string) => {
    returnToList.current = { scroll: window.scrollY, focusId }
    if (type === 'category') setCategoryEdit(value as Category | 'new')
    else setItemEdit(value as Item | 'new')
    window.scrollTo(0, 0)
  }
  const closeEditor = () => {
    setCategoryEdit(null); setItemEdit(null)
    const destination = returnToList.current
    window.requestAnimationFrame(() => {
      if (destination) window.scrollTo(0, destination.scroll)
      const focusTarget = document.getElementById(destination?.focusId ?? '') ?? document.getElementById('admin-items-title')
      focusTarget?.focus({ preventScroll: true })
      returnToList.current = null
    })
  }
  const remove = async () => {
    if (!deleting || busy) return
    setBusy(true); setDeleteError(null)
    try {
      await adminRequest<void>(`${base}/${deleting.type === 'item' ? 'items' : 'categories'}/${deleting.id}`, { method: 'DELETE' })
      if (deleting.type === 'item') setItems(current => current.filter(item => item.id !== deleting.id))
      else { setCategories(current => current.filter(category => category.id !== deleting.id)); if (categoryFilter === deleting.id) setCategoryFilter('all') }
      setNotice(deleting.type === 'item' ? t.itemDeleted : t.categoryDeleted); setDeleting(null)
    } catch (error) {
      setDeleteError(error instanceof ApiError && error.status === 409 && deleting.type === 'category' ? t.categoryConflict : message(error))
    } finally { setBusy(false) }
  }
  if (categoryEdit) return <><PageHeading kicker={`${t.menu} / ${t.categories}`} title={categoryEdit === 'new' ? t.newCategory : t.editCategory} description={t.categoryEditorHint} />
    <CategoryForm key={categoryEdit === 'new' ? 'new' : categoryEdit.id} initial={categoryEdit === 'new' ? null : categoryEdit}
      onCancel={closeEditor} onSaved={value => { setCategories(current => [...current.filter(row => row.id !== value.id), value]); closeEditor(); setNotice(t.categorySaved) }} /></>
  if (itemEdit) return <><PageHeading kicker={`${t.menu} / ${t.items}`} title={itemEdit === 'new' ? t.newItem : t.editItem} description={t.itemEditorHint} />
    <ItemForm key={itemEdit === 'new' ? 'new' : itemEdit.id} initial={itemEdit === 'new' ? null : itemEdit} categories={sortedCategories} defaultCategoryId={categoryFilter === 'all' ? undefined : categoryFilter}
      onCancel={closeEditor} onSaved={value => { setItems(current => [...current.filter(row => row.id !== value.id), value]); if (itemEdit === 'new') { setQuery(''); setStateFilter('all'); setCategoryFilter(value.categoryId) }; closeEditor(); setNotice(t.itemSaved) }} /></>
  return <><PageHeading kicker={t.whatServe} title={t.menu} description={t.menuDescription} action={<div className="admin-actions"><button className="admin-button secondary" type="button" onClick={() => document.getElementById('admin-categories-heading')?.focus()}>{t.categories}</button><button id="admin-add-item" className="admin-button" type="button" disabled={categories.length === 0} onClick={() => openEditor('item', 'new', 'admin-add-item')}>{t.addItem}</button></div>} /><Notice text={notice} kind="success" />
    <section className="admin-section admin-menu-workspace" aria-labelledby="admin-items-title">
      <div className="admin-section-header"><div><h2 id="admin-items-title" tabIndex={-1}>{t.items} <span className="admin-count">{items.length}</span></h2><p className="admin-muted">{t.itemsHint}</p></div></div>
      <div className="admin-menu-tools"><Field label={t.searchItems}><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t.searchItemsHint} /></Field>
        <Field label={t.category}><select value={categoryFilter} onChange={event => setCategoryFilter(event.target.value === 'all' ? 'all' : Number(event.target.value))}><option value="all">{t.allCategories}</option>{sortedCategories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></Field>
        <Field label={t.filterStatus}><select value={stateFilter} onChange={event => setStateFilter(event.target.value as typeof stateFilter)}><option value="all">{t.allItems}</option><option value="hidden">{t.hidden}</option><option value="unavailable">{t.soldOut}</option><option value="featured">{t.featured}</option></select></Field></div>
      {items.length === 0 && <div className="admin-empty"><h3>{t.noItems}</h3><p>{t.noItemsHint}</p></div>}
      {items.length > 0 && filteredItems.length === 0 && <div className="admin-empty"><h3>{t.noMatchingItems}</h3><p>{t.noMatchingItemsHint}</p><button type="button" className="admin-button secondary" onClick={() => { setQuery(''); setCategoryFilter('all'); setStateFilter('all') }}>{t.clearFilters}</button></div>}
      {sortedCategories.map(category => { const group = filteredItems.filter(item => item.categoryId === category.id); return group.length ? <div className="admin-menu-group" key={category.id}><div className="admin-menu-group-heading"><h3 lang="lt">{category.name}</h3><span>{group.length}</span></div><div className="admin-list">{group.map(item => <div className="admin-list-row admin-product-row" key={item.id}><div className="admin-product-main"><strong lang="lt">{item.name}</strong><span className="admin-product-meta"><span className="admin-price">{price.format(item.priceEur)}</span><span>{t.order} {item.displayOrder}</span>{item.imageUrl && <span>{t.hasImage}</span>}</span><span className="admin-badges">{(!item.active || !category.active) && <span className="admin-badge quiet">{t.hidden}</span>}{!item.available && <span className="admin-badge warning">{t.soldOut}</span>}{item.featured && <span className="admin-badge">{t.featured}</span>}{item.active && category.active && item.available && !item.featured && <span className="admin-badge quiet">{t.visible}</span>}</span></div>
        <div className="admin-actions"><button id={`admin-item-${item.id}`} type="button" className="admin-text-button" onClick={() => openEditor('item', item, `admin-item-${item.id}`)}>{t.edit}</button><button type="button" className="admin-text-button danger-text" onClick={() => { setDeleteError(null); setDeleting({ type: 'item', id: item.id, name: item.name }) }}>{t.delete}</button></div></div>)}</div></div> : null })}
    </section>
    <section id="admin-categories" className="admin-section admin-category-section"><div className="admin-section-header"><div><h2 id="admin-categories-heading" tabIndex={-1}>{t.categories} <span className="admin-count">{categories.length}</span></h2><p className="admin-muted">{t.categoriesHint}</p></div><button id="admin-add-category" className="admin-button secondary" type="button" onClick={() => openEditor('category', 'new', 'admin-add-category')}>{t.addCategory}</button></div>
      {categories.length === 0 && <div className="admin-empty"><h3>{t.noCategories}</h3><p>{t.noCategoriesHint}</p></div>}
      <div className="admin-list">{sortedCategories.map(category => <div className="admin-list-row" key={category.id}><div><strong lang="lt">{category.name}</strong><span>{t.order} {category.displayOrder} · {items.filter(item => item.categoryId === category.id).length} {t.itemsCount}</span>{!category.active && <span className="admin-badge quiet">{t.hidden}</span>}</div>
        <div className="admin-actions"><button id={`admin-category-${category.id}`} type="button" className="admin-text-button" onClick={() => openEditor('category', category, `admin-category-${category.id}`)}>{t.edit}</button><button type="button" className="admin-text-button danger-text" onClick={() => { setDeleteError(null); setDeleting({ type: 'category', id: category.id, name: category.name }) }}>{t.delete}</button></div></div>)}</div>
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
    <section className="admin-shared-section" aria-label={t.categoryDetails}><h2>{t.categoryDetails}</h2>
      <Field label={t.order} hint={t.orderHint}><input type="number" min="0" step="1" required value={shared.displayOrder} onChange={event => setShared(current => ({ ...current, displayOrder: Number(event.target.value) }))} /></Field>
      <Checkbox label={t.active} hint={t.categoryActiveHint} checked={shared.active} onChange={active => setShared(current => ({ ...current, active }))} />
    </section>
    <Notice text={error} /><div className="admin-actions admin-editor-actions"><span className="admin-dirty-state" aria-live="polite">{dirty ? t.unsaved : initial ? t.allSaved : ''}</span><button type="button" className="admin-button secondary" onClick={() => { if (confirmDiscard(dirty)) onCancel() }}>{t.cancel}</button><button type="submit" className="admin-button" disabled={busy || !dirty}>{busy ? t.saving : t.saveCategory}</button></div>
  </form>
}

function ItemForm({ initial, categories, defaultCategoryId, onCancel, onSaved }: { initial: Item | null; categories: Category[]; defaultCategoryId?: number; onCancel: () => void; onSaved: (value: Item) => void }) {
  const { t } = useAdminLanguage()
  type SharedItem = Omit<ItemInput, 'name' | 'description' | 'priceEur' | 'translations'> & { priceEur: string }
  const baseline: SharedItem = initial ? { categoryId: initial.categoryId, priceEur: String(initial.priceEur), active: initial.active, available: initial.available, featured: initial.featured, imageUrl: initial.imageUrl, displayOrder: initial.displayOrder } :
    { categoryId: defaultCategoryId ?? categories[0].id, priceEur: '', active: true, available: true, featured: false, imageUrl: null, displayOrder: 0 }
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
  const [failedImage, setFailedImage] = useState<string | null>(null)
  const dirty = JSON.stringify({ shared, draft }) !== JSON.stringify({ shared: baseline, draft: initialDraft })
  const imageUrl = shared.imageUrl?.trim() ?? ''
  const previewUrl = /^https?:\/\//i.test(imageUrl) ? imageUrl : null
  useDirtyGuard(dirty)
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (busy) return
    if (!draft.lt.first.trim()) { setContentLocale('lt'); setError(t.lithuanianRequired); return }
    const priceText = shared.priceEur.replace(',', '.')
    if (!/^\d{1,8}(\.\d{1,2})?$/.test(priceText) || Number(priceText) < .01) { setError(t.priceInvalid); return }
    setBusy(true); setError(null)
    const body: ItemInput = { ...shared, priceEur: Number(priceText), imageUrl: shared.imageUrl?.trim() || null,
      name: draft.lt.first.trim(), description: draft.lt.second.trim() || null,
      translations: collectTranslations(draft, (name, description) => ({ name, description })) }
    try { onSaved(await adminRequest<Item>(initial ? `${base}/items/${initial.id}` : `${base}/items`, { method: initial ? 'PUT' : 'POST', body })) }
    catch (error) { setError(message(error)) } finally { setBusy(false) }
  }
  return <form className="admin-inline-form" onSubmit={submit}><TranslationEditor draft={draft} onChange={setDraft} selected={contentLocale} onSelect={setContentLocale} firstLabel={t.name} secondLabel={t.descriptionOptional} requiredSecond={false} />
    <section className="admin-shared-section" aria-label={t.itemDetails}><h2>{t.itemDetails}</h2>
    <div className="admin-fields"><Field label={t.category}><select value={shared.categoryId} onChange={event => setShared(current => ({ ...current, categoryId: Number(event.target.value) }))}>{categories.map(category => <option key={category.id} value={category.id}>{category.name}{!category.active ? ` (${t.hidden})` : ''}</option>)}</select></Field>
      <Field label={t.priceEur}><input required type="text" inputMode="decimal" pattern="[0-9]{1,8}([.,][0-9]{1,2})?" value={shared.priceEur} onChange={event => setShared(current => ({ ...current, priceEur: event.target.value }))} placeholder="8,50" /></Field>
      <Field label={t.order} hint={t.itemOrderHint}><input type="number" min="0" step="1" required value={shared.displayOrder} onChange={event => setShared(current => ({ ...current, displayOrder: Number(event.target.value) }))} /></Field></div></section>
    <section className="admin-shared-section" aria-label={t.visibility}><h2>{t.visibility}</h2><div className="admin-checks"><Checkbox label={t.active} hint={t.itemActiveHint} checked={shared.active} onChange={active => setShared(current => ({ ...current, active }))} />
      <Checkbox label={t.available} hint={t.availableHint} checked={shared.available} onChange={available => setShared(current => ({ ...current, available }))} />
      <Checkbox label={t.featured} hint={t.featuredHint} checked={shared.featured} onChange={featured => setShared(current => ({ ...current, featured }))} /></div></section>
    <section className="admin-shared-section" aria-label={t.imageSection}><h2>{t.imageSection}</h2><p className="admin-muted">{t.imageShared}</p><Field label={t.imageUrl} hint={t.imageHint}><input type="url" pattern="https?://.+" maxLength={2048} value={shared.imageUrl ?? ''} onChange={event => { setFailedImage(null); setShared(current => ({ ...current, imageUrl: event.target.value })) }} /></Field>
      {imageUrl && <div className="admin-image-controls">{previewUrl && failedImage !== previewUrl ? <div className="admin-image-preview"><img src={previewUrl} alt={t.imagePreview} onError={() => setFailedImage(previewUrl)} /></div> : previewUrl && <p className="admin-muted" role="status">{t.imageUnavailable}</p>}<button type="button" className="admin-text-button" onClick={() => { setFailedImage(null); setShared(current => ({ ...current, imageUrl: null })) }}>{t.clearImage}</button></div>}</section>
    <Notice text={error} /><div className="admin-actions admin-editor-actions"><span className="admin-dirty-state" aria-live="polite">{dirty ? t.unsaved : initial ? t.allSaved : ''}</span><button type="button" className="admin-button secondary" onClick={() => { if (confirmDiscard(dirty)) onCancel() }}>{t.cancel}</button><button type="submit" className="admin-button" disabled={busy || !dirty}>{busy ? t.saving : t.saveItem}</button></div>
  </form>
}
