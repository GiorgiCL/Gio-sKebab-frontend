import { useEffect, useRef, useState } from 'react'
import { studioConfig } from './config'

type EmblemControl = { view: (name: string) => void; unfold: (value: number) => void; reset: () => void; dispose: () => void }

export function StudioEmblem({ motionPaused }: { motionPaused: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const controls = useRef<EmblemControl | null>(null)
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('Preparing the sculptural study…')
  const [ready, setReady] = useState(false)
  const [unfold, setUnfold] = useState(0)
  const [view, setView] = useState('front')
  useEffect(() => {
    if (!open) return
    const ownedDialog = dialog.current
    ownedDialog?.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    let cancelled = false, owned: EmblemControl | null = null
    const fail = () => { if (!cancelled) { setStatus('The 3D view is unavailable. The original identity is shown instead.'); setReady(false) } }
    const url = '/studio/v3/living-emblem.mjs'
    import(/* @vite-ignore */ url).then(async (module) => {
      if (cancelled || !viewport.current) return
      owned = await module.mountEmblem(viewport.current, { reducedMotion: motionPaused || matchMedia('(prefers-reduced-motion: reduce)').matches, onFailure: fail, onReset: () => { setUnfold(0); setView('front') }, onViewChange: setView })
      if (cancelled) { owned?.dispose(); return }
      controls.current = owned; setReady(true); setStatus('A three-dimensional interpretation of the supplied identity.')
    }).catch(fail)
    return () => { cancelled = true; owned?.dispose(); controls.current = null; ownedDialog?.close(); document.body.style.overflow = previousOverflow }
  }, [open, motionPaused])
  function close() { setOpen(false); setReady(false); setUnfold(0); setView('front'); setStatus('Preparing the sculptural study…') }
  function reset() { controls.current?.reset(); setUnfold(0); setView('front') }
  const image = <img src={studioConfig.brand.logo} srcSet={`${studioConfig.brand.small} 400w, ${studioConfig.brand.logo} 800w`} sizes="(max-width: 760px) 80vw, 38vw" width="800" height="1000" alt="" fetchPriority="high" />
  return <div className="im-hero-art">
    <button className="im-symbol-button im-symbol-launch" aria-haspopup="dialog" onClick={() => setOpen(true)}><span className="im-symbol-art">{image}</span><span className="im-symbol-prompt">Explore the symbol <span>3D ↗</span></span></button>
    <p className="im-symbol-story im-symbol-story-visible">Two perspectives.<br />One considered whole.</p>
    <dialog ref={dialog} className="im-emblem-dialog" aria-labelledby="im-emblem-title" onCancel={close} onClose={() => { if (open) close() }}>
      <div className="im-emblem-dialog-top"><div><span className="im-eyebrow">THE SCULPTURAL STUDY</span><h2 id="im-emblem-title">A different <em>perspective.</em></h2></div><button className="im-dialog-close" onClick={close} aria-label="Close symbol exploration">Close <span aria-hidden="true">×</span></button></div>
      <div className={`im-emblem-viewport${ready ? ' im-emblem-ready' : ''}`}><img src={studioConfig.brand.small} alt="Original approved silver and violet Idiomorph emblem" width="400" height="500" loading="lazy" /><div ref={viewport} className="im-emblem-canvas" hidden={!ready && status.startsWith('The 3D')} /></div>
      <p className="im-emblem-instructions">Drag sideways to turn. Arrow keys to explore. Swipe vertically to scroll.</p>
      <div className="im-emblem-controls"><div role="group" aria-label="Emblem camera view">{[['front', 'Front'], ['perspective', 'Three-quarter'], ['side', 'Side']].map(([value, label]) => <button key={value} disabled={!ready} aria-pressed={view === value} onClick={() => { controls.current?.view(value); setView(value) }}>{label}</button>)}</div><label htmlFor="im-emblem-unfold">Reveal the construction<input id="im-emblem-unfold" type="range" min="0" max="100" value={unfold} disabled={!ready} onChange={event => { const value = Number(event.target.value); setUnfold(value); controls.current?.unfold(value / 100) }} /></label><button className="im-emblem-reset" onClick={reset} disabled={!ready}>Reset view ↺</button></div>
      <p className="im-emblem-status" role="status">{status}</p><p className="im-emblem-meaning">Imagination gives it character. Engineering makes it work.<br />Two curved sheets, a shared opening, and room for a different point of view.</p>
    </dialog>
  </div>
}
