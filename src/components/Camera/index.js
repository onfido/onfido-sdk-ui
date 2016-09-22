import { h, Component } from 'preact'
import { Link, route } from 'preact-router'
import Webcam from 'react-webcam'
import CountUp from 'countup.js'
import classNames from 'classnames'
import { connect, events } from 'onfido-sdk-core'
import { DocumentNotFound, DocumentOverlay, DocumentInstructions } from '../Document'
import { FaceOverlay, FaceInstructions } from '../Face'
import { Uploader } from '../Uploader'
import Countdown from '../Countdown'

import style from './style.css'

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

  renderOverlay = (method) => {
    const methods = {
      'document': () => <DocumentOverlay />,
      'face': () => (
        <div>
          <Countdown ref={(c) => { this.countdown = c }} />
          <FaceOverlay />
        </div>
      ),
      'home': () => null
    }
    return (methods[method] || methods['home'])()
  }

  renderInstructions = (method) => {
    const methods = {
      'document': () => <DocumentInstructions />,
      'face': () => <FaceInstructions handeClick={this.capture.once} />,
      'home': () => null
    }
    return (methods[method] || methods['home'])()
  }

  render () {
    const { method, onUserMedia } = this.props
    return (
      <div>
        <div className={style["video-overlay"]}>
          {this.renderOverlay(method)}
          <Webcam
            className={style.video}
            ref={(c) => {
              const previous = this.webcam;
              this.webcam = c
              if (c===null && previous!==null) this.webcamUnmounted()
              else if (c!==null && previous===null) this.webcamMounted()
            }}
            audio={false}
            onUserMedia = {onUserMedia}
          />
        </div>
        {this.renderInstructions(method)}
      </div>
    )
  }
}
