import { h, Component } from 'preact'
import { appendToTracking } from '../../Tracker'
import DocumentAutoCapture from '../Photo/DocumentAutoCapture'
import DocumentLiveCapture from '../Photo/DocumentLiveCapture'
import Uploader from '../Uploader'
import PageTitle from '../PageTitle'
import CustomFileInput from '../CustomFileInput'
import withCrossDeviceWhenNoCamera from './withCrossDeviceWhenNoCamera'
import { getDocumentTypeGroup } from '../DocumentSelector/documentTypes'
import { isDesktop, isHybrid, addDeviceRelatedProperties } from '~utils'
import { compose } from '~utils/func'
import { validateFileTypeAndSize, resizeImageFile } from '~utils/file'
import { DOCUMENT_CAPTURE_LOCALES_MAPPING } from '~utils/localesMapping'
import { randomId } from '~utils/string'
import { localised } from '../../locales'
import FallbackButton from '../Button/FallbackButton'
import style from './style.scss'

class Document extends Component {
  static defaultProps = {
    side: 'front',
    forceCrossDevice: false,
  }

  handleCapture = (payload) => {
    const {
      isPoA,
      documentType,
      poaDocumentType,
      actions,
      side,
      nextStep,
      mobileFlow,
    } = this.props
    const documentCaptureData = {
      ...payload,
      sdkMetadata: addDeviceRelatedProperties(payload.sdkMetadata, mobileFlow),
      method: 'document',
      documentType: isPoA ? poaDocumentType : documentType,
      side,
      id: payload.id || randomId(),
    }
    actions.createCapture(documentCaptureData)

    nextStep()
  }

  handleUpload = (blob, isResizedImage = false) => {
    this.handleCapture({
      blob,
      sdkMetadata: { captureMethod: 'html5', isResizedImage },
    })
  }

  handleError = () => this.props.actions.deleteCapture()

  handleFileSelected = (file) => {
    let isResizedImage = false
    const error = validateFileTypeAndSize(file)
    if (error === 'INVALID_SIZE' && file.type.match(/image.*/)) {
      // Resize image to 720p (1280×720 px) if captured with native camera app on mobile
      isResizedImage = true
      resizeImageFile(file, (blob) => this.handleUpload(blob, isResizedImage))
    } else {
      this.handleUpload(file, isResizedImage)
    }
  }

  renderUploadFallback = (text) => (
    <CustomFileInput
      className={style.uploadFallback}
      onChange={this.handleFileSelected}
      accept="image/*"
      capture
    >
      {text}
    </CustomFileInput>
  )

  renderCrossDeviceFallback = (text) => (
    <FallbackButton
      text={text}
      onClick={() => this.props.changeFlowTo('crossDeviceSteps')}
    />
  )

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
    } = this.props

    const title = translate(
      DOCUMENT_CAPTURE_LOCALES_MAPPING[isPoA ? poaDocumentType : documentType][
        side
      ].title
    )
    const propsWithErrorHandling = { ...this.props, onError: this.handleError }
    const renderTitle = <PageTitle {...{ title, subTitle }} smaller />
    const renderFallback = isDesktop
      ? this.renderCrossDeviceFallback
      : this.renderUploadFallback
    const enableLiveDocumentCapture =
      useLiveDocumentCapture && (!isDesktop || isHybrid)

    if (hasCamera && useWebcam) {
      return (
        <DocumentAutoCapture
          {...propsWithErrorHandling}
          renderTitle={renderTitle}
          renderFallback={renderFallback}
          containerClassName={style.documentContainer}
          onValidCapture={this.handleCapture}
        />
      )
    }

    if (hasCamera && enableLiveDocumentCapture) {
      return (
        <DocumentLiveCapture
          {...propsWithErrorHandling}
          renderTitle={renderTitle}
          renderFallback={renderFallback}
          containerClassName={style.liveDocumentContainer}
          onCapture={this.handleCapture}
          isUploadFallbackDisabled={!uploadFallback}
        />
      )
    }

    // Different upload types show different icons
    // return the right icon name for document
    // For document, the upload can be 'identity' or 'proof_of_address'
    const uploadType = getDocumentTypeGroup(poaDocumentType || documentType)
    const instructions = translate(
      DOCUMENT_CAPTURE_LOCALES_MAPPING[isPoA ? poaDocumentType : documentType][
        side
      ].body
    )

    return (
      <Uploader
        {...propsWithErrorHandling}
        uploadType={uploadType}
        onUpload={this.handleUpload}
        title={title}
        instructions={instructions}
      />
    )
  }
}

export default compose(
  appendToTracking,
  localised,
  withCrossDeviceWhenNoCamera
)(Document)
