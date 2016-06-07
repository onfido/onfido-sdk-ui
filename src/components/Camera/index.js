import { h, Component } from 'preact'
import { Link } from 'preact-router'
import Webcam from 'react-webcam'
import CountUp from 'countup.js'
import classNames from 'classnames'
import { connect, events } from 'onfido-sdk-core'

import randomId from '../utils/randomString'
import screenWidth from '../utils/screenWidth'
import { createBase64 } from '../utils/createBase64'

import { DocumentNotFound, DocumentInstructions } from '../Document'
import { FaceInstructions } from '../Face'
import { Uploader } from '../Uploader'

import Countdown from '../Countdown'

export default class Camera extends Component {

  captureOnce = () => {
    const options = { useEasing: false, useGrouping: false }
    const countdown = new CountUp(this.countdown, 3, 0, 0, 3, options)
    countdown.start(() => this.screenshot())
  }

  componentDidMount () {
    console.log('Camera componentDidMount')
    const { autoCapture } = this.props
    if (autoCapture) {
      this.interval = setInterval(() => this.screenshot(), 1000)
    }
    events.on('onBeforeOpen', () => null)
    events.on('onBeforeClose', () => clearInterval(this.interval))
  }

  componentWillUnmount () {
    console.log('Camera componentWillUnmount')
    clearInterval(this.interval)
  }

  componentDidUnmount () {
    console.log('Camera componentDidUnmount')
  }

  screenshot = () => {
    const { method, handleImage } = this.props
    const image = this.webcam.getScreenshot()
    const payload = {
      id: randomId(),
      messageType: method,
      image
    }
    handleImage(method, payload)
  }

  renderInstructions = (method) => {
    const methods = {
      'document': () => <DocumentInstructions />,
      'face': () => (
        <div>
          <Countdown ref={(c) => { this.countdown = c }} />
          <FaceInstructions handeClick={this.captureOnce} />
        </div>
      ),
      'home': () => null
    }
    return (methods[method] || methods['home'])()
  }

  render () {
    const { method } = this.props
    return (
      <div className='onfido-center'>
        {this.renderInstructions(method)}
        <Webcam
          className='onfido-video'
          ref={(c) => { this.webcam = c }}
          audio={false}
        />
      </div>
    )
  }

}
