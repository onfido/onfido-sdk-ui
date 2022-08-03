import Webcam from '~webcam/react-webcam'
import { canvasToBlob } from './blob'

import type { SdkMetadata } from '~types/commons'
import type { HandleCaptureProp } from '~types/routers'

export const screenshot = (
  webcam: Webcam,
  callback: (blob: Blob, sdkMetadata: SdkMetadata) => void,
  mimeType?: string
): void => {
  if (!webcam) {
    console.error('webcam is null')
    return
  }

  const canvas = webcam && webcam.getCanvas()

  if (!canvas) {
    console.error('webcam canvas is null')
    return
  }

  if (!webcam.stream) {
    console.error('webcam stream is null')
    return
  }

  const sdkMetadata = getDeviceInfo(webcam.stream)
  canvasToBlob(canvas, (blob) => callback(blob, sdkMetadata), mimeType)
}

export const isCameraReady = (webcam: Webcam): boolean => {
  if (!webcam) {
    return false
  }

  const canvas = webcam.getCanvas()

  if (!canvas || !canvas.width || !canvas.height) {
    return false
  }

  // Check if the canvas is still blank
  const context = canvas.getContext('2d')
  if (context) {
    const pixelBuffer = new Uint32Array(
      context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    )

    return pixelBuffer.some((color) => color !== 0)
  } else {
    return false
  }
}

export const getRecordedVideo = (
  webcam: Webcam,
  callback: HandleCaptureProp
): void => {
  const blob = webcam.getVideoBlob()
  if (!blob || !webcam.stream) {
    console.error('webcam blob or stream is null')
    return
  }
  const sdkMetadata = getDeviceInfo(webcam.stream)
  callback({ blob, sdkMetadata })
}

const getDeviceInfo = (stream: MediaStream): SdkMetadata => {
  if (stream) {
    const videoTrack = stream.getVideoTracks()[0]
    const videoSettings = videoTrack.getSettings()
    const audioTrack = stream.getAudioTracks()[0]

    return {
      captureMethod: 'live',
      camera_name: videoTrack?.label,
      microphone_name: audioTrack?.label,
      camera_settings: {
        aspect_ratio: videoSettings?.aspectRatio,
        frame_rate: videoSettings?.frameRate,
        height: videoSettings?.height,
        width: videoSettings?.width,
      },
    }
  }

  return {}
}
