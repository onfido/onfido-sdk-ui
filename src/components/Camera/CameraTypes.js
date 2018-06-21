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

type CameraActionType = {
  handleClick: Function,
  btnText: string,
  isFullScreen: boolean,
  btnClass: string
}

type CameraPureType = {
  ...CameraCommonType,
  onFallbackClick?: void => void,
  webcamRef: React.Ref<typeof Webcam>,
  useFullScreen: boolean => void,
  video?: boolean
}


type CameraType = {
  ...CameraCommonType,
  onScreenshot: Function,
  onVideoRecorded: ?Blob => void,
  trackScreen: Function,
}

type CameraStateType = {
  hasGrantedPermission: ?boolean,
  hasSeenPermissionsPrimer: boolean,
}

export type { CameraPureType, CameraType, CameraActionType, CameraStateType};
