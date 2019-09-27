import { canvasToBlob } from './blob'

export const screenshot = (webcam, callback) => {
  const canvas = webcam && webcam.getCanvas()
  if (!canvas){
    console.error('webcam canvas is null')
    return
  }
  const sdkMetadata = getDeviceInfo(webcam.stream)
  canvasToBlob(canvas, blob => callback(blob, sdkMetadata))
}

export const takePhoto = (webcam, callback) => {
  const sdkMetadata = getDeviceInfo(webcam.stream)
  const videoTrack = webcam.stream.getVideoTracks()[0] || {}
  const imageCapture = new ImageCapture(videoTrack)
  if (imageCapture) {
    imageCapture
      .takePhoto()
      .then(blob => callback(blob, sdkMetadata))
      .catch(() => videoTrack.stop())
  } else {
    screenshot(webcam, callback)
  }
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
