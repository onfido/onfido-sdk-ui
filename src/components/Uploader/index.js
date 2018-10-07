import { h, Component } from 'preact'
import classNames from 'classnames'
import theme from '../Theme/style.css'
import style from './style.css'
import { isDesktop } from '../utils'
import { camelCase } from 'utils/string'
import errors from '../strings/errors'
import { trackComponentAndMode } from '../../Tracker'
import CustomFileInput from '../CustomFileInput'
import SwitchDevice from '../crossDevice/SwitchDevice'
import Title from '../Title'
import { find } from '../utils/object'
import { fileToLossyBase64Image, isOfFileType } from '../utils/file.js'
import { getDocumentTypeGroup } from '../DocumentSelector/documentTypes'
import { localised } from '../../locales'

const UploadError = localised(({error, translate}) => {
  const { message, instruction } = errors[error.name]
  return <div className={style.error}>{`${translate(message)}. ${translate(instruction)}.`}</div>
})

const MobileUploadArea = localised(({ onFileSelected, children, isPoA, translate }) =>
  <div className={classNames(style.uploadArea, style.uploadAreaMobile)}>
    { children }
    <div className={style.buttons}>
      <CustomFileInput
        className={classNames(theme.btn, theme['btn-centered'],
          theme[`btn-${ isPoA ? 'outline' : 'primary' }`],
          style.button
        )}
        onChange={onFileSelected}
        accept="image/*"
        capture
      >
      { translate('capture.take_photo') }
      </CustomFileInput>
      {
        isPoA &&
          <CustomFileInput
            onChange={onFileSelected}
            className={classNames(theme.btn, theme['btn-centered'], theme['btn-primary'], style.button)}
          >
            { translate(`capture.upload_${isDesktop ? 'file' : 'document'}`) }
          </CustomFileInput>
      }
    </div>
  </div>
)

const DesktopUploadArea = localised(({ onFileSelected, translate, children }) =>
  <CustomFileInput
    className={classNames(style.uploadArea, style.uploadAreaDesktop)}
    onChange={onFileSelected}
  >
    { children }
    <div className={style.buttons}>
      <span className={classNames(theme.btn, theme['btn-centered'], theme['btn-outline'], style.button)}>
      { translate(`capture.upload_${isDesktop ? 'file' : 'document'}`) }
      </span>
    </div>
  </CustomFileInput>
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
    return find({
      'INVALID_TYPE': file => !isOfFileType(acceptedTypes, file),
      'INVALID_SIZE': file => file.size > maxSize,
    }, checkFn => checkFn(file))
  }

  handleFileSelected = (file) => {
    const error = this.findError(file)

    return error ?
      this.setError(error) :
      fileToLossyBase64Image(file, () => this.props.onUpload(file), () => this.setError('INVALID_CAPTURE'))
  }

  render() {

    const { title, subTitle, changeFlowTo, allowCrossDeviceFlow, documentType, instructions } = this.props
    const documentTypeGroup = getDocumentTypeGroup(documentType)
    const isPoA = documentTypeGroup === 'proof_of_address'
    const UploadArea = isDesktop ? DesktopUploadArea : MobileUploadArea
    const { error } = this.state

    return (
      <div className={classNames(theme.fullHeightContainer, style.container)}>
        <Title {...{title, subTitle}}/>
        <div className={classNames(style.uploaderWrapper, {[style.crossDeviceClient]: !allowCrossDeviceFlow})}>
          { allowCrossDeviceFlow && <SwitchDevice {...{changeFlowTo}}/> }
          <UploadArea
            onFileSelected={ this.handleFileSelected }
            {...{isPoA}}
          >
            <div className={style.instructions}>
              <span className={classNames(theme.icon, style.icon, style[`${ camelCase(documentTypeGroup) }Icon`])} />
              { error ?
                <UploadError {...{error}} /> :
                <div className={style.instructionsCopy}>{instructions}</div>
              }
            </div>
          </UploadArea>
        </div>
      </div>
    )
  }
}

export default trackComponentAndMode(Uploader, 'file_upload', 'error')
