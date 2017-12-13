import { h } from 'preact'
import Dropzone from 'react-dropzone'
import classNames from 'classnames'
import theme from '../Theme/style.css'
import style from './style.css'
import { isDesktop } from '../utils'
import {errors} from '../strings/errors'
import { trackComponentAndMode } from '../../Tracker'
import SwitchDevice from '../crossDevice/SwitchDevice'

const instructionsIcon = () =>
  isDesktop ? style.uploadIcon : style.cameraIcon

const UploadInstructions = ({error, instructions, parentheses}) =>
    <div className={style.base}>
      <span className={`${theme.icon} ${instructionsIcon()}`}></span>
      { error ? <UploadError error={errors[error.name]} /> :
        <Instructions {...{instructions, parentheses}} />
      }
    </div>

const Instructions = ({instructions, parentheses}) =>
  <div className={style.text}>
    <div>{instructions}</div>
    { parentheses && <div>{parentheses}</div> }
  </div>

const UploadError = ({error}) =>
  <div className={style.error}>{`${error.message}. ${error.instruction}.`}</div>

const UploaderPure = ({instructions, parentheses, onImageSelected, error, changeFlowTo, allowCrossDeviceFlow}) =>
  <div className={classNames(style.uploaderWrapper, {[style.crossDeviceClient]: !allowCrossDeviceFlow})}>
    { allowCrossDeviceFlow && <SwitchDevice {...{changeFlowTo}}/> }
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
      <UploadInstructions {...{error, instructions, parentheses}}/>
    </Dropzone>
  </div>

export const Uploader = trackComponentAndMode(UploaderPure, 'file_upload', 'error')
