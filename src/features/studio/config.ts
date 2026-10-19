/** Owner-confirmed final contact address. Publishing remains separate. */
export const studioConfig = {
  email: 'idiomorph.studio@gmail.com',
  emailConfirmed: true,
  publicationReady: false,
  brand: {
    logo: '/studio/brand-logo.webp',
    small: '/studio/brand-logo-small.webp',
    favicon: '/studio/brand-favicon.png',
  },
  film: {
    mp4: '/studio/recovery/idiomorph-continuum-v4-720p.mp4',
    webm: '/studio/recovery/idiomorph-continuum-v4-720p.webm',
    poster: '/studio/recovery/continuum-v4-poster.webp',
    posterSmall: '/studio/recovery/continuum-v4-poster-small.webp',
    captions: '/studio/recovery/continuum-v4-captions.vtt',
    duration: '00:32',
  },
} as const

export type FilmCue = { at: number; request: number } | null

export const filmChapters = [
  { id: 'spark', title: 'Spark', time: 0 },
  { id: 'structure', title: 'Structure', time: 5 },
  { id: 'transformation', title: 'Transformation', time: 12 },
  { id: 'reveal', title: 'Reveal', time: 23 },
]

export const processStages = [
  { id: 'discover', title: 'Discover', heading: 'Agree on the right problem.', copy: 'We talk through your business, your audience and what needs to improve. Together, we define the scope, priorities and a useful measure of success.', outcome: 'A clear brief: what to build, for whom, and why.' },
  { id: 'design', title: 'Design', heading: 'Make the direction tangible.', copy: 'We map the pages and user journeys, then explore layout, typography and interactions. You can review the direction before it becomes software.', outcome: 'An agreed structure and a design you can respond to.' },
  { id: 'engineer', title: 'Engineer', heading: 'Build the working product.', copy: 'We turn the design into responsive pages, application features and the backend connections the project needs. Progress becomes something you can use.', outcome: 'A working implementation, connected to its real data.' },
  { id: 'refine', title: 'Refine', heading: 'Test it in the real world.', copy: 'We review content, keyboard access, screen sizes and performance. We test the important journeys with you and resolve the details before launch.', outcome: 'A polished product, checked against the agreed goals.' },
  { id: 'deliver', title: 'Deliver', heading: 'Put it in your hands.', copy: 'We prepare the release and walk you through your product. Access, documentation and practical guidance give you a clear starting point after handover.', outcome: 'Your live product, with the knowledge to use it.' },
] as const
