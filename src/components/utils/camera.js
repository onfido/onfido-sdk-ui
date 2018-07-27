import { asyncFunc } from '../utils/func'
import { cloneCanvas } from '../utils/canvas.js'

export const screenshot = (webcam, callback) => {
  const canvas = webcam && webcam.getCanvas()
  if (!canvas){
    console.error('webcam canvas is null')
    return
  }
  asyncFunc(cloneCanvas, [canvas], callback)
}
