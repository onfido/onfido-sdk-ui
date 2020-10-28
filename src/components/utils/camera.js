import { canvasToBlob, convertDataURIToBinary } from './blob'

export const screenshot = (webcam, callback, mimeType) => {
  if (!webcam) {
    console.error('webcam is null')
    return
  }
  const canvas = webcam && webcam.getCanvas()
  if (!canvas) {
    console.error('webcam canvas is null')
    return
  }
  const sdkMetadata = getDeviceInfo(webcam.stream)
  canvasToBlob(canvas, (blob) => callback(blob, sdkMetadata), mimeType)
}

export const getScreenshotBinaryForVideo = (webcam, callback) => {
  // Could we just reuse the Blobs returned in the screenshot() function above and get rid of this one?
  if (!webcam) {
    console.error('webcam is null')
    return
  }
  const dataUrl = webcam && webcam.getScreenshot()
  if (!dataUrl) {
    console.error('screenshot dataUrl is null')
    return
  }
  const binary = convertDataURIToBinary(dataUrl)
  callback(binary)
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
    return {
      captureMethod: 'live',
      camera_name: videoTrack.label,
      microphone_name: audioTrack.label,
    }
  }
  return {}
}
