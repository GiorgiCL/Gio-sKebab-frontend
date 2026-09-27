// TEMPORARY DEVELOPMENT ILLUSTRATIONS. Delete this mapping when owner imageUrl values are populated.
// These assets are visual tests, not verified photographs of Gio's menu items. Owner imageUrl always wins.
import chickenUrl from '../../assets/restaurant/demo/chicken-kebab.webp'
import liuliaUrl from '../../assets/restaurant/demo/liulia-kebab.webp'
import plateUrl from '../../assets/restaurant/demo/kebab-plate.webp'
import cutoutUrl from '../../assets/restaurant/demo/kebab-cutout.webp'

const demoProductImages: Readonly<Record<number, { url: string; darkStage?: boolean }>> = {
  1: { url: chickenUrl },
  2: { url: cutoutUrl },
  6: { url: liuliaUrl },
  9: { url: plateUrl, darkStage: true },
}

export function productImage(itemId: number, ownerImageUrl: string | null): { url: string | null; illustrative: boolean; darkStage: boolean } {
  if (ownerImageUrl) return { url: ownerImageUrl, illustrative: false, darkStage: false }
  const illustration = demoProductImages[itemId]
  return { url: illustration?.url ?? null, illustrative: Boolean(illustration), darkStage: Boolean(illustration?.darkStage) }
}
