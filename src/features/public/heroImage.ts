import master from '../../assets/restaurant/demo/hero-grill.webp'
import small from '../../assets/restaurant/demo/hero-grill-640.webp'
import medium from '../../assets/restaurant/demo/hero-grill-800.webp'
import large from '../../assets/restaurant/demo/hero-grill-960.webp'
import wide from '../../assets/restaurant/demo/hero-grill-1280.webp'
import { heroImageSizes } from './heroImageSizes'

export const heroImage = {
  src: master,
  srcSet: `${small} 640w, ${medium} 800w, ${large} 960w, ${wide} 1280w, ${master} 1672w`,
  // Account for the source width needed by object-fit:cover in the tall hero.
  sizes: heroImageSizes,
}
