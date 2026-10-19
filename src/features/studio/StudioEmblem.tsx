import { studioConfig } from './config'

/** Approved artwork, deliberately presented without a 3D claim. */
export function StudioEmblem() {
  return <figure className="im-hero-art im-official-emblem">
    <div className="im-official-art"><img src={studioConfig.brand.logo} srcSet={`${studioConfig.brand.small} 400w, ${studioConfig.brand.logo} 800w`} sizes="(max-width: 760px) 80vw, 38vw" width="800" height="1000" alt="Idiomorph Studio’s folded violet and silver emblem" fetchPriority="high" /></div>
    <figcaption>Imagination, given structure.</figcaption>
  </figure>
}
