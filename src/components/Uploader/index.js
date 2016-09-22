import { h, Component } from 'preact'
import Dropzone from 'react-dropzone'
import { events } from 'onfido-sdk-core'
import loadImage from 'blueimp-load-image/js/load-image'
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

const DropzoneExt = ({ uploading, noDocument, handleUpload }) => (
  <Dropzone
    onDrop={handleUpload}
    multiple={false}
    className={style.dropzone}
  >
    {uploading && <UploadProcessing /> || <UploadInstructions />}
    {(!uploading && noDocument) && <DocumentNotFound />}
  </Dropzone>
)

const UploaderPure = ({ method, documentCaptured, faceCaptured, ...other }) => {
  const capture = {
    document: documentCaptured,
    face: faceCaptured
  }[method]

  return capture ? <Confirm {...other} /> : <DropzoneExt {...other}/>
}

export class Uploader extends Component {
  componentDidMount () {
    this.canvas = document.createElement('canvas')
  }

  handleUpload = (files) => {
    const { method, onImageLoading, onImageLoaded } = this.props
    const options = {
      maxWidth: 960,
      maxHeight: 960,
      canvas: true
    }
    const [ file ] = files
    onImageLoading(file)

    loadImage(file.preview, (canvas) => {
      events.emit('imageLoaded', canvas)
    }, options)
    events.once('imageLoaded', (canvas) => {
      const image = canvas.toDataURL('image/webp')
      onImageLoaded(image)
    })
  }

  render () {
    const {localFile} = this.props
    return <UploaderPure {...{...this.props, handleUpload: this.handleUpload}} />
  }
}
