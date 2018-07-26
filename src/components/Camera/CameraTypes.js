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
  isFullScreen: boolean,
  cameraError: Object,
}

type CameraActionType = {
  handleClick: Function,
  btnText: string,
  isFullScreen: boolean,
  btnClass: string,
  btnDisabled: boolean,
}

type CameraPureType = {
  ...CameraCommonType,
  hasError?: boolean,
  webcamRef: React.Ref<typeof Webcam>,
  trackScreen: Function,
  useFullScreen: boolean => void,
  video?: boolean,
}

type CameraType = {
  ...CameraCommonType,
  onFailure: ?Error => void,
  onScreenshot: Function,
  onVideoRecorded: ?Blob => void,
  trackScreen: Function,
  hasError?: boolean,
  liveness: boolean,
  hasGrantedPermission?: boolean,
}

type CameraStateType = {
  hasError: boolean,
  hasGrantedPermission: ?boolean,
  hasSeenPermissionsPrimer: boolean,
  cameraError: Object,
}

export type { CameraPureType, CameraType, CameraActionType, CameraStateType};
