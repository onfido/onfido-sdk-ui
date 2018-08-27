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

import { getDocumentTypeGroup } from '../DocumentSelector'

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

const UploaderPure = ({
  instructions, title, subTitle, onImageSelected,
  error, changeFlowTo, allowCrossDeviceFlow, i18n, documentType,
}) => {
  const documentTypeGroup = getDocumentTypeGroup(documentType)
  const isPoA = documentTypeGroup === 'proof_of_address'

  return (
    <div className={classNames(theme.fullHeightContainer, style.container)}>
      <Title {...{title, subTitle}}/>
      <div className={classNames(style.uploaderWrapper, {[style.crossDeviceClient]: !allowCrossDeviceFlow})}>
        { allowCrossDeviceFlow && <SwitchDevice {...{changeFlowTo, i18n}}/> }
        <div className={style.uploadArea}>
          <Instructions {...{error, instructions, i18n, documentTypeGroup}} />
          <div className={style.buttons}>
            {
              !isDesktop &&
                <CustomFileInput
                  className={classNames(theme.btn, theme['btn-centered'],
                    theme[`btn-${ isPoA ? 'outline' : 'primary' }`],
                    style.button
                  )}
                  onFileSelected={onImageSelected}
                  accept="image/*"
                  capture
                >
                { i18n.t('capture.take_photo') }
                </CustomFileInput>
            }
            {
              (isDesktop || isPoA) &&
                <CustomFileInput
                  onFileSelected={onImageSelected}
                  className={classNames(theme.btn, theme['btn-centered'],
                    theme[`btn-${ isDesktop ? 'outline' : 'primary' }`],
                    style.button
                  )}
                >
                  { i18n.t(`capture.upload_${isDesktop ? 'file' : 'document'}`) }
                </CustomFileInput>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export const Uploader = trackComponentAndMode(UploaderPure, 'file_upload', 'error')
