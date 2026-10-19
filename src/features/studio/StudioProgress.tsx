import { useEffect, useState } from 'react'

const chapters = [
  { id: 'studio-top', label: 'The idea' },
  { id: 'film', label: 'The film' },
  { id: 'expertise', label: 'What we create' },
  { id: 'approach', label: 'How we work' },
  { id: 'contact', label: 'Your next step' },
]

export function StudioProgress() {
  const [active, setActive] = useState(0)
  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>('[data-studio-chapter]')]
    const visible = new Set<number>()
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const index = Number((entry.target as HTMLElement).dataset.studioChapter)
        if (entry.isIntersecting) visible.add(index)
        else visible.delete(index)
      })
      if (visible.size) setActive(Math.max(...visible))
    }, { rootMargin: '0px 0px -60% 0px', threshold: 0 })
    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  return <nav className={`im-progress im-progress-${active}${expanded ? ' im-progress-expanded' : ''}`} aria-label="Page chapters">
    <button className="im-chapters-toggle" aria-expanded={expanded} aria-controls="im-chapter-links" onClick={() => setExpanded(!expanded)} aria-label={expanded ? 'Collapse page chapters' : 'Expand page chapters'}><span aria-hidden="true">↳</span><span>CHAPTERS</span></button>
    <div id="im-chapter-links">{chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} aria-current={active === index ? 'location' : undefined} onClick={() => { setActive(index); setExpanded(false) }}><span className="im-chapter-number" aria-hidden="true">0{index + 1}</span><span className="im-chapter-label">{chapter.label}</span><span className="im-chapter-tick" aria-hidden="true" /></a>)}</div>
    <span className="im-progress-readout" aria-hidden="true">0{active + 1}<span> / 05</span></span>
  </nav>
}
