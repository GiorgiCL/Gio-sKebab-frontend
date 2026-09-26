import { useState } from 'react'
import type { PublicLocale } from '../../lib/i18n/locales'
import { adminRequest, ApiError, message } from './api'
import { useDirtyGuard, useLoad } from './hooks'
import { useAdminLanguage } from './languageContext'
import { Field, LoadError, Loading, Notice, PageHeading, SubmitBar } from './shared'
import { TranslationEditor } from './TranslationEditor'
import { collectTranslations, makeTranslationDraft } from './translationDraft'
import type { ProfileInput, RestaurantProfile } from './types'

type SharedFields = Omit<ProfileInput, 'displayName' | 'description' | 'translations'>
const blank: SharedFields = { address: '', phone: '', email: null, googleMapsUrl: '', woltUrl: null, boltFoodUrl: null, instagramUrl: null, facebookUrl: null }
type SharedKey = keyof SharedFields

export function RestaurantPage() {
  const resource = useLoad(async () => {
    try { return await adminRequest<RestaurantProfile>('/api/admin/restaurant') }
    catch (error) { if (error instanceof ApiError && error.status === 404) return null; throw error }
  })
  if (resource.loading) return <Loading />
  if (resource.error) return <LoadError error={resource.error} retry={resource.refresh} />
  return <RestaurantForm key={resource.data?.updatedAt ?? 'new'} initial={resource.data} onSaved={resource.setData} />
}

function RestaurantForm({ initial, onSaved }: { initial: RestaurantProfile | null; onSaved: (value: RestaurantProfile) => void }) {
  const { t } = useAdminLanguage()
  const baseline = initial ? pickShared(initial) : blank
  const initialDraft = makeTranslationDraft({ first: initial?.displayName ?? '', second: initial?.description ?? '' }, {
    en: { first: initial?.translations.en?.displayName ?? '', second: initial?.translations.en?.description ?? '' },
    ru: { first: initial?.translations.ru?.displayName ?? '', second: initial?.translations.ru?.description ?? '' },
    ka: { first: initial?.translations.ka?.displayName ?? '', second: initial?.translations.ka?.description ?? '' },
  })
  const [form, setForm] = useState<SharedFields>(baseline)
  const [draft, setDraft] = useState(initialDraft)
  const [contentLocale, setContentLocale] = useState<PublicLocale>('lt')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const dirty = JSON.stringify({ form, draft }) !== JSON.stringify({ form: baseline, draft: initialDraft })
  useDirtyGuard(dirty)
  const change = (key: SharedKey, value: string) => setForm(current => ({ ...current, [key]: value }))
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (saving || !dirty && initial) return
    if (!draft.lt.first.trim() || !draft.lt.second.trim()) { setContentLocale('lt'); setError(t.lithuanianRequired); return }
    setSaving(true); setError(null); setSuccess(null)
    const payload: ProfileInput = {
      ...form, displayName: draft.lt.first.trim(), description: draft.lt.second.trim(),
      address: form.address.trim(), phone: form.phone.trim(), googleMapsUrl: form.googleMapsUrl.trim(),
      email: optional(form.email), woltUrl: optional(form.woltUrl), boltFoodUrl: optional(form.boltFoodUrl),
      instagramUrl: optional(form.instagramUrl), facebookUrl: optional(form.facebookUrl),
      translations: collectTranslations(draft, (displayName, description) => ({ displayName, description })),
    }
    try { onSaved(await adminRequest<RestaurantProfile>('/api/admin/restaurant', { method: 'PUT', body: payload })); setSuccess(t.restaurantSaved) }
    catch (error) { setError(message(error)) } finally { setSaving(false) }
  }
  return <><PageHeading kicker={t.yourBusiness} title={t.restaurant} description={t.restaurantDescription} />
    <form className="admin-form" onSubmit={submit}>
      <TranslationEditor draft={draft} onChange={setDraft} selected={contentLocale} onSelect={setContentLocale} firstLabel={t.restaurantName} secondLabel={t.description} />
      <div className="admin-form-section"><h2>{t.businessDetails}</h2><div className="admin-fields">
        <SharedField label={t.address} field="address" value={form.address} change={change} required max={500} multiline />
        <SharedField label={t.phone} field="phone" value={form.phone} change={change} required max={50} type="tel" />
        <SharedField label={t.email} field="email" value={form.email ?? ''} change={change} max={254} type="email" />
      </div></div>
      <div className="admin-form-section"><h2>{t.links}</h2><p className="admin-muted">{t.linksHint}</p><div className="admin-fields">
        <SharedField label={t.mapsUrl} hint={t.mapsHint} field="googleMapsUrl" value={form.googleMapsUrl} change={change} required max={2048} type="url" />
        <SharedField label={t.woltUrl} field="woltUrl" value={form.woltUrl ?? ''} change={change} max={2048} type="url" />
        <SharedField label={t.boltUrl} field="boltFoodUrl" value={form.boltFoodUrl ?? ''} change={change} max={2048} type="url" />
        <SharedField label={t.instagramUrl} field="instagramUrl" value={form.instagramUrl ?? ''} change={change} max={2048} type="url" />
        <SharedField label={t.facebookUrl} field="facebookUrl" value={form.facebookUrl ?? ''} change={change} max={2048} type="url" />
      </div></div>
      <Notice text={error} /><Notice text={success} kind="success" />
      <SubmitBar dirty={dirty || !initial} saving={saving} label={initial ? t.saveDetails : t.createRestaurant} />
    </form></>
}

function SharedField({ label, hint, field, value, change, required, max, type, multiline }: {
  label: string; hint?: string; field: SharedKey; value: string; change: (key: SharedKey, value: string) => void;
  required?: boolean; max: number; type?: string; multiline?: boolean
}) {
  return <Field label={label} hint={hint}>{multiline ?
    <textarea value={value} onChange={event => change(field, event.target.value)} required={required} maxLength={max} rows={2} /> :
    <input type={type ?? 'text'} value={value} onChange={event => change(field, event.target.value)} required={required} maxLength={max} pattern={type === 'url' ? 'https://.+' : undefined} />}</Field>
}
function optional(value: string | null) { return value?.trim() || null }
function pickShared(value: RestaurantProfile): SharedFields {
  const { address, phone, email, googleMapsUrl, woltUrl, boltFoodUrl, instagramUrl, facebookUrl } = value
  return { address, phone, email, googleMapsUrl, woltUrl, boltFoodUrl, instagramUrl, facebookUrl }
}
