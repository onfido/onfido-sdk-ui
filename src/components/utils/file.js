import { findKey } from '~utils/object'
import { isOfMimeType, canvasToBlob } from '~utils/blob'

const DEFAULT_ACCEPTED_FILE_TYPES = ['jpg', 'jpeg', 'png', 'pdf']
const MAX_FILE_SIZE_ACCEPTED_BY_API = 10000000 // The Onfido API only accepts files below 10 MB
export const validateFileTypeAndSize = (
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

export const resizeImageFile = (file, onImageResize) => {
  const reader = new FileReader()
  reader.onload = (readerEvent) => {
    const image = new Image()
    image.onload = () => {
      // We want to resize to 720p (1280×720px)
      const MAX_SIZE_IN_PIXEL = 1280
      let width = image.width
      let height = image.height
      const WIDTH_ONE_PERCENT = width / 100
      const HEIGHT_ONE_PERCENT = height / 100
      let imageCurrentPercent
      if (width > height) {
        // landscape orientation
        width = MAX_SIZE_IN_PIXEL
        imageCurrentPercent = width / WIDTH_ONE_PERCENT
        height = HEIGHT_ONE_PERCENT * imageCurrentPercent
        window.alert(
          `Landscape image size (W, H): ${image.width}, ${image.height}`
        )
        window.alert(`Landscape image resized to (W, H): ${width}, ${height}`)
      } else {
        // portrait orientation
        height = MAX_SIZE_IN_PIXEL
        imageCurrentPercent = height / HEIGHT_ONE_PERCENT
        width = WIDTH_ONE_PERCENT * imageCurrentPercent
        window.alert(
          `Portrait image size (W, H): ${image.width}, ${image.height}`
        )
        window.alert(`Portrait image resized to (H, W): ${width}, ${height}`)
      }
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = width
      tempCanvas.height = height
      tempCanvas.getContext('2d').drawImage(image, 0, 0, width, height)
      return canvasToBlob(tempCanvas, onImageResize, 'image/png')
    }
    image.src = readerEvent.target.result
  }
  reader.readAsDataURL(file)
}
