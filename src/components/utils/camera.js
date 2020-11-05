import { canvasToBlob } from './blob'

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

export const getRecordedVideo = async (webcam, callback) => {
  // const blob = webcam.getVideoBlob()
  const sdkMetadata = getDeviceInfo(webcam.stream)
  await webcam.getVideoUrl((videoUrl) =>
    callback({ blob: null, videoUrl, sdkMetadata })
  )
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
