import { findKey } from '~utils/object'
import { isOfMimeType, canvasToBlob } from '~utils/blob'

const DEFAULT_ACCEPTED_FILE_TYPES = ['jpg', 'jpeg', 'png', 'pdf']
const MAX_FILE_SIZE_ACCEPTED_BY_API = 10000000 // The Onfido API only accepts files below 10 MB
const validateFileTypeAndSize = (
  file,
  acceptedTypes = DEFAULT_ACCEPTED_FILE_TYPES
) =>
  findKey(
    {
      INVALID_TYPE: (file) => !isOfMimeType(acceptedTypes, file),
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
      return canvasToBlob(tempCanvas, onImageResize, 'image/png')
    }
    image.src = readerEvent.target.result
  }
  reader.readAsDataURL(file)
}

export const getDimensionsToResizeTo = (image) => {
  // 1440px because we want to conservatively resize for Web SDK
  // compared to mobile SDKs' 720p (1280×720px) as their UI always has a frame
  const MAX_SIZE_IN_PIXEL = 1440
  const ORIGNAL_WIDTH = image.width
  let resizedWidth
  const ORIGINAL_HEIGHT = image.height
  let resizedHeight
  const widthOnePercent = ORIGNAL_WIDTH / 100
  const heightOnePercent = ORIGINAL_HEIGHT / 100
  let imageCurrentPercent
  if (ORIGNAL_WIDTH > ORIGINAL_HEIGHT) {
    // landscape orientation
    resizedWidth = MAX_SIZE_IN_PIXEL
    imageCurrentPercent = resizedWidth / widthOnePercent
    resizedHeight = heightOnePercent * imageCurrentPercent
  } else {
    // portrait orientation
    resizedHeight = MAX_SIZE_IN_PIXEL
    imageCurrentPercent = resizedHeight / heightOnePercent
    resizedWidth = widthOnePercent * imageCurrentPercent
  }
  return {
    width: resizedWidth,
    height: resizedHeight,
  }
}

export const validateFile = (file, onSuccess, onError) => {
  const fileError = validateFileTypeAndSize(file)
  const INVALID_SIZE = 'INVALID_SIZE'
  let isResizedImage = false
  if (fileError === INVALID_SIZE && file.type.match(/image.*/)) {
    // Resize image to 720p (1280×720 px) if captured with native camera app on mobile
    console.warn('Image file is too large (over 3MB). Image will be resized.')
    isResizedImage = true
    resizeImageFile(file, (blob) => onSuccess(blob, isResizedImage))
  } else if (fileError) {
    onError(fileError)
  } else {
    onSuccess(file, isResizedImage)
  }
}
