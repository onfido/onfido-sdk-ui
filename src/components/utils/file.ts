import { findKey } from '~utils/object'
import { isOfMimeType, canvasToBlob } from '~utils/blob'

import type { ImageResizeInfo } from '~types/commons'

type ImageSize = {
  width: number
  height: number
}

type ImageResizePayload = {
  resizedImage: Blob
  imgDiff: ImageResizeInfo
}

type ImageResizeCallback = (payload: ImageResizePayload) => void

const INVALID_IMAGE_SIZE = 'INVALID_IMAGE_SIZE'
const INVALID_SIZE = 'INVALID_SIZE'
const INVALID_TYPE = 'INVALID_TYPE'

export type ImageValidationTypes =
  | typeof INVALID_IMAGE_SIZE
  | typeof INVALID_SIZE
  | typeof INVALID_TYPE

type ImageValidationCallback = (file: Blob) => boolean

const DEFAULT_ACCEPTED_FILE_TYPES = ['jpg', 'jpeg', 'png', 'pdf']
const MAX_FILE_SIZE_ACCEPTED_BY_API = 10000000 // The Onfido API only accepts files below 10 MB
const MAX_IMAGE_FILE_SIZE_ACCEPTED = 3000000
const MAX_SIZE_IN_PIXEL = 1440

const validateFileTypeAndSize = (
  file: Blob,
  acceptedTypes = DEFAULT_ACCEPTED_FILE_TYPES
): ImageValidationTypes => {
  const imageValidators: Record<
    ImageValidationTypes,
    ImageValidationCallback
  > = {
    INVALID_TYPE: (file) => !isOfMimeType(acceptedTypes, file),
    INVALID_IMAGE_SIZE: (file) =>
      file.type.match(/image.*/) != null &&
      file.size > MAX_IMAGE_FILE_SIZE_ACCEPTED,
    INVALID_SIZE: (file) => file.size > MAX_FILE_SIZE_ACCEPTED_BY_API,
  }

  return findKey(imageValidators, (checkFn) => checkFn(file))
}

const resizeImageFile = (
  file: Blob,
  onImageResize: ImageResizeCallback
): void => {
  const reader = new FileReader()

  reader.onload = (readerEvent) => {
    const image = new Image()

    image.onload = () => {
      const resizeTo = getDimensionsToResizeTo(image)
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = resizeTo.width
      tempCanvas.height = resizeTo.height
      tempCanvas
        .getContext('2d')
        ?.drawImage(image, 0, 0, resizeTo.width, resizeTo.height)

      const imgDiff = {
        resizedFrom: {
          width: image.width,
          height: image.height,
          fileSize: file.size,
        },
        resizedTo: {
          width: resizeTo.width,
          height: resizeTo.height,
        },
      }

      return canvasToBlob(
        tempCanvas,
        (blob) => onImageResize({ resizedImage: blob, imgDiff }),
        file.type
      )
    }

    if (typeof readerEvent.target?.result === 'string') {
      image.src = readerEvent.target?.result
    }
  }

  reader.readAsDataURL(file)
}

export const getDimensionsToResizeTo = (
  originalImage: ImageSize
): ImageSize => {
  // 1440px because we want to conservatively resize for Web SDK
  // compared to mobile SDKs' 720p (1280×720px) as their UI always has a frame
  let newWidth = originalImage.width
  let newHeight = originalImage.height
  const ratio = originalImage.width / originalImage.height

  if (ratio > 1) {
    // landscape orientation
    newWidth = MAX_SIZE_IN_PIXEL
    newHeight = (originalImage.height * newWidth) / originalImage.width

    return {
      width: newWidth,
      height: newHeight,
    }
  }
  // portrait orientation
  newHeight = MAX_SIZE_IN_PIXEL
  newWidth = (originalImage.width * newHeight) / originalImage.height

  return {
    width: newWidth,
    height: newHeight,
  }
}

export const validateFile = (
  file: Blob,
  onSuccess: (file: Blob, imageResizeInfo?: ImageResizeInfo) => void,
  onError: (error: ImageValidationTypes) => void
): void => {
  const fileError = validateFileTypeAndSize(file)
  const imageResizeInfo: ImageResizeInfo | undefined = undefined

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
