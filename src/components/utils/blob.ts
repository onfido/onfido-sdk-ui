import supportsWebP from 'supports-webp'
import loadImage from 'blueimp-load-image'
import 'blueimp-load-image/js/load-image-orientation'
import 'blueimp-load-image/js/load-image-exif'

type Base64ResultCallback = (result: string) => void
type CanvasResultCallback = (canvas: HTMLCanvasElement) => void
type ErrorCallback = (error: Event) => void
type BlobResultCallback = (blob: Blob) => void
type FileReaderCallback = (error: ProgressEvent<FileReader>) => void

type Base64Blob = {
  integerArray: Uint8Array
  mimeString: string
}

type ImageOptions = {
  canvas?: boolean
  maxHeight?: number
  maxWidth?: number
  orientation?: boolean
}

const blobToBase64 = (
  blob: Blob,
  callback: Base64ResultCallback,
  errorCallback: FileReaderCallback
): void => {
  const reader = new FileReader()

  reader.readAsDataURL(blob)

  reader.onload = () => {
    callback(reader.result as string)
  }

  reader.onerror = function (error) {
    console.warn('File Reading Error: ', error)
    errorCallback(error)
  }
}

const blobToCanvas = (
  blob: Blob,
  callback: CanvasResultCallback,
  errorCallback: ErrorCallback,
  options?: ImageOptions
): void => {
  const {
    maxWidth = 960,
    maxHeight = 960,
    orientation = true,

    // `blueimp-load-image` doesn't fallback to use a canvas tag if image
    // orientation is supported by the browser (see https://caniuse.com/#feat=css-image-orientation).
    // We rely on a <canvas /> rather than a <img /> for our image operations.
    // This option forces the library to always use a canvas tag.
    canvas = true,
  } = options || {}

  loadImage(
    blob,
    (canvasOrEventError) => {
      if (canvasOrEventError instanceof Event) {
        errorCallback(canvasOrEventError)
      } else if (canvasOrEventError instanceof HTMLCanvasElement) {
        callback(canvasOrEventError)
      } else {
        console.warn('Result mismatched:', canvasOrEventError)
      }
    },
    { maxWidth, maxHeight, orientation, canvas }
  )
}

const decodeBase64 = (image: string): Base64Blob => {
  const byteString = atob(image.split(',')[1])
  const mimeString = image.split(',')[0].split(':')[1].split(';')[0]
  const integerArray = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    integerArray[i] = byteString.charCodeAt(i)
  }
  return { integerArray, mimeString }
}

const base64toBlob = (image: string): Blob => {
  const base64Data = decodeBase64(image)
  return new Blob([base64Data.integerArray], { type: base64Data.mimeString })
}

const toDataUrl = (type: string) => (
  canvas: HTMLCanvasElement,
  callback: (dataURL: string) => void
) => callback(canvas.toDataURL(type))

export const canvasToBlob = (
  canvas: HTMLCanvasElement,
  callback: BlobResultCallback,
  mimeType = 'image/png'
): void => {
  if (!HTMLCanvasElement.prototype.toBlob) {
    // Handle browsers that do not support canvas.toBlob() like Edge
    const dataUrlImg = canvas.toDataURL()
    callback(base64toBlob(dataUrlImg))
    return
  }

  canvas.toBlob((blob) => blob && callback(blob), mimeType)
}

export const blobToLossyBase64 = (
  blob: Blob,
  callback: Base64ResultCallback,
  errorCallback: FileReaderCallback,
  options?: ImageOptions
): void => {
  const browserSupportedLossyFormat = `image/${supportsWebP ? 'webp' : 'jpeg'}`
  const toLossyImageDataUrl = toDataUrl(browserSupportedLossyFormat)

  const asBase64 = () => blobToBase64(blob, callback, errorCallback)
  const asLossyBase64 = () =>
    blobToCanvas(
      blob,
      (canvas) => toLossyImageDataUrl(canvas, callback),
      asBase64,
      options
    )

  isOfMimeType(['pdf'], blob) ? asBase64() : asLossyBase64()
}

export const mimeType = (blob?: Blob): Optional<string> => {
  if (!blob || !blob.type) {
    return null
  }

  return blob.type.split('/')[1]
}

export const isOfMimeType = (mimeTypeList: string[], blob: Blob): boolean =>
  mimeTypeList.some(
    (acceptableMimeType) => acceptableMimeType === mimeType(blob)
  )

export const hmac256 = async (
  key: string,
  data: ArrayBuffer
): Promise<string> => {
  const encoder = new TextEncoder()
  const encodedKey = encoder.encode(key)

  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    encodedKey,
    {
      name: 'HMAC',
      hash: { name: 'SHA-256' },
    },
    false,
    ['sign']
  )

  const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, data)

  const digest = Array.prototype.map
    .call(new Uint8Array(signature), (byte: number) =>
      `00${byte.toString(16)}`.slice(-2)
    )
    .join('')

  return digest
}
