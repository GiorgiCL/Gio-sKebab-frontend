import { useEffect, useRef, useState } from 'react'
import { studioConfig } from './config'

export function StudioFilm({ requested, onRequest }: { requested: boolean; onRequest: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [failed, setFailed] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const pause = () => { if (document.hidden) videoRef.current?.pause() }
    document.addEventListener('visibilitychange', pause)
    return () => document.removeEventListener('visibilitychange', pause)
  }, [])

  useEffect(() => {
    if (requested) videoRef.current?.focus({ preventScroll: true })
  }, [requested])

  async function expand() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else if (videoRef.current?.requestFullscreen) await videoRef.current.requestFullscreen()
      else setNotice('Use the video controls to expand playback on this device.')
    } catch { setNotice('Use the video controls to expand playback on this device.') }
  }

  return <section className="im-film im-section" id="film" aria-labelledby="im-film-title">
    <div className="im-section-label"><span>01 / THE FILM</span><span>A STUDY IN TRANSFORMATION</span></div>
    <div className="im-section-heading"><h2 id="im-film-title">A thought.<br /><em>In motion.</em></h2><p>From the first spark to something extraordinary.<br />The idea behind everything we build.</p></div>
    <div className={`im-cinema ${requested ? 'im-cinema-active' : ''}`}>
      {!requested && <>
        <img src={studioConfig.film.poster} alt="The silver Idiomorph ribbon, suspended in a dark architectural space" width="1600" height="900" loading="lazy" />
        <div className="im-poster-shade" />
        <div className="im-cinema-top" aria-hidden="true"><span>IDIOMORPH ORIGINAL</span><span>32 SECONDS / SOUND & VISION</span></div>
        <button className="im-play" onClick={onRequest} aria-label="Watch the film — 32-second Idiomorph Studio advertisement"><span className="im-play-circle"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7Z" fill="currentColor" /></svg></span><span>WATCH THE FILM</span></button>
        <div className="im-cinema-bottom" aria-hidden="true"><span>Built to become more.</span><span>00:32</span></div>
      </>}
      {requested && !failed && <video ref={videoRef} tabIndex={0} controls autoPlay playsInline muted={muted} preload="none" poster={studioConfig.film.poster} aria-label="Idiomorph Studio — Built to become more" onVolumeChange={() => { if (videoRef.current) setMuted(videoRef.current.muted) }} onError={() => setFailed(true)}>
        <source src={studioConfig.film.webm} type="video/webm" />
        <source src={studioConfig.film.mp4} type="video/mp4" />
        <track kind="captions" src={studioConfig.film.captions} srcLang="en" label="English descriptions" />
        Your browser cannot play this film. <a href={studioConfig.film.mp4}>Download the film</a> or read its description below.
      </video>}
      {failed && <div className="im-media-fallback" role="status"><p>The film couldn’t play in this browser.</p><a href={studioConfig.film.mp4} download>Download the film · MP4</a><p>Or read the complete film description below.</p><button onClick={() => setFailed(false)}>Try again</button></div>}
    </div>
    <div className="im-film-caption"><span>AN IDEA. A SYSTEM. A SIGNATURE.</span><div>{requested && !failed && <><button onClick={() => setMuted(!muted)} aria-pressed={!muted}>{muted ? 'Enable sound' : 'Mute sound'}<span aria-hidden="true"> {muted ? '＋' : '−'}</span></button><button onClick={expand}>Expand <span aria-hidden="true">↗</span></button></>}<span>{studioConfig.film.duration}</span></div></div>
    {notice && <p className="im-film-notice" role="status">{notice}</p>}
    <details className="im-transcript"><summary>Read the film description <span aria-hidden="true">＋</span></summary><p>A tiny ultraviolet seed emerges in darkness. It opens into measured silver fragments, which resolve into an architectural network. Original illustrative interfaces show business websites, custom applications, and connected backend systems. The compositions converge into a continuous, sculptural silver ribbon. Idiomorph Studio. Built to become more. Original ambient tones and metallic accents fade into silence. No speech.</p></details>
  </section>
}
