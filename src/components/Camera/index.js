import { h, Component } from 'preact'
import { Link, route } from 'preact-router'
import Webcam from 'react-webcam'
import CountUp from 'countup.js'
import classNames from 'classnames'
import { connect, events } from 'onfido-sdk-core'
import Dropzone from 'react-dropzone'

import { DocumentNotFound, DocumentOverlay, DocumentInstructions } from '../Document'
import { FaceOverlay, FaceInstructions } from '../Face'
import { Uploader } from '../Uploader'
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

const Intructions = ({method, faceCaptureClick}) => (
  functionalSwitch(method, {
    'document': () => <DocumentInstructions />,
    'face': () => <FaceInstructions handeClick={faceCaptureClick} />
  })
)

const CameraPure = ({method, onUploadFallback, onUserMedia, faceCaptureClick, countDownRef, webcamRef}) => (
  <div>
  <Dropzone
    onDrop={([file]) => onUploadFallback(file)}
    multiple={false}/>
    <div className={style["video-overlay"]}>
      <Overlay {...{method, countDownRef}}/>
      <Webcam
        className={style.video}
        audio={false}
        {...{onUserMedia, ref:webcamRef}}
      />
    </div>
    <Intructions {...{method, faceCaptureClick}}/>
  </div>
)

export default class Camera extends Component {

  webcam = null

  capture = {
    start: () => {
      this.capture.stop()
      this.interval = setInterval(() => this.screenshot(), 1000)
    },
    stop: () => clearInterval(this.interval),
    once: () => {
      const options = { useEasing: false, useGrouping: false }
      const countdown = new CountUp(this.countdown, 3, 0, 0, 3, options)
      countdown.start(() => this.screenshot())
    }
  }

  //Necessary since componentDidMount is sometimes not called
  webcamMounted () {
    const { autoCapture } = this.props
    if (autoCapture) this.capture.start()
    events.on('onBeforeClose', () => {
      this.capture.stop()
      route('/', true)
    })
  }

  //Necessary since componentWillUnmount is sometimes not called
  webcamUnmounted () {
    this.capture.stop()
  }

  screenshot = () => {
    const { onScreenshot } = this.props
    const image = this.webcam.getScreenshot()
    onScreenshot(image)
  }

  render = ({method, onUserMedia, onUploadFallback}) => (
    <CameraPure {...{
      method, onUserMedia,
      faceCaptureClick: this.capture.once,
      onUploadFallback: ([file]) => onUploadFallback(file),
      countDownRef: (c) => { this.countdown = c },
      webcamRef: (c) => {
        const previous = this.webcam;
        this.webcam = c
        if (c===null && previous!==null) this.webcamUnmounted()
        else if (c!==null && previous===null) this.webcamMounted()
      }}}
    />
  )
}
