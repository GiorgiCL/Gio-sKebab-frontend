import { useEffect, useRef, useState } from 'react'
import { studioConfig, filmChapters, type FilmCue } from './config'

export function StudioFilm({ cue, onRequest }: { cue: FilmCue; onRequest: (at: number) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [failed, setFailed] = useState(false)
  const [notice, setNotice] = useState('')
  const [chapter, setChapter] = useState(0)

  useEffect(() => {
    const pause = () => { if (document.hidden) videoRef.current?.pause() }
    document.addEventListener('visibilitychange', pause)
    return () => document.removeEventListener('visibilitychange', pause)
  }, [])
  useEffect(() => {
    const video = videoRef.current
    if (!video || !cue) return
    const start = () => { video.currentTime = cue.at; video.play().catch(() => setNotice('Press play in the video controls to continue.')) }
    if (video.readyState > 0) start()
    else video.addEventListener('loadedmetadata', start, { once: true })
    video.focus({ preventScroll: true })
    return () => video.removeEventListener('loadedmetadata', start)
  }, [cue, failed])
  async function expand() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else if (videoRef.current?.requestFullscreen) await videoRef.current.requestFullscreen()
      else setNotice('Use the video controls to expand playback on this device.')
    } catch { setNotice('Use the video controls to expand playback on this device.') }
  }

  return <section className="im-film im-section" id="film" data-studio-chapter="1" aria-labelledby="im-film-title">
    <div className="im-section-label"><span>01 / THE FILM</span><span>32 SECONDS / THE CONTINUUM</span></div>
    <div className="im-section-heading"><h2 id="im-film-title">An idea.<br /><em>A world of possibility.</em></h2><p>From a first spark to a digital experience.<br />A short film about what we create.</p></div>
    <div className={`im-cinema ${cue ? 'im-cinema-active' : ''}`}>
      {!cue && <><img src={studioConfig.film.poster} srcSet={`${studioConfig.film.posterSmall} 640w, ${studioConfig.film.poster} 1600w`} sizes="(max-width: 760px) 88vw, 86vw" alt="The approved folded violet and silver Idiomorph emblem" width="1600" height="900" loading="lazy" /><div className="im-poster-shade" /><div className="im-cinema-top" aria-hidden="true"><span>IDIOMORPH ORIGINAL</span><span>SPARK / STRUCTURE / TRANSFORMATION / REVEAL</span></div><button className="im-play" onClick={() => onRequest(0)} aria-label="Watch the film — 32-second Idiomorph Studio advertisement"><span className="im-play-circle"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7Z" fill="currentColor" /></svg></span><span>WATCH THE FILM</span></button><div className="im-cinema-bottom" aria-hidden="true"><span>Everything begins with an idea.</span><span>{studioConfig.film.duration}</span></div></>}
      {cue && !failed && <video ref={videoRef} tabIndex={0} controls autoPlay playsInline muted={muted} preload="none" poster={studioConfig.film.poster} aria-label="Idiomorph Studio — The Continuum" onVolumeChange={() => { if (videoRef.current) setMuted(videoRef.current.muted) }} onTimeUpdate={event => setChapter(filmChapters.reduce((last, stage, index) => event.currentTarget.currentTime >= stage.time ? index : last, 0))} onError={() => setFailed(true)}>
        <source src={studioConfig.film.webm} type="video/webm" /><source src={studioConfig.film.mp4} type="video/mp4" /><track kind="captions" src={studioConfig.film.captions} srcLang="en" label="English descriptions" />Your browser cannot play this film. <a href={studioConfig.film.mp4}>Download the film</a> or read the description below.
      </video>}
      {failed && <div className="im-media-fallback" role="status"><p>The film couldn’t play in this browser.</p><a href={studioConfig.film.mp4} download>Download the film · MP4</a><p>Or read the complete film description below.</p><button onClick={() => setFailed(false)}>Try again</button></div>}
    </div>
    <div className="im-film-caption"><span>AN IDEA BECOMING SOMETHING REAL.</span><div>{cue && !failed && <><button onClick={() => setMuted(!muted)} aria-pressed={!muted}>{muted ? 'Enable sound' : 'Mute sound'} <span aria-hidden="true">{muted ? '＋' : '−'}</span></button><button onClick={expand}>Expand <span aria-hidden="true">↗</span></button></>}<span>{studioConfig.film.duration}</span></div></div>
    <div className="im-film-chapters" role="group" aria-label="Jump to a film chapter"><span>FILM CHAPTERS</span>{filmChapters.map((stage, index) => <button key={stage.id} aria-pressed={!!cue && chapter === index} onClick={() => onRequest(stage.time)}><span aria-hidden="true">0{index + 1}</span>{stage.title}</button>)}</div>
    {notice && <p className="im-film-notice" role="status">{notice}</p>}
    <details className="im-transcript"><summary>Read the film description <span aria-hidden="true">＋</span></summary><p>One violet form emerges from darkness and opens into silver architectural surfaces. The surfaces separate, connect and become interface panels: an editorial business website, a filterable project application and a flow from website to API to data. Wireframes resolve into finished typography and interactions. The compositions fold inward along the two silhouettes of the approved Idiomorph emblem, revealing the exact violet and silver artwork. IDIOMORPH STUDIO. From ideas to what’s next. An original atmospheric score develops through the four acts and resolves with the signature. All digital examples are original concepts, not client projects. No speech.</p></details>
  </section>
}
