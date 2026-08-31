export function isImageAttachment(
  fileName?: string | null,
  url?: string | null,
  mimeType?: string | null,
): boolean {
  if (mimeType?.startsWith('image/')) return true
  if (url?.startsWith('data:image/')) return true
  const name = fileName ?? ''
  return /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i.test(name)
}

/** Persist uploaded files in dashboard state without revoking blob URLs on save. */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
