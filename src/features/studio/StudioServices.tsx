import { useState } from 'react'
import { Arrow } from './StudioMark'

const services = [
  { id: 'website', title: 'Business websites', short: 'A presence that feels like you.', heading: 'Make the first impression yours.', copy: 'Distinctive, responsive websites that give your business a clear voice and make the next step easy.', action: 'Discuss a website' },
  { id: 'application', title: 'Custom web applications', short: 'A better way to get things done.', heading: 'Software that fits the way you work.', copy: 'Purpose-built applications that simplify a task, shape a workflow, or turn a useful idea into something people can use.', action: 'Discuss an application' },
  { id: 'systems', title: 'Backend systems & integrations', short: 'Your tools, working together.', heading: 'Thoughtful connections. Less friction.', copy: 'Backends, APIs, and integrations that connect the experience people see with the systems your business relies on.', action: 'Discuss your systems' },
] as const

function WebsiteStudy() {
  const [mobile, setMobile] = useState(false)
  return <div className="im-study im-study-website">
    <div className="im-study-toolbar"><span>A RESPONSIVE DESIGN STUDY</span><div role="group" aria-label="Preview screen size">
      <button aria-pressed={!mobile} onClick={() => setMobile(false)}>Desktop</button>
      <button aria-pressed={mobile} onClick={() => setMobile(true)}>Mobile</button>
    </div></div>
    <div className={`im-website-preview${mobile ? ' im-preview-mobile' : ''}`}>
      <div className="im-preview-top"><span>FORM / FEELING</span><span aria-hidden="true">↗</span></div>
      <div className="im-preview-content"><div>
        <span className="im-preview-eyebrow">A DIFFERENT POINT OF VIEW</span>
        <p>Make an<br /><em>impression.</em></p><span className="im-preview-rule" />
      </div><div className="im-preview-art" aria-hidden="true"><span /><span /><span /></div></div>
      <span className="im-preview-caption">Thoughtfully designed. At every size.</span>
    </div>
    <span className="im-study-caption" role="status">{mobile ? 'Mobile layout. Designed for a smaller screen.' : 'Desktop layout. Try a different screen size.'}</span>
  </div>
}

const applicationTasks = [
  { title: 'Homepage direction', type: 'Design', detail: 'Layout & typography' },
  { title: 'Enquiry flow', type: 'Engineering', detail: 'Form & validation' },
  { title: 'Data import', type: 'Engineering', detail: 'API & data mapping' },
]

function ApplicationStudy() {
  const [filter, setFilter] = useState('All')
  const shown = applicationTasks.filter(task => filter === 'All' || task.type === filter)
  return <div className="im-study im-study-application">
    <div className="im-study-toolbar"><span>APPLICATION CONCEPT</span><span>PROJECT WORKSPACE</span></div>
    <p className="im-app-title">A clearer working day.</p>
    <div className="im-app-filters" role="group" aria-label="Filter project tasks">{['All', 'Design', 'Engineering'].map(value =>
      <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value}</button>
    )}</div>
    <div className="im-app-tasks" key={filter}>{shown.map((task, index) =>
      <div key={task.title} style={{ animationDelay: `${index * 40}ms` }}>
        <span><strong>{task.title}</strong><span>{task.detail}</span></span><span>{task.type}</span>
      </div>
    )}</div>
    <p className="im-study-caption" role="status">{shown.length} {shown.length === 1 ? 'task' : 'tasks'} shown. Try filtering by discipline.</p>
  </div>
}

const systemStages = [
  { title: 'Website', copy: 'A visitor sends an enquiry. The interface collects the details they want to share.', action: 'Send example enquiry' },
  { title: 'Backend API', copy: 'The backend validates the request and applies the business rules before passing it on.', action: 'Pass to your tools' },
  { title: 'Your tools', copy: 'The useful details reach your chosen business tool, ready for your team to follow up.', action: 'Trace another enquiry' },
]

function SystemIcon({ stage }: { stage: number }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {stage === 0 ? <><rect x="3" y="4" width="18" height="15" rx="1.5" /><path d="M3 8h18M7 12h5M7 15h8" /></>
      : stage === 1 ? <><rect x="4" y="3" width="16" height="7" rx="1.5" /><rect x="4" y="14" width="16" height="7" rx="1.5" /><path d="M8 6.5h.01M8 17.5h.01M12 10v4M12 6.5h4M12 17.5h4" /></>
      : <><rect x="3" y="5" width="18" height="15" rx="1.5" /><path d="M8 3v4M16 3v4M3 10h18m-13 5 3 2 5-4" /></>}
  </svg>
}

function SystemsStudy() {
  const [active, setActive] = useState(0)
  const [transfer, setTransfer] = useState<{ from: number; id: number } | null>(null)
  function selectStage(index: number) {
    setTransfer(null)
    setActive(index)
  }
  function trace() {
    const next = (active + 1) % systemStages.length
    setTransfer(next === 0 ? null : { from: active, id: (transfer?.id ?? 0) + 1 })
    setActive(next)
  }
  return <div className="im-study im-study-systems">
    <div className="im-study-toolbar"><span>INTEGRATION CONCEPT</span><span>FOLLOW AN ENQUIRY</span></div>
    <div className="im-system-map im-system-explanation">
      <div className="im-system-links" aria-hidden="true">{[0, 1].map(index =>
        <span key={index} className={active > index ? 'im-link-reached' : ''}>
          {transfer?.from === index && <i key={transfer.id} />}
        </span>
      )}</div>
      {systemStages.map((stage, index) =>
        <button key={stage.title} data-stage={index} aria-pressed={active === index} onClick={() => selectStage(index)}>
          <span><SystemIcon stage={index} /></span>{stage.title}
        </button>
      )}
    </div>
    <p className="im-system-description" role="status"><span key={active}>{systemStages[active].copy}</span></p>
    <div className="im-system-actions">
      <button className="im-system-trace" onClick={trace}>{systemStages[active].action}<Arrow diagonal={active === 2} /></button>
      <span aria-hidden="true">0{active + 1} / 03</span>
    </div>
    <span className="im-study-caption">Select a step or trace an enquiry. An illustrated example.</span>
  </div>
}

export function StudioServices() {
  const [active, setActive] = useState(0)
  function selectService(index: number) {
    setActive(index)
    if (matchMedia('(max-width: 760px)').matches) requestAnimationFrame(() => {
      document.getElementById(`im-service-panel-${services[index].id}`)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches || document.querySelector('.im-motion-paused') ? 'instant' : 'smooth', block: 'start' })
    })
  }
  return <section className="im-services im-section" id="expertise" data-studio-chapter="2" aria-labelledby="im-services-title">
    <div className="im-section-label"><span>02 / WHAT WE CREATE</span><span>DESIGN, WITH SOMETHING TO DO</span></div>
    <div className="im-section-heading"><h2 id="im-services-title">What do you<br /><em>want to build?</em></h2><p>Business websites, custom web applications,<br />backend systems and integrations.<br />Choose a service to explore an example.</p></div>
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
        <div className="im-service-detail"><h3>{service.heading}</h3><p>{service.copy}</p><a className="im-text-link" href="#contact">{service.action} <Arrow diagonal /></a></div>
      </div>)}
    </div>
  </section>
}
