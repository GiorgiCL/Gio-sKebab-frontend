import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type RefObject } from 'react'
import type { PublicLocale } from '../../../lib/i18n/locales'
import { productImage } from '../demoProductImages'
import { formatPrice } from '../format'
import { publicText } from '../text'
import type { MenuItem } from '../types'

type DetailItem = Pick<MenuItem, 'id' | 'name' | 'description' | 'priceEur' | 'available' | 'imageUrl'>

interface ProductDialogProps {
  locale: PublicLocale
  itemId: number
  item: DetailItem | undefined
  categoryName: string | undefined
  loading: boolean
  imageKind?: 'menu' | 'lunch'
  returnFocus: RefObject<HTMLButtonElement | null>
  onClose: () => void
}

export function ProductDialog({ locale, itemId, item, categoryName, loading, imageKind = 'menu', returnFocus, onClose }: ProductDialogProps) {
  const t = publicText[locale]
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const previousOverflow = document.body.style.overflow
    const previousPadding = document.body.style.paddingRight
    const trigger = returnFocus.current
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`
    dialog.showModal()
    closeRef.current?.focus()
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPadding
      const attribute = imageKind === 'lunch' ? 'data-lunch-item-id' : 'data-menu-item-id'
      const destination = trigger?.isConnected ? trigger : document.querySelector<HTMLButtonElement>(`[${attribute}="${itemId}"]`)
      destination?.focus({ preventScroll: true })
    }
  }, [imageKind, itemId, returnFocus])

  const closeFromBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose()
  }
  const keepFocusInside = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') return
    const dialog = dialogRef.current
    const controls = dialog?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    if (!controls?.length) return
    const first = controls[0]
    const last = controls[controls.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return <dialog ref={dialogRef} className="product-dialog" aria-modal="true" aria-labelledby="product-dialog-title"
    aria-describedby={item?.description ? 'product-dialog-description' : undefined}
    onClick={closeFromBackdrop} onKeyDown={keepFocusInside} onCancel={event => { event.preventDefault(); onClose() }}>
    <div className="product-dialog-panel">
      <button ref={closeRef} type="button" className="product-dialog-close" onClick={onClose} aria-label={t.close}>
        <span aria-hidden="true">×</span><span>{t.close}</span>
      </button>
      <ProductImage item={item} locale={locale} imageKind={imageKind} />
      <div className="product-dialog-content">
        <p className="product-dialog-kicker">{categoryName ?? t.menu} <span aria-hidden="true">/</span> {t.productDetails}</p>
        <h2 id="product-dialog-title">{item?.name ?? (loading ? t.menuLoading : t.menuErrorTitle)}</h2>
        {item ? <>
          {item.description && <p id="product-dialog-description" className="product-dialog-description">{item.description}</p>}
          <div className="product-dialog-bottom"><strong>{formatPrice(item.priceEur, locale)}</strong>
            {!item.available && <span className="product-dialog-sold-out">{t.soldOut}</span>}
          </div>
        </> : <p className="product-dialog-description" role="status">{loading ? t.menuLoading : t.menuError}</p>}
      </div>
    </div>
  </dialog>
}

function ProductImage({ item, locale, imageKind }: { item: DetailItem | undefined; locale: PublicLocale; imageKind: 'menu' | 'lunch' }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const source = item ? productImage(item.id, item.imageUrl, imageKind) : { url: null, illustrative: false, darkStage: false, drink: false, mask: null }
  const imageUrl = source.url && source.url !== failedUrl ? source.url : null
  return <div className={`product-image-stage${imageUrl ? ' has-image' : ''}${source.darkStage && imageUrl ? ' is-dark' : ''}${source.drink && imageUrl ? ' is-drink' : ''}${source.mask && imageUrl ? ` is-${source.mask}-mask` : ''}`}>
    {imageUrl ? <>
      <img className="product-image-ambient" src={imageUrl} alt="" aria-hidden="true" onError={() => setFailedUrl(imageUrl)} />
      <img className="product-image-main" src={imageUrl} alt={source.illustrative ? '' : item?.name ?? ''} loading="lazy" decoding="async" onError={() => setFailedUrl(imageUrl)} />
      {source.illustrative && <span className="product-image-disclaimer">{publicText[locale].illustrativeImage}</span>}
    </> : <div className="product-image-empty" aria-hidden="true"><span className="product-image-emblem">G</span><span>Gio's Kebab</span></div>}
  </div>
}
