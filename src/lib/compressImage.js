// Comprime una imagen (File / Blob) a JPEG redimensionado.
// max: dimensión máxima en pixels (lado más largo)
// quality: 0-1
// Retorna un Blob listo para subir.
export async function compressImage(file, { max = 1200, quality = 0.75 } = {}) {
  const dataUrl = await fileToDataUrl(file)
  const img = await loadImage(dataUrl)

  // Mantener aspect ratio, lado más largo = max
  const ratio = img.width > img.height ? max / img.width : max / img.height
  const factor = ratio < 1 ? ratio : 1
  const targetW = Math.round(img.width * factor)
  const targetH = Math.round(img.height * factor)

  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, targetW, targetH)

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
