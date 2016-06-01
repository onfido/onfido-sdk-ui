import { h, Component } from 'preact'
import getUserMedia from 'getusermedia'

import CountUp from 'countup.js'
import classNames from 'classnames'
import loadImage from 'blueimp-load-image/js/load-image'
import { connect, events } from 'onfido-sdk-core'

import randomId from '../utils/randomString'
import screenWidth from '../utils/screenWidth'
import { createBase64 } from '../utils/createBase64'

import { DocumentNotFound, DocumentInstructions } from '../Document'
import { FaceInstructions } from '../Face'
import { Uploader } from '../Uploader'
import CameraNavigation from '../CameraNavigation'
import Countdown from '../Countdown'
import Previews from '../Previews'

export default class Camera extends Component {

  componentWillReceiveProps (nextProps) {
    const { supportsGetUserMedia, cameraActive } = this.props
    const useCapture = (supportsGetUserMedia && (screenWidth > 800))
    if ((useCapture) && (nextProps.cameraActive !== cameraActive)) {
      return this.capture(nextProps.method)
    }
  }

  createImage = () => {
    const { canvas, video, dimensions } = this
    const { method, handleImage } = this.props
    createBase64(canvas, video, dimensions, (image) => {
      const payload = {
        id: randomId(),
        messageType: method,
        image
      }
      return handleImage(method, payload)
    })
  }

  capture = (method) => {
    const methods = {
      'document': () => {
        setTimeout(() => this.video.play(), 50)
        this.interval = setInterval(() => this.createImage(), 1000)
      },
      'face': () => setTimeout(() => this.video.play(), 50),
      'home': () => clearInterval(this.interval),
      'stop': () => clearInterval(this.interval),
      'default': () => null
    }
    return (methods[method] || methods['default'])()
  }

  captureOnce = () => {
    const options = { useEasing: false, useGrouping: false }
    const countdown = new CountUp(this.countdown, 3, 0, 0, 3, options)
    countdown.start(() => {
      this.video.pause()
      this.createImage()
    })
  }

  init = () => {
    const { clientWidth, clientHeight } = this.video
    const ratio = (clientWidth / clientHeight)
    this.dimensions = { clientWidth, clientHeight, ratio }
    events.on('onBeforeOpen', () => null)
    events.on('onBeforeClose', () => this.capture('stop'))
  }

  componentDidMount () {
    const { handleMessages } = this.props
    this.canvas = document.createElement('canvas')
    getUserMedia((err, stream) => {
      if (!err) {
        this.video.src = window.URL.createObjectURL(stream)
        this.video.play()
        events.once('initCamera', () => this.init())
      }
    })
  }

  componentWillUnmount () {
    this.capture('stop')
  }

  renderVideo = (method) => (
    <video
      id='onfido-video'
      className='onfido-video'
      autoplay={true}
      muted={true}
      ref={(video) => { this.video = video }}
    />
  )

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
    const { method, hasCaptured } = this.props
    const captured = hasCaptured(method)
    return (
      <div className='onfido-center'>
        {this.renderInstructions(method)}
        {this.renderVideo(method)}
      </div>
    )
  }

}
