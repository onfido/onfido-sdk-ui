import { asyncFunc } from './func'
import { cloneCanvas, canvasToBase64Images } from './canvas'
import { base64toBlob } from './file'

export const screenshot = (webcam, callback) => {
  const canvas = webcam && webcam.getCanvas()
  if (!canvas){
    console.error('webcam canvas is null')
    return
  }
  asyncFunc(cloneCanvas, [canvas], canvas =>
    canvasToBase64Images(canvas, (lossyBase64, base64) =>
      callback(base64toBlob(base64), lossyBase64)
    )
  )
}
