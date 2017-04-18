import loadImage from 'blueimp-load-image/js/load-image'
import {canvasToBase64Images, toLossyImageDataUrl} from './canvas.js'

export const fileToBase64 = (file, callback, errorCallback) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    callback(reader.result)
  };
  reader.onerror = function (error) {
    console.log('File Reading Error: ', error);
    errorCallback(error)
  };
}
export const decodeBase64 = (image) => {
  const byteString  = atob(image.split(',')[1])
  const mimeString = image.split(',')[0].split(':')[1].split(';')[0]
  const integerArray = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    integerArray[i] = byteString.charCodeAt(i)
  }
  return {integerArray, mimeString}
}

export const base64toFile = (image, callback) => {
  const base64Data = decodeBase64(image)
  const blob = new Blob([base64Data.integerArray], {type: base64Data.mimeString})
  const file = new File([blob], 'image.'+ blob.type.split('/')[1], {type: base64Data.mimeString})
  const preview = URL.createObjectURL(blob)
  file.preview = preview
  callback(file)
}

export const fileType = file => file.type.split('/')[1]

export const isOfFileType = (fileTypeList, file) =>
  fileTypeList.some(acceptableFileType =>
    acceptableFileType === fileType(file));

const fileToCanvas = (options = { maxWidth: 960, maxHeight: 960, canvas: true},
                      file, callback, errorCallback) =>
  loadImage(file.preview, canvasOrEventError => {
    if (canvasOrEventError.type === "error"){
      errorCallback(canvasOrEventError)
    }
    else {
      callback(canvasOrEventError)
    }
  }, options)

export const fileToLossyBase64Image = (options, file, callback, errorCallback) =>
  fileToCanvas(options, file,
    canvas => toLossyImageDataUrl(canvas, callback),
    errorCallback
  )
