import supportsWebP from 'supports-webp'

export const cloneCanvas = (oldCanvas, width=null, height=null) => {
    //create a new canvas
    const newCanvas = document.createElement('canvas');
    const context = newCanvas.getContext('2d');

    if (width  === null) width = oldCanvas.width;
    if (height === null) height = oldCanvas.height;

    //set dimensions
    newCanvas.width =  width;
    newCanvas.height = height;

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0, width , height);

    //return the new canvas
    return newCanvas;
}

const cloneLowResCanvas = (canvas, maxHeight) => {
  const {width, height} = canvas
  const ratio = width/height

  const lowHeight = Math.min(maxHeight, canvas.height)
  const lowWidth = lowHeight*ratio

  return cloneCanvas(canvas, lowWidth, lowHeight)
}

const toDataUrl = type => (canvas, callback) =>
  setTimeout( _=> callback(canvas.toDataURL(type)))


export const toLossyImageDataUrl = toDataUrl(`image/${supportsWebP ? 'webp':'jpeg'}`)
const toPngImageDataUrl =   toDataUrl("image/png")


export const canvasToBase64Images = (canvas, callback/*(imageLossy, imagePng)*/) => {
  if (!canvas) return
  canvas = cloneCanvas(canvas)
  const lowResCanvas = cloneLowResCanvas(canvas, 200)

  toLossyImageDataUrl(lowResCanvas, imageLossy => {
    toPngImageDataUrl(canvas, imagePng => {
      callback(imageLossy, imagePng)
    })
  })
}
