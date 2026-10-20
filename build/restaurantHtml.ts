import type { Plugin } from 'vite'
import { heroImageSizes } from '../src/features/public/heroImageSizes.ts'

/** Static homepage entry documents expose the LCP request to the HTML parser.
 * The shared SPA shell used by Studio, legal and owner routes has no preload.
 */
export function restaurantHtml(): Plugin {
  let base = '/'
  return {
    name: 'restaurant-homepage-html',
    enforce: 'post',
    configResolved(config) { base = config.base },
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const shell = bundle['index.html']
        if (!shell || shell.type !== 'asset') throw new Error('Missing SPA entry document')
        const image = (stem: string) => {
          const file = Object.values(bundle).find(asset => asset.type === 'asset' && asset.names.includes(`${stem}.webp`))
          if (!file) throw new Error(`Missing responsive hero asset: ${stem}`)
          return `${base}${file.fileName}`
        }
        const src = image('hero-grill')
        const srcset = [640, 800, 960, 1280].map(width => `${image(`hero-grill-${width}`)} ${width}w`).concat(`${src} 1672w`).join(', ')
        const preload = `<link rel="preload" as="image" href="${src}" imagesrcset="${srcset}" imagesizes="${heroImageSizes}" fetchpriority="high">`
        const fontPreload = (name: string) => {
          const font = Object.values(bundle).find(asset => asset.type === 'asset' && asset.names.includes(`${name}.woff2`))
          if (!font) throw new Error(`Missing critical font: ${name}`)
          return `<link rel="preload" as="font" type="font/woff2" crossorigin href="${base}${font.fileName}">`
        }
        for (const locale of ['lt', 'en', 'ru', 'ka']) {
          // Only faces observed in the initial hero for this language.
          const fonts = ['instrument-serif-latin-400-normal',
            ...(locale === 'lt' || locale === 'en' ? ['dm-sans-latin-wght-normal'] : []),
            ...(locale === 'lt' ? ['dm-sans-latin-ext-wght-normal'] : []),
            ...(locale === 'ka' ? ['noto-sans-georgian-georgian-400-normal'] : []),
          ].map(fontPreload).join('\n  ')
          const html = String(shell.source).replace('</head>', `  ${preload}\n  ${fonts}\n  </head>`)
          const source = html.replace('<html lang="lt">', `<html lang="${locale}">`)
          // Support both clean and trailing-slash URLs without redirecting.
          for (const fileName of [`${locale}.html`, `${locale}/index.html`]) {
            this.emitFile({ type: 'asset', fileName, source })
          }
        }
      },
    },
  }
}
