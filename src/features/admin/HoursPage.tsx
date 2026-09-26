import { useEffect, useState } from 'react'
import { adminRequest, message } from './api'
import { confirmDiscard, useDirtyGuard, useLoad } from './hooks'
import { Checkbox, DeleteDialog, Field, LoadError, Loading, Notice, PageHeading, SubmitBar } from './shared'
import type { Day, HoursRule, SpecialDate, WeeklyDay } from './types'

const days: Day[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
const emptyRule = (): HoursRule => ({ open: false, openingTime: null, closingTime: null })

export function HoursPage() {
  const [weeklyDirty, setWeeklyDirty] = useState(false)
  const [specialDirty, setSpecialDirty] = useState(false)
  useDirtyGuard(weeklyDirty || specialDirty)
  return <><PageHeading kicker="When you're open" title="Hours" description="Set a normal week, then add single-date changes for holidays or special occasions." /><WeeklyEditor onDirtyChange={setWeeklyDirty} /><SpecialEditor onDirtyChange={setSpecialDirty} /></>
}

function WeeklyEditor({ onDirtyChange }: { onDirtyChange: (value: boolean) => void }) {
  const resource = useLoad(() => adminRequest<WeeklyDay[]>('/api/admin/opening-hours/weekly'))
  if (resource.loading) return <Loading />
  if (resource.error) return <LoadError error={resource.error} retry={resource.refresh} />
  return <WeeklyForm key={JSON.stringify(resource.data)} initial={resource.data ?? []} onSaved={resource.setData} onDirtyChange={onDirtyChange} />
}

function WeeklyForm({ initial, onSaved, onDirtyChange }: { initial: WeeklyDay[]; onSaved: (days: WeeklyDay[]) => void; onDirtyChange: (value: boolean) => void }) {
  const normalize = (rows: WeeklyDay[]) => days.map(dayOfWeek => rows.find(row => row.dayOfWeek === dayOfWeek) ?? { dayOfWeek, ...emptyRule() })
  const [form, setForm] = useState(normalize(initial))
  const [saved, setSaved] = useState(normalize(initial))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const changed = JSON.stringify(form) !== JSON.stringify(saved)
  const dirty = changed || initial.length !== 7
  useEffect(() => { onDirtyChange(changed); return () => onDirtyChange(false) }, [changed, onDirtyChange])
  const change = (day: Day, rule: HoursRule) => setForm(current => current.map(row => row.dayOfWeek === day ? { dayOfWeek: day, ...rule } : row))
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (saving) return
    if (form.some(invalidHours)) { setError('For each open day, choose an opening time and a later closing time.'); return }
    setSaving(true); setError(null); setSuccess(null)
    try { const result = await adminRequest<WeeklyDay[]>('/api/admin/opening-hours/weekly', { method: 'PUT', body: { days: form } }); setForm(normalize(result)); setSaved(normalize(result)); onSaved(result); setSuccess('Weekly hours saved.') }
    catch (error) { setError(message(error)) } finally { setSaving(false) }
  }
  return <section className="admin-section"><h2>Normal week</h2><p className="admin-muted">Save all seven days together. Closed days do not need times.</p><form onSubmit={submit}><div className="admin-hours-list">{form.map(row => <div className="admin-hours-row" key={row.dayOfWeek}><strong>{title(row.dayOfWeek)}</strong><HoursControls value={row} onChange={rule => change(row.dayOfWeek, rule)} label={title(row.dayOfWeek)} /></div>)}</div><Notice text={error} /><Notice text={success} kind="success" /><SubmitBar dirty={dirty} saving={saving} label="Save weekly hours" /></form></section>
}

function HoursControls({ value, onChange, label }: { value: HoursRule; onChange: (rule: HoursRule) => void; label: string }) {
  return <div className="admin-hours-controls"><Checkbox label="Open" checked={value.open} onChange={open => onChange(open ? { open, openingTime: value.openingTime ?? '11:00', closingTime: value.closingTime ?? '21:00' } : emptyRule())} />{value.open && <div className="admin-time-pair"><Field label={`${label} opens`}><input type="time" required value={value.openingTime ?? ''} onChange={event => onChange({ ...value, openingTime: event.target.value })} /></Field><Field label={`${label} closes`}><input type="time" required min={value.openingTime ?? undefined} value={value.closingTime ?? ''} onChange={event => onChange({ ...value, closingTime: event.target.value })} /></Field></div>}</div>
}

