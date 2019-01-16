import supportsWebP from 'supports-webp'
import loadImage from 'blueimp-load-image/js/load-image'
import 'blueimp-load-image/js/load-image-orientation'
import 'blueimp-load-image/js/load-image-exif'

const fileToBase64 = (file, callback, errorCallback) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {callback(reader.result)}
  reader.onerror = function (error) {
   console.warn('File Reading Error: ', error)
   errorCallback(error)
 }
}

const fileToCanvas = (file, callback, errorCallback, options) => {
  const { maxWidth = 960, maxHeight = 960, orientation = true } = options || {}

  return loadImage(file, canvasOrEventError => {
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
  const asBase64 = () => fileToBase64(blob, callback, errorCallback)
  const asLossyBase64 = () => fileToCanvas(blob,
    canvas => toLossyImageDataUrl(canvas, callback),
    asBase64,
    options
  )

  return isOfFileType(['pdf'], blob) ? asBase64() : asLossyBase64()
}

export const fileType = file => file.type.split('/')[1]

export const isOfFileType = (fileTypeList, file) =>
  fileTypeList.some(acceptableFileType =>
    acceptableFileType === fileType(file));
