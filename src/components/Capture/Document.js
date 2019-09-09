import { h, Component } from 'preact'
import { appendToTracking } from '../../Tracker'
import DocumentAutoCapture from '../Photo/DocumentAutoCapture'
import Uploader from '../Uploader'
import PageTitle from '../PageTitle'
import withPrivacyStatement from './withPrivacyStatement'
import withCameraDetection from './withCameraDetection'
import withCrossDeviceWhenNoCamera from './withCrossDeviceWhenNoCamera'
import { isDesktop } from '~utils'
import { compose } from '~utils/func'
import { randomId } from '~utils/string'
import CustomFileInput from '../CustomFileInput'
import { localised } from '../../locales'
import style from './style.css'

class Document extends Component {
  static defaultProps = {
    side: 'front',
    forceCrossDevice: false
  }

  handleCapture = payload => {
    const { isPoA, documentType, poaDocumentType, actions, side, nextStep } = this.props
    actions.createCapture({
      ...payload,
      method: 'document',
      documentType: isPoA ? poaDocumentType : documentType,
      side,
      id: payload.id || randomId(),
    })

    nextStep()
  }

  handleUpload = blob => this.handleCapture({ blob })

  handleError = () => this.props.actions.deleteCapture()

  renderUploadFallback = text =>
    <CustomFileInput onChange={this.handleUpload} accept="image/*" capture>
      {text}
    </CustomFileInput>

  renderCrossDeviceFallback = text =>
    <span onClick={ () => this.props.changeFlowTo('crossDeviceSteps') }>
      {text}
    </span>

  render() {
    const {
      useWebcam,
      hasCamera,
      documentType,
      poaDocumentType,
      isPoA,
      side,
      translate,
      subTitle
    } = this.props
    const copyNamespace = `capture.${isPoA ? poaDocumentType : documentType}.${side}`
    const title = translate(`${copyNamespace}.title`)
    const moreProps = { ...this.props, onError: this.handleError }

    return useWebcam && hasCamera ?
      <DocumentAutoCapture
        { ...moreProps }
        renderTitle={ <PageTitle { ...{ title, subTitle } } smaller /> }
        renderFallback={ isDesktop ? this.renderCrossDeviceFallback : this.renderUploadFallback }
        containerClassName={ style.documentContainer }
        onValidCapture={ this.handleCapture }
      /> :
      <Uploader
        { ...moreProps }
        onUpload={ this.handleUpload }
        title={ translate(`${copyNamespace}.upload_title`) || title }
        instructions={ translate(`${copyNamespace}.instructions`) }
      />
  }
}

export default compose(
  appendToTracking,
  localised,
  withPrivacyStatement,
  withCameraDetection,
  withCrossDeviceWhenNoCamera,
)(Document)
