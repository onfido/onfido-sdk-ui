import { h, Component } from 'preact'
import CountUp from 'countup.js'
import classNames from 'classnames'
import Dropzone from 'react-dropzone'
import Visibility from 'visibilityjs'

import { DocumentOverlay, DocumentInstructions } from '../Document'
import { FaceOverlay, FaceInstructions } from '../Face'
import Countdown from '../Countdown'
import WebcamVideo from '../Webcam'
import {functionalSwitch} from '../utils'

import style from './style.css'

const Overlay = ({method, countDownRef}) => (
  functionalSwitch(method, {
    document: () => <DocumentOverlay />,
    face: () => (
      <div>
        <Countdown ref={countDownRef} />
        <FaceOverlay />
      </div>
    )
  })
)

const Instructions = ({method, faceCaptureClick}) => (
  functionalSwitch(method, {
    'document': () => <DocumentInstructions />,
    'face': () => <FaceInstructions handeClick={faceCaptureClick} />
  })
)

const UploadFallback = ({onUploadFallback}) => (
  <Dropzone
    onDrop={([file]) => onUploadFallback(file)}
    className={style.uploadFallback}
    multiple={false}>
    <button> Having problems? Click here to upload a file</button>
  </Dropzone>
)

const CameraPure = ({method, onUploadFallback, onUserMedia, faceCaptureClick, countDownRef, webcamProps, webcamRef}) => (
  <div>
    <div className={style["video-overlay"]}>
      <Overlay {...{method, countDownRef}}/>
      <WebcamVideo {...webcamProps} ref={webcamRef} />
      <UploadFallback {...{onUploadFallback}}/>
    </div>
    <Instructions {...{method, faceCaptureClick}}/>
  </div>
)

export default class Camera extends Component {

  capture = {
    start: () => {
      this.capture.stop()
      this.interval = Visibility.every(1000, this.screenshot)
    },
    stop: () => Visibility.stop(this.interval),
    once: () => {
      const options = { useEasing: false, useGrouping: false }
      const countdown = new CountUp(this.countdown, 3, 0, 0, 3, options)
      countdown.start(() => this.screenshot())
    }
  }

  webcamRef = (component) => this.webcam = component

  onWebcamLive () {
    const { autoCapture } = this.props
    const capture = this.capture
    return () => () => {
      if (autoCapture) {
        this.capture.start()
      }
    }
  }

  onWebcamError (error) {
    console.error(error)
  }

  screenshot = () => {
    const { onScreenshot } = this.props
    this.webcam.snap((data_uri, canvas) => {
      onScreenshot(canvas)
    })
  }

  componentWillUnmount () {
    this.capture.stop()
  }

  render = ({method, onUserMedia, onUploadFallback}) => (
    <CameraPure {...{
      method, onUserMedia, onUploadFallback,
      faceCaptureClick: this.capture.once,
      countDownRef: (c) => { this.countdown = c },
      webcamProps: {enable_flash: false, onLive: this.onWebcamLive(), onError: this.onWebcamError},
      webcamRef: this.webcamRef
    }}/>
  )
}
