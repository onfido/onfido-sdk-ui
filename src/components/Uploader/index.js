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
import SwitchDevice from '../crossDevice/SwitchDevice'
import PageTitle from '../PageTitle'
import Button from '../Button'
import { getDocumentTypeGroup } from '../DocumentSelector/documentTypes'
import { localised } from '../../locales'

const UploadError = localised(({error, translate}) => {
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
          variants={['centered', isPoA ? 'outline' : 'primary']}
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

const DesktopUploadArea = localised(({ onFileSelected, translate, children }) =>
  <CustomFileInput
    className={classNames(style.uploadArea, style.uploadAreaDesktop)}
    onChange={onFileSelected}
  >
    { children }
    <div className={style.buttons}>
      <Button variants={['centered', 'outline']} className={style.button}>
        {translate(`capture.upload_${isDesktop ? 'file' : 'document'}`)}
      </Button>
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
    const documentTypeGroup = getDocumentTypeGroup(poaDocumentType || documentType)
    const UploadArea = isDesktop ? DesktopUploadArea : MobileUploadArea
    const { error } = this.state

    return (
      <div className={ classNames(theme.fullHeightContainer, style.container) }>
        <PageTitle { ...{title, subTitle}}/>
        <div className={ classNames(style.uploaderWrapper, { [style.crossDeviceClient]: !allowCrossDeviceFlow }) }>
          { allowCrossDeviceFlow && <SwitchDevice { ...{ changeFlowTo } }/> }
          <UploadArea
            onFileSelected={ this.handleFileSelected }
            { ...{ isPoA } }
          >
            <div className={ style.instructions }>
              <span className={ classNames(theme.icon, style.icon, style[`${ camelCase(documentTypeGroup) }Icon`]) } />
              { error ?
                <UploadError { ...{ error } } /> :
                <div className={ style.instructionsCopy }>{ instructions }</div>
              }
            </div>
          </UploadArea>
        </div>
      </div>
    )
  }
}

export default trackComponentAndMode(Uploader, 'file_upload', 'error')
