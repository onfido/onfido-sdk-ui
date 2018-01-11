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

const UploadInstructions = ({error, instructions, parentheses, i18n}) =>
  <div>
    <span className={`${theme.icon} ${instructionsIcon()}`}></span>
    { error ? <UploadError {...{error, i18n}} /> :
      <Instructions {...{instructions, parentheses}} />
    }
  </div>

const Instructions = ({instructions, parentheses}) =>
  <div className={style.text}>
    <div>{instructions}</div>
    { parentheses && <div>{parentheses}</div> }
  </div>

const UploadError = ({error, i18n}) => {
  const errorList = errors(i18n)
  const errorObj = errorList[error.name]
  return <div className={style.error}>{`${errorObj.message}. ${errorObj.instruction}.`}</div>
}

const UploaderPure = ({instructions, parentheses, onImageSelected, error, changeFlowTo, allowCrossDeviceFlow, i18n}) =>
  <div className={classNames(style.uploaderWrapper, {[style.crossDeviceClient]: !allowCrossDeviceFlow})}>
    { allowCrossDeviceFlow && <SwitchDevice {...{changeFlowTo, i18n}}/> }
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
      <UploadInstructions {...{error, instructions, parentheses, i18n}}/>
    </Dropzone>
  </div>

export const Uploader = trackComponentAndMode(UploaderPure, 'file_upload', 'error')
