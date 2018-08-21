import { h } from 'preact'
import CustomFileInput from './CustomFileInput'
import classNames from 'classnames'
import theme from '../Theme/style.css'
import style from './style.css'
import { isDesktop } from '../utils'
import {errors} from '../strings/errors'
import { trackComponentAndMode } from '../../Tracker'
import SwitchDevice from '../crossDevice/SwitchDevice'
import Title from '../Title'

import { getDocumentTypeGroup } from '../DocumentSelector'

const UploadError = ({error, i18n}) => {
  const errorList = errors(i18n)
  const errorObj = errorList[error.name]
  return <div className={style.error}>{`${errorObj.message}. ${errorObj.instruction}.`}</div>
}

const Instructions = ({error, instructions, parentheses, i18n, documentType }) =>
  <div>
    {getDocumentTypeGroup(documentType)}
    <span className={classNames(theme.icon, style[`${ getDocumentTypeGroup(documentType) }Icon`])} />
    {
      error ?
        <UploadError {...{error, i18n}} /> :
        <div className={style.text}>
          <div>{instructions}</div>
          { isDesktop && <div>{parentheses}</div> }
        </div>
    }
  </div>

const UploaderPure = ({instructions, parentheses, title, subTitle, onImageSelected, error, changeFlowTo, allowCrossDeviceFlow, i18n, documentType}) =>
  <div>
    <Title {...{title, subTitle}}/>
    <div className={classNames(style.uploaderWrapper, {[style.crossDeviceClient]: !allowCrossDeviceFlow})}>
      { allowCrossDeviceFlow && <SwitchDevice {...{changeFlowTo, i18n}}/> }
      <CustomFileInput
        className={style.dropzone}
        onFileSelected={onImageSelected}
      >
        <Instructions {...{error, instructions, parentheses, i18n, documentType}}/>
      </CustomFileInput>
    </div>
  </div>

export const Uploader = trackComponentAndMode(UploaderPure, 'file_upload', 'error')
