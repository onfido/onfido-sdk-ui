import { canvasToBlob } from '~utils/blob'
import { getDimensionsToResizeTo } from '~utils/file'

onmessage = (event) => {
  console.log('Worker message received!', event)
  const fileToResize = event.data
  resizeImageFile(fileToResize)
}

const resizeImageFile = (file, onImageResize) => {
  const reader = new window.FileReaderSync()
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
      postMessage(canvasToBlob(tempCanvas, onImageResize, 'image/png'))
    }
    image.src = readerEvent.target.result
  }
  reader.readAsDataURL(file)
}
