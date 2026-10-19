import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Arrow, StudioMark } from './StudioMark'
import { StudioFilm } from './StudioFilm'
import { StudioServices } from './StudioServices'
import { StudioProcess } from './StudioProcess'
import { studioConfig } from './config'
import './studio.css'

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
    if (theme) theme.content = '#08070b'
    if (icon) { icon.href = '/studio/emblem.svg'; icon.type = 'image/svg+xml' }
    const description = 'Distinctive business websites, custom web applications, and backend systems. Ideas transformed into considered digital experiences.'
    const metas = { description, robots: studioConfig.publicationReady ? 'index, follow' : 'noindex, nofollow', 'og:type': 'website', 'og:title': 'Idiomorph Studio — Built to become more.', 'og:description': description, 'og:image': new URL(studioConfig.film.poster, location.origin).href, 'og:image:alt': 'The original Idiomorph silver ribbon sculpture', 'og:url': new URL('/studio', location.origin).href, 'twitter:card': 'summary_large_image' }
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
  const [filmRequested, setFilmRequested] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')
  const [motionPaused, setMotionPaused] = useState(false)
  const emailRef = useRef<HTMLSpanElement>(null)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(copyTimer.current), [])

  function watchFilm() {
    setFilmRequested(true)
    document.getElementById('film')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
  }
  async function copyEmail() {
    try { await navigator.clipboard.writeText(studioConfig.email);setCopyStatus('Email copied') }
    catch {
      if (emailRef.current) { const range = document.createRange();range.selectNodeContents(emailRef.current);const selection = window.getSelection();selection?.removeAllRanges();selection?.addRange(range) }
      setCopyStatus('Select and copy the address above.')
    }
    clearTimeout(copyTimer.current);copyTimer.current = setTimeout(() => setCopyStatus(''), 5000)
  }

  return <div className={`im-studio${motionPaused ? ' im-motion-paused' : ''}`}>
    <a className="im-skip" href="#im-main">Skip to content</a>
    <header className="im-header"><a className="im-brand" href="#studio-top" aria-label="Idiomorph Studio home"><StudioMark /><span>IDIOMORPH <span>STUDIO</span></span></a><nav aria-label="Studio navigation"><a href="#expertise">Expertise</a><a href="#approach">Approach</a><a className="im-nav-contact" href="#contact">Let’s talk <Arrow diagonal /></a></nav></header>
    <main id="im-main">
      <section className="im-hero" id="studio-top" aria-labelledby="im-hero-title">
        <div className="im-hero-lines" aria-hidden="true" />
        <div className="im-hero-content"><p className="im-eyebrow"><span /> INDEPENDENT DIGITAL DEVELOPMENT STUDIO</p><h1 id="im-hero-title">From ideas<br />to <em>what’s next.</em></h1><p className="im-hero-description">Distinctive websites, custom applications,<br className="im-desktop-break" /> and digital systems—built with intention.</p><div className="im-hero-actions"><button className="im-button im-button-primary" onClick={watchFilm}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 9 6-9 6Z" fill="currentColor" /></svg>Watch the film<span>00:32</span></button><a className="im-text-link" href="#contact">Start a project <Arrow diagonal /></a></div></div>
        <div className="im-hero-art" aria-hidden="true"><div className="im-art-halo" /><img className="im-chrome" src="/studio/emblem.webp" srcSet="/studio/emblem-small.webp 392w, /studio/emblem.webp 784w" sizes="(max-width: 760px) 88vw, 46vw" width="784" height="864" fetchPriority="high" alt="" /><div className="im-art-caption"><span>FIG. 01 — THE CONTINUUM</span><span>AN IDEA, IN A CONSTANT STATE OF BECOMING.</span></div><span className="im-art-axis">I / M</span></div>
        <div className="im-hero-bottom"><a href="#film"><span className="im-scroll-arrow" aria-hidden="true">↓</span> SCROLL TO UNFOLD</a><span>THOUGHTFULLY DESIGNED. PRECISELY ENGINEERED.</span><button onClick={() => setMotionPaused(!motionPaused)} aria-pressed={motionPaused}>{motionPaused ? 'Resume motion' : 'Pause motion'} <span aria-hidden="true">{motionPaused ? '▷' : 'Ⅱ'}</span></button></div>
      </section>
      <div className="im-manifesto"><span aria-hidden="true">↳</span><p>The best digital experiences don’t just exist.<br />They <em>become something.</em></p><span className="im-manifesto-note">VISION, GIVEN FORM.<br />AMBITION, MADE REAL.</span></div>
      <StudioFilm requested={filmRequested} onRequest={() => setFilmRequested(true)} />
      <StudioServices />
      <StudioProcess />
      <section className="im-contact im-section" id="contact" aria-labelledby="im-contact-title"><div className="im-section-label"><span>04 / THE NEXT CHAPTER</span><span>IT STARTS WITH A CONVERSATION</span></div><div className="im-contact-heading"><h2 id="im-contact-title">Your idea deserves<br />more than <em>ordinary.</em></h2><StudioMark className="im-contact-mark" /></div><div className="im-contact-bottom"><div><p>Something on your mind?<br />Tell us what you’d like to make possible.</p><a className="im-email" href={`mailto:${studioConfig.email}?subject=${encodeURIComponent('A new idea — project enquiry')}`} aria-describedby={!studioConfig.emailConfirmed ? 'im-contact-status' : undefined}><span ref={emailRef}>{studioConfig.email}</span><Arrow diagonal /></a>{!studioConfig.emailConfirmed && <p id="im-contact-status" className="im-contact-status">Proposed contact address · not yet confirmed.<br />Please verify the address before sending.</p>}</div><div className="im-contact-actions"><a className="im-text-link" href={`mailto:${studioConfig.email}?subject=${encodeURIComponent('A new idea — project enquiry')}`} aria-describedby={!studioConfig.emailConfirmed ? 'im-contact-status' : undefined}>Draft an email <Arrow diagonal /></a><button className="im-copy" onClick={copyEmail}>Copy email <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 8h12v12H8zM4 15V4h11" stroke="currentColor" strokeWidth="1.3" /></svg></button><span className="im-copy-status" role="status">{copyStatus}</span></div></div></section>
    </main>
    <footer className="im-footer"><a className="im-footer-wordmark" href="#studio-top" aria-label="Idiomorph Studio, back to top">IDIOMORPH<span aria-hidden="true">↗</span></a><div className="im-footer-bottom"><span>© {new Date().getFullYear()} IDIOMORPH STUDIO</span><span>BUILT TO BECOME MORE.</span><Link to="/lt">Back to Gio’s Kebab <span aria-hidden="true">↗</span></Link></div></footer>
  </div>
}
