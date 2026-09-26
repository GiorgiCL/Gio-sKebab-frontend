import { useState } from 'react'
import { adminRequest, ApiError, message } from './api'
import { useDirtyGuard, useLoad } from './hooks'
import { Field, LoadError, Loading, Notice, PageHeading, SubmitBar } from './shared'
import type { ProfileInput, RestaurantProfile } from './types'

const blank: ProfileInput = { displayName: '', description: '', address: '', phone: '', email: null, googleMapsUrl: '', woltUrl: null, boltFoodUrl: null, instagramUrl: null, facebookUrl: null }
const fields: { key: keyof ProfileInput; label: string; required?: boolean; type?: string; max: number; hint?: string }[] = [
  { key: 'displayName', label: 'Restaurant name', required: true, max: 160 },
  { key: 'description', label: 'Description', required: true, max: 1000, hint: 'Shown on the public site.' },
  { key: 'address', label: 'Address', required: true, max: 500 },
  { key: 'phone', label: 'Phone number', required: true, type: 'tel', max: 50 },
  { key: 'email', label: 'Email', type: 'email', max: 254 },
  { key: 'googleMapsUrl', label: 'Google Maps URL', required: true, type: 'url', max: 2048, hint: 'An HTTPS link to your location.' },
  { key: 'woltUrl', label: 'Wolt URL', type: 'url', max: 2048 },
  { key: 'boltFoodUrl', label: 'Bolt Food URL', type: 'url', max: 2048 },
  { key: 'instagramUrl', label: 'Instagram URL', type: 'url', max: 2048 },
  { key: 'facebookUrl', label: 'Facebook URL', type: 'url', max: 2048 },
]

export function RestaurantPage() {
  const resource = useLoad(async () => {
    try { return await adminRequest<RestaurantProfile>('/api/admin/restaurant') }
    catch (error) { if (error instanceof ApiError && error.status === 404) return null; throw error }
  })
  if (resource.loading) return <Loading />
  if (resource.error) return <LoadError error={resource.error} retry={resource.refresh} />
  return <RestaurantForm key={resource.data?.updatedAt ?? 'new'} initial={resource.data} onSaved={value => resource.setData(value)} />
}

function RestaurantForm({ initial, onSaved }: { initial: RestaurantProfile | null; onSaved: (value: RestaurantProfile) => void }) {
  const [form, setForm] = useState<ProfileInput>(initial ? pick(initial) : blank)
  const [saved, setSaved] = useState<ProfileInput>(initial ? pick(initial) : blank)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const dirty = JSON.stringify(form) !== JSON.stringify(saved)
  useDirtyGuard(dirty)
  const change = (key: keyof ProfileInput, value: string) => setForm(current => ({ ...current, [key]: value }))
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (saving || !dirty && initial) return
    setSaving(true); setError(null); setSuccess(null)
    const payload: ProfileInput = { ...form, displayName: form.displayName.trim(), description: form.description.trim(), address: form.address.trim(), phone: form.phone.trim(), googleMapsUrl: form.googleMapsUrl.trim(), email: optional(form.email), woltUrl: optional(form.woltUrl), boltFoodUrl: optional(form.boltFoodUrl), instagramUrl: optional(form.instagramUrl), facebookUrl: optional(form.facebookUrl) }
    try { const result = await adminRequest<RestaurantProfile>('/api/admin/restaurant', { method: 'PUT', body: payload }); setForm(pick(result)); setSaved(pick(result)); onSaved(result); setSuccess('Restaurant details saved.') }
    catch (error) { setError(message(error)) } finally { setSaving(false) }
  }
  return <><PageHeading kicker="Your business" title="Restaurant" description="The essential details customers use to find and contact you." /><form className="admin-form" onSubmit={submit}><div className="admin-form-section"><h2>Identity & contact</h2><div className="admin-fields">{fields.slice(0, 5).map(field => <ProfileField key={field.key} field={field} value={form[field.key] ?? ''} change={change} />)}</div></div><div className="admin-form-section"><h2>Links</h2><p className="admin-muted">Optional links can be left empty. All external links must use HTTPS.</p><div className="admin-fields">{fields.slice(5).map(field => <ProfileField key={field.key} field={field} value={form[field.key] ?? ''} change={change} />)}</div></div><Notice text={error} /><Notice text={success} kind="success" /><SubmitBar dirty={dirty || !initial} saving={saving} label={initial ? 'Save details' : 'Create restaurant'} /></form></>
}

function ProfileField({ field, value, change }: { field: typeof fields[number]; value: string; change: (key: keyof ProfileInput, value: string) => void }) {
  return <Field label={field.label} hint={field.hint}>{field.key === 'description' || field.key === 'address' ? <textarea value={value} onChange={event => change(field.key, event.target.value)} required={field.required} maxLength={field.max} rows={field.key === 'description' ? 4 : 2} /> : <input type={field.type ?? 'text'} value={value} onChange={event => change(field.key, event.target.value)} required={field.required} maxLength={field.max} pattern={field.type === 'url' ? 'https://.+' : undefined} />}</Field>
}
function optional(value: string | null) { return value?.trim() || null }
function pick(value: RestaurantProfile): ProfileInput { const { displayName, description, address, phone, email, googleMapsUrl, woltUrl, boltFoodUrl, instagramUrl, facebookUrl } = value; return { displayName, description, address, phone, email, googleMapsUrl, woltUrl, boltFoodUrl, instagramUrl, facebookUrl } }
