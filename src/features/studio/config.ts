/** Confirm ownership and delivery before changing emailConfirmed or publicationReady. */
export const studioConfig = {
  email: 'idiomorph.studio@gmail.com',
  emailConfirmed: false,
  publicationReady: false,
  brand: {
    logo: '/studio/brand-logo.webp',
    small: '/studio/brand-logo-small.webp',
    favicon: '/studio/brand-favicon.png',
  },
  film: {
    mp4: '/studio/idiomorph-film-720p.mp4',
    webm: '/studio/idiomorph-film-720p.webm',
    poster: '/studio/film-poster.webp',
    posterSmall: '/studio/film-poster-small.webp',
    captions: '/studio/film-captions.vtt',
    duration: '00:32',
  },
} as const

export type ProjectKind = 'website' | 'application' | 'systems' | 'exploring'
export type FilmCue = { at: number; request: number } | null

export const projectOptions: { id: ProjectKind; label: string; subject: string; thought: string }[] = [
  { id: 'website', label: 'A website', subject: 'Business website', thought: 'a business website' },
  { id: 'application', label: 'An application', subject: 'Custom web application', thought: 'a custom web application' },
  { id: 'systems', label: 'Connected systems', subject: 'Backend systems & integrations', thought: 'backend systems or integrations' },
  { id: 'exploring', label: 'Still exploring', subject: 'A new idea', thought: 'an idea I would like to explore' },
]

export const processStages = [
  { id: 'discover', title: 'Discover', time: 0, heading: 'Start with the person.', copy: 'Your goals, your audience, and what could feel easier. We ask the questions that give the project a clear purpose.', outcome: 'A shared understanding of what matters.' },
  { id: 'design', title: 'Design', time: 4.25, heading: 'Find its own language.', copy: 'Sketches become structure. We explore the look, the flow, and the small interactions that will make the experience feel like you.', outcome: 'A direction you can see and respond to.' },
  { id: 'engineer', title: 'Engineer', time: 14.1, heading: 'Make the idea work.', copy: 'Design becomes useful software. Interfaces, workflows, and connections come together around the way people will actually use them.', outcome: 'Working software, shaped around its purpose.' },
  { id: 'refine', title: 'Refine', time: 19.25, heading: 'Give the details their time.', copy: 'We try it, question it, and make it better. Across screens and through the moments that turn something functional into something considered.', outcome: 'An experience that feels clear and complete.' },
  { id: 'deliver', title: 'Deliver', time: 23, heading: 'Ready for real life.', copy: 'We bring everything together and walk you through it. A thoughtful handover gives you the clarity to use what we have made.', outcome: 'Your next step, with room to grow.' },
] as const