function SpecialEditor({ onDirtyChange }: { onDirtyChange: (value: boolean) => void }) {
  const resource = useLoad(() => adminRequest<SpecialDate[]>('/api/admin/opening-hours/special-dates'))
  const [editing, setEditing] = useState<SpecialDate | 'new' | null>(null)
  const [deleting, setDeleting] = useState<SpecialDate | null>(null)
  const [busy, setBusy] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  if (resource.loading) return <Loading />
  if (resource.error) return <LoadError error={resource.error} retry={resource.refresh} />
  const rows = resource.data ?? []
  const deleteRule = async () => {
    if (!deleting || busy) return
    setBusy(true); setDeleteError(null)
    try { await adminRequest<void>(`/api/admin/opening-hours/special-dates/${deleting.date}`, { method: 'DELETE' }); resource.setData(rows.filter(row => row.date !== deleting.date)); setDeleting(null); setNotice('Date override deleted.') }
    catch (error) { setDeleteError(message(error)) } finally { setBusy(false) }
  }
  return <section className="admin-section"><div className="admin-section-header"><div><h2>Special dates</h2><p className="admin-muted">Each date replaces its normal weekly hours. Past dates remain here for review.</p></div>{!editing && <button type="button" className="admin-button secondary" onClick={() => setEditing('new')}>Add date</button>}</div><Notice text={notice} kind="success" />{!editing && <>{rows.length === 0 && <div className="admin-empty"><h3>No special dates yet</h3><p>Add one when a particular date needs different hours.</p></div>}<div className="admin-list">{rows.map(row => <div className="admin-list-row" key={row.date}><div><strong>{row.date}</strong><span>{row.open ? `${row.openingTime}–${row.closingTime}` : 'Closed'}</span></div><div className="admin-actions"><button type="button" className="admin-text-button" onClick={() => setEditing(row)}>Edit</button><button type="button" className="admin-text-button danger-text" onClick={() => { setDeleteError(null); setDeleting(row) }}>Delete</button></div></div>)}</div></>}{editing && <SpecialForm key={editing === 'new' ? 'new' : editing.date} initial={editing === 'new' ? null : editing} existingDates={rows.map(row => row.date)} onDirtyChange={onDirtyChange} onCancel={() => setEditing(null)} onSaved={value => { resource.setData([...rows.filter(row => row.date !== value.date), value].sort((a,b) => a.date.localeCompare(b.date))); setEditing(null); setNotice('Date override saved.') }} />}{deleting && <DeleteDialog name={`the override for ${deleting.date}`} onCancel={() => setDeleting(null)} onDelete={deleteRule} busy={busy} error={deleteError} />}</section>
}

function SpecialForm({ initial, existingDates, onDirtyChange, onCancel, onSaved }: { initial: SpecialDate | null; existingDates: string[]; onDirtyChange: (value: boolean) => void; onCancel: () => void; onSaved: (value: SpecialDate) => void }) {
  const [form, setForm] = useState<SpecialDate>(initial ?? { date: '', ...emptyRule() })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dirty = JSON.stringify(form) !== JSON.stringify(initial ?? { date: '', ...emptyRule() })
  useEffect(() => { onDirtyChange(dirty); return () => onDirtyChange(false) }, [dirty, onDirtyChange])
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (saving) return
    if (invalidHours(form)) { setError('Choose an opening time and a later closing time.'); return }
    if (!initial && existingDates.includes(form.date)) { setError('An override already exists for this date. Edit it instead.'); return }
    setSaving(true); setError(null)
    try { const result = initial ? await adminRequest<SpecialDate>(`/api/admin/opening-hours/special-dates/${initial.date}`, { method: 'PUT', body: { open: form.open, openingTime: form.openingTime, closingTime: form.closingTime } }) : await adminRequest<SpecialDate>('/api/admin/opening-hours/special-dates', { method: 'POST', body: form }); onSaved(result) }
    catch (error) { setError(message(error)) } finally { setSaving(false) }
  }
  return <form className="admin-inline-form" onSubmit={submit}><h3>{initial ? `Edit ${initial.date}` : 'Add special date'}</h3><Field label="Date"><input autoFocus type="date" required value={form.date} disabled={!!initial} onChange={event => setForm(current => ({ ...current, date: event.target.value }))} /></Field><HoursControls label="Special date" value={form} onChange={rule => setForm(current => ({ ...current, ...rule }))} /><Notice text={error} /><div className="admin-actions"><button type="button" className="admin-button secondary" onClick={() => { if (confirmDiscard(dirty)) onCancel() }}>Cancel</button><button type="submit" className="admin-button" disabled={saving || !dirty}>{saving ? 'Saving…' : 'Save date'}</button></div></form>
}
function title(day: Day) { return day.charAt(0) + day.slice(1).toLowerCase() }
function invalidHours(rule: HoursRule) { return rule.open ? !rule.openingTime || !rule.closingTime || rule.closingTime <= rule.openingTime : rule.openingTime !== null || rule.closingTime !== null }
