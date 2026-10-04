/** Remote product references only. Local file previews are created separately by the upload UI. */
export function safeImageUrl(value: string | null | undefined): string | null {
  const url = value?.trim()
  if (!url || url.length > 2048 || !/^https:\/\//i.test(url) || /[\s\\]/.test(url) || /%(?![\da-f]{2})/i.test(url)) return null
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' && parsed.hostname && !parsed.username && !parsed.password
      && !url.split('/')[2].includes('@') ? url : null
  } catch { return null }
}
