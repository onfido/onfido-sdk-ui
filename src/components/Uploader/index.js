import { h } from 'preact'
import classNames from 'classnames'
import theme from '../Theme/style.css'
import style from './style.css'
import { isDesktop } from '../utils'
import { camelCase } from '../utils/string'
import {errors} from '../strings/errors'
import { trackComponentAndMode } from '../../Tracker'
import CustomFileInput from '../CustomFileInput'
import SwitchDevice from '../crossDevice/SwitchDevice'
import Title from '../Title'

import { getDocumentTypeGroup } from '../DocumentSelector/documentTypes'

const UploadError = ({error, i18n}) => {
  const errorList = errors(i18n)
  const errorObj = errorList[error.name]
  return <div className={style.error}>{`${errorObj.message}. ${errorObj.instruction}.`}</div>
}

const Instructions = ({error, instructions, i18n, documentTypeGroup }) =>
  <div className={style.instructions}>
    <span className={classNames(theme.icon, style.icon, style[`${ camelCase(documentTypeGroup) }Icon`])} />
    {
      error ?
        <UploadError {...{error, i18n}} /> :
        <div className={style.instructionsCopy}>{instructions}</div>
    }
  </div>

const MobileUploadArea = ({ onImageSelected, children, isPoA, i18n }) => (
  <div className={classNames(style.uploadArea, style.uploadAreaMobile)}>
    { children }
    <div className={style.buttons}>
      <CustomFileInput
        className={classNames(theme.btn, theme['btn-centered'],
          theme[`btn-${ isPoA ? 'outline' : 'primary' }`],
          style.button
        )}
        onChange={onImageSelected}
        accept="image/*"
        capture
      >
      { i18n.t('capture.take_photo') }
      </CustomFileInput>
      {
        isPoA &&
          <CustomFileInput
            onChange={onImageSelected}
            className={classNames(theme.btn, theme['btn-centered'], theme['btn-primary'], style.button)}
          >
            { i18n.t(`capture.upload_${isDesktop ? 'file' : 'document'}`) }
          </CustomFileInput>
      }
    </div>
  </div>
)

const DesktopUploadArea = ({ onImageSelected, i18n, children }) => (
  <CustomFileInput
    className={classNames(style.uploadArea, style.uploadAreaDesktop)}
    onChange={onImageSelected}
  >
    { children }
    <div className={style.buttons}>
      <span className={classNames(theme.btn, theme['btn-centered'], theme['btn-outline'], style.button)}>
      { i18n.t(`capture.upload_${isDesktop ? 'file' : 'document'}`) }
      </span>
    </div>
  </CustomFileInput>
)

const UploaderPure = ({
  instructions, title, subTitle, error, onImageSelected, documentType,
  changeFlowTo, allowCrossDeviceFlow, i18n,
}) => {
  const documentTypeGroup = getDocumentTypeGroup(documentType)
  const isPoA = documentTypeGroup === 'proof_of_address'
  const UploadArea = isDesktop ? DesktopUploadArea : MobileUploadArea
  return (
    <div className={classNames(theme.fullHeightContainer, style.container)}>
      <Title {...{title, subTitle}}/>
      <div className={classNames(style.uploaderWrapper, {[style.crossDeviceClient]: !allowCrossDeviceFlow})}>
        { allowCrossDeviceFlow && <SwitchDevice {...{changeFlowTo, i18n}}/> }
        <UploadArea {...{onImageSelected, i18n, isPoA }}>
          <Instructions {...{error, instructions, i18n, documentTypeGroup}} />
        </UploadArea>
      </div>
    </div>
  )
}

export const Uploader = trackComponentAndMode(UploaderPure, 'file_upload', 'error')
