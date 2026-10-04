import { safeImageUrl } from '../../lib/imageUrls'
import { useEffect, useRef, useState } from 'react'
import { useAdminLanguage } from './languageContext'

const acceptedTypes = 'image/jpeg,image/png,image/webp,image/heic,image/heif'

export function AdminImageField({ imageUrl, selectedFile, onSelect, onRemove, disabled = false }: {
  imageUrl: string | null; selectedFile: File | null; onSelect: (file: File | null) => void; onRemove: () => void; disabled?: boolean
}) {
  const { t } = useAdminLanguage()
  const input = useRef<HTMLInputElement>(null)
  const [failed, setFailed] = useState<string | null>(null)
  const [localPreview, setLocalPreview] = useState<{ file: File; url: string } | null>(null)
  useEffect(() => {
    if (!selectedFile) return
    const url = URL.createObjectURL(selectedFile)
    const frame = requestAnimationFrame(() => setLocalPreview({ file: selectedFile, url }))
    return () => { cancelAnimationFrame(frame); URL.revokeObjectURL(url) }
  }, [selectedFile])
  const preview = selectedFile && localPreview?.file === selectedFile ? localPreview.url : safeImageUrl(imageUrl)
  return <div className="admin-image-controls">
    {preview && failed !== preview && <div className="admin-image-preview"><img referrerPolicy="no-referrer" src={preview} alt={t.imagePreview} onError={() => setFailed(preview)} /></div>}
    {preview && failed === preview && <p role="status" className="admin-muted">{t.imageUnavailable}</p>}
    <input ref={input} className="admin-image-input" type="file" accept={acceptedTypes} aria-label={imageUrl ? t.replacePhoto : t.choosePhoto}
      disabled={disabled} onChange={event => { setFailed(null); onSelect(event.currentTarget.files?.[0] ?? null); event.currentTarget.value = '' }} />
    <div className="admin-actions">
      <button type="button" className="admin-button secondary" disabled={disabled} onClick={() => input.current?.click()}>
        {selectedFile || imageUrl ? t.replacePhoto : t.choosePhoto}
      </button>
      {(selectedFile || imageUrl) && <button type="button" className="admin-text-button danger-text" disabled={disabled} onClick={() => { setFailed(null); onRemove() }}>{t.removePhoto}</button>}
    </div>
    {selectedFile && <p className="admin-muted" aria-live="polite">{disabled ? t.imageUploading : selectedFile.name}</p>}
    <p className="admin-muted">{t.uploadHint}</p>
  </div>
}
