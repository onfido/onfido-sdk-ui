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

export const canvasToBlob = (canvas, callback) => canvas.toBlob(callback, "image/png")

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
