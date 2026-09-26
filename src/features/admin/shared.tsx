import { useEffect, useRef } from 'react'
import { useAdminLanguage } from './languageContext'

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
  const { t } = useAdminLanguage()
  return <div className="admin-submit"><span aria-live="polite">{dirty ? t.unsaved : t.allSaved}</span><button className="admin-button" type="submit" disabled={!dirty || saving}>{saving ? t.saving : label === 'Save changes' ? t.saveChanges : label}</button></div>
}

export function Loading() { const { t } = useAdminLanguage(); return <p className="admin-loading" role="status">{t.loading}</p> }

export function LoadError({ error, retry }: { error: string; retry: () => void }) {
  const { t } = useAdminLanguage()
  return <div className="admin-empty"><h2>{t.loadFailed}</h2><p>{error}</p><button type="button" className="admin-button" onClick={retry}>{t.tryAgain}</button></div>
}

export function DeleteDialog({ name, onCancel, onDelete, busy, error }: { name: string; onCancel: () => void; onDelete: () => void; busy: boolean; error: string | null }) {
  const { t } = useAdminLanguage()
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => dialog?.close() }, [])
  return <dialog ref={ref} className="admin-dialog" onCancel={event => { if (busy) event.preventDefault(); else onCancel() }} aria-labelledby="delete-title">
    <h2 id="delete-title">{t.deleteQuestion} {name}?</h2><p>{t.deleteHelp}</p>
    <Notice text={error} /><div className="admin-actions"><button type="button" className="admin-button secondary" onClick={onCancel} disabled={busy}>{t.cancel}</button><button type="button" className="admin-button danger" onClick={onDelete} disabled={busy}>{busy ? t.deleting : t.delete}</button></div>
  </dialog>
}
