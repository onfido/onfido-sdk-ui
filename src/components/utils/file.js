import { findKey } from '~utils/object'
import { isOfMimeType, canvasToBlob } from '~utils/blob'

const DEFAULT_ACCEPTED_FILE_TYPES = ['jpg', 'jpeg', 'png', 'pdf']
const MAX_FILE_SIZE_ACCEPTED_BY_API = 10000000 // The Onfido API only accepts files below 10 MB
const MAX_IMAGE_FILE_SIZE_ACCEPTED = 3000000
const MAX_SIZE_IN_PIXEL = 1440

const validateFileTypeAndSize = (
  file,
  acceptedTypes = DEFAULT_ACCEPTED_FILE_TYPES
) =>
  findKey(
    {
      INVALID_TYPE: (file) => !isOfMimeType(acceptedTypes, file),
      INVALID_IMAGE_SIZE: (file) =>
        file.type.match(/image.*/) && file.size > MAX_IMAGE_FILE_SIZE_ACCEPTED,
      INVALID_SIZE: (file) => file.size > MAX_FILE_SIZE_ACCEPTED_BY_API,
    },
    (checkFn) => checkFn(file)
  )

const resizeImageFile = (file, onImageResize) => {
  const reader = new FileReader()
  reader.onload = (readerEvent) => {
    const image = new Image()
    image.onload = () => {
      const resizeTo = getDimensionsToResizeTo(image)
      const resizedWidth = resizeTo.width
      const resizedHeight = resizeTo.height
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = resizedWidth
      tempCanvas.height = resizedHeight
      tempCanvas
        .getContext('2d')
        .drawImage(image, 0, 0, resizedWidth, resizedHeight)
      const imgDiff = {
        resizedFrom: {
          width: image.width,
          height: image.height,
          fileSize: file.size,
        },
        resizedTo: {
          width: resizedWidth,
          height: resizedHeight,
        },
      }
      return canvasToBlob(
        tempCanvas,
        (blob) => onImageResize({ resizedImage: blob, imgDiff }),
        file.type
      )
    }
    image.src = readerEvent.target.result
  }
  reader.readAsDataURL(file)
}

export const getDimensionsToResizeTo = (image) => {
  // 1440px because we want to conservatively resize for Web SDK
  // compared to mobile SDKs' 720p (1280×720px) as their UI always has a frame
  const originalWidth = image.width
  const originalHeight = image.height
  let newWidth = originalWidth
  let newHeight = originalHeight
  const ratio = originalWidth / originalHeight
  if (ratio > 1) {
    // landscape orientation
    newWidth = MAX_SIZE_IN_PIXEL
    newHeight = (originalHeight * newWidth) / originalWidth
  } else {
    // portrait orientation
    newHeight = MAX_SIZE_IN_PIXEL
    newWidth = (originalWidth * newHeight) / originalHeight
  }
  return {
    width: newWidth,
    height: newHeight,
  }
}

export const validateFile = (file, onSuccess, onError) => {
  const fileError = validateFileTypeAndSize(file)
  const INVALID_IMAGE_SIZE = 'INVALID_IMAGE_SIZE'
  const imageResizeInfo = null
  if (fileError === INVALID_IMAGE_SIZE) {
    resizeImageFile(file, ({ resizedImage, imgDiff }) => {
      if (resizedImage.size >= file.size) {
        onSuccess(file, imageResizeInfo)
      } else {
        onSuccess(resizedImage, {
          resizedFrom: {
            ...imgDiff.resizedFrom,
          },
          resizedTo: {
            ...imgDiff.resizedTo,
            fileSize: resizedImage.size,
          },
        })
      }
    })
  } else if (fileError) {
    onError(fileError)
  } else {
    onSuccess(file, imageResizeInfo)
  }
}
