import { h, Component } from 'preact'
import Dropzone from 'react-dropzone'
import Spinner from '../Spinner'
import theme from '../Theme/style.css'
import style from './style.css'
import {functionalSwitch, impurify} from '../utils'

const UploadInstructions = () =>
  <div className={style.base}>
    <span className={`${theme.icon} ${style.icon}`}></span>
    <p className={style.text}>Take a photo with your camera or upload one from your library.</p>
  </div>

const UploadProcessing = () =>
  <div className={theme.center}>
    <Spinner />
    <div className={style.processing}>Processing your document</div>
  </div>

const UploadError = ({children}) =>
  <div className={`${style.text} ${style.error}`}>{children}</div>

const InvalidCapture = ({message}) =>
  <UploadError>{message}</UploadError>

InvalidCapture.defaultProps = {
  message: 'We are unable to detect an identity document in this image. Please try again.'
}

const InvalidFileType = ({message}) =>
  <UploadError>{message}</UploadError>

InvalidFileType.defaultProps = {
  message: 'The file uploaded has an unsupported file type.'
}

const InvalidFileSize = ({message}) =>
  <UploadError>{message}</UploadError>

InvalidFileSize.defaultProps = {
  message: 'The file size limit of 4MB has been exceeded. Please try again.'
}

//TODO move to react instead of preact, since preact has issues handling pure components
//IF this component is exported as pure,
//some components like Camera will not have componentWillUnmount called
export const Uploader = impurify(({method, onImageSelected, uploading, error}) => (
  <Dropzone
    onDrop={([ file ])=> {
      //removes a memory leak created by react-dropzone
      URL.revokeObjectURL(file.preview)
      delete file.preview
      onImageSelected(file)
    }}
    multiple={false}
    className={style.dropzone}
  >
    {uploading ? <UploadProcessing /> : <UploadInstructions />}
    {!uploading && functionalSwitch(error, {
      INVALID_CAPTURE: () => <InvalidCapture />,
      INVALID_TYPE: () => <InvalidFileType />,
      INVALID_SIZE: () => <InvalidFileSize />
    })}
  </Dropzone>
))
