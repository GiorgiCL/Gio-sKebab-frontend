import { useState } from 'react'

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

export function MenuThumbnail({ imageUrl }: { imageUrl: string | null }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const url = imageUrl ? thumbnailUrl(imageUrl) : null
  return <span className="menu-row-visual" aria-hidden="true">
    {url && failedUrl !== url ? <img src={url} alt="" width="112" height="112" loading="lazy" decoding="async" onError={() => setFailedUrl(url)} />
      : <span className="menu-row-empty">G</span>}
    <span className="menu-row-visual-arrow">↗</span>
  </span>
}
