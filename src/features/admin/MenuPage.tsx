import { useState } from 'react'
import { adminRequest, ApiError, message } from './api'
import { confirmDiscard, useDirtyGuard, useLoad } from './hooks'
import { Checkbox, DeleteDialog, Field, LoadError, Loading, Notice, PageHeading } from './shared'
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
  const [categories, setCategories] = useState(initial.categories)
  const [items, setItems] = useState(initial.items)
  const [categoryEdit, setCategoryEdit] = useState<Category | 'new' | null>(null)
  const [itemEdit, setItemEdit] = useState<Item | 'new' | null>(null)
  const [deleting, setDeleting] = useState<{ type: 'category' | 'item'; id: number; name: string } | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const sortedCategories = [...categories].sort((a,b) => a.displayOrder - b.displayOrder || a.id - b.id)
  const sortedItems = [...items].sort((a,b) => a.displayOrder - b.displayOrder || a.id - b.id)
  const remove = async () => {
    if (!deleting || busy) return
    setBusy(true); setDeleteError(null)
    try {
      await adminRequest<void>(`${base}/${deleting.type === 'item' ? 'items' : 'categories'}/${deleting.id}`, { method: 'DELETE' })
      if (deleting.type === 'item') setItems(current => current.filter(item => item.id !== deleting.id))
      else setCategories(current => current.filter(category => category.id !== deleting.id))
      setNotice(`${deleting.name} deleted.`); setDeleting(null)
    } catch (error) {
      setDeleteError(error instanceof ApiError && error.status === 409 && deleting.type === 'category' ? 'Move or delete every item in this category before deleting it, including hidden items.' : message(error))
    } finally { setBusy(false) }
  }
  if (categoryEdit) return <><PageHeading kicker="Menu / categories" title={categoryEdit === 'new' ? 'New category' : 'Edit category'} description="Set the category name, order and visibility." /><CategoryForm key={categoryEdit === 'new' ? 'new' : categoryEdit.id} initial={categoryEdit === 'new' ? null : categoryEdit} onCancel={() => setCategoryEdit(null)} onSaved={value => { setCategories(current => [...current.filter(row => row.id !== value.id), value]); setCategoryEdit(null); setNotice('Category saved.') }} /></>
  if (itemEdit) return <><PageHeading kicker="Menu / items" title={itemEdit === 'new' ? 'New item' : 'Edit item'} description="Update the item customers will see on your menu." /><ItemForm key={itemEdit === 'new' ? 'new' : itemEdit.id} initial={itemEdit === 'new' ? null : itemEdit} categories={sortedCategories} onCancel={() => setItemEdit(null)} onSaved={value => { setItems(current => [...current.filter(row => row.id !== value.id), value]); setItemEdit(null); setNotice('Item saved.') }} /></>
  return <><PageHeading kicker="What you serve" title="Menu" description="Keep a small, clear menu that is easy to update when something changes." /><Notice text={notice} kind="success" /><section className="admin-section"><div className="admin-section-header"><div><h2>Categories</h2><p className="admin-muted">Inactive categories and all their items are hidden from customers.</p></div><button className="admin-button secondary" type="button" onClick={() => { setCategoryEdit('new'); setItemEdit(null) }}>Add category</button></div>{categories.length === 0 && <div className="admin-empty"><h3>Start with a category</h3><p>For example, Kebabs or Sides. You can add items after creating one.</p></div>}<div className="admin-list">{sortedCategories.map(category => <div className="admin-list-row" key={category.id}><div><strong>{category.name}</strong><span>Order {category.displayOrder} · {category.active ? 'Visible' : 'Hidden'} · {items.filter(item => item.categoryId === category.id).length} items</span></div><div className="admin-actions"><button type="button" className="admin-text-button" onClick={() => { setCategoryEdit(category); setItemEdit(null) }}>Edit</button><button type="button" className="admin-text-button danger-text" onClick={() => { setDeleteError(null); setDeleting({ type: 'category', id: category.id, name: category.name }) }}>Delete</button></div></div>)}</div></section><section className="admin-section"><div className="admin-section-header"><div><h2>Items</h2><p className="admin-muted">Inactive hides an item. Unavailable keeps a visible item marked sold out. Featured makes a visible item eligible for the public highlight.</p></div><button className="admin-button secondary" type="button" disabled={categories.length === 0} onClick={() => { setItemEdit('new'); setCategoryEdit(null) }}>Add item</button></div>{items.length === 0 && <div className="admin-empty"><h3>No items yet</h3><p>Add your first item once a category is ready.</p></div>}{sortedCategories.map(category => { const group = sortedItems.filter(item => item.categoryId === category.id); return group.length ? <div className="admin-menu-group" key={category.id}><h3>{category.name}</h3><div className="admin-list">{group.map(item => <div className="admin-list-row" key={item.id}><div><strong>{item.name} <span className="admin-price">€{Number(item.priceEur).toFixed(2)}</span></strong><span>Order {item.displayOrder} · {item.active ? item.available ? 'Visible' : 'Sold out' : 'Hidden'}{item.featured ? ' · Featured' : ''}</span></div><div className="admin-actions"><button type="button" className="admin-text-button" onClick={() => { setItemEdit(item); setCategoryEdit(null) }}>Edit</button><button type="button" className="admin-text-button danger-text" onClick={() => { setDeleteError(null); setDeleting({ type: 'item', id: item.id, name: item.name }) }}>Delete</button></div></div>)}</div></div> : null })}</section>{deleting && <DeleteDialog name={deleting.name} onCancel={() => setDeleting(null)} onDelete={remove} busy={busy} error={deleteError} />}</>
}

