import { h, Component } from 'preact'
import Webcam from 'react-webcam-onfido'
import CountUp from 'countup.js'
import Dropzone from 'react-dropzone'
import Visibility from 'visibilityjs'

import Countdown from '../Countdown'
import {functionalSwitch} from '../utils'
import {cloneCanvas} from '../utils/canvas.js'
import { asyncFunc } from '../utils/func'
import { uploadDesktop } from '../strings'

import theme from '../Theme/style.css'
import style from './style.css'

const Overlay = ({method, countDownRef}) => (
  functionalSwitch(method, {
    document: () => <DocumentOverlay />,
    face: () => (
      <div className={style.overlay}>
        <Countdown ref={countDownRef} />
        <FaceOverlay />
      </div>
    )
  })
)

const FaceOverlay = () =>
  <div className={theme.overlay}>
    <span className={`${theme["overlay-shape"]} ${style.circle}`} />
  </div>

const DocumentOverlay = () =>
  <div className={theme.overlay}>
    <span className={`${theme["overlay-shape"]} ${style.rectangle}`}/>
  </div>

const UploadFallback = ({onUploadFallback, onFallbackClick, method}) =>
  <Dropzone
    onDrop={([file]) => onUploadFallback(file)}
    className={style.uploadFallback}
    multiple={false}>
    <button onClick={onFallbackClick()}>{uploadDesktop[method].help}</button>
  </Dropzone>

const CaptureActions = ({handeClick}) =>
  <div className={style.captureActions}>
    <button
      className={`${theme.btn} ${theme["btn-primary"]} ${theme["btn-centered"]}`}
      onClick={handeClick}
    >
      Take photo
    </button>
  </div>

const CameraPure = ({method, autoCapture, onUploadFallback, onFallbackClick, onUserMedia, faceCaptureClick, countDownRef, webcamRef, onWebcamError}) => (
  <div className={theme.thickWrapper}>
    <div className={style["video-overlay"]}>
      <Webcam
        className={style.video}
        audio={false}
        width={960}
        height={720}
        {...{onUserMedia, ref: webcamRef, onFailure: onWebcamError}}
      />
      <Overlay {...{method, countDownRef}}/>
      <UploadFallback {...{onUploadFallback, onFallbackClick, method}}/>
    </div>
    { autoCapture ? '' : <CaptureActions handeClick={faceCaptureClick} />}
  </div>
)

export default class Camera extends Component {

  webcam = null

  capture = {
    start: () => {
      this.capture.stop()
      this.interval = Visibility.every(1000, this.screenshot)
    },
    stop: () => Visibility.stop(this.interval),
    once: () => {
      const options = { useEasing: false, useGrouping: false }
      const countdown = new CountUp(this.countdown.base, 3, 0, 0, 3, options)
      countdown.start(() => this.screenshot())
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
    const canvas = this.webcam.getCanvas()
    if (!canvas){
      console.error('webcam canvas is null')
      return
    }
    asyncFunc(cloneCanvas, [canvas], onScreenshot)
  }

  stopCamera = () => {
    this.capture.stop()
  }

  render = ({method, onUserMedia, onUploadFallback, onWebcamError, autoCapture}) => (
    <CameraPure {...{
      method, onUserMedia, onUploadFallback, onWebcamError, autoCapture,
      faceCaptureClick: this.capture.once,
      countDownRef: (c) => { this.countdown = c },
      webcamRef: (c) => { this.webcam = c },
      onFallbackClick: () => this.stopCamera}
    }
    />
  )
}
