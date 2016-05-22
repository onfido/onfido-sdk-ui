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
import { Upload } from '../Upload'
import CameraNavigation from '../CameraNavigation'
import Countdown from '../Countdown'

export default class Camera extends Component {

  state = {
    noDocument: false,
    uploading: false
  }

  componentWillReceiveProps (nextProps) {
    const { supportsGetUserMedia } = this.props
    const { cameraActive, method } = nextProps
    const wasActive = this.props.cameraActive
    const useCapture = (supportsGetUserMedia && (screenWidth > 800))
    if (useCapture && (cameraActive !== wasActive)) {
      this.capture(method)
    }
  }

  handleUpload = (files) => {
    const { method } = this.props
    this.setState({ uploading: true })
    const options = {
      maxWidth: 960,
      maxHeight: 960,
      canvas: true
    }
    files.map((file) => {
      loadImage(file.preview, (canvas) => {
        events.emit('imageLoaded', canvas)
      }, options)
    })
    events.once('imageLoaded', (canvas) => {
      const image = canvas.toDataURL('image/webp')
      const payload = {
        id: randomId(),
        messageType: method,
        image
      }
      return this.handleImage(method, payload)
    })
  }

  createImage = () => {
    const { canvas, video, dimensions } = this
    const { method } = this.props
    createBase64(canvas, video, dimensions, (image) => {
      const payload = {
        id: randomId(),
        messageType: method,
        image
      }
      return this.handleImage(method, payload)
    })
  }

  handleImage = (method, payload) => {
    const methods = {
      'document': (payload) => {
        const { actions, socket } = this.props
        socket.sendMessage(JSON.stringify(payload))
        actions.documentCapture(payload)
      },
      'face': (payload) => {
        const { actions, changeView } = this.props
        actions.faceCapture(payload)
        actions.setFaceCaptured(true)
        changeView()
      },
      'home': () => null
    }
    return (methods[method] || methods['home'])(payload)
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
  }

  componentDidMount () {
    this.canvas = document.createElement('canvas')
    events.on('onMessage', (message) => this.handleMessages(message))
    getUserMedia((err, stream) => {
      if (!err) {
        this.video.src = window.URL.createObjectURL(stream)
        this.video.play()
        events.once('initCamera', () => {
          this.init()
          this.bindCaptureEvents()
        })
      }
    })
  }

  isUploadValid = (uploading, noDocument) => {
    this.setState({ uploading, noDocument })
  }

  handleMessages = (message) => {
    const { changeView, actions } = this.props
    if (message.is_document) {
      actions.setDocumentCaptured(true)
      this.isUploadValid(false, false)
      changeView()
    } else {
      this.isUploadValid(false, true)
    }
  }

  bindCaptureEvents = () => {
    events.on('onBeforeOpen', () => this.props.changeView())
    events.on('onBeforeClose', () => this.capture('stop'))
  }

  componentWillUnmount () {
    this.capture('stop')
  }

  renderVideo (method) {
    return (
      <div>
        {this.renderInstructions(method)}
        <video
          id='onfido-video'
          className='onfido-video'
          autoplay={true}
          muted={true}
          ref={(video) => { this.video = video }}
        />
      </div>
    )
  }

  renderInstructions = (method) => {
    const methods = {
      'document': () => <DocumentInstructions />,
      'face': () => {
        return (
          <div>
            <Countdown ref={(c) => { this.countdown = c }} />
            <FaceInstructions handeClick={this.captureOnce} />
          </div>
        )
      },
      'home': () => null
    }
    return (methods[method] || methods['home'])()
  }

  render () {
    const { method, supportsGetUserMedia, changeView } = this.props
    const useCapture = (supportsGetUserMedia && (screenWidth > 800))
    const classes = classNames({
      'onfido-camera': useCapture,
      'onfido-uploader': !useCapture
    })
    return (
      <div id='onfido-camera' className={classes}>
        <CameraNavigation changeView={changeView} />
        {useCapture && this.renderVideo(method) || <Upload {...this.state} handleUpload={::this.handleUpload} />}
      </div>
    )
  }

}
