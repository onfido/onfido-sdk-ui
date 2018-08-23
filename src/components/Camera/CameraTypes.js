// @flow
import Webcam from 'react-webcam-onfido'
import * as React from 'react'
import type { ChallengeType } from '../Liveness/Challenge'

type FlowNameType = 'crossDeviceSteps' | 'captureSteps'

type ChallengeData = {
  id: string,
  challenges: Array<ChallengeType>,
  switchSeconds?: number,
}

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
  cameraErrorRenderAction?: void => React.Node,
  cameraErrorHasBackdrop?: boolean,
  changeFlowTo: FlowNameType => void,
}

type CameraActionType = {
  children?: React.Node,
  isFullScreen?: boolean,
}

type CameraPureType = {
  ...CameraCommonType,
  hasError?: boolean,
  webcamRef: React.Ref<typeof Webcam>,
  className?: string,
  trackScreen: Function,
  isWithoutHole?: boolean,
  video?: boolean
}

type CameraType = {
  ...CameraCommonType,
  onFailure: ?Error => void,
  onScreenshot: Function,
  onVideoRecorded: (?Blob, ?ChallengeData) => void,
  trackScreen: Function,
  hasError?: boolean,
  useFullScreen: boolean => void,
  liveness: ?boolean,
  hasGrantedPermission?: boolean,
  token: string,
}

type CameraStateType = {
  hasError: boolean,
  hasGrantedPermission: ?boolean,
  hasSeenPermissionsPrimer: boolean,
  cameraError: Object,
}

export type { CameraPureType, CameraType, CameraActionType, CameraStateType, FlowNameType };
