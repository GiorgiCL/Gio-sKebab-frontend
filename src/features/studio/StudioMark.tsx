/** The two returning apertures of the original chrome sculpture, reduced to a line. */
export function StudioMark({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 40 60" fill="none" aria-hidden="true">
    <path d="M11 5C27-4 43 13 28 24L12 36C-4 47 12 64 28 54M28 54C41 44 28 32 19 29S-1 16 11 5Z" stroke="currentColor" strokeWidth="2.2" />
    <path d="M11 5C3 18 18 25 24 29S38 43 28 54" stroke="currentColor" strokeWidth="1" opacity=".6" />
  </svg>
}

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h16m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.4" /></svg>
}
