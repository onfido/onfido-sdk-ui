import { h, Component } from 'preact'
import Dropzone from 'react-dropzone'
import Spinner from '../Spinner'
import theme from '../Theme/style.css'
import style from './style.css'
import {functionalSwitch} from '../utils'
import {errors} from '../strings/errors'
import { trackComponentAndMode } from '../../Tracker'
import MobileLink from '../MobileLink'

const UploadInstructions = ({error}) =>
  <div className={style.base}>
    <span className={`${theme.icon} ${style.icon}`}></span>
    <p className={style.text}>Take a photo with your camera or upload one from your library.</p>
    <UploadError error={errors[error.name]} />
  </div>

const UploadProcessing = () =>
  <div className={theme.center}>
    <Spinner />
    <div className={style.processing}>Processing your document</div>
  </div>

const UploadError = ({error}) =>
  error && <div className={`${style.text} ${style.error}`}>{`${error.message}. ${error.instruction}.`}</div>

const UploaderPure = ({method, onImageSelected, error, token}) =>
  <div>
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
      {<UploadInstructions error={error}/>}

    </Dropzone>
    { method === 'face' ? <MobileLink methods={['face']} token={token} /> : null }
  </div>


export const Uploader = trackComponentAndMode(UploaderPure, 'file_upload', 'error')
