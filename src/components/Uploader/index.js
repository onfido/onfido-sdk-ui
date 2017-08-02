import { h, Component } from 'preact'
import Dropzone from 'react-dropzone'
import Spinner from '../Spinner'
import theme from '../Theme/style.css'
import style from './style.css'
import {functionalSwitch, impurify} from '../utils'
import {errors} from '../strings/errors'
import { trackComponent } from '../../Tracker'

const UploadInstructions = ({error}) =>
  <div className={style.base}>
    <span className={`${theme.icon} ${style.icon}`}></span>
    <p className={style.text}>Take a photo with your camera or upload one from your library.</p>
    { error && <UploadError error={error} /> }
  </div>

const UploadProcessing = () =>
  <div className={theme.center}>
    <Spinner />
    <div className={style.processing}>Processing your document</div>
  </div>

const UploadError = ({error}) =>
  <div className={`${style.text} ${style.error}`}>{errors[error]}</div>


//TODO move to react instead of preact, since preact has issues handling pure components
//IF this component is exported as pure,
//some components like Camera will not have componentWillUnmount called
export const Uploader = trackComponent(impurify(({method, onImageSelected, error}) => (
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
    {<UploadInstructions error={error}/> }
  </Dropzone>
)), 'file_upload')
