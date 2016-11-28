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


export const fileToBase64AndLossyBase64Image = (options, file, callback, errorCallback) => {
  errorCallback = errorCallback || callback

  const onFileBase64 = fileBase64 =>
    fileToCanvas(options, file,
      canvas => { onCanvasFromFile(canvas, fileBase64) },
      error  => { callback(fileBase64, file, null) }
    )

  const onCanvasFromFile = (canvas, fileBase64) =>
    toLossyImageDataUrl(canvas,
      imageLossyDataUrl => onLossyImageDataUrl(imageLossyDataUrl, fileBase64))

  const onLossyImageDataUrl = (imageLossyDataUrl, fileBase64) =>
    callback(fileBase64, file, imageLossyDataUrl)

  fileToBase64(file,
    onFileBase64,
    errorCallback
  )
}
