import { useState } from 'react'
import { drinkThumbnail, productImage } from '../demoProductImages'

function thumbnailUrl(url: string) {
  try {
    const parsed = new URL(url)
    const segment = parsed.pathname.match(/\/image\/upload\/([^/]+)\//)?.[1]
    const transforms = segment?.split(',') ?? []
    if (parsed.hostname === 'res.cloudinary.com' && ['c_limit', 'h_1200', 'w_1200', 'q_auto:good', 'f_auto'].every(part => transforms.includes(part))) {
      parsed.pathname = parsed.pathname.replace(`/image/upload/${segment}/`, '/image/upload/c_fill,h_420,w_420,q_auto:good,f_auto/')
      return parsed.toString()
    }
  } catch { /* Keep existing or bundled image URLs unchanged. */ }
  return url
}

export function MenuThumbnail({ itemId, imageUrl, kind = 'menu' }: { itemId: number; imageUrl: string | null; kind?: 'menu' | 'lunch' }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const image = productImage(itemId, imageUrl, kind)
  const url = image.drink ? drinkThumbnail(itemId) : image.url ? thumbnailUrl(image.url) : null
  return <span className={`menu-row-visual${image.drink ? ' is-drink' : ''}`} aria-hidden="true">
    {url && failedUrl !== url ? <img src={url} alt="" width="112" height="112" loading="lazy" decoding="async" onError={() => setFailedUrl(url)} />
      : <span className="menu-row-empty">G</span>}
    <span className="menu-row-visual-arrow">↗</span>
  </span>
}
