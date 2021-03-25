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
import theme from '../Theme/style.scss'

import withCrossDeviceWhenNoCamera from './withCrossDeviceWhenNoCamera'
import style from './style.scss'

import type { ImageResizeInfo } from '~types/commons'
import type { WithLocalisedProps, WithCaptureVariantProps } from '~types/hocs'
import type { DocumentCapture } from '~types/redux'
import type {
  HandleCaptureProp,
  HandleDocVideoCaptureProp,
  RenderFallbackProp,
  StepComponentDocumentProps,
} from '~types/routers'
import type { DocumentTypes, PoaTypes } from '~types/steps'

const getDocumentType = (
  isPoA?: boolean,
  documentType?: DocumentTypes,
  poaDocumentType?: PoaTypes
): DocumentTypes | PoaTypes => {
  if (isPoA && poaDocumentType) {
    return poaDocumentType
  }

  if (documentType) {
    return documentType
  }

  throw new Error('Neither documentType nor poaDocumentType provided')
}

type Props = StepComponentDocumentProps &
  WithLocalisedProps &
  WithCaptureVariantProps

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
      documentType: getDocumentType(isPoA, documentType, poaDocumentType),
      id: payload.id || randomId(),
      method: 'document',
      sdkMetadata: addDeviceRelatedProperties(payload.sdkMetadata, mobileFlow),
      side,
      variant: 'standard',
    }
    actions.createCapture(documentCaptureData)

    nextStep()
  }

  handleVideoCapture: HandleDocVideoCaptureProp = (payload) => {
    const { actions, documentType, mobileFlow, nextStep } = this.props
    const { video, front, back } = payload

    if (!documentType) {
      throw new Error('documentType not provided')
    }

    const baseData: Omit<DocumentCapture, 'blob' | 'id'> = {
      documentType,
      method: 'document',
      sdkMetadata: addDeviceRelatedProperties(
        video?.sdkMetadata || {},
        mobileFlow
      ),
    }

    actions.createCapture({
      ...front,
      ...baseData,
      id: randomId(),
      side: 'front',
    })

    if (back) {
      actions.createCapture({
        ...back,
        ...baseData,
        id: randomId(),
        side: 'back',
      })
    }

    actions.createCapture({
      ...video,
      ...baseData,
      id: randomId(),
      variant: 'video',
    })

    nextStep()
  }

  handleUpload = (blob: Blob, imageResizeInfo?: ImageResizeInfo) =>
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

  renderUploadFallback: RenderFallbackProp = ({ text }) => (
    <CustomFileInput
      className={theme.warningFallbackButton}
      onChange={this.handleFileSelected}
      accept="image/*"
      capture
    >
      {text}
    </CustomFileInput>
  )

  renderCrossDeviceFallback: RenderFallbackProp = ({ text }) => (
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
      if (!documentType) {
        throw new Error('documentType not provided')
      }

      return (
        <DocumentVideo
          documentType={documentType}
          onCapture={this.handleVideoCapture}
          renderFallback={renderFallback}
          trackScreen={trackScreen}
        />
      )
    }

    if (!side) {
      throw new Error('Capture size was not provided')
    }

    const title = translate(
      DOCUMENT_CAPTURE_LOCALES_MAPPING[
        getDocumentType(isPoA, documentType, poaDocumentType)
      ][side]?.title || ''
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
          documentType={documentType}
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
      DOCUMENT_CAPTURE_LOCALES_MAPPING[
        getDocumentType(isPoA, documentType, poaDocumentType)
      ][side]?.body || ''
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
