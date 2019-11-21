import { h, Component } from 'preact'
import classNames from 'classnames'
import { isDesktop } from '~utils'
import { camelCase } from '~utils/string'
import { findKey } from '~utils/object'
import { isOfMimeType } from '~utils/blob.js'
import theme from '../Theme/style.css'
import style from './style.css'
import errors from '../strings/errors'
import { trackComponentAndMode } from '../../Tracker'
import CustomFileInput from '../CustomFileInput'
// import SwitchDevice from '../crossDevice/SwitchDevice'
import PageTitle from '../PageTitle'
import Button from '../Button'
import { getDocumentTypeGroup } from '../DocumentSelector/documentTypes'
import { localised } from '../../locales'
import { preventDefaultOnClick } from '~utils/index'

const UploadError = localised(({ error, translate }) => {
  const { message, instruction } = errors[error.name]
  return <div className={style.error}>{`${translate(message)} ${translate(instruction)}`}</div>
})

const MobileUploadArea = localised(({ onFileSelected, children, isPoA, translate }) =>
  <div className={classNames(style.uploadArea, style.uploadAreaMobile)}>
    { children }
    <div className={style.buttons}>
      <CustomFileInput
        className={style.buttonContainer}
        onChange={onFileSelected}
        accept="image/*"
        capture
      >
        <Button
          variants={['centered', isPoA ? 'secondary' : 'primary']}
          className={style.button}
        >
          {translate('capture.take_photo')}
        </Button>
      </CustomFileInput>
      {
        isPoA &&
          <CustomFileInput onChange={onFileSelected} className={style.buttonContainer}>
            <Button
              variants={['centered', 'primary']}
              className={style.button}
            >
              {translate(`capture.upload_${isDesktop ? 'file' : 'document'}`)}
            </Button>
          </CustomFileInput>
      }
    </div>
  </div>
)

const DesktopUploadArea = localised(({ translate, onFileSelected, error, uploadIcon, changeFlowTo }) =>
  <div className={ style.instructions }>
    <div>
      {/*<div className={style.header}>{translate('cross_device.switch_device.header')}</div>*/}
      <p className={style.submessage}>{translate('cross_device.switch_device.submessage')}</p>
      <i className={ classNames(theme.icon, style.icon, style[uploadIcon]) } />
      <Button
        variants={['centered', 'primary']}
        onClick={() => changeFlowTo('crossDeviceSteps')}
      >
        {translate(`cross_device.switch_device`)}
        Continue on phone
      </Button>
    </div>
    <CustomFileInput className={classNames(style.desktopUploadLink)} onChange={onFileSelected}>
      {error && <UploadError { ...{ error } } />}
      <div className={style.buttons}>
        <span tabindex="0" role="button" className={style.uploadLink} onClick={preventDefaultOnClick()}>
          or upload photo - no scans or photocopies
        </span>
      </div>
    </CustomFileInput>
  </div>
)

class Uploader extends Component {
  static defaultProps = {
    onUpload: () => {},
    acceptedTypes: ['jpg', 'jpeg', 'png', 'pdf'],
    maxSize: 10000000, // The Onfido API only accepts files below 10 MB
  }

  setError = (name) => this.setState({ error: {name}})

  findError = (file) => {
    const { acceptedTypes, maxSize } = this.props
    return findKey({
      'INVALID_TYPE': file => !isOfMimeType(acceptedTypes, file),
      'INVALID_SIZE': file => file.size > maxSize,
    }, checkFn => checkFn(file))
  }

  handleFileSelected = (file) => {
    const error = this.findError(file)
    return error ? this.setError(error) : this.props.onUpload(file)
  }

  render() {
    const {
      title,
      subTitle,
      changeFlowTo,
      allowCrossDeviceFlow,
      documentType,
      poaDocumentType,
      instructions
    } = this.props
    const isPoA = !!poaDocumentType
    // Different upload types show different icons
    // return the right icon name for document or face step
    // For document, the upload can be 'identity' or 'proofOfAddress'
    const uploadType = getDocumentTypeGroup(poaDocumentType || documentType) || 'face'
    const { error } = this.state
    return (
      <div className={ classNames(theme.fullHeightContainer, style.container) }>
        <PageTitle { ...{title, subTitle}}/>
        <div className={ classNames(style.uploaderWrapper, { [style.crossDeviceClient]: !allowCrossDeviceFlow }) }>
          {/* allowCrossDeviceFlow && <SwitchDevice { ...{ changeFlowTo } }/> */}
          {isDesktop ? (
            <DesktopUploadArea
              onFileSelected={ this.handleFileSelected }
              changeFlowTo={ changeFlowTo }
              uploadIcon={ `${camelCase(uploadType)}Icon` }
              error={error} />
            ) : (
            <MobileUploadArea
              onFileSelected={ this.handleFileSelected }
              { ...{ isPoA } }
            >
              <div className={ style.instructions }>
                <span className={ classNames(theme.icon, style.icon, style[`${camelCase(uploadType)}Icon`]) } />
                { error ?
                  <UploadError { ...{ error } } /> :
                  <div className={ style.instructionsCopy }>{ instructions }</div>
                }
              </div>
            </MobileUploadArea>
            )}
        </div>
      </div>
    )
  }
}

export default trackComponentAndMode(Uploader, 'file_upload', 'error')
