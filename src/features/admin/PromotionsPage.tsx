import { useState } from 'react'
import { adminRequest, message } from './api'
import { confirmDiscard, useDirtyGuard, useLoad } from './hooks'
import { Checkbox, DeleteDialog, Field, LoadError, Loading, Notice, PageHeading } from './shared'
import type { Promotion, PromotionInput } from './types'

export function PromotionsPage() {
  const resource = useLoad(() => adminRequest<Promotion[]>('/api/admin/promotions'))
  if (resource.loading) return <Loading />
  if (resource.error) return <LoadError error={resource.error} retry={resource.refresh} />
  return <PromotionsContent initial={resource.data ?? []} />
}

function PromotionsContent({ initial }: { initial: Promotion[] }) {
  const [rows, setRows] = useState(initial)
  const [editing, setEditing] = useState<Promotion | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Promotion | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const sorted = [...rows].sort((a,b) => a.displayOrder - b.displayOrder || a.id - b.id)
  const remove = async () => {
    if (!deleting || busy) return
    setBusy(true); setError(null)
    try { await adminRequest<void>(`/api/admin/promotions/${deleting.id}`, { method: 'DELETE' }); setRows(current => current.filter(row => row.id !== deleting.id)); setDeleting(null); setNotice('Promotion deleted.') }
    catch (error) { setError(message(error)) } finally { setBusy(false) }
  }
  if (editing) return <><PageHeading kicker="Promotions" title={editing === 'new' ? 'New promotion' : 'Edit promotion'} description="Set the message and optional times in the restaurant local time zone." /><PromotionForm key={editing === 'new' ? 'new' : editing.id} initial={editing === 'new' ? null : editing} onCancel={() => setEditing(null)} onSaved={value => { setRows(current => [...current.filter(row => row.id !== value.id), value]); setEditing(null); setNotice('Promotion saved.') }} /></>
  return <><PageHeading kicker="Current offers" title="Promotions" description="Share an offer or announcement on the public site, with an optional display window." action={<button type="button" className="admin-button" onClick={() => setEditing('new')}>Add promotion</button>} /><p className="admin-info">Times are entered in the restaurant’s local time zone{rows[0]?.timeZone ? ` (${rows[0].timeZone})` : ''}. A start or end can be left blank. The end time is when the promotion stops appearing. If a clock-change time is rejected, choose another local time.</p><Notice text={notice} kind="success" />{rows.length === 0 && <div className="admin-empty"><h2>No promotions yet</h2><p>Add one whenever you have news or an offer to share.</p></div>}<div className="admin-list">{sorted.map(row => <div className="admin-list-row" key={row.id}><div><strong>{row.title}</strong><span>Order {row.displayOrder} · {row.active ? 'Active' : 'Inactive'}{row.startsAt ? ` · From ${formatLocal(row.startsAt)}` : ''}{row.endsAt ? ` · Until ${formatLocal(row.endsAt)}` : ''}</span>{row.description && <p>{row.description}</p>}</div><div className="admin-actions"><button type="button" className="admin-text-button" onClick={() => setEditing(row)}>Edit</button><button type="button" className="admin-text-button danger-text" onClick={() => { setError(null); setDeleting(row) }}>Delete</button></div></div>)}</div>{deleting && <DeleteDialog name={deleting.title} onCancel={() => setDeleting(null)} onDelete={remove} busy={busy} error={error} />}</>
}

function PromotionForm({ initial, onCancel, onSaved }: { initial: Promotion | null; onCancel: () => void; onSaved: (value: Promotion) => void }) {
  const baseline: PromotionInput = initial ? { title: initial.title, description: initial.description, active: initial.active, startsAt: initial.startsAt, endsAt: initial.endsAt, displayOrder: initial.displayOrder } : { title: '', description: null, active: true, startsAt: null, endsAt: null, displayOrder: 0 }
  const [form, setForm] = useState(baseline)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dirty = JSON.stringify(form) !== JSON.stringify(baseline)
  useDirtyGuard(dirty)
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (busy) return
    if (form.startsAt && form.endsAt && form.endsAt < form.startsAt) { setError('End must be at or after start.'); return }
    setBusy(true); setError(null)
    try { onSaved(await adminRequest<Promotion>(initial ? `/api/admin/promotions/${initial.id}` : '/api/admin/promotions', { method: initial ? 'PUT' : 'POST', body: { ...form, title: form.title.trim(), description: form.description?.trim() || null, startsAt: form.startsAt || null, endsAt: form.endsAt || null } })) }
    catch (error) { setError(message(error)) } finally { setBusy(false) }
  }
  return <form className="admin-inline-form" onSubmit={submit}><h2>{initial ? 'Edit promotion' : 'New promotion'}</h2><div className="admin-fields"><Field label="Title"><input autoFocus required maxLength={160} value={form.title} onChange={event => setForm(current => ({ ...current, title: event.target.value }))} /></Field><Field label="Description" hint="Optional, up to 500 characters."><textarea rows={3} maxLength={500} value={form.description ?? ''} onChange={event => setForm(current => ({ ...current, description: event.target.value }))} /></Field><Field label="Starts at" hint="Optional, local restaurant date and time."><input type="datetime-local" value={form.startsAt?.slice(0, 16) ?? ''} onChange={event => setForm(current => ({ ...current, startsAt: event.target.value || null }))} /></Field><Field label="Ends at" hint="Optional. The promotion stops showing at this time."><input type="datetime-local" value={form.endsAt?.slice(0, 16) ?? ''} onChange={event => setForm(current => ({ ...current, endsAt: event.target.value || null }))} /></Field><Field label="Display order" hint="Lower numbers appear first."><input required type="number" min="0" step="1" value={form.displayOrder} onChange={event => setForm(current => ({ ...current, displayOrder: Number(event.target.value) }))} /></Field></div><Checkbox label="Active" hint="Inactive promotions stay saved but do not appear on the public site." checked={form.active} onChange={active => setForm(current => ({ ...current, active }))} /><Notice text={error} /><div className="admin-actions"><button type="button" className="admin-button secondary" onClick={() => { if (confirmDiscard(dirty)) onCancel() }}>Cancel</button><button type="submit" className="admin-button" disabled={busy || !dirty}>{busy ? 'Saving…' : 'Save promotion'}</button></div></form>
}
function formatLocal(value: string) { return value.replace('T', ' ').slice(0, 16) }
