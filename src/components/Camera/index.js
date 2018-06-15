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

import theme from '../Theme/style.css'
import style from './style.css'


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
  onUserMedia: void => void,
  i18n: Object,
  isFullScreen: boolean,
  handleWebcamError: Function
}

type CameraPureType = {
  ...CameraCommonType,
  onFallbackClick: void => void,
  faceCaptureClick: void => void,
  cameraHeight: number | Object,
  webcamRef: React.Ref<typeof Webcam>,
}

// Specify just a camera height (no width) because on safari if you specify both
// height and width you will hit an OverconstrainedError if the camera does not
// support the precise resolution.
const CameraPure = ({method, autoCapture, title, subTitle, onUploadFallback, onFallbackClick,
  onUserMedia, faceCaptureClick, webcamRef, isFullScreen, handleWebcamError, i18n, cameraHeight}: CameraPureType) => (
    <div className={style.camera}>
      <Title {...{title, subTitle, isFullScreen}} smaller={true}/>
      <div className={classNames(style["video-overlay"], {[style.overlayFullScreen]: isFullScreen})}>
        <Webcam
          className={style.video}
          audio={false}
          height={0}
          key={cameraHeight}
          {...{onUserMedia, ref: webcamRef, onFailure: handleWebcamError}}
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
  onWebcamError: Function
}

type State = {
  cameraHeight: number | Object
}

type Props = Object

export default class Camera extends React.Component<CameraType, State, Props> {

  webcam: ?React$ElementRef<typeof Webcam> = null
  interval: ?Visibility

  constructor(props: Props){
    super(props)
    this.state = { cameraHeight: 720 }
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

  handleWebcamError = (error: Object) => {
    if (!error.name === 'TrackStartError' || this.state.cameraHeight <= 480) {
      this.props.onWebcamError()
    }
    else {
      this.setState({cameraHeight: 480})
    }
  }

  render = () => (
    <CameraPure {...{
      ...this.props,
      faceCaptureClick: this.capture.once,
      webcamRef: (c) => { this.webcam = c },
      onFallbackClick: () => {this.stopCamera},
      cameraHeight: this.state.cameraHeight,
      handleWebcamError: (e) => this.handleWebcamError(e)
    }}
    />
  )
}
