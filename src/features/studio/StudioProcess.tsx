import { useState } from 'react'
import { Arrow } from './StudioMark'
import { processStages } from './config'

export function StudioProcess({ onWatch }: { onWatch: (at: number) => void }) {
  const [active, setActive] = useState(0)
  return <section className="im-process im-section" id="approach" data-studio-chapter="3" aria-labelledby="im-process-title">
    <div className="im-section-label"><span>03 / HOW WE WORK</span><span>A CONSIDERED PROCESS</span></div>
    <div className="im-section-heading"><h2 id="im-process-title">Good work is<br /><em>a conversation.</em></h2><p>From the first question to the final detail.<br />Explore how an idea takes shape.</p></div>
    <div className="im-process-tabs" role="tablist" aria-label="Our creation process">{processStages.map((step, index) => <button role="tab" aria-selected={active === index} aria-controls={`im-process-panel-${index}`} id={`im-process-tab-${index}`} tabIndex={active === index ? 0 : -1} key={step.id} onClick={() => setActive(index)} onKeyDown={event => {
      let next = index
      if (event.key === 'ArrowRight') next = (index + 1) % processStages.length
      else if (event.key === 'ArrowLeft') next = (index + processStages.length - 1) % processStages.length
      else if (event.key === 'Home') next = 0
      else if (event.key === 'End') next = processStages.length - 1
      else return
      event.preventDefault(); setActive(next); document.getElementById(`im-process-tab-${next}`)?.focus()
    }}><span>0{index + 1}</span>{step.title}<span className="im-stage-dot" aria-hidden="true" /></button>)}</div>
    {processStages.map((step, index) => <div className="im-process-panel" role="tabpanel" tabIndex={0} id={`im-process-panel-${index}`} aria-labelledby={`im-process-tab-${index}`} key={step.id} hidden={active !== index}>
      <figure className="im-process-figure"><img src={`/studio/process-${step.id}.webp`} srcSet={`/studio/process-${step.id}-small.webp 480w, /studio/process-${step.id}.webp 960w`} sizes="(max-width: 760px) 88vw, 46vw" alt="" width="960" height="540" loading="lazy" /><figcaption><span>FROM THOUGHT TO FORM</span><span>0{index + 1} / 05</span></figcaption></figure>
      <div className="im-process-story"><span className="im-eyebrow">{step.title.toUpperCase()} / 0{index + 1}</span><h3>{step.heading}</h3><p>{step.copy}</p><div className="im-process-outcome"><span>WHAT TAKES SHAPE</span><p>{step.outcome}</p></div><button className="im-text-link" onClick={() => onWatch(step.time)}>See this moment in the film <Arrow diagonal /></button></div>
    </div>)}
  </section>
}
