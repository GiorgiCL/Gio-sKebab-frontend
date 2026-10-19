import { Arrow } from './StudioMark'

function WebsiteDrawing() {
  return <svg viewBox="0 0 300 180" fill="none" aria-hidden="true"><g className="im-site-drawing"><rect x="55" y="23" width="198" height="132" rx="2" stroke="currentColor" opacity=".65" /><path d="M55 43h198M68 33h14m5 0h8m118 0h26M70 58h60m-60 7h38" stroke="currentColor" /><text x="70" y="130" fontFamily="Instrument Serif,serif" fontSize="72" fill="currentColor">Aa.</text><path d="M175 66h62m-62 9h46m-46 9h54M175 116h44m-44 9h35m-35 14h62" stroke="currentColor" opacity=".45" /></g><path className="im-drawing-detail" d="m33 120-12-8 12-8m237-45 12 8-12 8" stroke="currentColor" /></svg>
}
function AppDrawing() {
  return <svg viewBox="0 0 300 180" fill="none" aria-hidden="true"><g stroke="currentColor"><path d="M45 49h210M45 89h210M45 129h210" opacity=".2" /><rect className="im-app-line-one" x="49" y="31" width="112" height="36" rx="18" /><rect className="im-app-line-two" x="110" y="71" width="141" height="36" rx="18" /><rect className="im-app-line-three" x="61" y="111" width="112" height="36" rx="18" /><path d="m134 44 5 5-5 5m91 30 5 5-5 5m-71 30 5 5-5 5" /><circle cx="70" cy="49" r="3" /><circle cx="131" cy="89" r="3" /><circle cx="82" cy="129" r="3" /></g></svg>
}
function SystemsDrawing() {
  return <svg viewBox="0 0 300 180" fill="none" aria-hidden="true"><g stroke="currentColor"><path d="M80 45h43v45h60m-103 45h43V90m60 0h35" opacity=".55" /><rect x="37" y="26" width="43" height="38" rx="2" /><rect x="37" y="116" width="43" height="38" rx="2" /><rect x="218" y="71" width="43" height="38" rx="2" /><path d="m161 67 23 23-23 23-23-23Z" /><circle className="im-system-pulse" cx="123" cy="90" r="4" fill="currentColor" /><path d="M48 45h21m-21 90h21m160-45h21M161 81v18m-9-9h18" /></g></svg>
}

const services = [
  { id: '01', title: 'Business websites', line: 'A presence with a point of view.', copy: 'Distinctive, responsive websites that make your business easy to understand and hard to forget.', tags: 'STRATEGY / DESIGN / DEVELOPMENT', Drawing: WebsiteDrawing },
  { id: '02', title: 'Custom web applications', line: 'Software shaped around you.', copy: 'Purpose-built tools and web experiences that turn the way you work into something more intuitive.', tags: 'INTERFACES / WORKFLOWS / APPLICATIONS', Drawing: AppDrawing },
  { id: '03', title: 'Backend systems & integrations', line: 'The intelligence beneath it all.', copy: 'The systems, APIs, and connections that bring your digital experience together and keep it working.', tags: 'BACKENDS / APIs / INTEGRATIONS', Drawing: SystemsDrawing },
]

export function StudioServices() {
  return <section className="im-services im-section" id="expertise" aria-labelledby="im-services-title">
    <div className="im-section-label"><span>02 / WHAT WE CREATE</span><span>FORM MEETS FUNCTION</span></div>
    <div className="im-section-heading"><h2 id="im-services-title">Distinct in form.<br /><em>Purposeful by design.</em></h2><p>Beauty earns attention.<br />Thoughtful engineering makes it matter.</p></div>
    <div className="im-service-list">{services.map(({ id, title, line, copy, tags, Drawing }) => <article className="im-service" key={id}>
      <span className="im-service-number">/{id}</span><div className="im-service-title"><h3>{title}</h3><p>{line}</p></div>
      <div className="im-service-description"><p>{copy}</p><span>{tags}</span></div><div className="im-service-visual"><Drawing /></div>
      <a className="im-service-link" href="#contact" aria-label={`Discuss ${title.toLowerCase()}`}><Arrow diagonal /></a>
    </article>)}</div>
    <p className="im-service-note">One thoughtful experience. Every layer considered.</p>
  </section>
}
