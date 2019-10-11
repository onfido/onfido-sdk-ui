import { h, Component } from 'preact'
import { appendToTracking } from '../../Tracker'
import DocumentAutoCapture from '../Photo/DocumentAutoCapture'
import DocumentLiveCapture from '../Photo/DocumentLiveCapture'
import Uploader from '../Uploader'
import GenericError from '../GenericError'
import PageTitle from '../PageTitle'
import CustomFileInput from '../CustomFileInput'
import withPrivacyStatement from './withPrivacyStatement'
import withCameraDetection from './withCameraDetection'
import withCrossDeviceWhenNoCamera from './withCrossDeviceWhenNoCamera'
import { isDesktop } from '~utils'
import { compose } from '~utils/func'
import { randomId, upperCase } from '~utils/string'
import { getMobileOSName } from '~utils/detectMobileOS'
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
      useLiveDocumentCapture,
      useWebcam,
      hasCamera,
      documentType,
      poaDocumentType,
      isPoA,
      side,
      translate,
      subTitle,
      uploadFallback
    } = this.props
    const copyNamespace = `capture.${isPoA ? poaDocumentType : documentType}.${side}`
    const title = translate(`${copyNamespace}.title`)
    const propsWithErrorHandling = { ...this.props, onError: this.handleError }
    const renderTitle = <PageTitle {...{title, subTitle}} smaller />
    const renderFallback = isDesktop ? this.renderCrossDeviceFallback : this.renderUploadFallback
    const enableLiveDocumentCapture = useLiveDocumentCapture && !isDesktop
    if (hasCamera) {
      if (useWebcam) {
        return (
          <DocumentAutoCapture
            {...propsWithErrorHandling}
            renderTitle={ renderTitle }
            renderFallback={ renderFallback }
            containerClassName={ style.documentContainer }
            onValidCapture={ this.handleCapture }
          />
        )
      }
      if (enableLiveDocumentCapture) {
        return (
          <DocumentLiveCapture
            {...propsWithErrorHandling}
            renderTitle={ renderTitle }
            renderFallback={ renderFallback }
            containerClassName={ style.liveDocumentContainer }
            onCapture={ this.handleCapture }
            isUploadFallbackDisabled={ !uploadFallback }
          />
        )
      }
    }

    if (!hasCamera && !uploadFallback && enableLiveDocumentCapture) {
      return <GenericError error={{ name: `UNSUPPORTED_${upperCase(getMobileOSName())}_BROWSER` }} />
    }

    return (
      <Uploader
        {...propsWithErrorHandling}
        onUpload={ this.handleUpload }
        title={ translate(`${copyNamespace}.upload_title`) || title }
        instructions={ translate(`${copyNamespace}.instructions`) }
      />
    )
  }
}

export default compose(
  appendToTracking,
  localised,
  withPrivacyStatement,
  withCameraDetection,
  withCrossDeviceWhenNoCamera,
)(Document)