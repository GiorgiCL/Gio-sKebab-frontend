/** Confirm ownership and delivery before changing emailConfirmed or publicationReady. */
export const studioConfig = {
  email: 'idiomorph.studio@gmail.com',
  emailConfirmed: false,
  publicationReady: false,
  film: {
    mp4: '/studio/idiomorph-film-720p.mp4',
    webm: '/studio/idiomorph-film-720p.webm',
    poster: '/studio/film-poster.webp',
    captions: '/studio/film-captions.vtt',
    duration: '00:32',
  },
} as const
