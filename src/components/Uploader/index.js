import { h } from 'preact'
import Dropzone from 'react-dropzone'
import theme from '../Theme/style.css'
import style from './style.css'
import {errors} from '../strings/errors'
import { trackComponentAndMode } from '../../Tracker'
import SwitchDevice from '../crossDevice/SwitchDevice'
import { mobileCopy, desktopCopy } from '../strings/uploadCopy'

const instructionsCopy = (method, side, allowCrossDeviceFlow) => {
  const instructions = allowCrossDeviceFlow ? desktopCopy.instructions : mobileCopy.instructions
  return method === 'document' ? instructions[method][side] : instructions[method]
}

const UploadInstructions = ({error, method, side, allowCrossDeviceFlow}) =>
  <div className={style.base}>
    <span className={`${theme.icon} ${style.icon}`}></span>
    <p className={style.text}>{instructionsCopy(method, side, allowCrossDeviceFlow)}</p>
    <UploadError error={errors[error.name]} />
  </div>


const UploadError = ({error}) =>
  error && <div className={`${style.text} ${style.error}`}>{`${error.message}. ${error.instruction}.`}</div>

const UploaderPure = ({method, side, onImageSelected, error, changeFlowTo, allowCrossDeviceFlow}) =>
  <div>
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
      {<UploadInstructions {...{error, method, side, allowCrossDeviceFlow}}/> }
    </Dropzone>
  </div>

export const Uploader = trackComponentAndMode(UploaderPure, 'file_upload', 'error')
