import { asyncFunc } from './func'
import { cloneCanvas, canvasToBase64Images } from './canvas'
import { base64toBlob } from './file'

export const screenshot = (webcam, callback) => {
  const canvas = webcam && webcam.getCanvas()
  if (!canvas){
    console.error('webcam canvas is null')
    return
  }
  const sdkMetadata = getDeviceInfo(webcam.stream)
  asyncFunc(cloneCanvas, [canvas], canvas =>
    canvasToBase64Images(canvas, (lossyBase64, base64) =>
      callback(base64toBlob(base64), lossyBase64, sdkMetadata)
    )
  )
}

export const getRecordedVideo = (webcam, callback) => {
  const blob = webcam.getVideoBlob()
  const sdkMetadata = getDeviceInfo(webcam.stream)
  callback({ blob, sdkMetadata })
}

const getDeviceInfo = (stream) => {
  if (stream) {
    const videoTrack = stream.getVideoTracks()[0] || {}
    const audioTrack = stream.getAudioTracks()[0] || {}
    return {camera_name: videoTrack.label, microphone_name: audioTrack.label}
  }
  return {}
}
