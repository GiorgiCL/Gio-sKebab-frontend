import { useState } from 'react'
import { StudioMark } from './StudioMark'

const steps = [
  { title: 'Discover', heading: 'First, the right questions.', copy: 'We find the purpose, the people, and the problem worth solving. A clear idea of what success should feel like.' },
  { title: 'Design', heading: 'Give the idea its own language.', copy: 'We shape the structure, interactions, and visual direction into an experience with a distinct point of view.' },
  { title: 'Engineer', heading: 'Make the ambition work.', copy: 'Interfaces, logic, and connections become working software. Every layer serves the same intention.' },
  { title: 'Refine', heading: 'The difference is in the details.', copy: 'We test, tune, and simplify. Across screens, devices, and the small moments that make an experience feel right.' },
  { title: 'Deliver', heading: 'Ready for what comes next.', copy: 'A considered handover brings your idea into the world, with the clarity to use it and the room to grow.' },
]

export function StudioProcess() {
  const [active, setActive] = useState(0)
  return <section className="im-process im-section" id="approach" aria-labelledby="im-process-title">
    <div className="im-section-label"><span>03 / THE TRANSFORMATION</span><span>INTENTION AT EVERY STAGE</span></div>
    <div className="im-process-intro"><h2 id="im-process-title">Extraordinary is<br /><em>a process.</em></h2><p>Not a leap of faith.<br />A series of considered moves.</p></div>
    <div className="im-process-body">
      <div className={`im-process-sculpture im-stage-${active}`} aria-hidden="true"><div className="im-process-orbit" /><div className="im-process-orbit im-orbit-two" /><div className="im-process-grid" /><StudioMark className="im-process-mark" /><span className="im-seed" /><div className="im-process-coordinate">FORM / {String(active + 1).padStart(2, '0')}</div></div>
      <div className="im-process-story"><div className="im-process-tabs" role="tablist" aria-label="Our creation process">{steps.map((step, index) => <button type="button" role="tab" aria-selected={active === index} aria-controls={`im-process-panel-${index}`} id={`im-process-tab-${index}`} tabIndex={active === index ? 0 : -1} key={step.title} onClick={() => setActive(index)} onKeyDown={event => {
        let next = index
        if (event.key === 'ArrowRight') next = (index + 1) % steps.length
        else if (event.key === 'ArrowLeft') next = (index + steps.length - 1) % steps.length
        else if (event.key === 'Home') next = 0
        else if (event.key === 'End') next = steps.length - 1
        else return
        event.preventDefault(); setActive(next); document.getElementById(`im-process-tab-${next}`)?.focus()
      }}><span>0{index + 1}</span>{step.title}</button>)}</div>
      {steps.map((step, index) => <div role="tabpanel" tabIndex={0} id={`im-process-panel-${index}`} aria-labelledby={`im-process-tab-${index}`} hidden={active !== index} className="im-process-panel" key={step.title}><h3>{step.heading}</h3><p>{step.copy}</p><span className="im-process-count">0{index + 1} <span>/ 05</span></span></div>)}
      </div>
    </div>
  </section>
}
