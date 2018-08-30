import supportsWebP from 'supports-webp'
import { asyncFunc, tick } from './func'

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
  tick( () => callback(canvas.toDataURL(type)))

const browserSupportedLossyFormat = `image/${supportsWebP ? 'webp':'jpeg'}`

export const toLossyImageDataUrl = toDataUrl(browserSupportedLossyFormat)
const toPngImageDataUrl = toDataUrl("image/png")

export const canvasToBase64Images = (canvas, callback/*(imagePng, imageLossy)*/) => {
  if (!canvas) return

  const onPngImage = imagePng =>
    asyncFunc(cloneLowResCanvas, [canvas, 200],
      lowResCanvas => onLowResCanvas(lowResCanvas, imagePng)
    )

  const onLowResCanvas = (lowResCanvas, imagePng) =>
    toLossyImageDataUrl(lowResCanvas, imageLossy => callback(imagePng, imageLossy))

  tick(()=> toPngImageDataUrl(canvas, onPngImage))
}
