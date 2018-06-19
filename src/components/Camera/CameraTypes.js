// @flow

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
  onFallbackClick: void => void,
  handleClick: void => void,
  webcamRef: React.Ref<typeof Webcam>,
  btnText: string,
  recording: boolean,
  liveness: boolean
}

type CameraType = {
  ...CameraCommonType,
  onScreenshot: Function,
  trackScreen: Function,
}

export type { CameraPureType, CameraType };
