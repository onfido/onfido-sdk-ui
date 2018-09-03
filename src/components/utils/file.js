import loadImage from 'blueimp-load-image/js/load-image'
import 'blueimp-load-image/js/load-image-orientation'
import 'blueimp-load-image/js/load-image-exif'
import {canvasToBase64Images} from './canvas.js'

export const fileToBase64 = (file, callback, errorCallback) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {callback(reader.result)}
  reader.onerror = function (error) {
   console.warn('File Reading Error: ', error)
   errorCallback(error)
 }
}

const decodeBase64 = (image) => {
  const byteString  = atob(image.split(',')[1])
  const mimeString = image.split(',')[0].split(':')[1].split(';')[0]
  const integerArray = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    integerArray[i] = byteString.charCodeAt(i)
  }
  return {integerArray, mimeString}
}

export const base64toBlob = (image) => {
  const base64Data = decodeBase64(image)
  return new Blob([base64Data.integerArray], {type: base64Data.mimeString})
}

export const fileType = file => file.type.split('/')[1]

export const isOfFileType = (fileTypeList, file) =>
  fileTypeList.some(acceptableFileType =>
    acceptableFileType === fileType(file));

const fileToCanvas = (file, callback, errorCallback) =>
  loadImage(file, canvasOrEventError => {
    if (canvasOrEventError.type === "error"){
      errorCallback(canvasOrEventError)
    }
    else {
      callback(canvasOrEventError)
    }
  }, { maxWidth: 960, maxHeight: 960, orientation: true })

export const fileToLossyBase64Image = (file, callback, errorCallback) => {
  const asBase64 = () => fileToBase64(file, callback, errorCallback)
  const asLossyBase64 = () => fileToCanvas(file,
    canvas => canvasToBase64Images(canvas, callback),
    asBase64
  )
  // avoid rendering pdfs, due to inconsistencies between different browsers
  return isOfFileType(['pdf'], file) ? asBase64() : asLossyBase64()
}