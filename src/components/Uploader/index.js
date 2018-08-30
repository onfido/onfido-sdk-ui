import { h } from 'preact'
import Dropzone from 'react-dropzone'
import classNames from 'classnames'
import theme from '../Theme/style.css'
import style from './style.css'
import { isDesktop } from '../utils'
import {errors} from '../strings/errors'
import { trackComponentAndMode } from '../../Tracker'
import SwitchDevice from '../crossDevice/SwitchDevice'
import Title from '../Title'
import { find } from '../utils/object'
import { identity, constant } from '../utils/func'

const UploadInstructions = ({children, instructions, parentheses }) =>
  <div>
    <span className={`${theme.icon} ${style[isDesktop ? 'uploadIcon' : 'cameraIcon']}`}></span>
    {children}
    <div className={style.text}>
      <div>{instructions}</div>
      { isDesktop && <div>{parentheses}</div> }
    </div>
  </div>  

const UploadError = ({error, i18n}) => {
  const errorList = errors(i18n)
  const errorObj = errorList[error.name]
  return <div className={style.error}>{`${errorObj.message}. ${errorObj.instruction}.`}</div>
}

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
    const { i18n, subTitle, changeFlowTo, allowCrossDeviceFlow } = this.props
    const { error } = this.state

    return (
      <div>
        <Title {...{title, subTitle}}/>
        <div className={classNames(style.uploaderWrapper, {[style.crossDeviceClient]: !allowCrossDeviceFlow})}>
          { allowCrossDeviceFlow && <SwitchDevice {...{changeFlowTo, i18n}}/> }
          <Dropzone
            onDrop={([ file ])=> {
              //removes a memory leak created by react-dropzone
              URL.revokeObjectURL(file.preview)
              delete file.preview
              this.handleFileSelected(file)
            }}
            multiple={false}
            className={style.dropzone}
          >
            <UploadInstructions {...{instructions, parentheses}}>
            { error && <UploadError {...{error, i18n}} /> }
            </UploadInstructions>
          </Dropzone>
        </div>
      </div>
    )
  }
}

export default trackComponentAndMode(UploaderPure, 'file_upload', 'error')
