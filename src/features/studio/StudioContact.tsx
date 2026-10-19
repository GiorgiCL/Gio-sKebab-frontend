import { useState } from 'react'
import { Arrow } from './StudioMark'
import { studioConfig } from './config'

export function StudioContact() {
  const [feedback, setFeedback] = useState('')
  async function copyEmail() {
    try { await navigator.clipboard.writeText(studioConfig.email); setFeedback('Email address copied.') }
    catch { setFeedback('Select the email address to copy it, or use the email link.') }
  }
  return <div className="im-contact-direct">
    <p>A new website, a better way of working, or systems that need to connect. Tell us what you have in mind and what you want to change.</p>
    <a className="im-button im-button-ink" href={`mailto:${studioConfig.email}`}>Let’s talk about your project <Arrow diagonal /></a>
    <div className="im-contact-address"><a href={`mailto:${studioConfig.email}`}>{studioConfig.email}</a><button className="im-copy" onClick={copyEmail}>Copy email <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7 7h9v10H7zM4 13H3V3h9v1" stroke="currentColor" /></svg></button></div>
    <p className="im-copy-status" role="status">{feedback}</p>
    <span className="im-contact-note">Your email opens a conversation. No brief required.</span>
  </div>
}
