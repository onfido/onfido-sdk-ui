import { h, Component } from 'preact'
import Webcam from 'webcamjs'
import CountUp from 'countup.js'
import classNames from 'classnames'
import Dropzone from 'react-dropzone'
import Visibility from 'visibilityjs'

import { DocumentOverlay, DocumentInstructions } from '../Document'
import { FaceOverlay, FaceInstructions } from '../Face'
import Countdown from '../Countdown'
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

const CameraPure = ({method, onUploadFallback, onUserMedia, faceCaptureClick, countDownRef, webcamRef}) => (
  <div>
    <div className={style["video-overlay"]}>
      <Overlay {...{method, countDownRef}}/>
      <div className={style.video}></div>
      <UploadFallback {...{onUploadFallback}}/>
    </div>
    <Instructions {...{method, faceCaptureClick}}/>
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
      const countdown = new CountUp(this.countdown, 3, 0, 0, 3, options)
      countdown.start(() => this.screenshot())
    }
  }

  webcamLive () {
    const { autoCapture } = this.props
    return () => { if (autoCapture) this.capture.start() }
  }

  startWebcam () {
    Webcam.set({enable_flash: false})
    Webcam.attach('.onfido-sdk-ui-Camera-video')
    Webcam.on('live', this.webcamLive())
    Webcam.on('error', (err) => {console.error(err)})
  }

  componentDidMount () {
    this.startWebcam()
  }

  componentDidUpdate () {
    this.startWebcam()
  }

  componentWillUnmount () {
    this.capture.stop()
    Webcam.reset()
  }

  screenshot = () => {
    const { onScreenshot } = this.props
    Webcam.snap((data_uri, canvas) => {
      onScreenshot(canvas)
    })
  }

  render = ({method, onUserMedia, onUploadFallback}) => (
    <CameraPure {...{
      method, onUserMedia, onUploadFallback,
      faceCaptureClick: this.capture.once,
      countDownRef: (c) => { this.countdown = c },
      webcamRef: (c) => { this.webcam = c }}}
    />
  )
}
