import { useEffect, useRef, useState } from 'react'
import { studioConfig, processStages, type FilmCue } from './config'

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
    <div className="im-section-label"><span>01 / THE FILM</span><span>42 SECONDS / FROM INTENTION TO FORM</span></div>
    <div className="im-section-heading"><h2 id="im-film-title">Made of thought.<br /><em>Made for people.</em></h2><p>A question, a sketch, a change of mind.<br />The little things behind what comes next.</p></div>
    <div className={`im-cinema ${cue ? 'im-cinema-active' : ''}`}>
      {!cue && <><img src={studioConfig.film.poster} srcSet={`${studioConfig.film.posterSmall} 640w, ${studioConfig.film.poster} 1600w`} sizes="(max-width: 760px) 88vw, 86vw" alt="An original sculpted hand drawing on warm, textured paper" width="1600" height="900" loading="lazy" /><div className="im-poster-shade" /><div className="im-cinema-top" aria-hidden="true"><span>IDIOMORPH ORIGINAL</span><span>A FILM ABOUT MAKING</span></div><button className="im-play" onClick={() => onRequest(0)} aria-label="Watch the film — 42-second Idiomorph Studio advertisement"><span className="im-play-circle"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7Z" fill="currentColor" /></svg></span><span>WATCH THE FILM</span></button><div className="im-cinema-bottom" aria-hidden="true"><span>It starts with a question.</span><span>{studioConfig.film.duration}</span></div></>}
      {cue && !failed && <video ref={videoRef} tabIndex={0} controls autoPlay playsInline muted={muted} preload="none" poster={studioConfig.film.poster} aria-label="Idiomorph Studio — a film about making" onVolumeChange={() => { if (videoRef.current) setMuted(videoRef.current.muted) }} onTimeUpdate={event => setChapter(processStages.reduce((last, stage, index) => event.currentTarget.currentTime >= stage.time ? index : last, 0))} onError={() => setFailed(true)}>
        <source src={studioConfig.film.webm} type="video/webm" /><source src={studioConfig.film.mp4} type="video/mp4" /><track kind="captions" src={studioConfig.film.captions} srcLang="en" label="English descriptions" />Your browser cannot play this film. <a href={studioConfig.film.mp4}>Download the film</a> or read the description below.
      </video>}
      {failed && <div className="im-media-fallback" role="status"><p>The film couldn’t play in this browser.</p><a href={studioConfig.film.mp4} download>Download the film · MP4</a><p>Or read the complete film description below.</p><button onClick={() => setFailed(false)}>Try again</button></div>}
    </div>
    <div className="im-film-caption"><span>AN IDEA BECOMING SOMETHING REAL.</span><div>{cue && !failed && <><button onClick={() => setMuted(!muted)} aria-pressed={!muted}>{muted ? 'Enable sound' : 'Mute sound'} <span aria-hidden="true">{muted ? '＋' : '−'}</span></button><button onClick={expand}>Expand <span aria-hidden="true">↗</span></button></>}<span>{studioConfig.film.duration}</span></div></div>
    <div className="im-film-chapters" role="group" aria-label="Jump to a film chapter"><span>EXPLORE A MOMENT</span>{processStages.map((stage, index) => <button key={stage.id} aria-pressed={!!cue && chapter === index} onClick={() => onRequest(stage.time)}><span aria-hidden="true">0{index + 1}</span>{stage.title}</button>)}</div>
    {notice && <p className="im-film-notice" role="status">{notice}</p>}
    <details className="im-transcript"><summary>Read the film description <span aria-hidden="true">＋</span></summary><p>A graphite stroke meets textured paper. An intentionally stylized sculpted hand draws “What if?” under warm light. Sketch lines rise from the page into two folded surfaces. A website takes shape: type, spacing, and a deliberate adjustment. An application moves from request to review to ready; connected systems join together. We move close to brushed metal, then through silver and violet ribbons as they unfold and resolve. The three-dimensional interpretation gives way to the exact supplied Idiomorph Studio emblem. IDIOMORPH STUDIO. From ideas to what’s next. Original paper and graphite textures give way to a restrained tonal progression, then silence. All interfaces and the hand are original illustrative scenes, not client work or footage of a studio team. No speech.</p></details>
  </section>
}
