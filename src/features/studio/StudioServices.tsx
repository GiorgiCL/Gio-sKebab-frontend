import { useState } from 'react'
import { Arrow } from './StudioMark'
import type { ProjectKind } from './config'

const services = [
  { id: 'website', title: 'Business websites', short: 'A presence that feels like you.', heading: 'Make the first impression yours.', copy: 'Distinctive, responsive websites that give your business a clear voice and make the next step easy.', action: 'Discuss a website' },
  { id: 'application', title: 'Custom web applications', short: 'A better way to get things done.', heading: 'Software that fits the way you work.', copy: 'Purpose-built applications that simplify a task, shape a workflow, or turn a useful idea into something people can use.', action: 'Discuss an application' },
  { id: 'systems', title: 'Backend systems & integrations', short: 'Your tools, working together.', heading: 'Thoughtful connections. Less friction.', copy: 'Backends, APIs, and integrations that connect the experience people see with the systems your business relies on.', action: 'Discuss your systems' },
] as const

function WebsiteStudy() {
  const [mobile, setMobile] = useState(false)
  return <div className="im-study im-study-website"><div className="im-study-toolbar"><span>A RESPONSIVE DESIGN STUDY</span><div role="group" aria-label="Preview screen size"><button aria-pressed={!mobile} onClick={() => setMobile(false)}>Desktop</button><button aria-pressed={mobile} onClick={() => setMobile(true)}>Mobile</button></div></div><div className={`im-website-preview${mobile ? ' im-preview-mobile' : ''}`}><div className="im-preview-top"><span>FORM / FEELING</span><span aria-hidden="true">↗</span></div><div className="im-preview-content"><div><span className="im-preview-eyebrow">A DIFFERENT POINT OF VIEW</span><p>Make an<br /><em>impression.</em></p><span className="im-preview-rule" /></div><div className="im-preview-art" aria-hidden="true"><span /><span /><span /></div></div><span className="im-preview-caption">Thoughtfully designed. At every size.</span></div><span className="im-study-caption">Try a different screen size.</span></div>
}

function ApplicationStudy() {
  const [step, setStep] = useState(0)
  const labels = ['An idea arrives', 'The next step is clear', 'Ready to move forward']
  return <div className="im-study im-study-application"><div className="im-study-toolbar"><span>A WORKFLOW STUDY</span><span>SHAPED AROUND PEOPLE</span></div><div className="im-workflow"><span className="im-workflow-line" aria-hidden="true" />{['Request', 'Review', 'Ready'].map((label, index) => <div className={step >= index ? 'im-flow-reached' : ''} key={label}><span className="im-flow-dot" aria-hidden="true">{step > index ? '✓' : `0${index + 1}`}</span><span>{label}</span></div>)}</div><p className="im-flow-message" role="status">{labels[step]}</p><button className="im-study-action" onClick={() => setStep((step + 1) % 3)}>{step === 2 ? 'Try it again' : 'Move the idea forward'} <Arrow /></button><span className="im-study-caption">One clear step at a time.</span></div>
}

function SystemsStudy() {
  const [connected, setConnected] = useState(false)
  return <div className={`im-study im-study-systems${connected ? ' im-systems-connected' : ''}`}><div className="im-study-toolbar"><span>A CONNECTION STUDY</span><span>THOUGHTFULLY JOINED UP</span></div><div className="im-system-map"><svg viewBox="0 0 600 130" fill="none" aria-hidden="true"><path d="M100 65h400" stroke="currentColor" strokeWidth="1" strokeDasharray="5 6" /><path className="im-system-connection" d="M100 65h400" stroke="currentColor" strokeWidth="2" /></svg>{['Your website', 'Your tools', 'Your data'].map((label, index) => <div key={label}><span aria-hidden="true">{['↗', '◇', '≋'][index]}</span>{label}</div>)}</div><p className="im-flow-message" role="status">{connected ? 'Connected. Working as one.' : 'Separate tools. A shared possibility.'}</p><button className="im-study-action" onClick={() => setConnected(!connected)} aria-pressed={connected}>{connected ? 'Reset the connection' : 'Connect the system'} <Arrow /></button><span className="im-study-caption">A conceptual preview. No live systems are connected.</span></div>
}

export function StudioServices({ onChoose }: { onChoose: (kind: ProjectKind) => void }) {
  const [active, setActive] = useState(0)
  function selectService(index: number) {
    setActive(index)
    if (matchMedia('(max-width: 760px)').matches) requestAnimationFrame(() => {
      document.getElementById(`im-service-panel-${services[index].id}`)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches || document.querySelector('.im-motion-paused') ? 'instant' : 'smooth', block: 'start' })
    })
  }
  return <section className="im-services im-section" id="expertise" data-studio-chapter="2" aria-labelledby="im-services-title">
    <div className="im-section-label"><span>02 / WHAT WE CREATE</span><span>DESIGN, WITH SOMETHING TO DO</span></div>
    <div className="im-section-heading"><h2 id="im-services-title">Different needs.<br /><em>The same care.</em></h2><p>Something to show. Something to simplify.<br />Something to bring together.</p></div>
    <div className="im-expertise-explorer"><div className="im-expertise-tabs" role="tablist" aria-label="Explore our expertise" aria-orientation="vertical">{services.map((service, index) => <button key={service.id} role="tab" id={`im-service-tab-${service.id}`} aria-controls={`im-service-panel-${service.id}`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => selectService(index)} onKeyDown={event => {
      let next = index
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % services.length
      else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + services.length - 1) % services.length
      else if (event.key === 'Home') next = 0
      else if (event.key === 'End') next = services.length - 1
      else return
      event.preventDefault(); setActive(next); document.getElementById(`im-service-tab-${services[next].id}`)?.focus()
    }}><span className="im-service-index">0{index + 1}</span><span><span className="im-service-title">{service.title}</span><span className="im-service-short">{service.short}</span></span><Arrow diagonal /></button>)}</div>
      {services.map((service, index) => <div className="im-expertise-panel" key={service.id} id={`im-service-panel-${service.id}`} role="tabpanel" aria-labelledby={`im-service-tab-${service.id}`} tabIndex={0} hidden={active !== index}>
        {active === index && (index === 0 ? <WebsiteStudy /> : index === 1 ? <ApplicationStudy /> : <SystemsStudy />)}
        <div className="im-service-detail"><h3>{service.heading}</h3><p>{service.copy}</p><a className="im-text-link" href="#contact" onClick={() => onChoose(service.id)}>{service.action} <Arrow diagonal /></a></div>
      </div>)}
    </div>
  </section>
}
