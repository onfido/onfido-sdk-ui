import { h, Component } from 'preact'
import getUserMedia from 'getusermedia'

import CountUp from 'countup.js'
import classNames from 'classnames'
import loadImage from 'blueimp-load-image/js/load-image'
import { connect, events } from 'onfido-sdk-core'

import randomId from '../utils/randomString'
import screenWidth from '../utils/screenWidth'
import createBase64 from '../utils/createBase64'
import Interval from '../utils/interval'

import { DocumentNotFound, DocumentInstructions } from '../Document'
import { FaceInstructions } from '../Face'
import { Upload } from '../Upload'
import CameraNavigation from '../CameraNavigation'
import Countdown from '../Countdown'
import Spinner from '../Spinner'

export default class Camera extends Component {

  state = {
    noDocument: false,
    uploading: false
  }

  componentWillReceiveProps (nextProps) {
    const {
      cameraActive,
      method,
      hasDocumentCaptured,
      hasFaceCaptured
    } = nextProps
    const { transition } = this.props

    const prevMethod = this.props.method
    const prevActive = this.props.cameraActive

    if (cameraActive) {
      setTimeout(() => this.video.play(), 50)
    }

    const documentCaptured = (hasDocumentCaptured && prevMethod === 'document')
    const faceCaptured = (hasFaceCaptured && prevMethod === 'face')
    if (documentCaptured || faceCaptured) {
      this.capture.stop()
      transition()
    }

    const homeToDocumentView = (prevMethod === 'home' && method === 'document')
    const documentToHomeView = (prevMethod === 'document' && method === 'home')
    if (!homeToDocumentView && !documentToHomeView) {
      return
    }

    if ((cameraActive) && (cameraActive !== prevActive)) {
      console.log('this.capture.start()')
      this.capture.start()
    } else if ((prevActive) && (prevActive !== cameraActive)) {
      console.log('this.capture.stop()')
      this.capture.stop()
    }

  }

  captureImage = () => {
    if (!this.video || !this.dimensions) return
    const { ratio } = this.dimensions
    const image = createBase64(this.canvas, this.video, 960, (960 / ratio))
    this.handleImage(image, false)
  }

  handleUpload = (files) => {
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
      const base64 = canvas.toDataURL('image/webp')
      this.handleImage(base64)
    })
  }

  handleImage = (image) => {
    const { method, actions, socket } = this.props
    const payload = {
      id: randomId(),
      messageType: method,
      image
    }
    switch (method) {
      case 'document':
        return (() => {
          socket.sendMessage(JSON.stringify(payload))
          actions.documentCapture(payload)
        })()
      case 'face':
        return (() => {
          actions.faceCapture(payload)
          setTimeout(() => actions.setFaceCaptured(true), 1000)
        })()
      default:
        return false
    }
  }

  capture = {
    init: () => {
      const { clientWidth, clientHeight } = this.video
      const ratio = (clientWidth / clientHeight)
      this.dimensions = { clientWidth, clientHeight, ratio }
    },
    once: () => {
      // const options = { useEasing: false, useGrouping: false }
      // const countdown = new CountUp(this.countdown, 3, 0, 0, 3, options)
      // countdown.start(() => {
      //   this.video.pause()
      //   this.captureImage()
      // })
    },
    start: () => {
      // this.interval = setInterval(() => this.captureImage(), 1000)
    },
    stop: () => {
      // clearInterval(this.interval)
    }
  }

  componentDidMount () {
    this.canvas = document.createElement('canvas')
    events.on('onMessage', (message) => this.handleMessages(message))
    getUserMedia((err, stream) => {
      if (!err) {
        const { video } = this
        video.src = window.URL.createObjectURL(stream)
        video.play()
        events.once('initCamera', () => {
          this.capture.init()
          this.bindCaptureEvents()
        })
      }
    })
  }

  isUploadValid = (uploading, noDocument) => {
    this.setState({ uploading, noDocument })
  }

  handleMessages = (message) => {
    console.log(message)
    const { transition, actions } = this.props
    if (message.is_document) {
      actions.setDocumentCaptured(true)
      this.isUploadValid(false, false)
    } else {
      this.isUploadValid(false, true)
    }
  }

  bindCaptureEvents = () => {
    events.on('onBeforeOpen', () => this.props.transition())
    events.on('onBeforeClose', () => this.capture.stop())
  }

  componentWillUnmount () {
    this.capture.stop()
  }

  renderVideo () {
    return (
      <video
        id='onfido-video'
        className='onfido-video'
        autoplay={true}
        muted={true}
        ref={(video) => { this.video = video }}
      />
    )
  }

  render() {
    const { method, supportsGetUserMedia, transition } = this.props
    const useCapture = (supportsGetUserMedia && (screenWidth > 800))
    const faceCapture = (useCapture && method === 'face')
    const documentCapture = (useCapture && method === 'document')
    const classes = classNames({
      'onfido-camera': useCapture,
      'onfido-uploader': !useCapture
    })

    return (
      <div id='onfido-camera' className={classes}>
        <Interval
          timeout={1000}
          enabled={true}
          callback={() => this.captureImage()}
        />
        <CameraNavigation transition={transition} />
        {faceCapture && <Countdown ref={(c) => { this.countdown = c }}/>}
        {faceCapture && <FaceInstructions handeClick={this.capture.once} />}
        {documentCapture && <DocumentInstructions />}
        {useCapture && this.renderVideo() || <Upload {...this.state} handleUpload={::this.handleUpload} />}
      </div>
    )
  }

}
