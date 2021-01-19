import Webcam from 'react-webcam-onfido'
import { canvasToBlob } from './blob'

import type { SdkMetadata } from '~types/commons'

export const screenshot = (
  webcam: Webcam,
  callback: (blob: Blob, sdkMetadata: SdkMetadata) => void,
  mimeType: string
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

  const sdkMetadata = getDeviceInfo(webcam.stream)
  canvasToBlob(canvas, (blob) => callback(blob, sdkMetadata), mimeType)
}

export const getRecordedVideo = (
  webcam: Webcam,
  callback: (payload: { blob: Blob; sdkMetadata: SdkMetadata }) => void
): void => {
  const blob = webcam.getVideoBlob()
  const sdkMetadata = getDeviceInfo(webcam.stream)
  callback({ blob, sdkMetadata })
}

const getDeviceInfo = (stream: MediaStream): SdkMetadata => {
  if (stream) {
    const videoTrack = stream.getVideoTracks()[0]
    const audioTrack = stream.getAudioTracks()[0]

    return {
      captureMethod: 'live',
      camera_name: videoTrack?.label,
      microphone_name: audioTrack?.label,
    }
  }

  return {}
}
