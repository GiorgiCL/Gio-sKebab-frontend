// TEMPORARY DEVELOPMENT ILLUSTRATIONS. Delete this mapping when owner imageUrl values are populated.
// These assets are visual tests, not verified photographs of Gio's menu items. Owner imageUrl always wins.
import chickenUrl from '../../assets/restaurant/demo/chicken-kebab.webp'
import liuliaUrl from '../../assets/restaurant/demo/liulia-kebab.webp'
import plateUrl from '../../assets/restaurant/demo/kebab-plate.webp'
import cutoutUrl from '../../assets/restaurant/demo/kebab-cutout.webp'
import cocaColaUrl from '../../assets/restaurant/drinks/coca-cola.png'
import cocaColaZeroUrl from '../../assets/restaurant/drinks/coca-cola-zero.png'
import fantaUrl from '../../assets/restaurant/drinks/fanta.png'
import spriteUrl from '../../assets/restaurant/drinks/sprite.png'
import lemonUrl from '../../assets/restaurant/drinks/zandukeli-lemon.png'
import creamUrl from '../../assets/restaurant/drinks/zandukeli-cream.png'
import tarhunasUrl from '../../assets/restaurant/drinks/zandukeli-tarhunas.png'
import pearUrl from '../../assets/restaurant/drinks/zandukeli-pear.png'
import grapeUrl from '../../assets/restaurant/drinks/zandukeli-grape.png'
import colaUrl from '../../assets/restaurant/drinks/zandukeli-cola.png'
import ayranUrl from '../../assets/restaurant/drinks/ayran.png'
import cocaColaThumb from '../../assets/restaurant/drinks/thumbs/coca-cola.webp'
import cocaColaZeroThumb from '../../assets/restaurant/drinks/thumbs/coca-cola-zero.webp'
import fantaThumb from '../../assets/restaurant/drinks/thumbs/fanta.webp'
import spriteThumb from '../../assets/restaurant/drinks/thumbs/sprite.webp'
import lemonThumb from '../../assets/restaurant/drinks/thumbs/zandukeli-lemon.webp'
import creamThumb from '../../assets/restaurant/drinks/thumbs/zandukeli-cream.webp'
import tarhunasThumb from '../../assets/restaurant/drinks/thumbs/zandukeli-tarhunas.webp'
import pearThumb from '../../assets/restaurant/drinks/thumbs/zandukeli-pear.webp'
import grapeThumb from '../../assets/restaurant/drinks/thumbs/zandukeli-grape.webp'
import colaThumb from '../../assets/restaurant/drinks/thumbs/zandukeli-cola.webp'
import ayranThumb from '../../assets/restaurant/drinks/thumbs/ayran.webp'

const demoProductImages: Readonly<Record<number, { url: string; darkStage?: boolean }>> = {
  1: { url: chickenUrl },
  2: { url: cutoutUrl },
  6: { url: liuliaUrl },
  9: { url: plateUrl, darkStage: true },
}

// Stable IDs of the existing owner-managed menu products. Localized names can change independently.
const drinkImages: Readonly<Record<number, string>> = {
  41: cocaColaUrl, 42: cocaColaZeroUrl, 43: fantaUrl, 44: spriteUrl,
  45: lemonUrl, 46: creamUrl, 47: tarhunasUrl, 48: pearUrl,
  49: grapeUrl, 50: colaUrl, 51: ayranUrl,
}

const drinkThumbnails: Readonly<Record<number, string>> = {
  41: cocaColaThumb, 42: cocaColaZeroThumb, 43: fantaThumb, 44: spriteThumb,
  45: lemonThumb, 46: creamThumb, 47: tarhunasThumb, 48: pearThumb,
  49: grapeThumb, 50: colaThumb, 51: ayranThumb,
}

export function drinkThumbnail(itemId: number): string | null { return drinkThumbnails[itemId] ?? null }

export function productImage(itemId: number, ownerImageUrl: string | null, kind: 'menu' | 'lunch' = 'menu'): { url: string | null; illustrative: boolean; darkStage: boolean; drink: boolean; mask: 'can' | 'bottle' | null } {
  if (ownerImageUrl) return { url: ownerImageUrl, illustrative: false, darkStage: false, drink: false, mask: null }
  if (kind === 'lunch') return { url: null, illustrative: false, darkStage: false, drink: false, mask: null }
  if (drinkImages[itemId]) return { url: drinkImages[itemId], illustrative: false, darkStage: true, drink: true, mask: itemId === 43 ? 'can' : itemId === 51 ? 'bottle' : null }
  const illustration = demoProductImages[itemId]
  return { url: illustration?.url ?? null, illustrative: Boolean(illustration), darkStage: Boolean(illustration?.darkStage), drink: false, mask: null }
}
