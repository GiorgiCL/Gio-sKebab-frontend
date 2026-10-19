import { useEffect, useRef, useState } from 'react'
import { Arrow } from './StudioMark'
import { projectOptions, studioConfig, type ProjectKind } from './config'

const prompts: Record<ProjectKind, string> = {
  website: 'What should your website help people understand or do?',
  application: 'What task or workflow could work better?',
  systems: 'Which tools or information need to work together?',
  exploring: 'What is the possibility you keep coming back to?',
}
export function StudioInquiry({ project, onProject }: { project: ProjectKind; onProject: (kind: ProjectKind) => void }) {
  const [brief, setBrief] = useState('')
  const [feedback, setFeedback] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const address = useRef<HTMLSpanElement>(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  const selected = projectOptions.find(option => option.id === project)!
  const body = ['Hello Idiomorph Studio,', '', `I’m thinking about ${selected.thought}.`, '', 'The idea:', brief.trim() || '(Add a little about your idea here.)', '', prompts[project], '', 'A useful time to talk:', ''].join('\n')
  const subject = `Project enquiry — ${selected.subject}`
  const href = `mailto:${studioConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  async function copy() {
    try { await navigator.clipboard.writeText(studioConfig.email); setFeedback('Email address copied.') }
    catch { if (address.current) { const range = document.createRange(); range.selectNodeContents(address.current); const selection = getSelection(); selection?.removeAllRanges(); selection?.addRange(range) } setFeedback('Copy was unavailable. The address is selected so you can copy it manually.') }
    clearTimeout(timer.current); timer.current = setTimeout(() => setFeedback(''), 6000)
  }
  return <div className="im-inquiry">
    <div className="im-project-types" role="group" aria-label="What kind of project are you thinking about?"><span>01 / WHAT’S ON YOUR MIND?</span>{projectOptions.map(option => <button key={option.id} aria-pressed={project === option.id} onClick={() => onProject(option.id)}>{option.label}<span aria-hidden="true">{project === option.id ? '↗' : '＋'}</span></button>)}</div>
    <div className="im-brief-field"><label htmlFor="im-project-brief">02 / A LITTLE ABOUT THE IDEA <span>OPTIONAL</span></label><p id="im-brief-prompt">{prompts[project]}</p><textarea id="im-project-brief" rows={3} maxLength={600} value={brief} onChange={event => setBrief(event.target.value)} aria-describedby="im-brief-prompt im-brief-privacy" placeholder="A few words are enough to begin." /><div><span id="im-brief-privacy">Stays in this page until you open your email app.</span><span>{brief.length}/600</span></div></div>
    <div className="im-draft-summary" role="status"><span>YOUR CONVERSATION STARTS WITH</span><strong>{selected.subject}</strong></div>
    <a className="im-button im-button-ink" href={href} aria-describedby={!studioConfig.emailConfirmed ? 'im-contact-status' : undefined}>Open your email draft <Arrow diagonal /></a>
    <details className="im-draft-preview"><summary>Preview the draft <span aria-hidden="true">＋</span></summary><p><strong>Subject:</strong> {subject}</p><pre>{body}</pre></details>
    <div className="im-direct-contact"><span className="im-direct-label">OR WRITE DIRECTLY</span><a className="im-email" href={`mailto:${studioConfig.email}`} aria-describedby={!studioConfig.emailConfirmed ? 'im-contact-status' : undefined}><span ref={address}>{studioConfig.email}</span><Arrow diagonal /></a><button className="im-copy" onClick={copy}>Copy email <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 8h12v12H8zM4 15V4h11" stroke="currentColor" strokeWidth="1.3" /></svg></button></div>
    {!studioConfig.emailConfirmed && <p id="im-contact-status" className="im-contact-status">Proposed address · not yet confirmed.<br />Please verify before sending.</p>}<span className="im-copy-status" role="status">{feedback}</span>
  </div>
}
