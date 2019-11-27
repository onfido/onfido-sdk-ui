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
import PageTitle from '../PageTitle'
import Button from '../Button'
import { getDocumentTypeGroup } from '../DocumentSelector/documentTypes'
import { localised } from '../../locales'

const UploadError = ({ error, translate }) => {
  const { message, instruction } = errors[error.name]
  return <div className={style.error}>{`${translate(message)} ${translate(instruction)}`}</div>
}

const MobileUploadArea = ({ onFileSelected, children, isPoA, translate }) =>
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

const DesktopUploadArea = ({ translate, onFileSelected, error, uploadIcon, changeFlowTo }) =>
  <div className={ style.crossDeviceInstructionsContainer }>
    <i className={ classNames(theme.icon, style.icon, style[uploadIcon]) } />
    <div>
      <Button
        variants={['centered', 'primary']}
        className={ style.crossDeviceButton }
        onClick={() => changeFlowTo('crossDeviceSteps')}
      >
        { translate('capture.switch_device') }
      </Button>
      <CustomFileInput className={ style.desktopUpload } onChange={ onFileSelected }>
        {error && <UploadError { ...{ error, translate } } />}
        <span tabindex="0" role="button" className={ theme.link } data-onfido-qa="uploaderButtonLink">
          { translate('capture.upload_file') }
        </span>
      </CustomFileInput>
    </div>
  </div>

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
      instructions,
      translate
    } = this.props
    const isPoA = !!poaDocumentType
    // Different upload types show different icons
    // return the right icon name for document or face step
    // For document, the upload can be 'identity' or 'proofOfAddress'
    const uploadType = getDocumentTypeGroup(poaDocumentType || documentType) || 'face'
    const { error } = this.state
    return (
      <div className={ classNames(theme.fullHeightContainer, style.container) }>
        <PageTitle
          title={title}
          subTitle={ allowCrossDeviceFlow ? translate('cross_device.switch_device.header') : subTitle } />
        <div className={ classNames(style.uploaderWrapper, { [style.crossDeviceClient]: !allowCrossDeviceFlow }) }>
          {isDesktop ? (
            <DesktopUploadArea
              onFileSelected={ this.handleFileSelected }
              changeFlowTo={ changeFlowTo }
              uploadIcon={ `${camelCase(uploadType)}Icon` }
              error={error}
              translate={translate} />
            ) : (
            <MobileUploadArea
              onFileSelected={ this.handleFileSelected }
              translate={translate}
              { ...{ isPoA } }
            >
              <div className={ style.instructions }>
                <span className={ classNames(theme.icon, style.icon, style[`${camelCase(uploadType)}Icon`]) } />
                { error ?
                  <UploadError { ...{ error, translate } } /> :
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

export default trackComponentAndMode(localised(Uploader), 'file_upload', 'error')
