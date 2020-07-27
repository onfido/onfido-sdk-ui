import { h, Component } from 'preact'
import { appendToTracking } from '../../Tracker'
import DocumentAutoCapture from '../Photo/DocumentAutoCapture'
import DocumentLiveCapture from '../Photo/DocumentLiveCapture'
import Uploader from '../Uploader'
import GenericError from '../GenericError'
import PageTitle from '../PageTitle'
import CustomFileInput from '../CustomFileInput'
import withCameraDetection from './withCameraDetection'
import withCrossDeviceWhenNoCamera from './withCrossDeviceWhenNoCamera'
import withHybridDetection from './withHybridDetection'
import { getDocumentTypeGroup } from '../DocumentSelector/documentTypes'
import { isDesktop, addDeviceRelatedProperties, getUnsupportedMobileBrowserError } from '~utils'
import { compose } from '~utils/func'
import { randomId } from '~utils/string'
import { localised } from '../../locales'
import FallbackButton from '../Button/FallbackButton'
import style from './style.scss'

class Document extends Component {
  static defaultProps = {
    side: 'front',
    forceCrossDevice: false
  }

  handleCapture = payload => {
    const {
      isPoA,
      documentType,
      poaDocumentType,
      actions,
      side,
      nextStep,
      mobileFlow
    } = this.props
    const documentCaptureData = {
      ...payload,
      sdkMetadata: addDeviceRelatedProperties(payload.sdkMetadata, mobileFlow),
      method: 'document',
      documentType: isPoA ? poaDocumentType : documentType,
      side,
      id: payload.id || randomId()
    }
    actions.createCapture(documentCaptureData)

    nextStep()
  }

  handleUpload = blob => this.handleCapture({ blob, sdkMetadata: { captureMethod: 'html5' } })

  handleError = () => this.props.actions.deleteCapture()

  renderUploadFallback = text =>
    <CustomFileInput className={style.uploadFallback} onChange={this.handleUpload} accept="image/*" capture>
      {text}
    </CustomFileInput>

  renderCrossDeviceFallback = text =>
    <FallbackButton text={text} onClick={ () => this.props.changeFlowTo('crossDeviceSteps') }/>

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
      uploadFallback,
      isHybrid,
    } = this.props
    const copyNamespace = `capture.${isPoA ? poaDocumentType : documentType}.${side}`
    const title = translate(`${copyNamespace}.title`)
    const propsWithErrorHandling = { ...this.props, onError: this.handleError }
    const renderTitle = <PageTitle {...{title, subTitle}} smaller />
    const renderFallback = isDesktop ? this.renderCrossDeviceFallback : this.renderUploadFallback
    const enableLiveDocumentCapture = useLiveDocumentCapture && (!isDesktop || isHybrid)
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
      return <GenericError error={{ name: getUnsupportedMobileBrowserError() }} />
    }

    // Different upload types show different icons
    // return the right icon name for document
    // For document, the upload can be 'identity' or 'proof_of_address'
    const uploadType = getDocumentTypeGroup(poaDocumentType || documentType)
    return (
      <Uploader
        {...propsWithErrorHandling}
        uploadType={ uploadType }
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
  withCameraDetection,
  withCrossDeviceWhenNoCamera,
  withHybridDetection,
)(Document)
