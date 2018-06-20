// @flow
import Webcam from 'react-webcam-onfido'
import * as React from 'react'

type CameraCommonType = {
  autoCapture: boolean,
  method: string,
  title: string,
  subTitle: string,
  onUserMedia: Function,
  onUploadFallback: File => void,
  onWebcamError: Function,
  onUserMedia: void => void,
  i18n: Object,
  isFullScreen: boolean
}

type CameraPureType = {
  ...CameraCommonType,
  onFallbackClick?: void => void,
  webcamRef: React.Ref<typeof Webcam>,
  liveness?: boolean,
  webcam?: React$ElementRef<typeof Webcam>
}

type CameraType = {
  ...CameraCommonType,
  onScreenshot: Function,
  onVideoRecorded: ?Blob => void,
  trackScreen: Function,
}

export type { CameraPureType, CameraType };
