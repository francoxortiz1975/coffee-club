// Comprime una imagen (File / Blob) a JPEG redimensionado.
// max: dimensión máxima en pixels (lado más largo)
// quality: 0-1
// Respeta la orientación EXIF (incluido flip de selfies) usando createImageBitmap.
// Retorna un Blob listo para subir.
export async function compressImage(file, { max = 1200, quality = 0.75 } = {}) {
  let bitmap

  // Si el navegador soporta createImageBitmap con imageOrientation, lo usamos.
  // Eso respeta el flag EXIF de orientación (rotaciones + flip horizontal).
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    // Fallback: HTMLImageElement clásico. Algunos browsers viejos pierden la
    // orientación EXIF, pero al menos no se rompe.
    const dataUrl = await fileToDataUrl(file)
    bitmap = await loadImage(dataUrl)
  }

  // Mantener aspect ratio, lado más largo = max
  const w = bitmap.width
  const h = bitmap.height
  const ratio = w > h ? max / w : max / h
  const factor = ratio < 1 ? ratio : 1
  const targetW = Math.round(w * factor)
  const targetH = Math.round(h * factor)

  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext('2d')
  ctx.drawImage(bitmap, 0, 0, targetW, targetH)

  // Liberar el bitmap si se puede
  if (bitmap.close) bitmap.close()

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality)
  })
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = dataUrl
  })
}
