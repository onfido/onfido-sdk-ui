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
    const { documentType, actions, side, onCapture } = this.props
    actions.createCapture({
      ...payload,
      method: 'document',
      documentType: documentType === 'poa' ? 'unknown' : documentType,
      side,
      id: payload.id || randomId(),
    })
    onCapture()
  }

  handleUpload = blob => this.handleCapture({ blob })

  handleError = () => this.props.actions.deleteCapture()

  renderUploadFallback = text =>
    <CustomFileInput onChange={this.handleUpload} accept="image/*" capture>
      {text}
    </CustomFileInput>

  renderCrossDeviceFallback = text =>
    <span onClick={() => this.props.changeFlowTo('crossDeviceSteps') }>
      {text}
    </span>

  render() {
    const { useWebcam, hasCamera, documentType, side, translate, subTitle } = this.props
    const copyNamespace = `capture.${documentType}.${side}`
    const title = translate(`${copyNamespace}.title`)
    const propsWithErrorHandling = {...this.props, onError: this.handleError }
    const useDocumentAutoCapture = useWebcam && hasCamera

    return useDocumentAutoCapture ?
      <DocumentAutoCapture
        {...propsWithErrorHandling}
        renderTitle={ <PageTitle {...{title, subTitle}} smaller /> }
        renderFallback={ isDesktop ? this.renderCrossDeviceFallback : this.renderUploadFallback }
        containerClassName={style.documentContainer}
        onValidCapture={ this.props.onCapture }
      /> :
      <Uploader
        {...propsWithErrorHandling}
        onUpload={ this.handleUpload }
        title={translate(`${copyNamespace}.upload_title`) || title}
        instructions={translate(`${copyNamespace}.instructions`)}
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
