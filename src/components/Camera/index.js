import { h, Component } from 'preact'
import { Link, route } from 'preact-router'
import Webcam from 'react-webcam'
import CountUp from 'countup.js'
import classNames from 'classnames'
import { connect, events } from 'onfido-sdk-core'

import randomId from '../utils/randomString'
import { createBase64 } from '../utils/createBase64'

import { DocumentNotFound, DocumentOverlay, DocumentInstructions } from '../Document'
import { FaceOverlay, FaceInstructions } from '../Face'
import { Uploader } from '../Uploader'
import Countdown from '../Countdown'

import style from './style.css'

export default class Camera extends Component {

  capture = {
    start: () => this.interval = setInterval(() => this.screenshot(), 1000),
    stop: () => clearInterval(this.interval),
    once: () => {
      const options = { useEasing: false, useGrouping: false }
      const countdown = new CountUp(this.countdown, 3, 0, 0, 3, options)
      countdown.start(() => this.screenshot())
    }
  }

  componentDidMount () {
    const { autoCapture } = this.props
    if (autoCapture) this.capture.start()
    events.on('onBeforeClose', () => {
      clearInterval(this.interval)
      route('/', true)
    })
  }

  componentWillUnmount () {
    this.capture.stop()
  }

  screenshot = () => {
    const { method, handleImage } = this.props
    if (this.webcam === null) return;
    const image = this.webcam.getScreenshot()
    const payload = {
      id: randomId(),
      messageType: method,
      image
    }
    handleImage(method, payload)
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
            ref={(c) => { this.webcam = c }}
            audio={false}
            onUserMedia = {onUserMedia}
          />
        </div>
        {this.renderInstructions(method)}
      </div>
    )
  }

}
