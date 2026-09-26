import { useEffect, useRef } from 'react'

export function Notice({ text, kind = 'error' }: { text: string | null; kind?: 'error' | 'success' }) {
  return text ? <p className={`admin-notice ${kind}`} role={kind === 'error' ? 'alert' : 'status'}>{text}</p> : null
}

export function PageHeading({ kicker, title, description, action }: { kicker: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="admin-page-heading"><div><p className="admin-kicker">{kicker}</p><h1>{title}</h1><p>{description}</p></div>{action}</div>
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return <label className="admin-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>
}

export function Checkbox({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (value: boolean) => void; hint?: string }) {
  return <label className="admin-check"><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} /><span><strong>{label}</strong>{hint && <small>{hint}</small>}</span></label>
}

export function SubmitBar({ dirty, saving, label = 'Save changes' }: { dirty: boolean; saving: boolean; label?: string }) {
  return <div className="admin-submit"><span aria-live="polite">{dirty ? 'Unsaved changes' : 'All changes saved'}</span><button className="admin-button" type="submit" disabled={!dirty || saving}>{saving ? 'Saving…' : label}</button></div>
}

export function Loading() { return <p className="admin-loading" role="status">Loading content…</p> }

export function LoadError({ error, retry }: { error: string; retry: () => void }) {
  return <div className="admin-empty"><h2>Could not load this section</h2><p>{error}</p><button type="button" className="admin-button" onClick={retry}>Try again</button></div>
}

export function DeleteDialog({ name, onCancel, onDelete, busy, error }: { name: string; onCancel: () => void; onDelete: () => void; busy: boolean; error: string | null }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => dialog?.close() }, [])
  return <dialog ref={ref} className="admin-dialog" onCancel={event => { if (busy) event.preventDefault(); else onCancel() }} aria-labelledby="delete-title">
    <h2 id="delete-title">Delete {name}?</h2><p>This cannot be undone. You can also make content inactive to hide it without deleting it.</p>
    <Notice text={error} /><div className="admin-actions"><button type="button" className="admin-button secondary" onClick={onCancel} disabled={busy}>Cancel</button><button type="button" className="admin-button danger" onClick={onDelete} disabled={busy}>{busy ? 'Deleting…' : 'Delete'}</button></div>
  </dialog>
}
