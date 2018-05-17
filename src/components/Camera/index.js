// @flow
import * as React from 'react'
import { h } from 'preact'
import Webcam from 'react-webcam-onfido'
import CountUp from 'countup.js'
import Dropzone from 'react-dropzone'
import Visibility from 'visibilityjs'
import classNames from 'classnames'

import {cloneCanvas} from '../utils/canvas.js'
import { asyncFunc } from '../utils/func'
import { Overlay } from '../Overlay'
import { Countdown } from '../Countdown'
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

const CaptureActions = ({handeClick, i18n}) =>
  <div className={style.captureActions}>
    <button
      className={`${theme.btn} ${theme["btn-primary"]} ${theme["btn-centered"]}`}
      onClick={handeClick}
    >
      {i18n.t('capture.face.button')}
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
  countDownRef: React.Ref<typeof Countdown>,
  webcamRef: React.Ref<typeof Webcam>,
}

// Specify just a camera height (no width) because on safari if you specify both
// height and width you will hit an OverconstrainedError if the camera does not
// support the precise resolution.
const CameraPure = ({method, autoCapture, title, subTitle, onUploadFallback, onFallbackClick,
  onUserMedia, faceCaptureClick, countDownRef, webcamRef, isFullScreen, onWebcamError, i18n}: CameraPureType) => (
    <div className={style.camera}>
      <Title {...{title, subTitle}} smaller={true}/>
      <div className={classNames(style["video-overlay"], {[style.overlayFullScreen]: isFullScreen})}>
        <Webcam
          className={style.video}
          audio={false}
          height={720}
          {...{onUserMedia, ref: webcamRef, onFailure: onWebcamError}}
        />
        <Overlay {...{method, countDownRef}}/>
        <UploadFallback {...{onUploadFallback, onFallbackClick, method, i18n}}/>
      </div>
      { autoCapture ? '' : <CaptureActions handeClick={faceCaptureClick} {...{i18n}}/>}
    </div>
)


type CameraType = {
  ...CameraCommonType,
  onScreenshot: Function,
  trackScreen: Function,
}

export default class Camera extends React.Component<CameraType> {

  webcam: ?React$ElementRef<typeof Webcam> = null
  interval: ?Visibility
  countdown: ?React$ElementRef<typeof Countdown> = null

  capture = {
    start: () => {
      this.capture.stop()
      this.interval = Visibility.every(1000, this.screenshot)
    },
    stop: () => Visibility.stop(this.interval),
    once: () => {
      const options = { useEasing: false, useGrouping: false }
      if (this.countdown){
        const countdown = new CountUp(this.countdown.base, 3, 0, 0, 3, options)
        countdown.start(() => this.screenshot())
      }
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

  render = () => (
    <CameraPure {...{
      ...this.props,
      faceCaptureClick: this.capture.once,
      countDownRef: (c) => { this.countdown = c },
      webcamRef: (c) => { this.webcam = c },
      onFallbackClick: () => {this.stopCamera},
    }}
    />
  )
}
