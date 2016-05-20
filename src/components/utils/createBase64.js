const createBase64 = (canvas, video, width, height) => {
  const ctx = canvas.getContext('2d')
  canvas.width = width
  canvas.height = height
  ctx.drawImage(video, 0, 0, width, height)
  return canvas.toDataURL('image/webp')
}

export default createBase64
