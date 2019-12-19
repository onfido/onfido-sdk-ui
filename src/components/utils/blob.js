import supportsWebP from 'supports-webp'
import loadImage from 'blueimp-load-image/js/load-image'
import 'blueimp-load-image/js/load-image-orientation'
import 'blueimp-load-image/js/load-image-exif'

const blobToBase64 = (blob, callback, errorCallback) => {
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = () => {callback(reader.result)}
  reader.onerror = function (error) {
   console.warn('File Reading Error: ', error)
   errorCallback(error)
 }
}

const blobToCanvas = (blob, callback, errorCallback, options) => {
  const { maxWidth = 960, maxHeight = 960, orientation = true } = options || {}

  return loadImage(blob, canvasOrEventError => {
    if (canvasOrEventError.type === "error"){
      errorCallback(canvasOrEventError)
    }
    else {
      callback(canvasOrEventError)
    }
  }, { maxWidth, maxHeight, orientation })
}

const decodeBase64 = (image) => {
  const byteString  = atob(image.split(',')[1])
  const mimeString = image.split(',')[0].split(':')[1].split(';')[0]
  let integerArray = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    integerArray[i] = byteString.charCodeAt(i)
  }
  return { integerArray, mimeString }
}

const base64toBlob = (image) => {
  const base64Data = decodeBase64(image)
  return new Blob([base64Data.integerArray], {type: base64Data.mimeString})
}

export const canvasToBlob = (canvas, callback, mimeType = 'image/png') => {
  if (!HTMLCanvasElement.prototype.toBlob) {
    // Handle browsers that do not support canvas.toBlob() like Edge
    const dataUrlImg = canvas.toDataURL()
    return callback(base64toBlob(dataUrlImg))
  }
  return canvas.toBlob(callback, mimeType)
}

const toDataUrl = type => (canvas, callback) => callback(canvas.toDataURL(type))
const browserSupportedLossyFormat = `image/${supportsWebP ? 'webp':'jpeg'}`
const toLossyImageDataUrl = toDataUrl(browserSupportedLossyFormat)
export const blobToLossyBase64 = (blob, callback, errorCallback, options) => {
  const asBase64 = () => blobToBase64(blob, callback, errorCallback)
  const asLossyBase64 = () => blobToCanvas(blob,
    canvas => toLossyImageDataUrl(canvas, callback),
    asBase64,
    options
  )

  return isOfMimeType(['pdf'], blob) ? asBase64() : asLossyBase64()
}

export const mimeType = blob => blob.type.split('/')[1]

export const isOfMimeType = (mimeTypeList, blob) =>
  mimeTypeList.some(acceptableMimeType =>
    acceptableMimeType === mimeType(blob));
