import { useState } from 'react'
import { processStages } from './config'

function ProjectScene({ stage }: { stage: number }) {
  return <div className={`im-project-scene im-project-stage-${stage}`}>
    <div className="im-project-scene-top"><span>ONE PROJECT, TAKING SHAPE</span><span>0{stage + 1} / 05</span></div>
    {stage === 0 ? <div className="im-project-brief"><span>The starting point</span><p className="im-project-title">A clearer way<br />to introduce your business.</p><dl><div><dt>Audience</dt><dd>People looking for your services</dd></div><div><dt>Goal</dt><dd>Help visitors understand and enquire</dd></div><div><dt>Scope</dt><dd>Website, content & enquiry flow</dd></div></dl></div> : <>
      <div className="im-project-map"><span>Home</span><i aria-hidden="true">→</i><span>Services</span><i aria-hidden="true">→</i><span>Enquire</span></div>
      <div className={`im-project-window${stage === 1 ? ' im-project-wireframe' : ''}`}>
        <div className="im-project-window-top"><span>FORM / FIELD</span><span>{stage === 1 ? 'Layout direction' : 'Independent by design'}</span></div>
        <div className="im-project-page"><div><p className="im-project-title">Room for<br />a different view.</p><p>Considered spaces.<br />Made around you.</p><span className="im-project-page-link">Explore our services</span></div><div className="im-project-material" aria-hidden="true"><span /><span /></div></div>
      </div>
      {stage === 2 && <div className="im-project-annotation"><span>Enquiry interface</span><i aria-hidden="true">→</i><span>Validation & API</span><i aria-hidden="true">→</i><span>Business data</span></div>}
      {stage === 3 && <div className="im-project-review"><span>Review points</span><span>Keyboard access</span><span>Small screens</span><span>Content & speed</span></div>}
      {stage === 4 && <div className="im-project-handover"><span>Release</span><span>Access</span><span>Documentation</span><span>Walkthrough</span></div>}
    </>}
    <span className="im-project-scene-note">Illustrative deliverables, not a client project.</span>
  </div>
}

export function StudioProcess() {
  const [active, setActive] = useState(0)
  return <section className="im-process im-section" id="approach" data-studio-chapter="3" aria-labelledby="im-process-title">
    <div className="im-section-label"><span>03 / HOW WE WORK</span><span>A CONSIDERED PROCESS</span></div>
    <div className="im-section-heading"><h2 id="im-process-title">A clear path.<br /><em>A working product.</em></h2><p>We begin with a conversation and agree a direction.<br />Then we design, build, test and hand it over.<br />Follow one example through the five stages.</p></div>
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
      <figure className="im-process-figure"><ProjectScene stage={index} /><figcaption>{['A brief with a purpose.', 'Structure before detail.', 'Design becomes software.', 'Review the experience.', 'Prepared for handover.'][index]}</figcaption></figure>
      <div className="im-process-story"><span className="im-eyebrow">{step.title.toUpperCase()} / 0{index + 1}</span><h3>{step.heading}</h3><p>{step.copy}</p><div className="im-process-outcome"><span>WHAT YOU LEAVE WITH</span><p>{step.outcome}</p></div></div>
    </div>)}
  </section>
}
