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
  onFailure: Function,
  onUserMedia: void => void,
  i18n: Object,
  isFullScreen: boolean
}

type CameraActionType = {
  handleClick: Function,
  btnText: string,
  isFullScreen: boolean,
  btnClass: string
}

type CameraPureType = {
  ...CameraCommonType,
  hasError?: boolean,
  onFallbackClick?: void => void,
  webcamRef: React.Ref<typeof Webcam>,
  video?: boolean
}

type CameraType = {
  ...CameraCommonType,
  onFailure: ?Error => void,
  onScreenshot: Function,
  onVideoRecorded: ?Blob => void,
  trackScreen: Function,
  useFullScreen: boolean => void,
  liveness: boolean
}

type CameraStateType = {
  hasError: boolean,
  hasGrantedPermission: ?boolean,
  hasSeenPermissionsPrimer: boolean,
}

export type { CameraPureType, CameraType, CameraActionType, CameraStateType};
