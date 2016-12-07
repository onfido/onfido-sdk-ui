import { h, Component } from 'preact'
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
import {cloneCanvas, cloneLowResCanvas} from '../utils/canvas.js'
import { asyncFunc, timeFunc } from '../utils/func'
import { centeredInnerRectangle, linearMappingBound } from '../utils/math'
import measureBlur from './measure_blur'

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

const CameraPure = ({method, onUploadFallback, onUserMedia, faceCaptureClick, countDownRef, webcamRef, score}) => (
  <div>
    <div className={style["video-overlay"]}>
      <Overlay {...{method, countDownRef}}/>
      <Webcam
        className={style.video}
        audio={false}
        width={960}
        height={720}
        {...{onUserMedia, ref:webcamRef}}
      />
      <UploadFallback {...{onUploadFallback}}/>
    </div>
    {score &&
      <span>
        <div>{`score:${score.range.toFixed(2)}`}</div>
        <div>{`score:${score.original.toFixed(2)}`}</div>
        <div>{`time:${score.time.toFixed(2)} ms`}</div>
      </span>
    }
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

  webcamMounted () {
    const { autoCapture } = this.props
    if (autoCapture) this.capture.start()
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
    const { onScreenshot, autoCapture } = this.props
    const canvas = this.webcam.getCanvas()
    if (!canvas){
      console.error('webcam canvas is null')
      return
    }

    let range = 1
    if (autoCapture){
      const lowResCanvas = cloneLowResCanvas(canvas, 400)

      const dimensions = centeredInnerRectangle(lowResCanvas.width, 0.8, lowResCanvas.height, 0.67)
      const imageData = lowResCanvas.getContext("2d").getImageData(...dimensions);

      const {time, result} = timeFunc(()=>measureBlur(imageData))

      range = linearMappingBound(1,0, 0.75, 1.3, result.avg_edge_width_perc)

      this.setState({
        score:{
          range,
          time,
          original: result.avg_edge_width_perc
        }
      })
    }

    if (range >= 1) asyncFunc(cloneCanvas, [canvas], onScreenshot)
  }

  render = ({method, onUserMedia, onUploadFallback}) => (
    <CameraPure {...{
      method, onUserMedia, onUploadFallback,
      faceCaptureClick: this.capture.once,
      countDownRef: (c) => { this.countdown = c },
      webcamRef: (c) => { this.webcam = c }}}

      score={this.state.score}
    />
  )
}
