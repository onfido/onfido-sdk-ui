import { h, Component } from 'preact'
import Dropzone from 'react-dropzone'
import { events } from 'onfido-sdk-core'
import loadImage from 'blueimp-load-image/js/load-image'

import randomId from '../utils/randomString'
import { createBase64 } from '../utils/createBase64'

import { DocumentNotFound } from '../Document'
import Spinner from '../Spinner'
import Confirm from '../Confirm'
import theme from '../Theme/style.css'
import style from './style.css'

const UploadInstructions = () => (
  <div className={style.base}>
    <span className={`${theme.icon} ${style.icon}`}></span>
    <p className={style.text}>Take a photo with your camera or upload one from your library.</p>
  </div>
)

const UploadProcessing = () => (
  <div className={theme.center}>
    <Spinner />
    <div className={style.processing}>Processing your document</div>
  </div>
)

export const UploadError = ({errorMessage}) => (
  <div className={`${style.text} ${style.error}`}>{errorMessage}</div>
)

export class Uploader extends Component {

  componentDidMount () {
    this.canvas = document.createElement('canvas')
  }

  handleUpload = (files) => {
    const { method, handleImage, setUploadState } = this.props
    setUploadState(true)
    const options = {
      maxWidth: 960,
      maxHeight: 960,
      canvas: true
    }
    const [ file ] = files
    loadImage(file.preview, (canvas) => {
      events.emit('imageLoaded', canvas)
    }, options)
    events.once('imageLoaded', (canvas) => {
      const image = canvas.toDataURL('image/webp')
      const payload = {
        id: randomId(),
        messageType: method,
        image
      }
      return handleImage(method, payload)
    })
  }

  renderDropzone = ({ uploading, noDocument }) => (
    <Dropzone
      onDrop={this.handleUpload}
      multiple={false}
      className={style.dropzone}
    >
      {uploading && <UploadProcessing /> || <UploadInstructions />}
      {(!uploading && noDocument) && <DocumentNotFound />}
    </Dropzone>
  )


  render () {
    const { method, documentCaptured, faceCaptured } = this.props
    const capture = {
      document: documentCaptured,
      face: faceCaptured
    }[method]

    return capture ? <Confirm {...this.props} /> : this.renderDropzone(this.props)
  }
}
