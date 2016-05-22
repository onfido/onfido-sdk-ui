export const createBase64 = (canvas, video, dimensions, callback) => {
  if (!video || !dimensions) return
  const { ratio } = dimensions
  const ctx = canvas.getContext('2d')
  const width = 960
  const height = (960 / ratio)
  canvas.width = width
  canvas.height = height
  ctx.drawImage(video, 0, 0, width, height)
  const image = canvas.toDataURL('image/webp')
  callback(image)
}
