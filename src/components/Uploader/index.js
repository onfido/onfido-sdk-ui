import { h, Component } from 'preact'
import Dropzone from 'react-dropzone'
import { events } from 'onfido-sdk-core'
import loadImage from 'blueimp-load-image/js/load-image'

import randomId from '../utils/randomString'
import { createBase64 } from '../utils/createBase64'

import { DocumentNotFound } from '../Document'
import Spinner from '../Spinner'
import Confirm from '../Confirm'

const UploadInstructions = () => (
  <div className='onfido-upload'>
    <span className='onfido-icon onfido-icon--upload'></span>
    <p className='onfido-upload-text'>Take a photo with your camera or upload one from your library.</p>
  </div>
)

const UploadProcessing = () => (
  <div className='onfido-center'>
    <Spinner />
    <div className='onfido-processing'>Processing your document</div>
  </div>
)

export default class Uploader extends Component {

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

  renderUploader = (captured) => {
    if (captured) {
      return ( <Confirm {...this.props} /> )
    } else {
      return this.renderDropzone()
    }
  }

  renderDropzone = () => {
    const { uploading, noDocument } = this.props
    return (
      <Dropzone
        onDrop={this.handleUpload}
        multiple={false}
        className='onfido-dropzone'
      >
        {uploading && <UploadProcessing /> || <UploadInstructions />}
        {(!uploading && noDocument) && <DocumentNotFound />}
      </Dropzone>
    )
  }

  render () {
    const { documentCaptured, faceCaptured, method } = this.props
    const methods = {
      'document': () => this.renderUploader(documentCaptured),
      'face': () => this.renderUploader(faceCaptured),
      'home': () => null
    }
    return (methods[method] || methods['home'])()
  }
}
