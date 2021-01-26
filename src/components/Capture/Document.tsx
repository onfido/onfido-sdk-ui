import { h, Component } from 'preact'

import { isDesktop, isHybrid, addDeviceRelatedProperties } from '~utils'
import { validateFile } from '~utils/file'
import { DOCUMENT_CAPTURE_LOCALES_MAPPING } from '~utils/localesMapping'
import { randomId } from '~utils/string'

import { appendToTracking } from '../../Tracker'
import { localised } from '../../locales'
import DocumentVideo from '../DocumentVideo'
import DocumentAutoCapture from '../Photo/DocumentAutoCapture'
import DocumentLiveCapture from '../Photo/DocumentLiveCapture'
import Uploader from '../Uploader'
import PageTitle from '../PageTitle'
import CustomFileInput from '../CustomFileInput'
import { getDocumentTypeGroup } from '../DocumentSelector/documentTypes'
import FallbackButton from '../Button/FallbackButton'

import withCrossDeviceWhenNoCamera from './withCrossDeviceWhenNoCamera'
import style from './style.scss'

import type { ImageResizeInfo } from '~types/commons'
import type { WithLocalisedProps, WithOptionsProps } from '~types/hocs'
import type { DocumentCapture } from '~types/redux'
import type {
  HandleCaptureProp,
  HandleDocVideoCaptureProp,
  StepComponentDocumentProps,
} from '~types/routers'

type Props = StepComponentDocumentProps & WithLocalisedProps & WithOptionsProps

class Document extends Component<Props> {
  static defaultProps = {
    forceCrossDevice: false,
  }

  handleCapture: HandleCaptureProp = (payload) => {
    const {
      actions,
      documentType,
      isPoA,
      mobileFlow,
      nextStep,
      poaDocumentType,
      side,
    } = this.props

    const documentCaptureData: DocumentCapture = {
      ...payload,
      documentType: isPoA ? poaDocumentType : documentType,
      id: payload.id || randomId(),
      method: 'document',
      sdkMetadata: addDeviceRelatedProperties(payload.sdkMetadata, mobileFlow),
      side,
      variant: 'standard',
    }
    actions.createCapture(documentCaptureData)

    nextStep()
  }

  handleDocVideoCapture: HandleDocVideoCaptureProp = (payload) => {
    const { actions, documentType, mobileFlow, nextStep } = this.props
    const { video, front, back } = payload

    const baseData: Omit<DocumentCapture, 'blob'> = {
      documentType,
      id: randomId(),
      method: 'document',
      sdkMetadata: addDeviceRelatedProperties(video.sdkMetadata, mobileFlow),
    }

    actions.createCapture({ ...baseData, ...front, side: 'front' })
    actions.createCapture({ ...baseData, ...back, side: 'back' })
    actions.createCapture({ ...baseData, ...video, variant: 'video' })

    nextStep()
  }

  handleUpload = (blob: Blob, imageResizeInfo: ImageResizeInfo) =>
    this.handleCapture({
      blob,
      sdkMetadata: { captureMethod: 'html5', imageResizeInfo },
    })

  handleError = () => {
    const { actions, side, requestedVariant: variant } = this.props
    actions.deleteCapture({ method: 'document', side, variant })
  }

  handleFileSelected = (file: File) =>
    validateFile(file, this.handleUpload, this.handleError)

  renderUploadFallback = (text: string) => (
    <CustomFileInput
      className={style.uploadFallback}
      onChange={this.handleFileSelected}
      accept="image/*"
      capture
    >
      {text}
    </CustomFileInput>
  )

  renderCrossDeviceFallback = (text: string) => (
    <FallbackButton
      text={text}
      onClick={() => this.props.changeFlowTo('crossDeviceSteps')}
    />
  )

  render() {
    const {
      documentType,
      hasCamera,
      isPoA,
      poaDocumentType,
      requestedVariant,
      side,
      trackScreen,
      translate,
      uploadFallback,
      useLiveDocumentCapture,
      useWebcam,
    } = this.props

    const renderFallback = isDesktop
      ? this.renderCrossDeviceFallback
      : this.renderUploadFallback

    if (requestedVariant === 'video') {
      return (
        <DocumentVideo
          documentType={documentType}
          onCapture={this.handleDocVideoCapture}
          renderFallback={renderFallback}
          trackScreen={trackScreen}
        />
      )
    }

    const title = translate(
      DOCUMENT_CAPTURE_LOCALES_MAPPING[isPoA ? poaDocumentType : documentType][
        side
      ].title
    )
    const propsWithErrorHandling = { ...this.props, onError: this.handleError }
    const renderTitle = <PageTitle title={title} smaller />
    const enableLiveDocumentCapture =
      useLiveDocumentCapture && (!isDesktop || isHybrid)

    if (hasCamera && useWebcam) {
      return (
        <DocumentAutoCapture
          {...propsWithErrorHandling}
          renderFallback={renderFallback}
          onValidCapture={this.handleCapture}
        />
      )
    }

    if (hasCamera && enableLiveDocumentCapture) {
      return (
        <DocumentLiveCapture
          containerClassName={style.liveDocumentContainer}
          isUploadFallbackDisabled={!uploadFallback}
          onCapture={this.handleCapture}
          renderFallback={renderFallback}
          renderTitle={renderTitle}
          trackScreen={trackScreen}
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

export default appendToTracking(
  localised(withCrossDeviceWhenNoCamera(Document))
)
