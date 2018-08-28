import { h } from 'preact'
import Dropzone from 'react-dropzone'
import classNames from 'classnames'
import theme from '../Theme/style.css'
import style from './style.css'
import { isDesktop } from '../utils'
import {errors} from '../strings/errors'
import {localised} from '../../locales'
import { trackComponentAndMode } from '../../Tracker'
import SwitchDevice from '../crossDevice/SwitchDevice'
import Title from '../Title'

const instructionsIcon = () =>
  isDesktop ? style.uploadIcon : style.cameraIcon

const UploadInstructions = ({error, instructions, parentheses}) =>
  <div>
    <span className={`${theme.icon} ${instructionsIcon()}`}></span>
    { error ? <UploadError {...{error}} /> :
      <Instructions {...{instructions, parentheses}} />
    }
  </div>

const Instructions = ({instructions, parentheses}) =>
  <div className={style.text}>
    <div>{instructions}</div>
    { isDesktop && <div>{parentheses}</div> }
  </div>

const UploadError = localised(({error, t}) => {
  const errorList = errors(t)
  const errorObj = errorList[error.name]
  return <div className={style.error}>{`${errorObj.message}. ${errorObj.instruction}.`}</div>
})

const UploaderPure = ({instructions, parentheses, title, subTitle, onImageSelected, error, changeFlowTo, allowCrossDeviceFlow}) =>
  <div>
    <Title {...{title, subTitle}}/>
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
  </div>

export const Uploader = trackComponentAndMode(UploaderPure, 'file_upload', 'error')
