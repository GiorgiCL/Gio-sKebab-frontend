/** Responsive derivatives of the studio owner's supplied identity asset. */
export function StudioMark({ className = '' }: { className?: string }) {
  return <img className={`im-logo-mark ${className}`} src="/studio/brand-icon.webp" srcSet="/studio/brand-icon.webp 96w, /studio/brand-logo-small.webp 400w" sizes="64px" width="96" height="120" alt="" aria-hidden="true" />
}

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h16m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.4" /></svg>
}
