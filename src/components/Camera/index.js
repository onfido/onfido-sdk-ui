// @flow
import * as React from 'react'
import { h } from 'preact'
import Webcam from 'react-webcam-onfido'
import Dropzone from 'react-dropzone'
import Visibility from 'visibilityjs'
import classNames from 'classnames'

import {cloneCanvas} from '../utils/canvas.js'
import { asyncFunc } from '../utils/func'
import { Overlay } from '../Overlay'
import Title from '../Title'
import { checkIfWebcamPermissionGranted } from '../utils'
import theme from '../Theme/style.css'
import style from './style.css'
import PermissionsPrimer from './PermissionsPrimer'

const UploadFallback = ({onUploadFallback, onFallbackClick, method, i18n}) =>
  <Dropzone
    onDrop={([file]) => onUploadFallback(file)}
    className={style.uploadFallback}
    multiple={false}>
    <button onClick={onFallbackClick()}>{i18n.t(`capture.${method}.help`)}</button>
  </Dropzone>

const CaptureActions = ({handeClick, i18n, isFullScreen}) =>
  <div className={style.captureActions}>
    <button
      className={classNames(
        theme.btn, theme["btn-centered"],
        theme["btn-primary"],
        { [style.fullScreenBtn]: isFullScreen }
      )}
      onClick={handeClick}
    >
      <div className={classNames({[style.btnText]: isFullScreen})}>{i18n.t('capture.face.button')}</div>
    </button>
  </div>

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
  faceCaptureClick: void => void,
  webcamRef: React.Ref<typeof Webcam>,
}

// Specify just a camera height (no width) because on safari if you specify both
// height and width you will hit an OverconstrainedError if the camera does not
// support the precise resolution.
const CameraPure = ({method, autoCapture, title, subTitle, onUploadFallback, onFallbackClick,
  onUserMedia, faceCaptureClick, webcamRef, isFullScreen, onWebcamError, i18n}: CameraPureType) => (
    <div className={style.camera}>
      <Title {...{title, subTitle, isFullScreen}} smaller={true}/>
      <div className={classNames(style["video-overlay"], {[style.overlayFullScreen]: isFullScreen})}>
        <Webcam
          className={style.video}
          audio={false}
          height={720}
          {...{onUserMedia, ref: webcamRef, onFailure: onWebcamError}}
        />
        <Overlay {...{method, isFullScreen}}/>
        <UploadFallback {...{onUploadFallback, onFallbackClick, method, i18n}}/>
      </div>
      { autoCapture ? '' : <CaptureActions handeClick={faceCaptureClick} {...{i18n, isFullScreen}}/>}
    </div>
)


type CameraType = {
  ...CameraCommonType,
  onScreenshot: Function,
  trackScreen: Function,
}

type CameraStateType = {
  hasWebcamAccess: boolean,
  hasSeenPermissionsPrimer: boolean,
}

export default class Camera extends React.Component<CameraType, CameraStateType> {
  webcam: ?React$ElementRef<typeof Webcam> = null
  interval: ?Visibility

  state:CameraStateType = {
    hasWebcamAccess: false,
    hasSeenPermissionsPrimer: false,
  }

  capture = {
    start: () => {
      this.capture.stop()
      this.interval = Visibility.every(1000, this.screenshot)
    },
    stop: () => Visibility.stop(this.interval),
    once: () => {
      this.screenshot()
    }
  }

  constructor (props: CameraType) {
    super(props)
  }

  webcamMounted () {
    const { autoCapture } = this.props
    if (autoCapture) this.capture.start()
  }

  webcamUnmounted () {
    this.capture.stop()
  }

  componentDidMount () {
    this.webcamMounted()
    this.props.trackScreen('camera')
    checkIfWebcamPermissionGranted(hasWebcamAccess => this.setState({ hasWebcamAccess }))
  }

  componentWillUnmount () {
    this.webcamUnmounted()
  }

  screenshot = () => {
    const { onScreenshot } = this.props
    const canvas = this.webcam && this.webcam.getCanvas()
    if (!canvas){
      console.error('webcam canvas is null')
      return
    }
    asyncFunc(cloneCanvas, [canvas], onScreenshot)
  }

  stopCamera = () => {
    this.capture.stop()
  }

  setPermissionsPrimerSeen = () => {
    this.setState({ hasSeenPermissionsPrimer: true })
  }

  render = () => {
    const { hasSeenPermissionsPrimer, hasWebcamAccess } = this.state;
    return (
      (hasWebcamAccess || hasSeenPermissionsPrimer) ?
        <CameraPure {...{
          ...this.props,
          faceCaptureClick: this.capture.once,
          webcamRef: (c) => { this.webcam = c },
          onFallbackClick: () => {this.stopCamera},
        }}
        /> :
        <PermissionsPrimer
          {...this.props}
          onNext={this.setPermissionsPrimerSeen}
        />
    )
  }
}
