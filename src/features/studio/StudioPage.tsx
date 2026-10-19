import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Arrow, StudioMark } from './StudioMark'
import { StudioFilm } from './StudioFilm'
import { StudioServices } from './StudioServices'
import { StudioProcess } from './StudioProcess'
import { StudioProgress } from './StudioProgress'
import { studioConfig, type ProjectKind, type FilmCue } from './config'
import { StudioEmblem } from './StudioEmblem'
import { StudioInquiry } from './StudioInquiry'
import { StudioPassage } from './StudioPassage'
import './studio.css'
import './studio-v3.css'

function useStudioIdentity() {
  useEffect(() => {
    const title = document.title, lang = document.documentElement.lang
    const theme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    const themeColor = theme?.content
    const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    const iconHref = icon?.getAttribute('href'), iconType = icon?.getAttribute('type')
    const old = [...document.head.querySelectorAll('meta[name="description"],meta[name="robots"],meta[property^="og:"],meta[name^="twitter:"],link[rel="canonical"],link[rel="alternate"][hreflang],script[data-page-metadata]')]
    old.forEach(node => node.remove())
    document.title = 'Idiomorph Studio — Built to become more.'
    document.documentElement.lang = 'en';document.documentElement.classList.add('im-document')
    if (theme) theme.content = '#17121e'
    if (icon) { icon.href = studioConfig.brand.favicon; icon.type = 'image/png' }
    const description = 'Distinctive business websites, custom web applications, and backend systems. Ideas transformed into considered digital experiences.'
    const metas = { description, robots: studioConfig.publicationReady ? 'index, follow' : 'noindex, nofollow', 'og:type': 'website', 'og:title': 'Idiomorph Studio — Built to become more.', 'og:description': description, 'og:image': new URL(studioConfig.film.poster, location.origin).href, 'og:image:alt': 'An original sculpted hand drawing on warm, textured paper', 'og:url': new URL('/studio', location.origin).href, 'twitter:card': 'summary_large_image' }
    const nodes: HTMLElement[] = []
    for (const [name, content] of Object.entries(metas)) { const meta = document.createElement('meta');meta.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);meta.content = content;document.head.append(meta);nodes.push(meta) }
    const canonical = document.createElement('link');canonical.rel = 'canonical';canonical.href = new URL('/studio', location.origin).href;document.head.append(canonical);nodes.push(canonical)
    return () => {
      nodes.forEach(node => node.remove());old.forEach(node => document.head.append(node))
      document.title = title;document.documentElement.lang = lang;document.documentElement.classList.remove('im-document')
      if (theme && themeColor) theme.content = themeColor
      if (icon && iconHref) { icon.setAttribute('href', iconHref); if (iconType) icon.type = iconType }
    }
  }, [])
}

export function Component() {
  useStudioIdentity()
  const [filmCue, setFilmCue] = useState<FilmCue>(null)
  const [project, setProject] = useState<ProjectKind>('exploring')
  const [motionPaused, setMotionPaused] = useState(false)
  function watchFilm(at = 0) {
    setFilmCue(previous => ({ at, request: (previous?.request ?? 0) + 1 }))
    document.querySelector('.im-cinema')?.scrollIntoView({ behavior: motionPaused || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' })
  }
  function chooseProject(kind: ProjectKind) {
    setProject(kind)
    requestAnimationFrame(() => document.getElementById('im-contact-title')?.focus({ preventScroll: true }))
  }
  return <div className={`im-studio${motionPaused ? ' im-motion-paused' : ''}`}>
    <a className="im-skip" href="#im-main">Skip to content</a>
    <header className="im-header">
      <a className="im-brand" href="#studio-top" aria-label="Idiomorph Studio home"><StudioMark /><span>IDIOMORPH <span>STUDIO</span></span></a>
      <nav aria-label="Studio navigation"><a href="#expertise">Expertise</a><a href="#approach">Approach</a><a className="im-nav-contact" href="#contact">Let’s talk <Arrow diagonal /></a></nav>
    </header>
    <StudioProgress />
    <main id="im-main">
      <section className="im-hero im-section" id="studio-top" data-studio-chapter="0" aria-labelledby="im-hero-title">
        <div className="im-hero-grid">
          <div className="im-hero-content"><p className="im-eyebrow"><span /> DESIGN & DIGITAL DEVELOPMENT</p><h1 id="im-hero-title">From ideas<br />to <em>what’s next.</em></h1><p className="im-hero-description">Distinctive websites, custom applications, and connected systems. Thoughtfully made for the people who use them.</p><div className="im-hero-actions"><a className="im-button im-button-primary" href="#contact">Start a project <Arrow diagonal /></a><button className="im-film-link" onClick={() => watchFilm()}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 9 6-9 6Z" fill="currentColor" /></svg>Watch the film <span>{studioConfig.film.duration}</span></button></div></div>
          <StudioEmblem motionPaused={motionPaused} />
        </div>
        <div className="im-hero-bottom"><a href="#film">A LITTLE THOUGHT. A DIFFERENT EXPERIENCE. <span aria-hidden="true">↓</span></a><span>WEBSITES / APPLICATIONS / SYSTEMS</span></div>
      </section>
      <div className="im-intention"><span className="im-eyebrow">THE WAY WE SEE IT</span><p>An idea is personal.<br />What it becomes should be, <em>too.</em></p><span className="im-intention-mark" aria-hidden="true">↳</span></div>
      <StudioFilm cue={filmCue} onRequest={watchFilm} />
      <StudioPassage />
      <StudioServices onChoose={chooseProject} />
      <StudioPassage reverse />
      <StudioProcess onWatch={watchFilm} />
      <StudioPassage contact />
      <section className="im-contact im-section" id="contact" data-studio-chapter="4" aria-labelledby="im-contact-title">
        <div className="im-section-label"><span>04 / YOUR NEXT STEP</span><span>A CONSIDERED BEGINNING</span></div>
        <div className="im-contact-grid"><div className="im-contact-heading"><h2 id="im-contact-title" tabIndex={-1}>An idea in mind?<br />Let’s give it <em>form.</em></h2><p>Tell us what you’re thinking.<br />You don’t need to have it all figured out.</p><div className="im-contact-aside"><span>A FEW WORDS TO BEGIN.</span><p>The draft is yours to review.<br />Nothing is sent from this page.</p></div></div><StudioInquiry project={project} onProject={setProject} /></div>
      </section>
    </main>
    <footer className="im-footer"><div className="im-footer-signature"><a className="im-footer-brand" href="#studio-top" aria-label="Idiomorph Studio, back to top"><StudioMark /><span>IDIOMORPH <span>STUDIO</span></span></a><p>Built to become more.</p></div><div className="im-footer-bottom"><span>© {new Date().getFullYear()} IDIOMORPH STUDIO</span><button onClick={() => setMotionPaused(!motionPaused)} aria-pressed={motionPaused}>{motionPaused ? 'Enable motion' : 'Reduce motion'}</button><Link to="/lt">Back to Gio’s Kebab <span aria-hidden="true">↗</span></Link></div></footer>
  </div>
}