function CategoryForm({ initial, onCancel, onSaved }: { initial: Category | null; onCancel: () => void; onSaved: (value: Category) => void }) {
  const baseline: CategoryInput = initial ? { name: initial.name, displayOrder: initial.displayOrder, active: initial.active } : { name: '', displayOrder: 0, active: true }
  const [form, setForm] = useState(baseline)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dirty = JSON.stringify(form) !== JSON.stringify(baseline)
  useDirtyGuard(dirty)
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (busy) return
    setBusy(true); setError(null)
    try { onSaved(await adminRequest<Category>(initial ? `${base}/categories/${initial.id}` : `${base}/categories`, { method: initial ? 'PUT' : 'POST', body: { ...form, name: form.name.trim() } })) }
    catch (error) { setError(message(error)) } finally { setBusy(false) }
  }
  return <form className="admin-inline-form" onSubmit={submit}><h3>{initial ? 'Edit category' : 'New category'}</h3><div className="admin-fields"><Field label="Name"><input autoFocus required maxLength={160} value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} /></Field><Field label="Display order" hint="Lower numbers appear first."><input type="number" min="0" step="1" required value={form.displayOrder} onChange={event => setForm(current => ({ ...current, displayOrder: Number(event.target.value) }))} /></Field></div><Checkbox label="Active" hint="Show this category on the public menu." checked={form.active} onChange={active => setForm(current => ({ ...current, active }))} /><Notice text={error} /><div className="admin-actions"><button type="button" className="admin-button secondary" onClick={() => { if (confirmDiscard(dirty)) onCancel() }}>Cancel</button><button type="submit" className="admin-button" disabled={busy || !dirty}>{busy ? 'Saving…' : 'Save category'}</button></div></form>
}

function ItemForm({ initial, categories, onCancel, onSaved }: { initial: Item | null; categories: Category[]; onCancel: () => void; onSaved: (value: Item) => void }) {
  const baseline: Omit<ItemInput, 'priceEur'> & { priceEur: string } = initial ? { categoryId: initial.categoryId, name: initial.name, description: initial.description, priceEur: String(initial.priceEur), active: initial.active, available: initial.available, featured: initial.featured, imageUrl: initial.imageUrl, displayOrder: initial.displayOrder } : { categoryId: categories[0].id, name: '', description: '', priceEur: '', active: true, available: true, featured: false, imageUrl: null, displayOrder: 0 }
  const [form, setForm] = useState(baseline)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dirty = JSON.stringify(form) !== JSON.stringify(baseline)
  useDirtyGuard(dirty)
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (busy) return
    if (!/^\d{1,8}(\.\d{1,2})?$/.test(form.priceEur) || Number(form.priceEur) < .01) { setError('Enter a EUR price of at least €0.01 with at most two decimals.'); return }
    setBusy(true); setError(null)
    try { onSaved(await adminRequest<Item>(initial ? `${base}/items/${initial.id}` : `${base}/items`, { method: initial ? 'PUT' : 'POST', body: { ...form, name: form.name.trim(), description: form.description.trim(), priceEur: Number(form.priceEur), imageUrl: form.imageUrl?.trim() || null } })) }
    catch (error) { setError(message(error)) } finally { setBusy(false) }
  }
  return <form className="admin-inline-form" onSubmit={submit}><h3>{initial ? `Edit ${initial.name}` : 'New item'}</h3><div className="admin-fields"><Field label="Category"><select value={form.categoryId} onChange={event => setForm(current => ({ ...current, categoryId: Number(event.target.value) }))}>{categories.map(category => <option key={category.id} value={category.id}>{category.name}{!category.active ? ' (hidden)' : ''}</option>)}</select></Field><Field label="Name"><input autoFocus required maxLength={160} value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} /></Field><Field label="Description"><textarea required maxLength={1000} rows={3} value={form.description} onChange={event => setForm(current => ({ ...current, description: event.target.value }))} /></Field><Field label="Price (EUR)"><input required type="text" inputMode="decimal" pattern="[0-9]{1,8}(\.[0-9]{1,2})?" value={form.priceEur} onChange={event => setForm(current => ({ ...current, priceEur: event.target.value }))} placeholder="8.50" /></Field><Field label="Display order" hint="Lower numbers appear first within a category."><input type="number" min="0" step="1" required value={form.displayOrder} onChange={event => setForm(current => ({ ...current, displayOrder: Number(event.target.value) }))} /></Field><Field label="Image URL" hint="Optional HTTP or HTTPS image link. Clear it to remove the image; uploads are not available."><input type="url" pattern="https?://.+" maxLength={2048} value={form.imageUrl ?? ''} onChange={event => setForm(current => ({ ...current, imageUrl: event.target.value }))} /></Field></div><div className="admin-checks"><Checkbox label="Active" hint="Show this item when its category is active." checked={form.active} onChange={active => setForm(current => ({ ...current, active }))} /><Checkbox label="Available" hint="Turn off to mark a visible item sold out." checked={form.available} onChange={available => setForm(current => ({ ...current, available }))} /><Checkbox label="Featured" hint="Eligible for the public menu highlight when visible." checked={form.featured} onChange={featured => setForm(current => ({ ...current, featured }))} /></div><Notice text={error} /><div className="admin-actions"><button type="button" className="admin-button secondary" onClick={() => { if (confirmDiscard(dirty)) onCancel() }}>Cancel</button><button type="submit" className="admin-button" disabled={busy || !dirty}>{busy ? 'Saving…' : 'Save item'}</button></div></form>
}
