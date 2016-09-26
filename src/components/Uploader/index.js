import { h, Component } from 'preact'
import Dropzone from 'react-dropzone'
import loadImage from 'blueimp-load-image/js/load-image'
import { DocumentNotFound } from '../Document'
import Spinner from '../Spinner'
import Confirm from '../Confirm'
import theme from '../Theme/style.css'
import style from './style.css'

export const fileToBase64 = (file, callback) => {
  const options = {
    maxWidth: 960,
    maxHeight: 960,
    canvas: true
  }

  loadImage(file.preview, (canvas) => {
    const image = canvas.toDataURL('image/webp')
    callback(image)
  }, options)
}

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

export const Uploader = ({ onImageSelected, uploading, noDocument}) => (
  <Dropzone
    onDrop={([ file ])=> onImageSelected(file)}
    multiple={false}
    className={style.dropzone}
  >
    {uploading && <UploadProcessing /> || <UploadInstructions />}
    {(!uploading && noDocument) && <DocumentNotFound />}
  </Dropzone>
)
