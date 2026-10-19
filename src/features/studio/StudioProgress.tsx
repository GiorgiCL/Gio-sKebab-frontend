import { useEffect, useState } from 'react'
import { StudioMark } from './StudioMark'

const chapters = [
  { id: 'studio-top', label: 'The idea', word: 'POSSIBILITY' },
  { id: 'film', label: 'The film', word: 'INTENTION' },
  { id: 'expertise', label: 'What we create', word: 'EXPERIENCE' },
  { id: 'approach', label: 'How we work', word: 'CRAFT' },
  { id: 'contact', label: 'Your next step', word: 'WHAT’S NEXT' },
]

export function StudioProgress() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) setActive(Number((visible[0].target as HTMLElement).dataset.studioChapter))
    }, { rootMargin: '-12% 0px -52% 0px', threshold: 0 })
    document.querySelectorAll('[data-studio-chapter]').forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])
  return <nav className={`im-progress im-progress-${active}`} aria-label="Page chapters">
    <div className="im-progress-symbol" aria-hidden="true"><StudioMark /><span /></div>
    {chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} aria-label={chapter.label} aria-current={active === index ? 'location' : undefined} data-label={chapter.label}><span /></a>)}
    <span className="im-progress-word" aria-hidden="true">{chapters[active].word}</span>
  </nav>
}
