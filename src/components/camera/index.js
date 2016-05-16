import { h, Component } from 'preact'
import { Link, route } from 'preact-router'
import getUserMedia from 'getusermedia'
import Dropzone from 'react-dropzone'
import CountUp from 'countup.js'
import { connect, events } from '../../../../onfido-sdk-core'
import filterImage from '../utils/filterImage'
import loadImage from 'blueimp-load-image/js/load-image'
import randomId from '../utils/randomString'

const Countdown = () => (<span className='onfido-countdown'></span>)

export default class Camera extends Component {

  componentWillReceiveProps (nextProps) {
    const { method } = this.props
    const { hasDocumentCaptured, hasFaceCaptured } = nextProps
    const validDocumentCapture = (hasDocumentCaptured && method === 'document')
    const validFaceCapture = (hasFaceCaptured && method === 'face')
    if (validDocumentCapture || validFaceCapture) {
      route('/', true)
    }
  }

  captureImage () {
    if (!this.video) return
    const { ratio } = this.dimensions
    const image = this.createBase64(this.canvas, 960, (960 / ratio))
    this.handleImage(image, false)
  }

  createBase64 (canvas, width, height) {
    this.ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height
    this.ctx.drawImage(this.video, 0, 0, width, height)
    const image = canvas.toDataURL('image/webp')
    return image
  }

  handleFiles (files) {
    const options = {
      maxWidth: 960
    }
    files.map((file) => {
      loadImage(file.preview, (image) => {
        events.emit('imageLoaded', image)
      }, options)
    })
    events.once('imageLoaded', (image) => {
      this.handleImage(image, true)
    })
  }

  handleImage (image, isFile) {
    const { method, actions, socket } = this.props
    const payload = {
      id: randomId(),
      messageType: method,
      image: isFile ? null : filterImage(image),
      isFile
    }
    switch (method) {
      case 'document':
        return (() => {
          socket.sendMessage(JSON.stringify(payload))
          if (payload.isFile) {
            payload.image = image.src
            socket.sendMessage(image.src)
          }
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

  createStream (stream) {
    const { hasDocumentCaptured, method } = this.props
    const { video, capture } = this
    video.src = window.URL.createObjectURL(stream)
    video.onloadedmetadata = (e) => {
      const { clientWidth, clientHeight } = this.video
      this.dimensions = {
        clientWidth,
        clientHeight,
        ratio: (clientWidth / clientHeight)
      }
      video.play()
    }
    if (method === 'document' && !hasDocumentCaptured) {
      capture.start()
    }
  }

  capture = {
    once: () => {
      const options = {
        useEasing : false,
        useGrouping : false
      }
      const countdown = new CountUp(this.countdown, 3, 0, 0, 3, options)
      countdown.start(() => {
        this.video.pause()
        this.captureImage()
      })
    },
    start: () => {
      this.interval = setInterval(() => this.captureImage(), 1000)
    },
    stop: () => {
      clearInterval(this.interval)
    }
  }

  componentDidMount () {
    this.canvas = document.createElement('canvas')
    getUserMedia((err, stream) => {
      if (err) {

      } else {
        this.createStream(stream)
        this.bindEvents()
      }
    })
  }

  bindEvents () {
    events.on('onBeforeOpen', () => this.capture.start())
    events.on('onBeforeClose', () => this.capture.stop())
  }

  componentWillUnmount() {
    this.capture.stop()
  }

  renderCaptureButton () {
    return (
      <button id='onfido-capture' className='btn' onClick={this.capture.once}>
        Take photo
      </button>
    )
  }

  renderPreviews () {
    const { documentCaptures, faceCaptures, method } = this.props
    switch (method) {
      case 'document':
        return documentCaptures.map((file) => <img src={file.image} />)
      case 'face':
        return faceCaptures.map((file) => <img src={file.image} />)
      default:
        return false
    }
  }

  renderUploader () {
    return (
      <div className='onfido-upload'>
        {this.renderPreviews()}
        <Dropzone
          onDrop={::this.handleFiles}
          multiple={false}
          className='onfido-dropzone'
        >
          <div>Try dropping some files here, or click to select files to upload.</div>
        </Dropzone>
      </div>
    )
  }

  renderVideo () {
    return (
      <video
        id='onfido-video'
        className='onfido-video'
        autoplay='autoplay'
        muted={true}
        ref={(video) => { this.video = video }}
      />
    )
  }

  renderNav () {
    return (
      <div class='onfido-controls'>
        <Link href='/' id='onfido-back' className='onfido-back'>
          <span className='sans-serif'>&larr</span>&nbspBack
        </Link>
        <a rel='modal:close' className='onfido-close white'>×&nbspClose</a>
      </div>
    )
  }

  render() {
    const { method, supportsGetUserMedia } = this.props
    const showFaceCapture = (supportsGetUserMedia && method === 'face')
    return (
      <div id='onfido-camera' className='onfido-camera'>
        {this.renderNav()}
        {showFaceCapture && this.renderCaptureButton()}
        {showFaceCapture && <Countdown ref={(c) => { this.countdown = c }}/>}
        {supportsGetUserMedia && this.renderVideo() || this.renderUploader()}
      </div>
    )
  }

}
