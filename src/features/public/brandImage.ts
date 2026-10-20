import small from '../../assets/brand/gios-kebab-logo-128.webp'
import medium from '../../assets/brand/gios-kebab-logo-256.webp'
import large from '../../assets/brand/gios-kebab-logo-512.webp'

// Keep the original JPEG for owner UI and social metadata.
export const brandImage = {
  src: medium,
  srcSet: `${small} 128w, ${medium} 256w, ${large} 512w`,
  width: 256,
  height: 256,
}
