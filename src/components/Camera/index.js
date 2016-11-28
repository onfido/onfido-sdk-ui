import { h, Component } from 'preact'
import { Link, route } from 'preact-router'
import Webcam from 'react-webcam-onfido'
import CountUp from 'countup.js'
import classNames from 'classnames'
import { connect, events } from 'onfido-sdk-core'
import Dropzone from 'react-dropzone'
import Visibility from 'visibilityjs'

import { DocumentNotFound, DocumentOverlay, DocumentInstructions } from '../Document'
import { FaceOverlay, FaceInstructions } from '../Face'
import { Uploader } from '../Uploader'
import Countdown from '../Countdown'
import {functionalSwitch} from '../utils'
import {cloneCanvas} from '../utils/canvas.js'

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

const Intructions = ({method, faceCaptureClick}) => (
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
      <Webcam
        className={style.video}
        audio={false}
        {...{onUserMedia, ref:webcamRef}}
      />
      <UploadFallback {...{onUploadFallback}}/>
    </div>
    <Intructions {...{method, faceCaptureClick}}/>
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

  webcamMounted () {
    const { autoCapture } = this.props
    if (autoCapture) this.capture.start()
    events.on('onBeforeClose', () => {
      //TODO remove this once the react modal is implemented
      this.capture.stop()
      route('/', true)
    })
  }

  webcamUnmounted () {
    this.capture.stop()
  }

  componentDidMount () {
    this.webcamMounted()
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
    onScreenshot(cloneCanvas(canvas))
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
