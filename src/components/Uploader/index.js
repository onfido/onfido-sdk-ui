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
import { find } from '../utils/object'
import { identity, constant } from '../utils/func'

import { getDocumentTypeGroup } from '../DocumentSelector'

const UploadError = ({error, i18n}) => {
  const errorList = errors(i18n)
  const errorObj = errorList[error.name]
  return <div className={style.error}>{`${errorObj.message}. ${errorObj.instruction}.`}</div>
}

const Instructions = ({children, instructions, i18n, documentTypeGroup }) =>
  <div className={style.instructions}>
    <span className={classNames(theme.icon, style.icon, style[`${ camelCase(documentTypeGroup) }Icon`])} />
    {children}
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

class Uploader extends Component {
  static defaultProps = {
    acceptedTypes: ['jpg', 'jpeg', 'png', 'pdf'],
    maxSize: 10000000, // The Onfido API only accepts files below 10 MB
  }

  setError(name) {
    this.setState({ error: {name}})
  }

  findError(file) {
    const { acceptedTypes, maxSize } = this.props
    return find({
      'INVALID_SIZE': file => isOfFileType(acceptedTypes, file),
      'INVALID_TYPE': file => file.size > maxSize,
    })
  }

  fileToBlobAndBase64(file, callback) {
    const asBase64 = callback =>
      fileToBase64(file, base64 => callback(file, base64), () => this.setError('INVALID_CAPTURE')));

    const asLossyBase64 = callback => 
      fileToLossyBase64Image(file, base64 => callback(file, base64), () => asBase64(callback))

    // avoid rendering pdfs, due to inconsistencies between different browsers
    return isOfFileType(['pdf'], file) ? asBase64 : asLossyBase64
  }

  handleFileSelected(file) {
    const error = this.findError(file)
    return error ?
      this.setError(error) :
      this.fileToBlobAndBase64(file, this.props.onUpload)
  }

  render() {

    const { i18n, title, subTitle, changeFlowTo, allowCrossDeviceFlow, documentType } = this.props
    const documentTypeGroup = getDocumentTypeGroup(documentType)
    const isPoA = documentTypeGroup === 'proof_of_address'
    const UploadArea = isDesktop ? DesktopUploadArea : MobileUploadArea
    const { error } = this.state

    return (
      <div className={classNames(theme.fullHeightContainer, style.container)}>
        <Title {...{title, subTitle}}/>
        <div className={classNames(style.uploaderWrapper, {[style.crossDeviceClient]: !allowCrossDeviceFlow})}>
          { allowCrossDeviceFlow && <SwitchDevice {...{changeFlowTo, i18n}}/> }
          <UploadArea {...{onImageSelected, i18n, isPoA }}>
            <Instructions {...{instructions, parentheses}}>
              { error && <UploadError {...{error, i18n}} /> }
            </Instructions>
          </UploadArea>
        </div>
      </div>
    )
  }
}

export default trackComponentAndMode(Uploader, 'file_upload', 'error')
